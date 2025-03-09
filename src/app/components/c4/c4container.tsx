 import React from "react";
import C4Card from "./c4Card";

export interface C4ContainerProps {
  serverName: string;
  status: string;
  players: string;
  map: string;
  mapImage: string;
}

export default function C4Container({serverName, status, players, map, mapImage}: C4ContainerProps) {
  
  return (
    <div className="flex flex-col gap-3 justify-center">
      <C4Card 
        serverName={serverName} 
        status={status} 
        players={players} 
        map={map} 
        mapImage={mapImage} 
      />
    </div>
  );
};


