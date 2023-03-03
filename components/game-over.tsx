import React from 'react';
import { GameObject } from '../game/types/game-types';
import { Box } from '@mui/system';
import {
  Avatar,
  Typography,
  CardActionArea,
  CardContent,
  Card,
} from '@mui/material';
import { Socket } from 'socket.io-client';

type Props = {
  gameState: GameObject;
  userId: string;
  socket: Socket;
};

export default function GameOver(props: Props) {
  const resetGame = () => {
    props.socket.emit('reset-game', { gameId: props.gameState.id });
    console.log('trying to reset :', props.gameState.id);
  };
  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: '100vh',
          backgroundImage: "url('/board.png')",
          position: 'fixed',
        }}
      >
        <Box
          sx={{
            display: 'block',
            marginTop: '25vh',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
            <Avatar
              sx={{
                border: 2,
                borderColor: 'black',
                background: 'white',
              }}
            >
              {String.fromCodePoint(props.gameState.winner.icon)}
            </Avatar>
          </Box>

          <Typography
            sx={{
              backgroundColor: '#000',
              color: '#fff',
              textAlign: 'center',
              fontSize: '5vh',
              fontFamily: 'serif',
              fontStyle: 'italic',
            }}
          >
            {props.gameState.winner.name} WON!
          </Typography>
          <Card sx={{ maxWidth: '35vw', margin: 'auto' }}>
            <CardActionArea onClick={() => resetGame()}>
              <CardContent>
                <Typography gutterBottom variant='h5' component='div'>
                  Start New Game
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Box>
      </Box>
    </>
  );
}
