import { Action, GameObject } from './types/game-types';

export const currentUserName = (gameObj: GameObject) => {
  return gameObj.users[gameObj.currentPlayer].name;
};

export const getUserName = (gameObj: GameObject, userId: string) => {
  return gameObj.users[userId].name;
};

export const logAction = (gameObj: GameObject, action: Action) => {
  if (action.target) {
    gameObj.log.push(
      `${currentUserName(gameObj)} performed the ${
        action.type
      } action on ${getUserName(gameObj, action.target)}...`
    );
  } else {
    gameObj.log.push(
      `${currentUserName(gameObj)} performed the ${action.type} action...`
    );
  }
};

export const logChallengeAction = (
  gameObj: GameObject,
  actionType: string,
  challengerId: string,
  defenderId: string,
  loserId: string
) => {
  gameObj.log.push(
    `${getUserName(gameObj, challengerId)} challenged ${getUserName(
      gameObj,
      defenderId
    )}'s ${actionType} action...`
  );
  gameObj.log.push(`${getUserName(gameObj, loserId)} lost the challenge...`);
};

export const logCounterAction = (
  gameObj: GameObject,
  counterActorId: string
) => {
  gameObj.log.push(
    `${getUserName(gameObj, counterActorId)} is countering ${currentUserName(
      gameObj
    )}...`
  );
};
