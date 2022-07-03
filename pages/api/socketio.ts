import { Server } from 'socket.io';
import {
  addUser,
  startGame,
  removeUser,
  pushState,
  handleAction,
  handleChallengeAction,
  handleCounterAction,
  handleChallengeCounterAction,
  pushCacheState,
  resolveAction,
  resolveChallengeAction,
  resolveCounterAction,
  resolveChallengeCounterAction,
  handleNextTurn,
} from '../../game/game-state';

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
  NEXT_TURN,
  LOSE_INFLUENCE,
} from '../../game/phase-action-order';
import { GameObject } from '../../game/types/game-types';

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    console.log('*First use, starting socket.io');

    const io = new Server(res.socket.server);

    io.on('connection', (socket) => {
      socket.on('join', (gameId) => {
        console.log(`Socket ${socket.id} joining ${gameId}`);
        socket.join(gameId);
        pushState(socket, gameId);
      });
      socket.on('chat', (data) => {
        const { message, room } = data;
        console.log(`msg: ${message}, room: ${room}`);
        io.to(room).emit('chat', message);
      });
      socket.on('start-game', (data) => {
        startGame(socket, data.gameId);
      });

      socket.on('add-user', (data) => {
        console.log(`Trying to add user ${JSON.stringify(data)}`);
        // TODO need to mod the global game object to add the users?
        addUser(socket, data.gameId, {
          id: socket.id,
          name: data.username,
        });
        // socket.to(data.gameId).emit("state-update", updatedGameState);
      });

      socket.on(ACTION, (data) => {
        // depending on the action type, call some function in game-state.js and pass the socket
        // so that it can re-emit the updated state
        handleAction(socket, data.gameId, data.action);
      });

      socket.on(CHALLENGE_ACTION, (data) => {
        //
        handleChallengeAction(socket, data.gameId, data.action);
      });

      socket.on(COUNTER_ACTION, (data) => {
        handleCounterAction(socket, data.gameId, data.action);
      });

      socket.on(CHALLENGE_COUNTER_ACTION, (data) => {
        handleChallengeCounterAction(socket, data.gameId, data.action);
      });
      socket.on(
        LOSE_INFLUENCE,
        (data: { gameId: string; gameObj: GameObject }) => {
          console.log(
            'Back end loseInfluence socket call received, following action',
            data.gameObj.activity.action
          );
          pushCacheState(socket, data.gameId, data.gameObj);
          // socket.emit('unset-lose-influence', {});

          const nextPhase = getSetNextPhase(
            data.gameObj.activity.phase,
            actions[data.gameObj.activity.action],
            data.gameObj,
            false
          );
          const type = data.gameObj.activity.action;
          switch (nextPhase) {
            case RESOLVE_ACTION:
              resolveAction(socket, data.gameId, { type });
              break;
            case RESOLVE_CHALLENGE_ACTION:
              resolveChallengeAction(socket, data.gameId, { type });
              break;
            case RESOLVE_COUNTER_ACTION:
              resolveCounterAction(socket, data.gameId, { type });
              break;
            case RESOLVE_CHALLENGE_COUNTER_ACTION:
              // pretty sure this is not a thing
              resolveChallengeCounterAction(socket, data.gameId, { type });
              break;
            case NEXT_TURN:
              handleNextTurn(socket, data.gameId, { type });
              break;
            default:
              console.log('Unexpected phase encountered');
          }
        }
      );
      socket.on('disconnect', () => {
        removeUser(socket);
      });
    });
    res.socket.server.io = io;
  } else {
    console.log('socket.io already running');
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default ioHandler;
