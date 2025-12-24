# System Architecture

## Overview

This application follows **Clean Architecture** principles with clear separation of concerns across three main layers.

## Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│         (React Components, Pages, UI Logic)              │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                     Actions Layer                        │
│         (Server Actions - Controllers)                   │
│  • Input validation (Zod)                               │
│  • Authentication/Authorization                          │
│  • Call services                                        │
│  • Return responses                                     │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                    Services Layer                        │
│              (Business Logic)                            │
│  • Business rules enforcement                           │
│  • Orchestration (multiple repositories)                │
│  • Transaction handling                                 │
│  • Complex operations                                   │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                  Repositories Layer                      │
│               (Data Access)                              │
│  • Database operations (Prisma)                         │
│  • CRUD operations                                      │
│  • Query building                                       │
│  • Data mapping                                         │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                      Database                            │
│                   (PostgreSQL)                           │
└─────────────────────────────────────────────────────────┘
```

## Layer Responsibilities

### 1. Actions Layer (Controller)

**Location:** `src/actions/`

**Purpose:** Handle client requests from Server Actions

**Responsibilities:**

- Receive input from client
- Validate input with Zod schemas
- Check authentication & authorization
- Call appropriate service methods
- Handle errors and return standardized responses
- Trigger cache revalidation

**Example:**

```typescript
// actions/post.actions.ts
"use server";

export async function createPost(data: unknown): Promise<ActionResponse<Post>> {
  try {
    // 1. Authentication
    const session = await requireAuth();

    // 2. Validation
    const validated = createPostSchema.parse(data);

    // 3. Authorization
    await checkPermission(session.user, "posts:create");

    // 4. Business logic
    const post = await postService.create({
      ...validated,
      authorId: session.user.id,
    });

    // 5. Cache revalidation
    revalidatePath("/posts");

    return { success: true, data: post };
  } catch (error) {
    return handleError(error);
  }
}
```

### 2. Services Layer (Business Logic)

**Location:** `src/services/`

**Purpose:** Implement business logic and orchestration

**Responsibilities:**

- Enforce business rules
- Coordinate multiple repository calls
- Handle transactions
- Implement complex business operations
- Don't know about HTTP/requests

**Example:**

```typescript
// services/post.service.ts
export const postService = {
  async create(data: CreatePostInput) {
    // Business rule
    if (data.content.length < 10) {
      throw new AppError("VALIDATION_ERROR", "Content too short");
    }

    // Transaction with multiple operations
    return prisma.$transaction(async (tx) => {
      const post = await postRepository.create(data, tx);
      await userRepository.incrementPostCount(data.authorId, tx);
      await notificationService.notifyFollowers(data.authorId, post.id);
      return post;
    });
  },

  async publish(postId: string, userId: string) {
    const post = await postRepository.findById(postId);

    // Business rules
    if (post.authorId !== userId) {
      throw new AppError("FORBIDDEN", "Not the author");
    }

    if (post.published) {
      throw new AppError("VALIDATION_ERROR", "Already published");
    }

    return postRepository.update(postId, { published: true });
  },
};
```

### 3. Repositories Layer (Data Access)

**Location:** `src/repositories/`

**Purpose:** Handle all database operations

**Responsibilities:**

- Direct interaction with Prisma
- CRUD operations
- Query building
- Data transformation
- Don't contain business logic

**Example:**

```typescript
// repositories/post.repository.ts
export const postRepository = {
  async create(data: CreatePostData, tx?: PrismaTransaction) {
    const prismaClient = tx || prisma;

    return prismaClient.post.create({
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  },

  async findById(id: string) {
    return prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        comments: true,
      },
    });
  },

  async findMany(options: FindManyOptions) {
    return prisma.post.findMany({
      where: options.where,
      orderBy: options.orderBy,
      skip: options.skip,
      take: options.take,
      include: {
        author: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
  },
};
```

## Data Flow

### Creating a Post Example

```
1. User submits form
   ↓
2. Client calls Server Action: createPost(formData)
   ↓
3. Actions Layer:
   - Validates with Zod
   - Checks auth
   - Calls postService.create()
   ↓
4. Services Layer:
   - Applies business rules
   - Calls postRepository.create()
   - Calls other services if needed
   ↓
5. Repositories Layer:
   - Executes Prisma query
   - Returns data
   ↓
6. Response flows back up
   ↓
7. Cache revalidated
   ↓
8. Client receives response
```

## Benefits of This Architecture

### 1. Separation of Concerns

- Each layer has a single responsibility
- Easy to understand and navigate
- Changes in one layer don't affect others

### 2. Testability

- Each layer can be tested independently
- Mock dependencies easily
- Unit tests for services, integration tests for actions

### 3. Reusability

- Services can be called from multiple actions
- Repositories can be used by multiple services
- Business logic is centralized

### 4. Maintainability

- Clear code organization
- Easy to find bugs
- Simple to add new features

### 5. Scalability

- Easy to add new features
- Can extract services to microservices later
- Can add caching, logging, monitoring at each layer

## Type Safety

All layers use TypeScript with strict type checking:

```typescript
// types/entities/post.ts
export type Post = {
  id: string;
  title: string;
  content: string;
  published: boolean;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
};

// types/dto/post.dto.ts
export type CreatePostDTO = {
  title: string;
  content: string;
  authorId: string;
};

export type UpdatePostDTO = Partial<CreatePostDTO>;

// lib/validations/post.schema.ts
export const createPostSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
```

## Error Handling

Centralized error handling across all layers:

```typescript
// lib/errors/app-error.ts
export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public details?: unknown
  ) {
    super(message);
  }
}

// lib/errors/error-handler.ts
export function handleError(error: unknown): ActionResponse<never> {
  if (error instanceof ZodError) {
    return {
      success: false,
      error: "Validation failed",
      errors: error.flatten(),
    };
  }

  if (error instanceof AppError) {
    return { success: false, error: error.message };
  }

  console.error("Unexpected error:", error);
  return { success: false, error: "Internal server error" };
}
```

## Best Practices

### DO ✅

- Keep actions thin (just validation + calling services)
- Put business logic in services
- Keep repositories focused on data access
- Use transactions for multi-step operations
- Validate at the action layer
- Handle errors consistently
- Use TypeScript strictly

### DON'T ❌

- Put business logic in actions
- Access Prisma directly from actions
- Put HTTP concerns in services
- Mix responsibilities between layers
- Skip validation
- Use `any` type
- Ignore errors

## Middleware Layer

**Location:** `src/middleware.ts`

**Purpose:** Handle request-level concerns before routing

**Responsibilities:**

- Internationalization (i18n) routing
- Authentication checks (optional)
- Request logging
- Custom headers
- Redirects

**Example:**

```typescript
// middleware.ts
import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n/request";

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always", // /en/*, /bg/*
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

## Additional Concerns

### Internationalization (i18n)

The application supports multiple languages with:

- Automatic locale detection and routing
- Type-safe translations with next-intl
- Server & Client Component support
- Easy to add new languages

See [INTERNATIONALIZATION.md](./features/INTERNATIONALIZATION.md) for complete i18n documentation.

## Example: Complete Feature

See [AUTHENTICATION.md](./features/AUTHENTICATION.md) for a complete example of how all layers work together in the authentication system.
