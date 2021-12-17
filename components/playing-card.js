import React from 'react';
import { Card, CardMedia, Container } from '@mui/material';
// deprecated

export default function PlayingCard() {
  return (
    <Card>
      <CardMedia
        sx={{ maxWidth: 200, marginLeft: 'auto', marginRight: 'auto' }}
        component='img'
        image='/card-back.svg'
        alt='card back'
      />
      <CardMedia
        sx={{ maxWidth: 200, marginLeft: 'auto', marginRight: 'auto' }}
        component='img'
        image='/card-back.svg'
        alt='card back'
      />
    </Card>
  );
}
