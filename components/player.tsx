import React from 'react';
import { Button, Card, CardMedia } from '@mui/material';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { GameObject } from '../game/types/game-types';
import { Socket } from 'socket.io-client';

// TODO fix card spanning issue
// Add coin count to component
// Add statful card info
// Add influence loss placeholder
// Add animation card reveal and discard animation

type Props = {
  socket?: Socket;
  style?: object;
  cardOne?: string;
  cardTwo?: string;
  userName?: string;
  userId?: string;
  color?: string;
  coinCount?: number;
  isActiveUser?: boolean;
  action?: string;
  phase?: string;
  gameId?: string;
  gameState?: GameObject;
};

export default function Player(props: Props) {
  const handleClick = (
    action: string,
    targetPlayer: string,
    response: string
  ) => {
    console.log('target player action', targetPlayer, action);
    // event.preventDefault();
    props.socket.emit(props.phase, {
      gameId: props.gameId,
      action: { type: action, target: targetPlayer, response },
    });
  };

  let buttons;

  if (props.phase === 'action') {
    if (props.action === 'overThrow') {
      buttons = (
        <Button
          color='error'
          variant='contained'
          onClick={() => handleClick(props.action, props.userId, null)}
        >
          {props.action}
        </Button>
      );
    }
  } else if (props.phase === 'counterAction' && props.isActiveUser) {
    if (props.action === 'steal') {
      // TODO render ambassidor and captain buttons
    } else {
      buttons = (
        <Box>
          <Button
            color='error'
            variant='contained'
            onClick={() => handleClick(props.action, props.userId, 'block')}
          >
            BLOCK {props.action}
          </Button>
          <Button
            color='success'
            variant='contained'
            onClick={() => handleClick(props.action, props.userId, 'pass')}
          >
            PASS
          </Button>
        </Box>
      );
    }
  } else if (
    props.phase === 'challengeCounterAction' &&
    props.gameState.activity.counterActor === props.userId
  ) {
    buttons = (
      <Box>
        <Button
          color='error'
          variant='contained'
          onClick={() => handleClick(props.action, props.userId, 'doubt')}
        >
          Doubt {props.gameState.activity.counterActorCard}
        </Button>
        <Button
          color='success'
          variant='contained'
          onClick={() => handleClick(props.action, props.userId, 'pass')}
        >
          PASS
        </Button>
      </Box>
    );
  }

  return (
    <Card
      sx={{
        height: '32vh',
        whiteSpace: 'nowrap',
        bgcolor: props.isActiveUser && 'primary.main',
      }}
    >
      <Typography sx={{ fontSize: 18 }} color={props.color} gutterBottom>
        {props.userName}
      </Typography>

      <Typography sx={{ fontSize: 18 }} gutterBottom>
        {props.coinCount}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          p: 1,
          m: 1,
        }}
      >
        {props.cardOne && (
          <CardMedia
            sx={{
              ...props.style,
              marginLeft: 0.5,
              marginRight: 0.5,
              display: 'flex',
              width: 'auto',
              maxHeight: '23vh',
            }}
            component='img'
            image={props.cardOne}
          />
        )}
        {props.cardTwo && (
          <CardMedia
            sx={{
              ...props.style,
              marginLeft: 0.5,
              marginRight: 0.5,
              display: 'flex',
              width: 'auto',
              maxHeight: '23vh',
            }}
            component='img'
            image={props.cardTwo}
          />
        )}
      </Box>
      {buttons}
    </Card>
  );
}

Player.defaultProps = {
  coinCount: null,
  cardTwo: null,
  cardOne: null,
  style: { height: '32vh' },
};
