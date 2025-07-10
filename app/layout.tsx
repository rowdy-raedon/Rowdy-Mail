import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "./provider";
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RowdyMail - Temporary Email Service",
  description: "Generate temporary email addresses with Mailsac. Perfect for testing, signups, and privacy protection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <Provider>
            {children}
          </Provider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
