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

const gap = 2;

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
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              color='error'
              variant='contained'
              onClick={() => handleClick(props.action, props.user.id, null)}
              disabled={disabled}
            >
              {props.action}
            </Button>
          </Box>
        );
      }
    } else if (props.phase === 'challengeAction' && props.isActiveUser) {
      buttons = (
        <Box sx={{ gap: gap, display: 'flex', justifyContent: 'center' }}>
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
        <Box sx={{ gap: gap, display: 'flex', justifyContent: 'center' }}>
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
        <Box sx={{ gap: gap, display: 'flex', justifyContent: 'center' }}>
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
      <Box sx={{ gap: gap, display: 'flex', justifyContent: 'center' }}>
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

  const activeColor = props.isActiveUser ? '251, 200, 140' : '255, 255, 255';
  const tileOpacity = props.user.id === null ? '0.4' : '0.7';

  return (
    <Card
      sx={{
        height: '32vh',
        // opacity: props.user.id === null ? 0.4 : 0.7,
        backgroundColor: `rgba(${activeColor}, ${tileOpacity})`,
        whiteSpace: 'nowrap',
        // bgcolor: props.isActiveUser && 'primary.main',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
        {props.user.icon && <Avatar src={props.user.icon} />}
        <Typography sx={{ fontSize: 24 }} color={props.user.color} gutterBottom>
          {props.user.name}
        </Typography>
        <Box
          sx={{ borderRadius: '25px', backgroundColor: 'gold', boxShadow: 5 }}
        >
          <Typography sx={{ fontSize: 24 }} gutterBottom>
            {props.user.coins}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: gap,
          p: 1,
        }}
      >
        {props.user.cardOne && (
          <Box
            component='img'
            sx={{
              borderRadius: '25px',
              boxShadow: 20,
              maxWidth: '48%',
              maxHeight: '25vh',
              opacity: props.user.cardOneActive ? 1 : 0.5,
            }}
            src={cardOneImage}
          />
        )}
        {props.user.cardTwo && (
          <Box
            component='img'
            sx={{
              borderRadius: '25px',
              boxShadow: 20,
              maxWidth: '48%',
              maxHeight: '25vh',
              opacity: props.user.cardTwoActive ? 1 : 0.5,
            }}
            src={cardTwoImage}
          />
        )}
      </Box>
      <Box
        sx={{
          zIndex: 2000,
          position: 'relative',
          top: '-18%',
          left: '0%',
        }}
      >
        {buttons}
      </Box>
    </Card>
  );
}

Player.defaultProps = {
  coinCount: null,
  cardTwo: null,
  cardOne: null,
  style: { height: '32vh' },
};
