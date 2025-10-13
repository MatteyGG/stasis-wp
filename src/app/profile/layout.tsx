import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ProfileSidebar from "@/components/profile/ProfileSidebar";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import type { Metadata } from "next";
import "@/app/globals.css";
import "@mdxeditor/editor/style.css";

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
    redirect("/singin");
  }

  return (
    <>
      <div className="flex">
        <ProfileSidebar />
        <main>{children}</main>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}
