import Link from "next/link";
import Gallery from "../components/gallery";
import WikiList from "../components/wikilist";

export default function Home() {
  
    return (
      <>
        <div className="text-3xl text-center font-bold">
          <h1>
            Admin Dashboard
          </h1>
          <nav className="text-xl">
            <Link href="/wiki/edit">Новая статья</Link>
          </nav>
          
        </div>
        
        <div className="flex flex-col min-h-screen items-center justify-center">
          <WikiList />
          <Gallery />
          
        </div>
      </>
    );
  }
  