"use client";

import React, { useState } from "react";
import C4Container from "../c4/c4container";

const C4Dashboard: React.FC = () => {
  const [currentC4, setCurrentC4] = useState({
    serverName: "Server 1",
    status: "В процессе",
    players: "64",
    map: "Эгейское море",
    mapImage: "/source/c4/cairo.png",
  });


  return (
    <div className="flex flex-col gap-3 justify-center">
      <div className="flex flex-col gap-2">
        <label>
          Server Name
          <input
            type="text"
            value={currentC4.serverName}
            onChange={(e) =>
              setCurrentC4({ ...currentC4, serverName: e.target.value })
            }
            className="p-2 border-2 rounded"
          />
        </label>
        <label>
          Status
          <input
            type="text"
            value={currentC4.status}
            onChange={(e) =>
              setCurrentC4({ ...currentC4, status: e.target.value })
            }
            className="p-2 border-2 rounded"
          />
        </label>
        <label>
          Players
          <input
            type="text"
            value={currentC4.players}
            onChange={(e) =>
              setCurrentC4({ ...currentC4, players: e.target.value })
            }
            className="p-2 border-2 rounded"
          />
        </label>
        <label>
          Map
          <input
            type="text"
            value={currentC4.map}
            onChange={(e) =>
              setCurrentC4({ ...currentC4, map: e.target.value })
            }
            className="p-2 border-2 rounded"
          />
        </label>
        <label>
          Map Image
          <input
            type="text"
            value={currentC4.mapImage}
            onChange={(e) =>
              setCurrentC4({ ...currentC4, mapImage: e.target.value })
            }
            className="p-2 border-2 rounded"
          />
        </label>
      </div>
      <div className="flex justify-center">
        <C4Container {...currentC4} />
      </div>
    </div>
  );
};

export default C4Dashboard;

