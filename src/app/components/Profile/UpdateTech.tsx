import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import Select from "react-select";

  const nation_array = ["Vanguard", "Liberty", "Martyrs"];
  const army_array = [
    "Icon-infantry",
    "Icon-LTank",
    "Icon-MTank",
    "Icon-launcher",
    "Icon-HTank",
    "Icon-SH",
    "Icon-howitzer",
  ];

export default function UpdateTech({
  nation,
  army,
  id,
}: {
  nation: string;
  army: string;
  id: string;
}) {
  const [newNation, setNewNation] = useState(nation);
  const [newArmy, setNewArmy] = useState(army);
  const { data: session, update } = useSession();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

    event.preventDefault();
    try {
      const response = await fetch("/api/userUpdate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id, nation: newNation, army: newArmy }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        
      }
      await update(
        {
          ...session,
          username: session?.user.username,
          army: newArmy,
          nation: newNation,
        }
      )
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form className="p-4 rounded-lg shadow-md" onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold mb-4">Обновить технику</h1>
      <div className="w-full">
        <Select
          instanceId="nation_select"
          id="nation_select"
          className="peer/nation"
          defaultInputValue={nation}
          options={nation_array.map((nation) => ({
            value: nation,
            label: (
              <div className="flex items-center">
                <Image
                  className="peer-checked/nation:ring-2 peer-checked/nation:ring-blue peer-checked:rounded-lg"
                  src={`/source/nation/${nation}.webp`}
                  alt={nation}
                  height={70}
                  width={70}
                />
                <span className="ml-2">{nation}</span>
              </div>
            ),
          }))}
          onChange={(selectedOption) =>
            setNewNation(selectedOption?.value ?? "Не выбрано")
          }
        />
        <Select
          instanceId="army_select"
          id="army_select"
          defaultInputValue={army}
          className="peer/nation"
          options={army_array.map((army) => ({
            value: army,
            label: (
              <div className="flex items-center">
                <Image
                  className="peer-checked/nation:ring-2 peer-checked/nation:ring-blue peer-checked:rounded-lg"
                  src={`/source/army/${army}.webp`}
                  alt={army}
                  height={70}
                  width={70}
                />
                <span className="ml-2">{army}</span>
              </div>
            ),
          }))}
          onChange={(selectedOption) =>
            setNewArmy(selectedOption?.value ?? "Не выбрано")
          }
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Обновить
      </button>
    </form>
  );
}

