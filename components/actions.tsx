import React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { Typography } from '@mui/material';
import { Card, Box } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import { Socket } from 'socket.io-client';

type Props = {
  socket: Socket;
  isActiveUser: boolean;
  cardOne: string;
  cardTwo: string;
  gameId: string;
  coinCount: number;
  targetOtherPlayers: Function;
};

export default function Actions(props: Props) {
  const handleClick = (value) => {
    // event.preventDefault();

    props.socket.emit('action', {
      gameId: props.gameId,
      action: { type: value, target: null },
    });
  };

  return (
    <Card sx={{ height: '32vh' }}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            '& > *': {
              m: 1,
            },
          }}
        >
          <Typography sx={{ fontSize: 18 }} color='text.primary'>
            General Actions
          </Typography>
          <ButtonGroup variant='text' aria-label='text button group'>
            <Button
              variant='outlined'
              startIcon={<Avatar src='/banker-icon.svg' />}
              onClick={() => handleClick('income')}
              disabled={!props.isActiveUser || props.coinCount >= 10}
            >
              Income
            </Button>
            <Button
              variant='outlined'
              startIcon={<Avatar src='/aid-icon.svg' />}
              onClick={() => handleClick('foreignAid')}
            >
              Foreign Aid
            </Button>
            <Button
              variant='outlined'
              startIcon={<Avatar src='/assassin-icon.svg' />}
              onClick={() => props.targetOtherPlayers('overThrow')}
              disabled={!props.isActiveUser || props.coinCount < 7}
            >
              Overthrow
            </Button>
          </ButtonGroup>
          <Typography sx={{ fontSize: 18 }} color='text.primary'>
            Character Actions
          </Typography>
          <ButtonGroup variant='text' aria-label='text button group'>
            <Button
              variant='outlined'
              startIcon={<Avatar src='/duke-icon.svg' />}
            >
              Tax
            </Button>
            <Button
              variant='outlined'
              startIcon={<Avatar src='/assassin-icon.svg' />}
            >
              Assasinate
            </Button>
          </ButtonGroup>
          <ButtonGroup variant='text' aria-label='text button group'>
            <Button
              variant='outlined'
              startIcon={<Avatar src='/captain-icon.svg' />}
            >
              Steal
            </Button>
            <Button
              variant='outlined'
              startIcon={<Avatar src='/ambassador-icon.svg' />}
            >
              Exchange
            </Button>
          </ButtonGroup>
        </Box>
      </CardContent>
    </Card>
  );
}
