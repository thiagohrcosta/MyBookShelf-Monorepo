import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Bookshelf",
  description: "Organize and track your book collection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
