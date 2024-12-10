import { useState, useEffect } from "react";

export default function AllyWidget() {
  const [allyData, setAllyData] = useState(null);

  useEffect(() => {
    fetch("/api/warpath")
      .then((res) => res.json())
      .then((data) => setAllyData(data))
      .catch((err) => console.log(err));
  }, []);


  if (!allyData) return null;

  return (
    <div>
      <h1>Ally widget</h1>
      <p>{allyData}</p>
    </div>
  );
}

