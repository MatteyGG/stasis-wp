import type { Metadata } from "next";
import "../globals.css";
import { Inter } from "next/font/google";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Sidebar } from "@/components/NewUi/sidebar";
import { SessionProvider } from "next-auth/react";


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
      <body
        className={inter.className}
      >
        <Navbar />
        <SessionProvider>
          {children}
        </SessionProvider>
        <Footer />
      </body>
    </html>
  );
}
