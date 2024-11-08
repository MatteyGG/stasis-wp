import type { Metadata } from "next";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import "@mdxeditor/editor/style.css";

import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "STASIS",
  description: "Wiki and encyclopedia of STASIS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
      </head>
      <body className={inter.className}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
