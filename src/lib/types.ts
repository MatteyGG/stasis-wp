export enum C4Status {
  None = "none",
  Active = "active",
  Finished = "finished",
}

export interface PlayerSnapshot {
  id: number;
  playerId: number;
  c4Id: number;
  ally: string;
  username: string;
  TownHall: number;
  power: number;
  kill: number;
  die: number;
  kd: number;
  snapshotAt: Date;
}

export interface C4 {
  id: number;
  map: string;
  status: C4Status;
  players?: string | null;
  link?: string | null;
  startedAt: Date;
  endedAt?: Date | null;
  createdAt: Date;
  stats?: PlayerSnapshot[];
}

// Тип для игрока с Warpath API
export interface WarpathPlayer {
  pid: number;
  nick: string;
  gnick: string;
  lv: number;
  maxpower: number;
  sumkill: number;
  die: number;
}