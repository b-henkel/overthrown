import { v4 as uuidv4 } from 'uuid';
import cache from 'memory-cache';
import { deal, shuffle, swap, translateActionToCard } from './deck';
import { getFirstPlayer, getNextPlayer } from './user-order';
import { GlobalGameState, GameObject, User, Action } from './types/game-types';
import {
  actions,
  getSetNextPhase,
  ACTION,
  CHALLENGE_ACTION,
  RESOLVE_CHALLENGE_ACTION,
  COUNTER_ACTION,
  CHALLENGE_COUNTER_ACTION,
  RESOLVE_CHALLENGE_COUNTER_ACTION,
  RESOLVE_COUNTER_ACTION,
  RESOLVE_ACTION,
  LOSE_INFLUENCE,
  NEXT_TURN,
  EXCHANGE,
} from './phase-action-order';
import { icons } from '../constants/user-icons';
import _ from 'lodash';
import { logAction, logChallengeAction, logCounterAction } from './log-util';

export function phaseToFunction(func) {
  // console.log('phase to func received', func);
  switch (func) {
    case RESOLVE_ACTION:
      return resolveAction;
    case RESOLVE_CHALLENGE_ACTION:
      return resolveChallengeAction;
    case RESOLVE_COUNTER_ACTION:
      return resolveCounterAction;
    case RESOLVE_CHALLENGE_COUNTER_ACTION:
      return resolveChallengeCounterAction;
    case NEXT_TURN:
      return handleNextTurn;
    default:
      return null;
  }
}

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
  console.log(`New Game Initializing ${gameId}`);
  const newGameState: GameObject = {
    id: gameId,
    users: {},
    activity: null,
    started: false,
    ended: false,
    deck: [],
    currentPlayer: null,
    log: [],
  };
  globalGameState[gameId] = newGameState;
  cache.put('globalGameState', globalGameState);
  console.log('Just cached ', globalGameState);
  return newGameState;
};

export const addUser = (socket, gameId, user: User) => {
  let gameObj = globalGameState[gameId];
  if (!gameObj) {
    // TODO This is not actually acceptable long term but OK for dev
    console.log('Trying to bootstrap gameObj from user creation');
    gameObj = initGameState(gameId);
    // throw new Error("Somehow adding a user to a game that doesn't exist");
  }
  if (gameObj.users[user.id]) {
    gameObj.users[user.id].name = user.name;
  } else {
    gameObj.users[user.id] = {
      id: user.id,
      socketId: user.socketId,
      name: user.name,
      color: '#FF0000',
      cardOne: null,
      cardTwo: null,
      number: Object.keys(gameObj.users).length + 1,
      icon: _.sample(icons),
    };
  }
  console.log(JSON.stringify(gameObj));
  pushCacheState(socket, gameId, gameObj);
};

export const reconnectUser = (socket, userId, gameId) => {
  const gameObj = globalGameState[gameId];
  if (!userId || !gameObj.users || !(userId in gameObj.users)) {
    return;
  }
  const user = gameObj.users[userId];
  // TODO check if userId is null
  if (user.cardOneActive || user.cardTwoActive) {
    user.participant = true;
  }
  user.socketId = socket.id;
  pushCacheState(socket, gameId, gameObj);
};

export const startGame = (socket, gameId) => {
  const gameObj = globalGameState[gameId];
  gameObj.started = true;
  const { hands, deck } = deal(Object.keys(gameObj.users).length);
  gameObj.deck = deck;
  Object.values(gameObj.users).forEach((user, index) => {
    const hand = hands[index];
    user.cardOne = hand.cardOne;
    user.cardTwo = hand.cardTwo;
    user.cardOneActive = true;
    user.cardTwoActive = true;
    user.participant = true;
    user.coins = 7;
  });
  const firstPlayer = getFirstPlayer(gameObj.users);
  gameObj.currentPlayer = firstPlayer;
  gameObj.log = [];
  resetActivity(gameObj);
  pushCacheState(socket, gameId, gameObj);
};

export const resetGame = (socket, gameId) => {
  let gameObj = globalGameState[gameId];
  gameObj.started = false;
  gameObj.ended = false;
  gameObj.currentPlayer = null;
  if (Object.keys(gameObj.users).length < 2) {
    pushCacheState(socket, gameId, gameObj);
    return;
  }
  cacheState(gameId, gameObj);
  startGame(socket, gameId);
};

export const removeUser = (socket) => {
  Object.entries(globalGameState).forEach(([gameId, gameObj]) => {
    const user = Object.values(gameObj.users).find(
      (item) => item.socketId === socket.id
    );
    if (user) {
      gameObj.users[user.id].participant = false;
      let participants = Object.values(gameObj.users).filter(
        (user) => user.participant
      );
      if (gameObj.currentPlayer === user.id || participants.length === 1) {
        nextTurn(user.id, gameObj);
      } else {
        resetActivity(gameObj);
      }
      // delete gameObj.users[userId];
      socket.to(gameId).emit('state-update', gameObj);
    }
  });
};

const resetActivity = (gameObj) => {
  gameObj.activity = {
    phase: ACTION,
    action: null,
    actionTarget: null,
    actionChallenger: null,
    counterActor: null,
    counterActorCard: null,
    counteractionChallenger: null,
    passingUsers: [],
  };
};

const checkLastInfluence = (user: User) => {
  if (!user.cardOneActive || !user.cardTwoActive) {
    user.participant = false;
    user.cardOneActive = false;
    user.cardTwoActive = false;
    return true;
  }
  return false;
};

const nextTurn = (currentPlayer, gameObj: GameObject) => {
  let participants = Object.values(gameObj.users).filter(
    (user) => user.participant
  );
  if (participants.length < 2) {
    console.log('Participants: ', participants);
    gameObj.ended = true;
    gameObj.started = false;
    gameObj.winner = participants[0];
  }
  console.log(`participants: ${JSON.stringify(participants)}`);
  resetActivity(gameObj);
  gameObj.currentPlayer = getNextPlayer(currentPlayer, gameObj.users);
  gameObj.activity.phase = ACTION;
};

export function handleNextTurn(socket, gameId, action) {
  console.log('*** handleNextTurn');
  const gameObj = loadGlobalGameState()[gameId];
  nextTurn(gameObj.currentPlayer, gameObj);
  pushCacheState(socket, gameId, gameObj);
  console.log(' ------- ');
}

export function handleAction(socket, gameId, action: Action) {
  console.log('*** handleAction');
  const gameObj = loadGlobalGameState()[gameId];
  gameObj.activity.action = action.type;
  gameObj.activity.actionTarget = action.target;
  logAction(gameObj, action);

  const actionLogic = actions[action.type];
  console.log('handleAction.actionLogic', action.type, actionLogic);
  console.log('handleAction calling getSetNextPhase');
  const nextPhase = getSetNextPhase(ACTION, actionLogic, gameObj);
  const nextFunc = phaseToFunction(nextPhase);
  if (action.type === 'overThrow') {
    const targetUser = gameObj.users[action.target];
    const lastInfluence = checkLastInfluence(targetUser);
    if (lastInfluence) {
      cacheState(gameId, gameObj);
      resolveAction(socket, gameId, action);
      // nextTurn(gameObj.currentPlayer, gameObj);
    } else {
      gameObj.activity.phase = LOSE_INFLUENCE;
      gameObj.activity.originalPhase = ACTION;
      gameObj.activity.loseInfluenceTarget = targetUser.id;
    }
    pushCacheState(socket, gameId, gameObj);
    return;
  }

  if (nextFunc) {
    console.log('Forwarding immediately to ', nextFunc);
    nextFunc(socket, gameId, action);
    console.log(' ------- ');
    return;
  } else {
    console.log('Phase set but not forwarded ', nextPhase);
  }
  pushCacheState(socket, gameId, gameObj);
  console.log(' ------- ');
}

export function resolveAction(socket, gameId, action: Action) {
  console.log('*** resolveAction');
  const gameObj = loadGlobalGameState()[gameId];
  const actionLogic = actions[action.type];

  if (action.type !== 'steal') {
    gameObj.users[gameObj.currentPlayer].coins += actionLogic.coinExchange;
  }

  if (action.type === 'assassinate') {
    const targetUser = gameObj.users[gameObj.activity.actionTarget];
    const lastInfluence = checkLastInfluence(targetUser);
    if (lastInfluence) {
      nextTurn(gameObj.currentPlayer, gameObj);
    } else {
      gameObj.activity.nextPhase = NEXT_TURN;
      gameObj.activity.phase = LOSE_INFLUENCE;
      gameObj.activity.originalPhase = RESOLVE_ACTION;
      gameObj.activity.loseInfluenceTarget = targetUser.id;
    }
    pushCacheState(socket, gameId, gameObj);
    return;
  } else if (action.type === 'steal') {
    const targetUser = gameObj.users[gameObj.activity.actionTarget];
    if (targetUser.coins >= 2) {
      targetUser.coins -= 2;
      gameObj.users[gameObj.currentPlayer].coins += actionLogic.coinExchange;
    } else {
      gameObj.users[gameObj.currentPlayer].coins += targetUser.coins;
      targetUser.coins = 0;
    }
  }
  if (action.type === 'exchange') {
    gameObj.activity.phase = EXCHANGE;
    pushCacheState(socket, gameId, gameObj);
    return;
  }
  nextTurn(gameObj.currentPlayer, gameObj);
  pushCacheState(socket, gameId, gameObj);
  console.log(' ------- ');
}

const getParticipants = (gameObj: GameObject) => {
  return Object.values(gameObj.users).filter((user) => user.participant);
};

const processChallenge = (
  challengingUserId,
  defendingUserId,
  claimedCard,
  expectedReason,
  originatingPhase,
  socket,
  userId,
  action,
  gameObj: GameObject
) => {
  const actionType =
    originatingPhase === CHALLENGE_COUNTER_ACTION ? 'counter' : action.type;
  console.log(
    'Process challenge called',
    challengingUserId,
    defendingUserId,
    claimedCard,
    expectedReason,
    originatingPhase
  );
  const actionLogic = actions[action.type];
  // console.log('processChallenge calling getSetNextPhase');
  const nextPhase = getSetNextPhase(originatingPhase, actionLogic, gameObj);
  const nextFunc = phaseToFunction(nextPhase);

  if (action.response === expectedReason) {
    const defendingUser = gameObj.users[defendingUserId];
    const defendingUserCardOne = defendingUser.cardOneActive
      ? defendingUser.cardOne
      : null;
    const defendingUserCardTwo = defendingUser.cardTwoActive
      ? defendingUser.cardTwo
      : null;
    console.log('DefendingUser', JSON.stringify(defendingUser));
    console.log(
      'ChallengingUser',
      JSON.stringify(gameObj.users[challengingUserId])
    );
    // TODO check if user reaches game over state and set participant flag to false
    if (
      defendingUserCardOne === claimedCard ||
      defendingUserCardTwo === claimedCard
    ) {
      // Scenario 1, the original action or counter action was legitimate
      // Swap the actor or counter actors card, and cause the challenger to lose influence.
      // Game should move forward as normal and the action or counter action should complete
      // change claimed card to a new card from deck and shuffle
      console.log('Defending User was valid, challenger should lose a card');

      logChallengeAction(
        gameObj,
        actionType,
        challengingUserId,
        defendingUserId,
        challengingUserId
      );
      const { deck, cardOut } = swap(gameObj.deck, claimedCard);
      gameObj.deck = deck;
      if (defendingUserCardOne === claimedCard) {
        defendingUser.cardOne = cardOut;
      } else {
        defendingUser.cardTwo = cardOut;
      }
      const lastInfluence = checkLastInfluence(
        gameObj.users[challengingUserId]
      );
      if (lastInfluence) {
        nextTurn(gameObj.currentPlayer, gameObj);
      }
      //remove card from challenger
      else {
        gameObj.activity.phase = LOSE_INFLUENCE;
        gameObj.activity.originalPhase = originatingPhase;
        gameObj.activity.loseInfluenceTarget = challengingUserId;
      }
      pushCacheState(socket, gameObj.id, gameObj);
      console.log(' ------- ');
      return;
    } else {
      // Scenario 2, the challenger was right! punish the defending user
      // remove card from counter actor
      console.log(
        'Challenger was right! Original actor or counteractor loses a card'
      );
      logChallengeAction(
        gameObj,
        actionType,
        challengingUserId,
        defendingUserId,
        defendingUserId
      );
      const lastInfluence = checkLastInfluence(defendingUser);
      if (lastInfluence) {
        nextTurn(gameObj.currentPlayer, gameObj);
      } else {
        gameObj.activity.nextPhase = NEXT_TURN;
        gameObj.activity.phase = LOSE_INFLUENCE;
        gameObj.activity.originalPhase = originatingPhase;
        gameObj.activity.loseInfluenceTarget = defendingUserId;
      }
      pushCacheState(socket, gameObj.id, gameObj);
      console.log(' ------- ');
      return;
    }
  } else {
    gameObj.activity.passingUsers.push(userId);

    if (
      gameObj.activity.passingUsers.length ===
      getParticipants(gameObj).length - 1
    ) {
      console.log('Moving forward to nextFunc', nextFunc);
      gameObj.activity.passingUsers = [];
      if (nextFunc) {
        nextFunc(socket, gameObj.id, action);
        console.log(' ------- ');
        return;
      } else {
        pushCacheState(socket, gameObj.id, gameObj);
        console.log(' ------- ');
        return;
      }
    } else {
      console.log(
        'Insufficient passes so far',
        gameObj.activity.passingUsers.length,
        Object.keys(gameObj.users).length - 1
      );
    }
  }
};

export function handleChallengeAction(
  socket,
  gameId,
  userId: string,
  action: Action
) {
  console.log('*** handleChallengeAction');
  const gameObj = loadGlobalGameState()[gameId];
  processChallenge(
    userId,
    gameObj.currentPlayer,
    translateActionToCard(gameObj.activity.action),
    'challenge',
    CHALLENGE_ACTION,
    socket,
    userId,
    action,
    gameObj
  );
}

export function resolveChallengeAction(socket, gameId, action: Action) {
  console.log('*** resolveChallengeAction');
  const gameObj = loadGlobalGameState()[gameId];
  // let nextStep;
  const actionLogic = actions[action.type];
  console.log('resolveChallengeAction calling getSetNextPhase');
  const nextPhase = getSetNextPhase(CHALLENGE_ACTION, actionLogic, gameObj);
  const nextFunc = phaseToFunction(nextPhase);

  if (nextFunc) {
    nextFunc(socket, gameId, action);
    console.log(' ------- ');
    return;
  }
  pushCacheState(socket, gameId, gameObj);
  console.log(' ------- ');
}

export function handleCounterAction(
  socket,
  gameId,
  userId: string,
  action: Action
) {
  console.log('*** handleCounterAction');
  const gameObj = loadGlobalGameState()[gameId];
  gameObj.activity.counterActorCard = action.counterActorCard;
  if (action.response === 'block') {
    logCounterAction(gameObj, userId);
    gameObj.activity.counterActor = userId;
    gameObj.activity.phase = CHALLENGE_COUNTER_ACTION;
  } else {
    gameObj.activity.passingUsers.push(userId);

    if (
      gameObj.activity.passingUsers.length ===
      getParticipants(gameObj).length - 1
    ) {
      gameObj.activity.passingUsers = [];
      resolveAction(socket, gameId, action);
      console.log(' ------- ');
      return;
    }
  }
  pushCacheState(socket, gameId, gameObj);
  console.log(' ------- ');
}
export function resolveCounterAction(socket, gameId, action: Action) {
  console.log('*** resolveCounterAction');
  const gameObj = loadGlobalGameState()[gameId];
  // the only counter action for foreign aid is block so nothing happens
  nextTurn(gameObj.currentPlayer, gameObj);
  pushCacheState(socket, gameId, gameObj);
  console.log(' ------- ');
}
export function handleChallengeCounterAction(
  socket,
  gameId,
  userId: string,
  action: Action
) {
  console.log('*** handleChallengeCounterAction');
  const gameObj = loadGlobalGameState()[gameId];
  const actionLogic = actions[action.type];
  if (actionLogic.canBeCountered) {
    processChallenge(
      userId,
      gameObj.activity.counterActor,
      gameObj.activity.counterActorCard,
      'doubt',
      CHALLENGE_COUNTER_ACTION,
      socket,
      userId,
      action,
      gameObj
    );
  }
}
export function resolveChallengeCounterAction(socket, gameId, action: Action) {
  console.log('*** resolveChallengeCounterAction');
}

export function resolveExchange(socket, gameId, user: User, deck: string[]) {
  const gameObj = loadGlobalGameState()[gameId];
  gameObj.users[user.id] = user;
  // update the user object with user selection
  // suffle deck
  shuffle(deck);
  gameObj.deck = deck;
  // re-emit
  nextTurn(gameObj.currentPlayer, gameObj);
  pushCacheState(socket, gameId, gameObj);
}

export const pushState = (socket, gameId) => {
  const gameObj = cache.get('globalGameState')[gameId];
  console.log('looked up existing object', gameId, gameObj);
  socket.emit('state-update', gameObj);
};

export const pushCacheState = (socket, gameId, gameObj) => {
  globalGameState[gameId] = gameObj;
  cache.put('globalGameState', globalGameState);
  socket.emit('state-update', gameObj);
  socket.to(gameId).emit('state-update', gameObj);
  // console.log('game state: ', JSON.stringify(gameObj));
};

export const cacheState = (gameId, gameObj) => {
  globalGameState[gameId] = gameObj;
  cache.put('globalGameState', globalGameState);
};
