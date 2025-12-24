# Server Actions Architecture

Complete guide to our Server Actions implementation.

## What are Server Actions?

Server Actions are asynchronous functions that run on the server in Next.js 15. They provide:

- ✅ Type-safe client-server communication
- ✅ No API routes needed
- ✅ Progressive enhancement
- ✅ Built-in form handling
- ✅ Automatic serialization

## Our Pattern

We use Server Actions as the **Controller Layer** in our clean architecture.

### File Organization

```
src/actions/
├── index.ts              # Export all actions
├── auth.actions.ts       # Authentication actions
├── post.actions.ts       # Post management
├── user.actions.ts       # User management
└── admin.actions.ts      # Admin operations
```

## Action Structure

Every action follows this pattern:

```typescript
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import type { ActionResponse } from "@/types/api/responses";

export async function actionName(
  data: unknown
): Promise<ActionResponse<ReturnType>> {
  try {
    // 1. Authentication
    const session = await requireAuth();

    // 2. Input Validation
    const validated = schema.parse(data);

    // 3. Authorization
    await checkPermissions(session.user, "resource:action");

    // 4. Business Logic (via Service)
    const result = await service.method(validated);

    // 5. Cache Revalidation
    revalidatePath("/path");

    // 6. Success Response
    return { success: true, data: result };
  } catch (error) {
    // 7. Error Handling
    return handleError(error);
  }
}
```

## Step-by-Step Breakdown

### 1. Authentication

**Always check if user is logged in for protected actions:**

```typescript
// Option A: Simple auth check
const session = await requireAuth();
// Throws if not authenticated

// Option B: Role-based auth
const session = await requireRole(["ADMIN", "MODERATOR"]);
// Throws if user doesn't have required role

// Option C: Manual check
const session = await auth();
if (!session?.user) {
  return { success: false, error: "Unauthorized" };
}
```

### 2. Input Validation

**Use Zod schemas to validate all inputs:**

```typescript
import { createPostSchema } from "@/lib/validations/post.schema";

// Parse and validate
const validated = createPostSchema.parse(data);
// Auto-typed as CreatePostInput
// Throws ZodError if invalid
```

**Benefits:**

- Type safety
- Runtime validation
- Automatic error messages
- Sanitization (via transforms)

### 3. Authorization

**Check if user has permission:**

```typescript
// Resource ownership
if (post.authorId !== session.user.id) {
  throw new AppError("FORBIDDEN", "Not the owner");
}

// Permission-based
if (!hasPermission(session.user, "posts:delete")) {
  throw new AppError("FORBIDDEN", "No permission");
}

// Using helper
await requireOwnership(post.authorId, { allowAdmin: true });
```

### 4. Business Logic

**Delegate to Service Layer:**

```typescript
// ❌ DON'T do this in actions
const post = await prisma.post.create({
  data: validated,
});

// ✅ DO this instead
const post = await postService.create({
  ...validated,
  authorId: session.user.id,
});
```

**Why?**

- Actions should be thin
- Business logic belongs in services
- Services are reusable and testable

### 5. Cache Revalidation

**Tell Next.js to update cached data:**

```typescript
import { revalidatePath, revalidateTag } from "next/cache";

// Revalidate specific path
revalidatePath("/posts");

// Revalidate dynamic route
revalidatePath(`/posts/${post.id}`);

// Revalidate all posts
revalidatePath("/posts", "layout");

// Revalidate by tag
revalidateTag("posts");
```

### 6. Response Format

**Always use consistent response format:**

```typescript
// Success response
return {
  success: true,
  data: post,
};

// Error response
return {
  success: false,
  error: "Something went wrong",
  errors: { field: ["Error message"] }, // Optional validation errors
};
```

### 7. Error Handling

**Use centralized error handler:**

```typescript
import { handleError } from "@/lib/errors/error-handler";

try {
  // ... action logic
} catch (error) {
  return handleError(error);
  // Handles ZodError, AppError, and unknown errors
}
```

## Complete Example

```typescript
// actions/post.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { postService } from "@/services/post.service";
import {
  createPostSchema,
  updatePostSchema,
} from "@/lib/validations/post.schema";
import { requireAuth, requireOwnership } from "@/lib/auth-utils";
import { handleError } from "@/lib/errors/error-handler";
import type { ActionResponse } from "@/types/api/responses";
import type { Post } from "@prisma/client";

/**
 * Create a new post
 */
export async function createPost(data: unknown): Promise<ActionResponse<Post>> {
  try {
    const session = await requireAuth();
    const validated = createPostSchema.parse(data);

    const post = await postService.create({
      ...validated,
      authorId: session.user.id,
    });

    revalidatePath("/posts");
    revalidatePath(`/users/${session.user.id}/posts`);

    return { success: true, data: post };
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Update existing post
 */
export async function updatePost(
  postId: string,
  data: unknown
): Promise<ActionResponse<Post>> {
  try {
    const session = await requireAuth();
    const validated = updatePostSchema.parse(data);

    // Check ownership
    await requireOwnership(postId, session.user.id);

    const post = await postService.update(postId, validated);

    revalidatePath("/posts");
    revalidatePath(`/posts/${postId}`);

    return { success: true, data: post };
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Delete post
 */
export async function deletePost(
  postId: string
): Promise<ActionResponse<void>> {
  try {
    const session = await requireAuth();

    await requireOwnership(postId, session.user.id, { allowAdmin: true });

    await postService.delete(postId);

    revalidatePath("/posts");

    return { success: true, data: undefined };
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Get all posts (public action)
 */
export async function getPosts(
  page: number = 1,
  limit: number = 20
): Promise<ActionResponse<Post[]>> {
  try {
    const posts = await postService.getAll({ page, limit });
    return { success: true, data: posts };
  } catch (error) {
    return handleError(error);
  }
}
```

## Using Actions in Components

### Server Components

```typescript
import { getPosts } from "@/actions/post.actions";

export default async function PostsPage() {
  const result = await getPosts(1, 20);

  if (!result.success) {
    return <div>Error: {result.error}</div>;
  }

  return (
    <div>
      {result.data.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

### Client Components (Forms)

```typescript
"use client";

import { useTransition } from "react";
import { createPost } from "@/actions/post.actions";
import { useToast } from "@/hooks/use-toast";

export function CreatePostForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  async function onSubmit(formData: FormData) {
    startTransition(async () => {
      const data = {
        title: formData.get("title"),
        content: formData.get("content"),
      };

      const result = await createPost(data);

      if (result.success) {
        toast({ title: "Post created!" });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <form action={onSubmit}>
      <input name="title" required />
      <textarea name="content" required />
      <button disabled={isPending}>
        {isPending ? "Creating..." : "Create Post"}
      </button>
    </form>
  );
}
```

### Client Components (React Hook Form)

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPostSchema } from "@/lib/validations/post.schema";
import { createPost } from "@/actions/post.actions";

export function CreatePostForm() {
  const form = useForm({
    resolver: zodResolver(createPostSchema),
  });

  async function onSubmit(data) {
    const result = await createPost(data);

    if (result.success) {
      form.reset();
    } else {
      form.setError("root", { message: result.error });
    }
  }

  return <form onSubmit={form.handleSubmit(onSubmit)}>{/* fields */}</form>;
}
```

## Best Practices

### ✅ DO

1. **Keep actions thin** - Just validation + calling services
2. **Validate all inputs** - Use Zod schemas
3. **Check authentication** - Always for protected actions
4. **Use consistent responses** - ActionResponse type
5. **Revalidate cache** - After mutations
6. **Handle errors** - Use centralized handler
7. **Add JSDoc comments** - Document what action does
8. **Use TypeScript strictly** - No `any` types

### ❌ DON'T

1. **Put business logic in actions** - Use services
2. **Access Prisma directly** - Use repositories
3. **Skip validation** - Always validate
4. **Ignore errors** - Always handle
5. **Return sensitive data** - Filter user data
6. **Forget revalidation** - Update cache after changes
7. **Mix concerns** - One action = one responsibility

## Security Considerations

### Input Sanitization

```typescript
import { sanitizedHtmlSchema } from "@/lib/validators/sanitize";

const schema = z.object({
  title: z.string().trim().max(100),
  content: sanitizedHtmlSchema, // Removes XSS
});
```

### Rate Limiting

```typescript
import { checkRateLimit } from "@/lib/rate-limit";

export async function createPost(data: unknown) {
  const session = await requireAuth();

  // Rate limit: 10 posts per hour
  await checkRateLimit(session.user.id, "createPost");

  // ... rest of action
}
```

### Audit Logging

```typescript
export async function deletePost(postId: string) {
  const session = await requireAuth();

  await postService.delete(postId);

  // Log sensitive action
  await auditLog({
    action: "POST_DELETED",
    userId: session.user.id,
    resourceId: postId,
    timestamp: new Date(),
  });

  return { success: true };
}
```

## Testing Actions

```typescript
import { describe, it, expect, vi } from "vitest";
import { createPost } from "./post.actions";
import * as authUtils from "@/lib/auth-utils";

vi.mock("@/lib/auth-utils");
vi.mock("@/services/post.service");

describe("createPost", () => {
  it("should create post for authenticated user", async () => {
    vi.mocked(authUtils.requireAuth).mockResolvedValue({
      user: { id: "user-1", role: "USER" },
    });

    const result = await createPost({
      title: "Test Post",
      content: "Test content",
    });

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  it("should reject invalid input", async () => {
    const result = await createPost({
      title: "Ab", // Too short
      content: "Test",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
```

## Internationalization in Actions

When working with i18n, you can use translations in Server Actions:

```typescript
"use server";

import { getTranslations } from "next-intl/server";

export async function createPost(data: unknown): Promise<ActionResponse<Post>> {
  try {
    const session = await requireAuth();
    const validated = createPostSchema.parse(data);

    const post = await postService.create({
      ...validated,
      authorId: session.user.id,
    });

    // Get translations for response message
    const t = await getTranslations("posts.messages");

    revalidatePath("/posts");

    return {
      success: true,
      data: post,
      message: t("createSuccess"), // Localized message
    };
  } catch (error) {
    return handleError(error);
  }
}
```

See [INTERNATIONALIZATION.md](../features/INTERNATIONALIZATION.md) for complete i18n documentation.

## See Also

- [ARCHITECTURE.md](../ARCHITECTURE.md) - Overall architecture
- [SECURITY.md](./SECURITY.md) - Security best practices
- [TESTING.md](./TESTING.md) - Testing guidelines
- [AUTHENTICATION.md](../features/AUTHENTICATION.md) - Auth implementation
- [INTERNATIONALIZATION.md](../features/INTERNATIONALIZATION.md) - i18n implementation
