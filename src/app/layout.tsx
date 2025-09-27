
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/Auth";
import { Toaster } from "@/components/ui/sonner";
import GlobalErrorBoundary from "@/components/GlobalErrorBoundary";
import { QueryProvider } from "@/providers/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Employee Management System",
  description: "A modern employee management system.",
  manifest: "/manifest.json",
  icons: {
    icon: "/images/favicon/favicon.ico",
    shortcut: "/images/favicon/favicon-16x16.png",
    apple: "/images/favicon/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <GlobalErrorBoundary>
            <AuthProvider>{children}</AuthProvider>
            <Toaster
              position="top-center"
              expand={true}
              richColors={true}
              duration={4000}
            />
          </GlobalErrorBoundary>
        </QueryProvider>
      </body>
    </html>
  );
}
