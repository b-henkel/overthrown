import React from 'react';
import { Card, CardMedia } from '@mui/material';
import { cardBack } from '../constants/cards';

// TODO fix card spanning issue
// Add coin count to component
// Add statful card info
// Add influence loss placeholder
// Add animation card reveal and discard animation

export default function Player(props) {
  return (
    <Card sx={{ whiteSpace: 'nowrap' }}>
      <CardMedia
        sx={{
          ...props.style,
          marginLeft: 'auto',
          marginRight: 'auto',
          display: 'inline',
          width: 'auto',
        }}
        component='img'
        image={props.cardA}
        alt='card back'
      />
      <CardMedia
        sx={{
          ...props.style,
          marginLeft: 'auto',
          marginRight: 'auto',
          display: 'inline',
          width: 'auto',
        }}
        component='img'
        image={props.cardB}
        alt='card back'
      />
    </Card>
  );
}

Player.defaultProps = {
  coinCount: 0,
  cardB: cardBack,
  cardA: cardBack,
  style: { height: '23.5vh' },
};
