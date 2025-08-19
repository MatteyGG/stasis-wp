export async function lastDate() {

    const url = "https://yx.dmzgame.com/intl_warpath/total/total_latest_day";
    const response = await fetch(url);
    if (response) {
        const data = await response.json();
        const result = data.Data;
        console.log(result);
        return result.toString();
    }
    console.log("Failed to fetch data");

}