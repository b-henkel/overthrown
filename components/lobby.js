import React from 'react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

export default function Lobby(props) {
  const router = useRouter();
  const { id: gameId } = router.query;
  const [username, setUsername] = useState('');

  const addUser = async () => {
    // grab the text box's information
    // and then fire an http request
    if (props.socket) {
      console.log('Trying to emit?');
      props.socket.emit('add-user', { username, gameId });
    } else {
      console.log('no socket available');
    }
  };
  const startGame = async () => {
    if (props.socket) {
      props.socket.emit('start-game', { gameId });
    } else {
      console.log('no socket available');
    }
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
      <List>
        {props.gamestate &&
          Object.entries(props.gamestate.users).map(([userID, userName]) => {
            return (
              <ListItem>
                <ListItemText primary={userName} key={userID} />
              </ListItem>
            );
          })}
      </List>
    </div>
  );
}
