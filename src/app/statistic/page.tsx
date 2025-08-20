import Leaderboard from "../../components/statistic/leaderboard";
import AllyWidget from "../../components/allyWid";

export default function About() {
  return (
    <div className="about container md:mt-12 mx-auto flex flex-wrap p-4 rounded-xl">
      <h1 className="text-6xl text-primaly text-center w-full my-6">
        <b>Статистика</b>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2">
        <div className="flex flex-col">
          <Leaderboard />
        </div>
        <div>
          <AllyWidget />
        </div>
      </div>
    </div>
  );
}
