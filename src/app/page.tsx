import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Code2, Database, Lock, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Zap className="mr-2 h-4 w-4" />
            Next.js 15 + TypeScript + Prisma
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Modern Fullstack
            <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              {" "}
              Next.js Starter
            </span>
          </h1>

          <p className="text-xl text-muted-foreground">
            A professional, production-ready Next.js template with TypeScript,
            Prisma, NextAuth.js, Tailwind CSS, and modern best practices.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/docs">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link
                href="https://github.com/luongvucareer/venues"
                target="_blank"
              >
                View on GitHub
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold">Built with Modern Technologies</h2>
          <p className="mt-4 text-muted-foreground">
            Everything you need for a production-ready application
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1 */}
          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <Code2 className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>Next.js 15</CardTitle>
              <CardDescription>
                Latest Next.js with App Router, Server Components, and Turbopack
                for blazing fast development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Server & Client Components</li>
                <li>✓ Server Actions</li>
                <li>✓ Optimized for performance</li>
              </ul>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <Database className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>Prisma ORM</CardTitle>
              <CardDescription>
                Type-safe database access with PostgreSQL, migrations, and
                modern ORM features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Type-safe queries</li>
                <li>✓ Auto-generated types</li>
                <li>✓ Database migrations</li>
              </ul>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <Lock className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>Authentication</CardTitle>
              <CardDescription>
                Complete auth system with NextAuth.js v5, email verification,
                and OAuth support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Email/Password auth</li>
                <li>✓ Google OAuth</li>
                <li>✓ Role-based access</li>
              </ul>
            </CardContent>
          </Card>

          {/* Feature 4 */}
          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle>React Query</CardTitle>
              <CardDescription>
                Powerful data fetching and caching with TanStack Query
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Smart caching</li>
                <li>✓ Automatic refetching</li>
                <li>✓ Optimistic updates</li>
              </ul>
            </CardContent>
          </Card>

          {/* Feature 5 */}
          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle>Form Validation</CardTitle>
              <CardDescription>
                Type-safe validation with Zod and React Hook Form integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Schema validation</li>
                <li>✓ Type inference</li>
                <li>✓ Error handling</li>
              </ul>
            </CardContent>
          </Card>

          {/* Feature 6 */}
          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle>UI Components</CardTitle>
              <CardDescription>
                Beautiful components with Radix UI and Tailwind CSS
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Accessible components</li>
                <li>✓ Dark mode ready</li>
                <li>✓ Fully customizable</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-3xl rounded-lg border bg-card p-8">
          <h2 className="mb-6 text-2xl font-bold">Clean Architecture</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              This project follows a clean, layered architecture pattern for
              maintainability and scalability:
            </p>
            <ul className="space-y-2">
              <li>
                <strong className="text-foreground">Presentation Layer:</strong>{" "}
                React components, pages, and UI
              </li>
              <li>
                <strong className="text-foreground">Server Actions:</strong>{" "}
                Type-safe server-side operations
              </li>
              <li>
                <strong className="text-foreground">Service Layer:</strong>{" "}
                Business logic and orchestration
              </li>
              <li>
                <strong className="text-foreground">Repository Layer:</strong>{" "}
                Database access and queries
              </li>
              <li>
                <strong className="text-foreground">Validation:</strong> Zod
                schemas for runtime type checking
              </li>
            </ul>
            <div className="mt-6">
              <Button variant="outline" asChild>
                <Link href="/docs">
                  Read Documentation <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Built with ❤️ using Next.js 15 •{" "}
            <Link
              href="https://github.com/luongvucareer/venues"
              className="hover:text-foreground"
              target="_blank"
            >
              View Source
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
