import type { Metadata } from "next";
import "../globals.css";
import { Inter } from "next/font/google";

import Navbar from "../components/navbar";
import Footer from "../components/footer";

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
      <body className={inter.className}>
        <video
          className="absolute overflow-clip-border top-0 left-0 hidden md:block"
          autoPlay={true}
          loop={true}
          muted={true}
          src="https://oss-resource.farlightgames.com/p/SDK/200000/0/100000/2023-03-21/cb9b4854a5ba84837fe4c82c46a58c4e.mp4"
        />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
