import { NextResponse } from "next/server";

export async function GET() {
  const url =
    "https://yx.dmzgame.com/intl_warpath/guild_detail?gid=2645296&page=1&perPage=1";
  const response = await fetch(url, {
    next: {
      revalidate: 43200, // 12 часов в секундах
    },
  });
  const data = await response.json();

  const result = data.Data.map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (item: any) => ({
    id: item.id,
    day: item.day,
    wid: item.wid,
    ccid: item.ccid,
    gid: item.gid,
    power: item.power.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 "),
    sname: item.sname,
    fname: item.fname,
    owner: item.owner,
    kil: item.kil,
    di: item.di,
    c_power: item.c_power,
    c_kil: item.c_kil,
    created_at: item.created_at,
    c_di: item.c_di,
  }));
  


  return NextResponse.json(result);
}
