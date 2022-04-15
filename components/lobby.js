import React from 'react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  List,
  ListItem,
  Box,
  Button,
  Typography,
  TextField,
  Paper,
  InputBase,
} from '@mui/material';

import copy from 'copy-to-clipboard';
import { textAlign } from '@mui/system';

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
        marginTop: 10,
        textAlign: 'center',
      }}
    >
      <Box component='img' sx={{}} alt='characters' src='../splash.svg' />
      <Typography variant='h2'>Welcome to the Lobby!</Typography>
      <Typography sx={{ marginTop: 3 }} variant='h4'>
        Your Game ID:
      </Typography>
      <Typography variant='h6'>{router.query.id}</Typography>
      <Button variant='outlined' onClick={copyToClipboard}>
        Copy Link to Clipboard
      </Button>
      {/* <Paper
        component='form'
        sx={{
          alignItems: 'center',
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: 300,
        }}
      > */}
      <Box sx={{ marginTop: 5 }}>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          required
          id='text_box'
          placeholder='Input a User Name'
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <Button variant='outlined' onClick={addUser}>
          submit
        </Button>
      </Box>

      <Typography sx={{ marginTop: 3 }} variant='h5'>
        Players:{' '}
      </Typography>
      <List
        sx={{
          fontSize: 24,
          margin: 'auto',
          maxWidth: 600,
        }}
      >
        {props.gameState &&
          Object.entries(props.gameState.users).map(([userID, userObj]) => {
            return <ListItem>&rarr; {userObj.name}</ListItem>;
          })}
      </List>
      <Button
        variant='contained'
        color='error'
        onClick={startGame}
        disabled={
          props.gameState && Object.values(props.gameState.users).length < 2
        }
      >
        Start Game &rarr;
      </Button>
    </Box>
  );
}
