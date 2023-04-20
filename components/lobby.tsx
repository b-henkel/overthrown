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
  Avatar,
} from '@mui/material';
import { Socket } from 'socket.io-client';
import { GameObject } from '../game/types/game-types';
import copy from 'copy-to-clipboard';
import { textAlign } from '@mui/system';
import Rules from './rules';

type Props = {
  socket: Socket;
  gameState: GameObject;
  userId: string;
};

export default function Lobby(props: Props) {
  const router = useRouter();
  const { id: gameId } = router.query;
  const [username, setUsername] = useState('');
  const [rulesModal, setRulesModal] = useState(false);

  const addUser = () => {
    // grab the text box's information
    // and then fire an http request
    const sanitizedUser = username.trim();
    setUsername(sanitizedUser);
    if (!sanitizedUser) {
      return;
    }
    if (props.socket) {
      console.log('Trying to emit?');
      props.socket.emit('add-user', {
        username: sanitizedUser,
        gameId,
        userId: props.userId,
      });
    } else {
      console.log('no socket available');
    }
  };
  const startGame = () => {
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
        width: '100%',
        height: '100vh',
        backgroundImage: "url('/board.png')",
        position: 'fixed',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {rulesModal && (
        <Rules rulesModal={rulesModal} setRulesModal={setRulesModal} />
      )}
      <Box
        sx={{
          backgroundColor: '#fff',
          width: '900px',
          height: '100vh',
          display: 'block',
          paddingTop: 10,
          textAlign: 'center',
        }}
      >
        <Box
          component='img'
          sx={{ maxWidth: '90vw' }}
          alt='characters'
          src='../splash.svg'
        />
        <Typography
          sx={{
            backgroundColor: '#000',
            color: '#fff',
            fontFamily: 'serif',
            fontSize: '5vh',
            fontStyle: 'italic',
          }}
        >
          WELCOME TO THE LOBBY!
        </Typography>
        <Typography sx={{ marginTop: 3 }} variant='h4'>
          Your Game ID :
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
            required={true}
            id='text_box'
            placeholder='Input a User Name'
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addUser();
              }
            }}
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
              return (
                <ListItem key={userObj.id}>
                  &rarr;
                  <Avatar
                    sx={{
                      border: 2,
                      borderColor: 'black',
                      background: 'white',
                    }}
                  >
                    {String.fromCodePoint(userObj.icon)}
                  </Avatar>
                  {userObj.name}
                </ListItem>
              );
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
      <Button
        variant='contained'
        sx={{ position: 'absolute', bottom: 25, left: 10 }}
        onClick={() => {
          setRulesModal(true);
        }}
      >
        Rules
      </Button>
    </Box>
  );
}
