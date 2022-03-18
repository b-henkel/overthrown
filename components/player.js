import React from 'react';
import { Button, Card, CardMedia } from '@mui/material';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// TODO fix card spanning issue
// Add coin count to component
// Add statful card info
// Add influence loss placeholder
// Add animation card reveal and discard animation

export default function Player(props) {
  const handleClick = (value, targetPlayer) => {
    console.log('target player value', targetPlayer, value);
    // event.preventDefault();
    if (value === 'overThrow') {
      props.socket.emit('user-action', {
        gameId: props.gameId,
        action: { type: 'overThrow', target: targetPlayer },
      });
    }
  };

  return (
    <Card
      sx={{
        height: '23.5vh',
        whiteSpace: 'nowrap',
        bgcolor: props.isActiveUser && 'primary.main',
      }}
    >
      <Typography sx={{ fontSize: 18 }} color={props.color} gutterBottom>
        {props.userName}
      </Typography>
      {props.action && (
        <Button onClick={() => handleClick(props.action, props.userId)}>
          {props.action}
        </Button>
      )}
      <Typography sx={{ fontSize: 18 }} gutterBottom>
        {props.coinCount}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          p: 1,
          m: 1,
          borderRadius: 1,
        }}
      >
        {props.cardOne && (
          <CardMedia
            sx={{
              ...props.style,
              marginLeft: 'auto',
              marginRight: 'auto',
              display: 'inline',
              width: 'auto',
            }}
            component='img'
            image={props.cardOne}
          />
        )}
        {props.cardTwo && (
          <CardMedia
            sx={{
              ...props.style,
              marginLeft: 'auto',
              marginRight: 'auto',
              display: 'inline',
              width: 'auto',
            }}
            component='img'
            image={props.cardTwo}
          />
        )}
      </Box>
    </Card>
  );
}

Player.defaultProps = {
  coinCount: null,
  cardTwo: null,
  cardOne: null,
  style: { height: '23.5vh' },
};
