import type { Metadata } from "next";
import "./globals.css";
import AppNavbar from "@/components/AppNavbar";
import AppFooter from "@/components/AppFooter";
import { AppProviders } from "@/components/providers";

export const metadata: Metadata = {
  title: {
    default: "ShopSphere",
    template: "%s | ShopSphere",
  },
  description: "Modern Amazon-like customer storefront",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="store-body min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <AppProviders>
          <AppNavbar />
          <main className="mx-auto w-full max-w-[1440px] px-3 pb-12 pt-5 sm:px-4 md:px-6">
            {children}
          </main>
          <AppFooter />
        </AppProviders>
      </body>
    </html>
  );
}
