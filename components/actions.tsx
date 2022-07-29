import React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { Typography } from '@mui/material';
import { Card, Box } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import { Socket } from 'socket.io-client';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useState, useEffect } from 'react';

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
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setDisabled(false);
  }, [props.isActiveUser]);

  const handleClick = (value) => {
    // event.preventDefault();
    setDisabled(true);
    props.socket.emit('action', {
      gameId: props.gameId,
      action: { type: value, target: null },
    });
  };

  const orientation = useMediaQuery('(min-width:1080px)');
  const iconsOnly = useMediaQuery('(max-width:480px)');
  const avatarStyle = orientation
    ? { width: '1.5vw', height: '1.5vw' }
    : { width: '4vw', height: '4vw' };
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
          <ButtonGroup
            orientation={`${orientation ? `horizontal` : `vertical`}`}
            size='small'
            sx={{ maxWidth: '95%' }}
            variant='text'
            aria-label='text button group'
          >
            <Button
              variant='outlined'
              startIcon={<Avatar sx={avatarStyle} src='/banker-icon.svg' />}
              onClick={() => handleClick('income')}
              disabled={
                !props.isActiveUser || props.coinCount >= 10 || disabled
              }
            >
              {!iconsOnly && 'Income'}
            </Button>
            <Button
              variant='outlined'
              startIcon={<Avatar sx={avatarStyle} src='/aid-icon.svg' />}
              onClick={() => handleClick('foreignAid')}
              disabled={!props.isActiveUser || disabled}
            >
              {!iconsOnly && ' Foreign Aid'}
            </Button>
            <Button
              variant='outlined'
              startIcon={<Avatar sx={avatarStyle} src='/assassin-icon.svg' />}
              onClick={() => {
                props.targetOtherPlayers('overThrow');
                setDisabled(true);
              }}
              disabled={!props.isActiveUser || props.coinCount < 7 || disabled}
            >
              {!iconsOnly && 'Overthrow'}
            </Button>
          </ButtonGroup>
          <Typography sx={{ fontSize: 18 }} color='text.primary'>
            Character Actions
          </Typography>
          <ButtonGroup variant='text' aria-label='text button group'>
            <Button
              variant='outlined'
              startIcon={<Avatar sx={avatarStyle} src='/duke-icon.svg' />}
              onClick={() => handleClick('tax')}
              disabled={!props.isActiveUser || disabled}
            >
              {!iconsOnly && 'Tax'}
            </Button>
            <Button
              variant='outlined'
              startIcon={<Avatar sx={avatarStyle} src='/assassin-icon.svg' />}
              onClick={() => {
                props.targetOtherPlayers('assassinate');
                setDisabled(true);
              }}
              disabled={!props.isActiveUser || props.coinCount < 3 || disabled}
            >
              {!iconsOnly && 'Assassinate'}
            </Button>
          </ButtonGroup>
          <ButtonGroup variant='text' aria-label='text button group'>
            <Button
              variant='outlined'
              startIcon={<Avatar sx={avatarStyle} src='/captain-icon.svg' />}
              disabled={!props.isActiveUser || disabled}
              onClick={() => {
                props.targetOtherPlayers('steal');
                setDisabled(true);
              }}
            >
              {!iconsOnly && 'Steal'}
            </Button>
            <Button
              variant='outlined'
              startIcon={<Avatar sx={avatarStyle} src='/ambassador-icon.svg' />}
              disabled={!props.isActiveUser || disabled}
              onClick={() => handleClick('exchange')}
            >
              {!iconsOnly && 'Exchange'}
            </Button>
          </ButtonGroup>
        </Box>
      </CardContent>
    </Card>
  );
}
