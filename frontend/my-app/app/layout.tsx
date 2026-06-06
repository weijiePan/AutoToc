import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
/*#F5E7DE#F2BFA4
Kaffestuggu*/
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">
        <header>
          <svg className = "sandwichIcon">
            <rect  y = "0em"></rect>
            <rect  y = "0.5em"></rect>
            <rect  y = "1em"></rect>
        </svg>
        </header>
        {children}
        </body>
    </html>
  );
}
