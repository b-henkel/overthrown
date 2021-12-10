import React from 'react';
import { Card, CardMedia, Container } from '@mui/material';

export default function PlayingCard() {
  return (
    <Card>
      <Container>
        <CardMedia
          sx={{ maxWidth: 200 }}
          component='img'
          image='/card-back.svg'
          alt='card back'
        />
      </Container>
    </Card>
  );
}
