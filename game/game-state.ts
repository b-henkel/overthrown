import { v4 as uuidv4 } from 'uuid';
import cache from 'memory-cache';
import { deal, swap, translateActionToCard } from './deck';
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
} from './phase-action-order';

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
      name: user.name,
      coins: 7, // TODO reset to 2, this is just for DEV purposes
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
    user.cardOneActive = true;
    user.cardTwoActive = true;
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

const nextTurn = (currentPlayer, gameObj: GameObject) => {
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

  const actionLogic = actions[action.type];
  console.log('handleAction.actionLogic', action.type, actionLogic);
  console.log('handleAction calling getSetNextPhase');
  const nextPhase = getSetNextPhase(ACTION, actionLogic, gameObj);
  const nextFunc = phaseToFunction(nextPhase);
  if (action.type === 'overThrow') {
    // TODO remove opponent player when no more cards are available
    const targetUser = gameObj.users[action.target];
    gameObj.activity.phase = LOSE_INFLUENCE;
    gameObj.activity.originalPhase = ACTION;
    gameObj.activity.loseInfluenceTarget = targetUser.id;
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
    gameObj.activity.nextPhase = NEXT_TURN;
    gameObj.activity.phase = LOSE_INFLUENCE;
    gameObj.activity.originalPhase = RESOLVE_ACTION;
    gameObj.activity.loseInfluenceTarget = targetUser.id;
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

  nextTurn(gameObj.currentPlayer, gameObj);
  pushCacheState(socket, gameId, gameObj);
  console.log(' ------- ');
}

const processChallenge = (
  challengingUserId,
  defendingUserId,
  claimedCard,
  expectedReason,
  originatingPhase,
  socket,
  action,
  gameObj: GameObject
) => {
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
    const defendingUserCardOne = defendingUser.cardOne;
    const defendingUserCardTwo = defendingUser.cardTwo;
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
      const { deck, cardOut } = swap(gameObj.deck, claimedCard);
      gameObj.deck = deck;
      if (defendingUserCardOne === claimedCard) {
        defendingUser.cardOne = cardOut;
      } else {
        defendingUser.cardTwo = cardOut;
      }
      //remove card from challenger
      gameObj.activity.phase = LOSE_INFLUENCE;
      gameObj.activity.originalPhase = originatingPhase;
      gameObj.activity.loseInfluenceTarget = challengingUserId;
      pushCacheState(socket, gameObj.id, gameObj);
      console.log(' ------- ');
      return;
    } else {
      // Scenario 2, the challenger was right! punish the defending user
      // remove card from counter actor
      console.log(
        'Challenger was right! Original actor or counteractor loses a card'
      );
      gameObj.activity.nextPhase = NEXT_TURN;
      gameObj.activity.phase = LOSE_INFLUENCE;
      gameObj.activity.originalPhase = originatingPhase;
      gameObj.activity.loseInfluenceTarget = defendingUserId;
      pushCacheState(socket, gameObj.id, gameObj);
      console.log(' ------- ');
      return;
    }
  } else {
    gameObj.activity.passingUsers.push(socket.id);

    if (
      gameObj.activity.passingUsers.length ===
      Object.keys(gameObj.users).length - 1
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

export function handleChallengeAction(socket, gameId, action: Action) {
  console.log('*** handleChallengeAction');
  const gameObj = loadGlobalGameState()[gameId];
  processChallenge(
    socket.id,
    gameObj.currentPlayer,
    translateActionToCard(gameObj.activity.action),
    'challenge',
    CHALLENGE_ACTION,
    socket,
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

export function handleCounterAction(socket, gameId, action: Action) {
  console.log('*** handleCounterAction');
  const gameObj = loadGlobalGameState()[gameId];
  gameObj.activity.counterActorCard = action.counterActorCard;
  if (action.response === 'block') {
    gameObj.activity.counterActor = socket.id;
    gameObj.activity.phase = CHALLENGE_COUNTER_ACTION;
  } else {
    gameObj.activity.passingUsers.push(socket.id);

    if (
      gameObj.activity.passingUsers.length ===
      Object.keys(gameObj.users).length - 1
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
export function handleChallengeCounterAction(socket, gameId, action: Action) {
  console.log('*** handleChallengeCounterAction');
  const gameObj = loadGlobalGameState()[gameId];
  const actionLogic = actions[action.type];
  if (actionLogic.canBeCountered) {
    processChallenge(
      socket.id,
      gameObj.activity.counterActor,
      gameObj.activity.counterActorCard,
      'doubt',
      CHALLENGE_COUNTER_ACTION,
      socket,
      action,
      gameObj
    );
  }
}
export function resolveChallengeCounterAction(socket, gameId, action: Action) {
  console.log('*** resolveChallengeCounterAction');
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
