import React from 'react';
import { Card, CardMedia } from '@mui/material';
import { cardBack } from '../constants/cards';

export default function Rules(props) {
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
        image='/rulescard.svg'
        alt='rules'
      />
    </Card>
  );
}
