export enum C4Status {
  None = "none",
  Active = "active",
  Finished = "finished",
}

export interface C4 {
  id: string;
  map: string;
  status: C4Status;
  startedAt: Date;
  endedAt?: Date;
  createdAt: Date;
  totalPlayers?: number;
  avgPowerGain?: number;
  avgKillGain?: number;
  avgDieGain?: number;
  avgKdGain?: number;
}

export interface PlayerSnapshot {
  id: string;
  warpathId: number;
  username: string;
  playerId: string | null;
  c4Id: string;
  power: number;
  kill: number;
  die: number;
  kd: number;
  snapshotAt: Date;
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