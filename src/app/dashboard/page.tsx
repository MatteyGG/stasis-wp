import Link from "next/link";
import Gallery from "@/app/components/dashboard/gallery";
import WikiList from "@/app/components/dashboard/wikilist";
import Userlist from "@/app/components/dashboard/userslist";
import Main from "@/app/components/dashboard/main";
import Tabs from "../components/tabs";
import Manage_users from "../components/dashboard/manage";
import PromoList from "../components/dashboard/promocode";
import { auth } from "../auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AlertMake from "../components/alert/makeAlert";

const tabContents = [
  <Main key={0} />,
  <WikiList key={1} />,
  <Userlist key={2} />,
  <Gallery key={3} />,
  <Manage_users key={4} />,
  <PromoList key={5} />,
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
        <nav className="flex sm:justify-center space-x-4">
          <Link
            className="rounded-lg px-3 py-2 text-slate-700 font-medium hover:bg-slate-100 hover:text-slate-900"
            href="/wiki/edit"
          >
            Новая статья
          </Link>
          <AlertMake userId={"all"} />
          
        </nav>
        <Tabs
          tabs={[
            "Главная",
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


