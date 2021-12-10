import React, { Component } from 'react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Game from '../../components/game';

// TODO the initial game object with users should be marked with some started:False flag
function GameBase() {
  const router = useRouter();
  const { id: gameId } = router.query;
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState('');
  const [gamestate, setGamestate] = useState(null);

  useEffect(() => {
    fetch('/api/socketio').finally(() => {
      const socket = io();
      setSocket(socket);

      socket.on('connect', () => {
        console.log('connect');
        socket.emit('hello', 'init');
      });

      socket.on('hello', (data) => {
        console.log('hello', data);
      });

      socket.on('a user connected', () => {
        console.log('a user connected');
      });

      socket.on('state-update', (state) => {
        console.log('Update state:', state);
        setGamestate(state);
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

  const addUser = async () => {
    // grab the text box's information
    // and then fire an http request
    if (socket) {
      console.log('Trying to emit?');
      socket.emit('add-user', { username, gameId });
    } else {
      console.log('no socket available');
    }
  };

  const startGame = async () => {
    //
  };

  return (
    <div>
      <h2>HELLO THIS IS THE GAME</h2>
      <h3>{router.query.id}</h3>
      <p>
        Cras facilisis urna ornare ex volutpat, et convallis erat elementum. Ut
        aliquam, ipsum vitae gravida suscipit, metus dui bibendum est, eget
        rhoncus nibh metus nec massa. Maecenas hendrerit laoreet augue nec
        molestie. Cum sociis natoque penatibus et magnis dis parturient montes,
        nascetur ridiculus mus.
      </p>

      <input
        id='text_box'
        type='text'
        onChange={(e) => setUsername(e.target.value)}
        value={username}
      ></input>
      <button onClick={addUser}>Fire</button>
      <button onClick={startGame}>Start Game</button>
      <p>Duis a turpis sed lacus dapibus elementum sed eu lectus.</p>
      <Game />
    </div>
  );
}

export default GameBase;
