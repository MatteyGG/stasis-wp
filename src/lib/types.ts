export enum C4Status {
  None = "none",
  Active = "active",
  Finished = "finished",
}

export interface C4 {
  id: string;
  map: string;
  status: C4Status;
  result: string;
  startedAt: Date;
  endedAt?: Date;
  createdAt: Date;
  totalPlayers?: number;
  avgPowerGain?: number;
  avgKillGain?: number;
  avgDieGain?: number;
  avgKdGain?: number;
  statistics?: C4Statistic[];
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

export interface C4Statistic {
  id: string;
  c4Id: string;
  playerId: string | null;
  username: string;
  warpathId: number;
  startPower: number;
  startKill: number;
  startDie: number;
  startKd: number;
  powerGain: number | null;
  killGain: number | null;
  dieGain: number | null;
  kdGain: number | null;
  player?: Player;
}

export interface Player {
  id: string;
  warpathId: number | null;
  username: string;
  ally: string | null;
  power: number;
  kill: number;
  die: number;
  kd: number;
  onSite: boolean;
}

// Тип для игрока с Warpath API
export interface WarpathPlayer {
  ally: string;
  warpathId: number;
  id: number;
  pid: number;
  nick: string;
  gnick: string;
  wid: number;
  lv: number;
  power: string;
  caiji: number;
  maxpower: number;
  sumkill: number;
  die: number;
  kd: number;
  resourceCollection: number;
  powers: {
    camp: number;
    tech: number;
    equip: number;
    total: number;
    officer: number;
    army_air: number;
    army_navy: number;
    army_ground: number;
    tactic_card: number;
    mine_vehicle: number;
    super_computer: number;
    user_city_building: number;
  };
  kills: number[];
  createdAt: string;
}
