import React from 'react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { List, ListItem, Box } from '@mui/material';

import copy from 'copy-to-clipboard';

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

  const copyToClipboard = () => {
    copy(`http://localhost:3000/game/${router.query.id}`);
  };

  return (
    <Box
      sx={{
        display: 'block',
        textAlign: 'center',
      }}
    >
      <Box component='img' sx={{}} alt='characters' src='../splash.svg' />
      <h1>Welcome to the Lobby!</h1>
      <h3>Your Game ID:</h3>
      <h2>{router.query.id}</h2>
      <button onClick={copyToClipboard}>Copy Link to Clipboard</button>

      <h3>Input a User Name: </h3>
      <span>
        <input
          id='text_box'
          type='text'
          label='user name'
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        ></input>
        <button onClick={addUser}>submit</button>
      </span>

      <h2>Players: </h2>
      <List sx={{ fontSize: 24 }}>
        {props.gameState &&
          Object.entries(props.gameState.users).map(([userID, userObj]) => {
            return <ListItem>&rarr; {userObj.name}</ListItem>;
          })}
      </List>
      <div>
        <button
          onClick={startGame}
          disabled={
            props.gameState && Object.values(props.gameState.users).length < 2
          }
        >
          <h2>Start Game &rarr;</h2>
        </button>
      </div>
    </Box>
  );
}
