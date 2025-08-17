import Gallery from "@/app/components/dashboard/gallery";
import WikiList from "@/app/components/dashboard/wikilist";
import Userlist from "@/app/components/dashboard/userslist";
import Main from "@/app/components/dashboard/main";
import Tabs from "../components/tabs";
import Manage_users from "../components/dashboard/manage";
import PromoList from "../components/dashboard/promocode";
import { auth } from "../../lib/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CategoryList from "../components/dashboard/category";
import C4ManagerDashboard from "../components/dashboard/manage_c4";
import PlayersLeaderboard from "../components/dashboard/leaderboardPlayers";

const tabContents = [
  <Main key={0} />,
  <WikiList key={1} />,
  <Userlist key={2} />,
  <Gallery key={3} />,
  <Manage_users key={4} />,
  <PromoList key={5} />,
  <CategoryList key={6} />,
  <C4ManagerDashboard key={7} />,
  <PlayersLeaderboard key={8} />,

];



export default async function Dashboard() {
  const session = await auth();
  if (!session || !session.user?.role.includes("admin")) {
    return <div>Access denied</div>;
  }

  return (
    <>
      <div className="text-3xl text-center font-bold">
        <h1>Админ панель</h1>
        
        <Tabs
          tabs={[
            "Главная",
            "Вики",
            "Права доступа",
            "Галерея",
            "Пользователи",
            "Промокоды",
            "Категории",
            "New C4",
            "Игроки",
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


