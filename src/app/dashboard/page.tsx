import Link from "next/link";
import Gallery from "@/app/components/dashboard/gallery";
import WikiList from "@/app/components/dashboard/wikilist";
import Userlist from "@/app/components/dashboard/userslist";
import Tabs from "../components/tabs";
import Manage_users from "../components/dashboard/manage";

const tabContents = [
  <WikiList key={0} />,
  <Userlist key={1} />,
  <Gallery key={2} />,
  <Manage_users key={3} />,
];

export default function Dashboard() {
  return (
    <>
      <div className="text-3xl text-center font-bold">
        <h1>Admin Dashboard</h1>
        <nav className="text-xl">
          <Link href="/wiki/edit">Новая статья</Link>
        </nav>
        <Tabs
          tabs={["Вики", "Права доступа", "Галерея", "Пользователи"]}
          tabContents={tabContents}
        />
      </div>
    </>
  );
}

