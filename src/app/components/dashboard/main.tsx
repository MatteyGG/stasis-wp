"use client";

export default function main() {
  const warpathDataUpdate = async () => {
    const response = await fetch("/api/warpath/dataUpdate", {
      method: "GET",
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <div className="container h-full min-h-64 md:h-2/3 shadow-sm shadow-black mx-auto p-4 rounded-xl  backdrop-blur-3xl">
      <h1 className="text-2xl text-center">Main</h1>
      <button
        className="rounded-lg px-3 py-2 text-slate-700 font-medium hover:bg-slate-100 hover:text-slate-900"
        onClick={() => warpathDataUpdate()}
      >
        Обновить данные
      </button>
    </div>
  );
}
