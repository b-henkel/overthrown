export const getFirstPlayer = (usersObj) => {
  const usersArr = Object.keys(usersObj);
  const randomIndex = Math.floor(Math.random() * usersArr.length);
  return usersArr[randomIndex];
};
export const getNextPlayer = (currentPlayerId, usersObj) => {
  const currentPlayerNum = usersObj[currentPlayerId].number;
  const usersCount = Object.keys(usersObj).length;
  let nextPlayerNum;
  if (currentPlayerNum === usersCount) {
    nextPlayerNum = 1;
  } else {
    nextPlayerNum = currentPlayerNum + 1;
  }
  const userValues = Object.entries(usersObj);
  for (const [userId, userValue] of userValues) {
    if (userValue.number === nextPlayerNum) {
      return userId;
    }
  }
};
