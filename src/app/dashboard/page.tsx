import Link from "next/link";
import Gallery from "@/app/components/dashboard/gallery";
import WikiList from "@/app/components/dashboard/wikilist";
import Userlist from "@/app/components/dashboard/userslist";
import Tabs from "../components/tabs";
import Manage_users from "../components/dashboard/manage";
import PromoList from "../components/dashboard/promocode";
import { auth } from "../auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const tabContents = [
  <WikiList key={0} />,
  <Userlist key={1} />,
  <Gallery key={2} />,
  <Manage_users key={3} />,
  <PromoList key={4} />,
];

export default async function Dashboard() {
  const session = await auth();
  if (!session || !session.user?.role.includes("admin")) {
    return <div>Access denied</div>;
  }
  return (
    <>
      <div className="text-3xl text-center font-bold">
        <h1>Admin Dashboard</h1>
        <nav className="text-xl">
          <Link href="/wiki/edit">Новая статья</Link>
        </nav>
        <Tabs
          tabs={[
            "Вики",
            "Права доступа",
            "Галерея",
            "Пользователи",
            "Промокоды",
          ]}
          tabContents={tabContents}
        />
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}


