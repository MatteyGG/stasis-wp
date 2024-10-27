import Link from "next/link";
import Gallery from "../components/dashboard/gallery";
import WikiList from "../components/dashboard/wikilist";
import Userlist from "../components/dashboard/userslist";

export default function Dashboard() {
  
    return (
      <>
        <div className="text-3xl text-center font-bold">
          <h1>Admin Dashboard</h1>
          <nav className="text-xl">
            <Link href="/wiki/edit">Новая статья</Link>
          </nav>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3">
          <WikiList />
          <Userlist />
          <Gallery />
        </div>
      </>
    );
  }
  