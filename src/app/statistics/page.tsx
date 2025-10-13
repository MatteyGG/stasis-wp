// src/app/statistics/page.tsx

import Leaderboard from "../../components/statistic/leaderboard";
import AllyWidget from "../../components/allyWid";
import { lastDate } from "@/lib/getDate";
import { WarpathPlayer } from "@/lib/types";
import { Card } from "@/components/ui/card";

interface LeaderboardProps {
  players: WarpathPlayer[];
}
export default async function Statistics() {
  const date = await lastDate();
  const url = `https://yx.dmzgame.com/intl_warpath/rank_pid?day=${date}&wid=130&ccid=0&rank=power&is_benfu=1&is_quanfu=0&page=1&perPage=3000`;

  const response = await fetch(url, {
    next: {
      revalidate: 43200, // 12 часов в секундах
    },
  });
  if (!response.ok) throw new Error("Warpath API error");

  const data = await response.json();

  // Фильтрация игроков нужного альянса
  const targetAlliance = "ST";
  const stPlayers: WarpathPlayer[] = data.Data.filter(
    (p: WarpathPlayer) => p.gnick === targetAlliance
  );

  return (
    <div className="md:mx-12">
      <h1 className="text-6xl text-primaly text-center w-full my-6">
        <b>Статистика</b>
      </h1>
      <Card className="">
          <Leaderboard players={data.Data as WarpathPlayer[]} />
      </Card>
    </div>
  );
}
