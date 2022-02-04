import React, { Component } from 'react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import Game from '../../components/game';
import Lobby from '../../components/lobby';

// TODO the initial game object with users should be marked with some started:False flag
function GameBase() {
  const router = useRouter();
  const { id: gameId } = router.query;
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [userId, setUserId] = useState(null);

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

  return (
    <>
      {gameState && gameState.started ? (
        <Game socket={socket} gameState={gameState} userId={userId} />
      ) : (
        <Lobby socket={socket} gameState={gameState} userId={userId} />
      )}
    </>
  );
}

export default GameBase;
