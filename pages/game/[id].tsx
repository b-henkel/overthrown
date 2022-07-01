import React, { Component } from 'react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import Game from '../../components/game';
import Lobby from '../../components/lobby';
import GameOver from '../../components/game-over';
import { GameObject } from '../../game/types/game-types';

// TODO the initial game object with users should be marked with some started:False flag
function GameBase() {
  const router = useRouter();
  const { id: gameId } = router.query;
  const [socket, setSocket] = useState<Socket | undefined>(null);
  const [gameState, setGameState] = useState<GameObject | undefined>(null);
  const [userId, setUserId] = useState<string | undefined>(null);
  const [loseInfluence, setLoseInfluence] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/socketio').finally(() => {
      const socket = io();
      setSocket(socket);

      socket.on('connect', () => {
        console.log('connect');
        socket.emit('hello', 'init');
        setUserId(socket.id);
      });

      socket.on('hello', (data) => {
        console.log('hello', data);
      });

      socket.on('a user connected', () => {
        console.log('a user connected');
      });

      socket.on('state-update', (state) => {
        console.log('Update state:', state);
        setGameState(state);
        // setLoseInfluence(false);
      });

      socket.on('disconnect', () => {
        console.log('disconnect');
      });

      socket.on('lose-influence', (data) => {
        console.log('lose-influence', data);
        setLoseInfluence(true);
      });
      socket.on('unset-lose-influence', (data) => {
        console.log('unset-lose-influence', data);
        setLoseInfluence(false);
      });
    });
  }, []);

  useEffect(() => {
    if (socket && gameId) {
      socket.emit('join', gameId);
      console.log('Joined');
    } else {
      console.log('no socket or gameId available to join');
    }
  }, [socket, gameId]);

  // TODO make sure the fetched game id is valid
  let comp: JSX.Element;
  if (gameState) {
    if (gameState.started) {
      comp = <Game
      socket={socket}
      gameState={gameState}
      userId={userId}
      loseInfluence={loseInfluence}
    />
    } else if (gameState.ended) {
      comp = <GameOver gameState={gameState} userId={userId} />;
    } else {
      comp = <Lobby socket={socket} gameState={gameState} userId={userId} />;
    }
  }

  return <>{comp}</>;
}

export default GameBase;
