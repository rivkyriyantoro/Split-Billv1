import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Split Bill App - Pembagian Tagihan",
  description: "Aplikasi pembagian tagihan dengan TypeScript & Next.js 14",
  keywords: ["tagihan", "pembagian", "split bill", "nextjs", "typescript"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} bg-gradient-to-br from-gray-50 to-blue-50`}>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1 container-custom py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
