import { cn } from "@/shared/lib/utils";
import type { Metadata } from "next";
import { Annie_Use_Your_Telescope, Inter as FontSans } from "next/font/google";
import "./globals.css";
import Logo from "@/shared/ui/logo";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontAnnie = Annie_Use_Your_Telescope({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-annie",
});

export const metadata: Metadata = {
  title: "Wordathlon online",
  description: "Square shaped anagram puzzle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen font-sans antialiased",
          fontSans.variable,
          fontAnnie.variable,
        )}
      >
        {children}
        <footer className="fixed bottom-2 right-2">
          <Logo />
        </footer>
      </body>
    </html>
  );
}
