import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Venues - Modern Fullstack Template",
  description:
    "A professional, production-ready Next.js template with TypeScript, Prisma, Authentication, Internationalization, Tailwind CSS, and modern best practices.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
