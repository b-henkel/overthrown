// A central place to define all of the possible actions and outcome flows in each phase

import { GameObject } from './types/game-types';

// GAME ACTIVITY PHASES
export const ACTION = 'action';
export const CHALLENGE_ACTION = 'challengeAction';
export const RESOLVE_CHALLENGE_ACTION = 'resolveChallengeAction';
export const COUNTER_ACTION = 'counterAction';
export const CHALLENGE_COUNTER_ACTION = 'challengeCounterAction';
export const RESOLVE_CHALLENGE_COUNTER_ACTION = 'resolveChallengeCounterAction';
export const RESOLVE_COUNTER_ACTION = 'resolveCounterAction';
export const RESOLVE_ACTION = 'resolveAction';
export const LOSE_INFLUENCE = 'loseInfluence';
// for use by ambassador
export const EXCHANGE = 'exchange';
export const NEXT_TURN = 'nextTurn';

export const actions = {
  income: {
    canBeCountered: false,
    canBeChallenged: false,
    counteredBy: [],
    coinExchange: 1,
  },
  foreignAid: {
    canBeCountered: true,
    canBeChallenged: false,
    counteredBy: ['duke'],
    coinExchange: 2,
  },
  overThrow: {
    canBeCountered: false,
    canBeChallenged: false,
    counteredBy: [],
    coinExchange: -7,
  },
  tax: {
    canBeCountered: false,
    canBeChallenged: true,
    counteredBy: [],
    coinExchange: 3,
  },
  assassinate: {
    canBeCountered: true,
    canBeChallenged: true,
    counteredBy: ['contessa'],
    coinExchange: -3,
  },
  steal: {
    canBeCountered: true,
    canBeChallenged: true,
    counteredBy: ['captain', 'ambassador', 'inquisitor'],
    coinExchange: 2,
  },
  exchange: {
    canBeCountered: false,
    canBeChallenged: true,
    counteredBy: [],
    coinExchange: 0,
  },
};

export const getSetNextPhase = (
  phase,
  actionLogic,
  gameObj: GameObject,
  updateGamePhase = true
) => {
  // Determines the next phase given the current action
  // conditionally sets into the gameObj as appropriate

  let actualPhase = phase;
  // Reset the phase to whatever the original phase was, if possible
  // This helps with injected phases like loseInfluence and exchange
  if (gameObj.activity.originalPhase) {
    actualPhase = gameObj.activity.originalPhase;
    gameObj.activity.originalPhase = null;
  }

  let nextPhase;
  // Precheck for a resumable phase on the gameObj itself, first
  if (gameObj.activity.nextPhase) {
    nextPhase = gameObj.activity.nextPhase;
    // Unset so we don't keep resuming
    gameObj.activity.nextPhase = null;
  } else if (actualPhase == ACTION) {
    if (actionLogic.canBeChallenged) {
      nextPhase = CHALLENGE_ACTION;
    } else if (actionLogic.canBeCountered) {
      nextPhase = COUNTER_ACTION;
    } else {
      nextPhase = RESOLVE_ACTION;
    }
  } else if (actualPhase == CHALLENGE_ACTION) {
    if (actionLogic.canBeCountered) {
      nextPhase = COUNTER_ACTION;
    } else {
      nextPhase = RESOLVE_ACTION;
    }
  } else if (actualPhase == COUNTER_ACTION) {
    if (actionLogic.canBeChallenged) {
      nextPhase = CHALLENGE_COUNTER_ACTION;
    } else {
      nextPhase = RESOLVE_ACTION;
    }
  } else if (actualPhase == CHALLENGE_COUNTER_ACTION) {
    nextPhase = RESOLVE_COUNTER_ACTION;
  }
  if (updateGamePhase) {
    gameObj.activity.phase = nextPhase;
  }
  return nextPhase;
};
