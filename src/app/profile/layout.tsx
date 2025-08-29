import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import ProfileSidebar from '@/components/profile/ProfileSidebar';

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import type { Metadata } from "next";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import "@mdxeditor/editor/style.css";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "STASIS",
  description: "Wiki and encyclopedia of STASIS",
};
export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Если пользователь не авторизован
  if (!session?.user) {
    redirect('/login');
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
      </head>
      <body>
        <Navbar />
        <div className="flex min-h-screen">
          <ProfileSidebar />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
        <Footer />
        <ToastContainer />
      </body>

    </html>
  );
}