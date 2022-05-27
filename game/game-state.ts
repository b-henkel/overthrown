import { v4 as uuidv4 } from 'uuid';
import cache from 'memory-cache';
import { deal, swap, translateActionToCard } from './deck';
import { getFirstPlayer, getNextPlayer } from './user-order';
import { GlobalGameState, GameObject, User, Action } from './types/game-types';

const globalGameState: GlobalGameState = loadGlobalGameState();

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
  const newGameState: GameObject = {
    id: gameId,
    users: {},
    activity: null,
    started: false,
    deck: [],
    currentPlayer: null,
  };
  globalGameState[gameId] = newGameState;
  cache.put('globalGameState', globalGameState);
  return newGameState;
};

export const addUser = (socket, gameId, user: User) => {
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
  resetActivity(gameObj);
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

const resetActivity = (gameObj) => {
  gameObj.activity = {
    phase: 'action',
    action: null,
    actionTarget: null,
    actionChallenger: null,
    counterActor: null,
    counterActorCard: null,
    counteractionChallenger: null,
    passingUsers: [],
  };
};

export const handleAction = (socket, gameId, action: Action) => {
  console.log('recieved action: ', action);
  /* {type:"income", target:null} */
  const gameObj = globalGameState[gameId];
  gameObj.activity.action = action.type;
  gameObj.activity.actionTarget = action.target;

  if (action.type === 'income') {
    gameObj.users[socket.id].coins += 1;
    gameObj.currentPlayer = getNextPlayer(socket.id, gameObj.users);
    resetActivity(gameObj);
  }
  if (action.type === 'foreignAid') {
    if (gameObj.activity.phase === 'action') {
      gameObj.activity.phase = 'counterAction';
    }
  }
  if (action.type === 'overThrow') {
    gameObj.users[socket.id].coins -= 7;
    // TODO remove opponent player when no more cards are available
    const targetUser = gameObj.users[action.target];
    // if (targetUser.cardOne) {
    //   targetUser.cardOne = null;
    // } else {
    //   targetUser.cardTwo = null;
    // }
    pushLoseInfluence(socket, {}, targetUser.id);
  }
  if (['tax', 'assassinate', 'steal'].includes(action.type)) {
    if (gameObj.activity.phase === 'action') {
      gameObj.activity.phase = 'challengeAction';
    }
  }
  pushCacheState(socket, gameId, gameObj);
};

export const resolveAction = (socket, gameId, action: Action) => {
  const gameObj = globalGameState[gameId];
  if (action.type === 'foreignAid') {
    gameObj.users[gameObj.currentPlayer].coins += 2;
  } else if (action.type === 'overthrow') {
    gameObj.currentPlayer = getNextPlayer(socket.id, gameObj.users);
    resetActivity(gameObj);
  } else if (action.type === 'tax') {
    gameObj.users[gameObj.currentPlayer].coins += 3;
  } else if (action.type === 'assassinate') {
    gameObj.users[gameObj.currentPlayer].coins -= 3;
    const targetUser = gameObj.users[gameObj.activity.actionTarget];
    if (targetUser.cardOne) {
      targetUser.cardOne = null;
    } else {
      targetUser.cardTwo = null;
    }
  } else if (action.type === 'steal') {
    const targetUser = gameObj.users[gameObj.activity.actionTarget];
    console.log('resolve action steal ', targetUser);
    if (targetUser.coins >= 2) {
      console.log('inside the If statement :)');
      targetUser.coins -= 2;
      gameObj.users[gameObj.currentPlayer].coins += 2;
    } else {
      console.log('inside the else statement :(');
      gameObj.users[gameObj.currentPlayer].coins += targetUser.coins;
      targetUser.coins = 0;
    }
  }
  resetActivity(gameObj);
  gameObj.currentPlayer = getNextPlayer(gameObj.currentPlayer, gameObj.users);
  pushCacheState(socket, gameId, gameObj);
};
export const handleChallengeAction = (socket, gameId, action) => {
  const gameObj = globalGameState[gameId];
  let nextStep;
  if (action.type === 'tax') {
    nextStep = () => {
      resolveAction(socket, gameId, action);
    };
  } else if (['assassinate', 'steal'].includes(action.type)) {
    nextStep = () => {
      gameObj.activity.phase = 'counterAction';
    };
  }
  if (action.response === 'challenge') {
    const challenger = gameObj.users[socket.id];
    const activePlayerId = gameObj.currentPlayer;
    const activePlayer = gameObj.users[activePlayerId];
    const activePlayerCardOne = activePlayer.cardOne;
    const activePlayerCardTwo = activePlayer.cardTwo;
    const claimedCard = translateActionToCard(gameObj.activity.action);

    if (
      activePlayerCardOne === claimedCard ||
      activePlayerCardTwo === claimedCard
    ) {
      //remove card from challenger
      if (challenger.cardOne) {
        challenger.cardOne = null;
      } else {
        challenger.cardTwo = null;
      }
      // TODO check if user reaches game over state and set participant flag to false
      // change claimed card to a new card from deck and shuffle
      const { deck, cardOut } = swap(gameObj.deck, claimedCard);
      gameObj.deck = deck;
      if (activePlayerCardOne === claimedCard) {
        activePlayer.cardOne = cardOut;
      } else {
        activePlayer.cardTwo = cardOut;
      }
      // moves to resolve action phase completes
      nextStep();
    } else {
      // remove card from lying actor
      if (activePlayerCardOne) {
        activePlayer.cardOne = null;
      } else {
        activePlayer.cardTwo = null;
      }
      resetActivity(gameObj);
      gameObj.currentPlayer = getNextPlayer(
        gameObj.currentPlayer,
        gameObj.users
      );
    }
  } else {
    gameObj.activity.passingUsers.push(socket.id);
    console.log(
      'Size check',
      gameObj.activity.passingUsers.length,
      Object.keys(gameObj.users).length - 1
    );

    if (
      gameObj.activity.passingUsers.length ===
      Object.keys(gameObj.users).length - 1
    ) {
      gameObj.activity.passingUsers = [];
      nextStep();
    }
  }
  pushCacheState(socket, gameId, gameObj);
};
export const resolveChallengeAction = (socket, gameId, action) => {};
export const handleCounterAction = (socket, gameId, action: Action) => {
  console.log('counter action: ', action);
  const gameObj = globalGameState[gameId];
  gameObj.activity.counterActorCard = action.counterActorCard;
  if (action.response === 'block') {
    gameObj.activity.counterActor = socket.id;
    gameObj.activity.phase = 'challengeCounterAction';
  } else {
    gameObj.activity.passingUsers.push(socket.id);
    console.log(
      'Size check',
      gameObj.activity.passingUsers.length,
      Object.keys(gameObj.users).length - 1
    );

    if (
      gameObj.activity.passingUsers.length ===
      Object.keys(gameObj.users).length - 1
    ) {
      // gameObj.activity.phase = 'resolveAction';
      gameObj.activity.passingUsers = [];
      resolveAction(socket, gameId, action);
      return;
    }
  }
  pushCacheState(socket, gameId, gameObj);
};
export const resolveCounterAction = (socket, gameId, action) => {
  const gameObj = globalGameState[gameId];
  if (['foreignAid', 'assassinate', 'steal'].includes(action.type)) {
    // the only counter action for foreign aid is block so nothing happens
    resetActivity(gameObj);
    gameObj.currentPlayer = getNextPlayer(gameObj.currentPlayer, gameObj.users);
  }
  pushCacheState(socket, gameId, gameObj);
};
export const handleChallengeCounterAction = (socket, gameId, action) => {
  const gameObj = globalGameState[gameId];
  if (['foreignAid', 'assassinate', 'steal'].includes(action.type)) {
    if (action.response === 'doubt') {
      const doubter = gameObj.users[socket.id];
      const counterActorId = gameObj.activity.counterActor;
      const counterActor = gameObj.users[counterActorId];
      const counterActorCardOne = counterActor.cardOne;
      const counterActorCardTwo = counterActor.cardTwo;
      const claimedCard = gameObj.activity.counterActorCard;
      if (
        counterActorCardOne === claimedCard ||
        counterActorCardTwo === claimedCard
      ) {
        //remove card from challenger
        if (doubter.cardOne) {
          doubter.cardOne = null;
        } else {
          doubter.cardTwo = null;
        }
        // TODO check if user reaches game over state and set participant flag to false
        // change claimed card to a new card from deck and shuffle
        const { deck, cardOut } = swap(gameObj.deck, claimedCard);
        gameObj.deck = deck;
        if (counterActorCardOne === claimedCard) {
          counterActor.cardOne = cardOut;
        } else {
          counterActor.cardTwo = cardOut;
        }
        // counter action completes
        resolveCounterAction(socket, gameId, action);
        return;
      } else {
        // remove card from counter actor
        if (counterActorCardOne) {
          counterActor.cardOne = null;
        } else {
          counterActor.cardTwo = null;
        }
        resolveAction(socket, gameId, action);
        return;
      }
    } else {
      gameObj.activity.passingUsers.push(socket.id);
      console.log(
        'Size check',
        gameObj.activity.passingUsers.length,
        Object.keys(gameObj.users).length - 1
      );

      if (
        gameObj.activity.passingUsers.length ===
        Object.keys(gameObj.users).length - 1
      ) {
        // gameObj.activity.phase = 'resolveAction';
        gameObj.activity.passingUsers = [];
        resolveCounterAction(socket, gameId, action);
        return;
      }
    }
  }

  pushCacheState(socket, gameId, gameObj);
};
export const resolveChallengeCounterAction = (socket, gameId, action) => {};

export const pushState = (socket, gameId) => {
  console.log('global gamestate', JSON.stringify(globalGameState));
  const gameObj = globalGameState[gameId];
  socket.emit('state-update', gameObj);
};

export const pushCacheState = (socket, gameId, gameObj) => {
  cache.put('globalGameState', globalGameState);
  socket.emit('state-update', gameObj);
  socket.to(gameId).emit('state-update', gameObj);
  console.log('game state: ', gameObj);
};

const pushLoseInfluence = (socket, payload, targetPlayerId) => {
  socket.to(targetPlayerId).emit('lose-influence', payload);
};
