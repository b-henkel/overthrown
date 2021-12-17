import { v4 as uuidv4 } from 'uuid';
import cache from 'memory-cache';

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
  gameObj.users[user.id] = user.name;
  cache.put('globalGameState', globalGameState);
  console.log(JSON.stringify(gameObj));
  socket.emit('state-update', gameObj);
  socket.to(gameId).emit('state-update', gameObj);
};

export const startGame = (socket, gameId) => {
  let gameObj = globalGameState[gameId];
  gameObj.started = true;
  cache.put('globalGameState', globalGameState);
  socket.emit('state-update', gameObj);
  socket.to(gameId).emit('state-update', gameObj);
};

export const removeUser = (socket) => {
  Object.entries(globalGameState).forEach(([gameId, gameObj]) => {
    if (Object.keys(gameObj.users).includes(socket.id)) {
      delete gameObj.users[socket.id];
      socket.to(gameId).emit('state-update', gameObj);
    }
  });
};
export const pushState = (socket, gameId) => {
  console.log('global gamestate', JSON.stringify(globalGameState));
  const gameObj = globalGameState[gameId];
  socket.emit('state-update', gameObj);
};
