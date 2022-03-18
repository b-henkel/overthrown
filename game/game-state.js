import { v4 as uuidv4 } from 'uuid';
import cache from 'memory-cache';
import { deal } from './deck';
import { getFirstPlayer, getNextPlayer } from './user-order';

const globalGameState = loadGlobalGameState();

function loadGlobalGameState() {
  const state = cache.get('globalGameState');
  return state || {};
}

export const getGameState = (gameId) => {
  // Lookup a specific state object, return ref
  return globalGameState[gameId];
};

export const initGameState = (gameIdOverride = null) => {
  // Create, store, and return a new specific state object
  const gameId = gameIdOverride || uuidv4();
  console.log(`New Game Initialized ${gameId}`);
  const newGameState = { id: gameId, users: {} };
  globalGameState[gameId] = newGameState;
  cache.put('globalGameState', globalGameState);
  return newGameState;
};

export const addUser = (socket, gameId, user) => {
  let gameObj = globalGameState[gameId];
  if (!gameObj) {
    // TODO This is not actually acceptable long term but OK for dev
    gameObj = initGameState(gameId);
    // throw new Error("Somehow adding a user to a game that doesn't exist");
  }
  console.log('adding user', user);
  if (gameObj.users[user.id]) {
    gameObj.users[user.id].name = user.name;
  } else {
    gameObj.users[user.id] = {
      id: user.id,
      name: user.name,
      coins: 2,
      color: '#FF0000',
      cardOne: null,
      cardTwo: null,
      number: Object.keys(gameObj.users).length + 1,
    };
  }
  console.log(JSON.stringify(gameObj));
  pushCacheState(socket, gameId, gameObj);
};

export const startGame = (socket, gameId) => {
  let gameObj = globalGameState[gameId];
  gameObj.started = true;
  const { hands, deck } = deal(Object.keys(gameObj.users).length);
  gameObj.deck = deck;
  Object.values(gameObj.users).forEach((user, index) => {
    const hand = hands[index];
    user.cardOne = hand.cardOne;
    user.cardTwo = hand.cardTwo;
  });
  const firstPlayer = getFirstPlayer(gameObj.users);
  gameObj.currentPlayer = firstPlayer;
  pushCacheState(socket, gameId, gameObj);
};

export const removeUser = (socket) => {
  Object.entries(globalGameState).forEach(([gameId, gameObj]) => {
    if (Object.keys(gameObj.users).includes(socket.id)) {
      delete gameObj.users[socket.id];
      socket.to(gameId).emit('state-update', gameObj);
    }
  });
};

export const performAction = (socket, gameId, action) => {
  /* {type:"income", target:null} */
  const gameObj = globalGameState[gameId];
  if (action.type === 'income') {
    gameObj.users[socket.id].coins += 1;
    gameObj.currentPlayer = getNextPlayer(socket.id, gameObj.users);
  }
  if (action.type === 'overThrow') {
    gameObj.users[socket.id].coins -= 7;
    // todo: remove opponent player when no more cards are available
    const targetUser = gameObj.users[action.target];
    if (targetUser.cardOne) {
      targetUser.cardOne = null;
    } else {
      targetUser.cardTwo = null;
    }
    gameObj.currentPlayer = getNextPlayer(socket.id, gameObj.users);
  }
  pushCacheState(socket, gameId, gameObj);
};

export const pushState = (socket, gameId) => {
  console.log('global gamestate', JSON.stringify(globalGameState));
  const gameObj = globalGameState[gameId];
  socket.emit('state-update', gameObj);
};

const pushCacheState = (socket, gameId, gameObj) => {
  cache.put('globalGameState', globalGameState);
  socket.emit('state-update', gameObj);
  socket.to(gameId).emit('state-update', gameObj);
  console.log('game state: ', gameObj);
};
