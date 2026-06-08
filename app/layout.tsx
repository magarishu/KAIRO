import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { LayoutWrapper } from "./LayoutWrapper";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ 
  subsets: ["latin"], 
  variable: "--font-poppins", 
  weight: ["400", "500", "600", "700", "800", "900"] 
});

export const metadata: Metadata = {
  title: "KAIRO | Trade Copier",
  description: "Cross-Market Cloud Trade Copier for Forex and Futures",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider signInUrl="/sign-in" signUpUrl="/sign-up" signInFallbackRedirectUrl="/dashboard" signUpFallbackRedirectUrl="/dashboard">
      <html lang="en" className="h-full antialiased" suppressHydrationWarning>
        <head />
        <body className={`${inter.variable} ${poppins.variable} font-sans min-h-full flex bg-[var(--color-bg-main)] text-white selection:bg-[#4C1D95] selection:text-white`}>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </body>
      </html>
    </ClerkProvider>
  );
}
