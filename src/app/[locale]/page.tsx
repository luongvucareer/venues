import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Code2, Database, Globe, Lock, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="from-background to-muted min-h-screen bg-gradient-to-b">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="bg-primary/10 text-primary inline-flex items-center rounded-full px-4 py-2 text-sm font-medium">
            <Zap className="mr-2 h-4 w-4" />
            Next.js 15 + TypeScript + Prisma + i18n
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Modern Fullstack
            <span className="from-primary to-primary/50 bg-gradient-to-r bg-clip-text text-transparent">
              {" "}
              Next.js Starter
            </span>
          </h1>

          <p className="text-muted-foreground text-xl">
            A professional, production-ready Next.js template with TypeScript,
            Prisma, Authentication, Internationalization, Tailwind CSS, and
            modern best practices.
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
          <p className="text-muted-foreground mt-4">
            Everything you need for a production-ready application
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1 */}
          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <Code2 className="text-primary mb-2 h-10 w-10" />
              <CardTitle>Next.js 15</CardTitle>
              <CardDescription>
                Latest Next.js with App Router, Server Components, and Turbopack
                for blazing fast development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>✓ Server & Client Components</li>
                <li>✓ Server Actions</li>
                <li>✓ Optimized for performance</li>
              </ul>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <Database className="text-primary mb-2 h-10 w-10" />
              <CardTitle>Prisma ORM</CardTitle>
              <CardDescription>
                Type-safe database access with PostgreSQL, migrations, and
                modern ORM features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>✓ Type-safe queries</li>
                <li>✓ Auto-generated types</li>
                <li>✓ Database migrations</li>
              </ul>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <Lock className="text-primary mb-2 h-10 w-10" />
              <CardTitle>Authentication</CardTitle>
              <CardDescription>
                Complete auth system with custom implementation, email
                verification, and secure password hashing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>✓ Email/Password auth</li>
                <li>✓ Email verification</li>
                <li>✓ Secure bcrypt hashing</li>
              </ul>
            </CardContent>
          </Card>

          {/* Feature 4 */}
          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <Globe className="text-primary mb-2 h-10 w-10" />
              <CardTitle>Internationalization</CardTitle>
              <CardDescription>
                Multi-language support with next-intl for seamless
                internationalization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>✓ Multiple languages (EN, BG)</li>
                <li>✓ Type-safe translations</li>
                <li>✓ Server & client support</li>
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
              <ul className="text-muted-foreground space-y-2 text-sm">
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
                Beautiful components with shadcn/ui and Tailwind CSS
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground space-y-2 text-sm">
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
        <div className="bg-card mx-auto max-w-3xl rounded-lg border p-8">
          <h2 className="mb-6 text-2xl font-bold">Clean Architecture</h2>
          <div className="text-muted-foreground space-y-4">
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
              <li>
                <strong className="text-foreground">
                  Internationalization:
                </strong>{" "}
                Multi-language support with next-intl
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
        <div className="text-muted-foreground container mx-auto px-4 text-center text-sm">
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
