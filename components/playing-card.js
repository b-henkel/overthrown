import React from 'react';
import { Card, CardMedia, Container } from '@mui/material';
// deprecated

export default function PlayingCard() {
  return (
    <Card>
      <CardMedia
        sx={{
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
        component='img'
        image='/card-back.svg'
        alt='card back'
      />
      <CardMedia
        sx={{
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
        component='img'
        image='/card-back.svg'
        alt='card back'
      />
    </Card>
  );
}
