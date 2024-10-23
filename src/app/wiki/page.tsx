import WikiCard from "../components/wikicard";

export default function Wiki_main() {
  return (
    <div className="wiki container shadow-2xl mt-12 mx-auto flex flex-wrap p-4 rounded-lg  backdrop-blur-md text-white">
      <h1 className="text-6xl text-primaly text-center w-full my-6">
        <b>Wiki</b>
      </h1>
      <div className="wiki-title w-full flex justify-center">
        <div className="wiki-container grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 text-pretty">
         
        </div>
      </div>
    </div>
  );
}
