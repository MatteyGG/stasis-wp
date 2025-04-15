 import React from "react";
import C4Card from "./c4Card";

export interface C4ContainerProps {
  serverName: string;
  status: string;
  players: string;
  map: string;
  mapImage: string;
}

export default function C4Container({ status, players, map}: C4ContainerProps) {
  
  return (
    <div className=" flex flex-col  gap-3 justify-center">
      <C4Card
        status={status} 
        players={players} 
        map={map} 
      />
    </div>
  );
};



