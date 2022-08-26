import { Users } from './types/game-types';

const cleanUpPlayerNumbers = (currentPlayerId, usersObj: Users) => {
  // TODO
};

export const getFirstPlayer = (usersObj) => {
  const usersArr = Object.keys(usersObj);
  const randomIndex = Math.floor(Math.random() * usersArr.length);
  return usersArr[randomIndex];
};

export const getNextPlayer = (currentPlayerId, usersObj: Users) => {
  const usersArr = Object.values(usersObj);

  usersArr.sort((a, b) => {
    return a.number - b.number;
  });

  const currentPlayerIndex = usersArr.findIndex(
    (user) => user.id === currentPlayerId
  );

  if (currentPlayerIndex === usersArr.length - 1) {
    return usersArr[0].id;
  } else {
    return usersArr[currentPlayerIndex + 1].id;
  }

  // const currentPlayerNum = usersObj[currentPlayerId].number;
  // const usersCount = Object.keys(usersObj).length;
  // let nextPlayerNum;
  // if (currentPlayerNum === usersCount) {
  //   nextPlayerNum = 1;
  // } else {
  //   nextPlayerNum = currentPlayerNum + 1;
  // }
  // const userValues = Object.entries(usersObj);
  // for (const [userId, userValue] of userValues) {
  //   if (userValue.number === nextPlayerNum) {
  //     if (!userValue.participant) {
  //       return getNextPlayer(userId, usersObj);
  //     } else {
  //       return userId;
  //     }
  //   }
  // }
};
