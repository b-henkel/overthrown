import React from 'react';
import { Button, Card, CardMedia } from '@mui/material';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { GameObject, User } from '../game/types/game-types';
import { Socket } from 'socket.io-client';
import Avatar from '@mui/material/Avatar';
import { useState, useEffect } from 'react';
import { cardBack, toImage } from '../constants/cards';

// TODO fix card spanning issue
// Add animation card reveal and discard animation

type Props = {
  user: User;
  socket?: Socket;
  style?: object;
  isActiveUser?: boolean;
  action?: string;
  phase?: string;
  gameId?: string;
  gameState?: GameObject;
  loseInfluenceTarget?: string;
  isPrimaryPlayerTile: boolean;
  yourPlayerParticipant: boolean;
};

export default function Player(props: Props) {
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setDisabled(false);
  }, [props.phase]);

  const handleClick = (
    action: string,
    targetPlayer: string,
    response: string,
    counterActorCard: string = null
  ) => {
    setDisabled(true);
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
      gameState.users[props.user.id].cardOneActive = false;
    } else {
      gameState.users[props.user.id].cardTwoActive = false;
    }
    props.socket.emit('loseInfluence', {
      gameId: props.gameState.id,
      gameObj: gameState,
    });
  };
  let buttons;
  if (
    !props.isPrimaryPlayerTile &&
    props.user.participant &&
    props.yourPlayerParticipant
  ) {
    if (props.phase === 'action') {
      if (['overThrow', 'assassinate', 'steal'].includes(props.action)) {
        buttons = (
          <Button
            color='error'
            variant='contained'
            onClick={() => handleClick(props.action, props.user.id, null)}
            disabled={disabled}
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
            onClick={() =>
              handleClick(props.action, props.user.id, 'challenge')
            }
            disabled={disabled}
          >
            CHALLENGE {props.action}
          </Button>
          <Button
            color='success'
            variant='contained'
            onClick={() => handleClick(props.action, props.user.id, 'pass')}
            disabled={disabled}
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
                props.user.id,
                'block',
                blockIcon[props.action][1]
              )
            }
            startIcon={<Avatar src={blockIcon[props.action][0]} />}
            disabled={disabled}
          >
            BLOCK {props.action}
          </Button>
          {props.action === 'steal' && (
            <Button
              color='error'
              variant='contained'
              onClick={() =>
                handleClick(props.action, props.user.id, 'block', 'captain')
              }
              startIcon={<Avatar src='/captain-icon.svg' />}
              disabled={disabled}
            >
              BLOCK {props.action}
            </Button>
          )}
          <Button
            color='success'
            variant='contained'
            onClick={() => handleClick(props.action, props.user.id, 'pass')}
            disabled={disabled}
          >
            PASS
          </Button>
        </Box>
      );
    } else if (
      props.phase === 'challengeCounterAction' &&
      props.gameState.activity.counterActor === props.user.id
    ) {
      buttons = (
        <Box>
          <Button
            color='error'
            variant='contained'
            onClick={() => handleClick(props.action, props.user.id, 'doubt')}
            disabled={disabled}
          >
            Doubt {props.gameState.activity.counterActorCard}
          </Button>
          <Button
            color='success'
            variant='contained'
            onClick={() => handleClick(props.action, props.user.id, 'pass')}
            disabled={disabled}
          >
            PASS
          </Button>
        </Box>
      );
    }
  } else if (
    props.phase === 'loseInfluence' &&
    props.loseInfluenceTarget === props.user.id &&
    props.yourPlayerParticipant
  ) {
    const currentUser = props.gameState.users[props.user.id];
    buttons = (
      <Box>
        {currentUser.cardOneActive && (
          <Button
            color='error'
            variant='contained'
            onClick={() => handleLoseInfluence('one')}
            disabled={disabled}
          >
            Lose {currentUser.cardOne}
          </Button>
        )}
        {currentUser.cardTwoActive && (
          <Button
            color='error'
            variant='contained'
            onClick={() => handleLoseInfluence('two')}
            disabled={disabled}
          >
            Lose {currentUser.cardTwo}
          </Button>
        )}
      </Box>
    );
  }

  let cardOneImage;
  let cardTwoImage;

  if (props.isPrimaryPlayerTile) {
    cardOneImage = toImage(props.user.cardOne);
    cardTwoImage = toImage(props.user.cardTwo);
  } else {
    if (props.user.cardOneActive) {
      cardOneImage = cardBack;
    } else {
      cardOneImage = toImage(props.user.cardOne);
    }
    if (props.user.cardTwoActive) {
      cardTwoImage = cardBack;
    } else {
      cardTwoImage = toImage(props.user.cardTwo);
    }
  }

  return (
    <Card
      sx={{
        height: '32vh',

        whiteSpace: 'nowrap',
        bgcolor: props.isActiveUser && 'primary.main',
      }}
    >
      <Box sx={{ display: 'flex' }}>
        {props.user.icon && <Avatar src={props.user.icon} />}
        <Typography sx={{ fontSize: 18 }} color={props.user.color} gutterBottom>
          {props.user.name}
        </Typography>

        <Typography sx={{ fontSize: 18 }} gutterBottom>
          {props.user.coins}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          p: 1,
          m: 1,
        }}
      >
        {props.user.cardOne && (
          <Box
            component='img'
            sx={{
              maxWidth: '48%',
              maxHeight: '24vh',
              opacity: props.user.cardOneActive ? 1 : 0.5,
            }}
            src={cardOneImage}
          />
        )}
        {props.user.cardTwo && (
          <Box
            component='img'
            sx={{
              maxWidth: '48%',
              maxHeight: '24vh',
              opacity: props.user.cardTwoActive ? 1 : 0.5,
            }}
            src={cardTwoImage}
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
