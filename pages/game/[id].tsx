import React, { Component } from 'react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import Game from '../../components/game';
import Lobby from '../../components/lobby';
import GameOver from '../../components/game-over';
import { GameObject } from '../../game/types/game-types';
import { v4 as uuidv4 } from 'uuid';

// TODO the initial game object with users should be marked with some started:False flag
function GameBase() {
  const router = useRouter();
  const { id: gameId } = router.query;
  const [socket, setSocket] = useState<Socket | undefined>(null);
  const [gameState, setGameState] = useState<GameObject | undefined>(null);
  const [userId, setUserId] = useState<string | undefined>(null);

  const [name, setName] = useState(() => {
    // getting stored value
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('name');
      const initialValue = JSON.parse(saved);
      return initialValue || uuidv4();
    } else {
      return '';
    }
  });

  useEffect(() => {
    // storing input name
    localStorage.setItem('name', JSON.stringify(name));
  }, [name]);

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
      });

      socket.on('disconnect', () => {
        console.log('disconnect');
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
      comp = <Game socket={socket} gameState={gameState} userId={userId} />;
    } else if (gameState.ended) {
      comp = <GameOver socket={socket} gameState={gameState} userId={userId} />;
    } else {
      comp = <Lobby socket={socket} gameState={gameState} userId={userId} />;
    }
  }

  return <>{comp}</>;
}

export default GameBase;
