export type GlobalGameState = {
  [key: string]: GameObject;
};

export type User = {
  id: string;
  name: string;
  coins?: number;
  color?: string;
  cardOne?: string; // Could be ENUM
  cardTwo?: string;
  cardOneActive?: boolean;
  cardTwoActive?: boolean;
  number?: number;
  participant?: boolean;
};

export type Users = {
  [key: string]: User;
};

export type Activity = {
  phase: string;
  nextPhase?: string;
  originalPhase?: string;
  action: string;
  actionTarget: string;
  actionChallenger: string;
  counterActor: string;
  counterActorCard: string;
  counterActionChallenger: string;
  loseInfluenceTarget?: string;
  passingUsers: string[];
};

export type GameObject = {
  id: string;
  users: Users;
  started: boolean;
  ended: boolean;
  deck: string[];
  currentPlayer: string;
  activity: Activity;
  winner?: string;
};

export type Action = {
  type: string;
  target?: string;
  response?: string;
  counterActorCard?: string;
};
