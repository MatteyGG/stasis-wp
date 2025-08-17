import { NextResponse } from "next/server"


export async function GET(req: Request) {

    const url = "https://yx.dmzgame.com/intl_warpath/total/total_latest_day";
    const response = await fetch(url);
    if (response) {
        const data = await response.json();
        const result = data.Data;
        console.log(result);
        return result;
    }

}