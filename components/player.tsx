import React from 'react';
import { Button, Card, CardMedia } from '@mui/material';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { GameObject } from '../game/types/game-types';
import { Socket } from 'socket.io-client';
import Avatar from '@mui/material/Avatar';

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
  cardOneActive?: boolean;
  cardTwoActive?: boolean;
  userName?: string;
  userId?: string;
  color?: string;
  coinCount?: number;
  isActiveUser?: boolean;
  action?: string;
  phase?: string;
  gameId?: string;
  gameState?: GameObject;
  loseInfluenceTarget?: string;
  isPrimaryPlayerTile: boolean;
};

export default function Player(props: Props) {
  const handleClick = (
    action: string,
    targetPlayer: string,
    response: string,
    counterActorCard: string = null
  ) => {
    console.log('target player action', targetPlayer, action);
    // event.preventDefault();
    props.socket.emit(props.phase, {
      gameId: props.gameId,
      action: {
        type: action,
        target: targetPlayer,
        response,
        counterActorCard,
      },
    });
  };
  const handleLoseInfluence = (card) => {
    const gameState = props.gameState;
    if (card === 'one') {
      gameState.users[props.userId].cardOneActive = false;
    } else {
      gameState.users[props.userId].cardTwoActive = false;
    }
    props.socket.emit('loseInfluence', {
      gameId: props.gameState.id,
      gameObj: gameState,
    });
  };
  let buttons;
  if (!props.isPrimaryPlayerTile) {
    if (props.phase === 'action') {
      if (['overThrow', 'assassinate', 'steal'].includes(props.action)) {
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
    } else if (props.phase === 'challengeAction' && props.isActiveUser) {
      buttons = (
        <Box>
          <Button
            color='error'
            variant='contained'
            onClick={() => handleClick(props.action, props.userId, 'challenge')}
          >
            CHALLENGE {props.action}
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
    } else if (props.phase === 'counterAction' && props.isActiveUser) {
      const blockIcon = {
        foreignAid: ['/duke-icon.svg', 'duke'],
        steal: ['/ambassador-icon.svg', 'ambassador'],
        assassinate: ['/contessa-icon.svg', 'contessa'],
      };
      buttons = (
        <Box>
          <Button
            color='error'
            variant='contained'
            onClick={() =>
              handleClick(
                props.action,
                props.userId,
                'block',
                blockIcon[props.action][1]
              )
            }
            startIcon={<Avatar src={blockIcon[props.action][0]} />}
          >
            BLOCK {props.action}
          </Button>
          {props.action === 'steal' && (
            <Button
              color='error'
              variant='contained'
              onClick={() =>
                handleClick(props.action, props.userId, 'block', 'captain')
              }
              startIcon={<Avatar src='/captain-icon.svg' />}
            >
              BLOCK {props.action}
            </Button>
          )}
          <Button
            color='success'
            variant='contained'
            onClick={() => handleClick(props.action, props.userId, 'pass')}
          >
            PASS
          </Button>
        </Box>
      );
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
  } else if (
    props.phase === 'loseInfluence' &&
    props.loseInfluenceTarget === props.userId
  ) {
    const currentUser = props.gameState.users[props.userId];
    buttons = (
      <Box>
        {currentUser.cardOneActive && (
          <Button
            color='error'
            variant='contained'
            onClick={() => handleLoseInfluence('one')}
          >
            Lose {currentUser.cardOne}
          </Button>
        )}
        {currentUser.cardTwoActive && (
          <Button
            color='error'
            variant='contained'
            onClick={() => handleLoseInfluence('two')}
          >
            Lose {currentUser.cardTwo}
          </Button>
        )}
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
          <Box
            component='img'
            sx={{
              maxWidth: '48%',
              maxHeight: '24vh',
              opacity: props.cardOneActive ? 1 : 0.5,
            }}
            src={props.cardOne}
          />
        )}
        {props.cardTwo && (
          <Box
            component='img'
            sx={{
              maxWidth: '48%',
              maxHeight: '24vh',
              opacity: props.cardTwoActive ? 1 : 0.5,
            }}
            src={props.cardTwo}
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
