import React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { Typography } from '@mui/material';
import { Card, Box } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';

export default function Actions(props) {
  // const [value, setValue] = React.useState('');

  // const handleRadioChange = (event) => {
  //   setValue(event.target.value);
  // };

  const handleClick = (value) => {
    // event.preventDefault();
    if (value === 'income') {
      props.socket.emit('user-action', {
        gameId: props.gameId,
        action: { type: 'income', target: null },
      });
    }
  };

  return (
    <Card sx={{}}>
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
              startIcon={<Avatar src='/banker-icon.svg' />}
              onClick={() => handleClick('income')}
              disabled={!props.isActiveUser || props.coinCount >= 10}
            >
              Income
            </Button>
            <Button startIcon={<Avatar src='/banker-icon.svg' />}>
              Foreign Aid
            </Button>
            <Button
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
            <Button startIcon={<Avatar src='/duke-icon.svg' />}>Tax</Button>
            <Button startIcon={<Avatar src='/assassin-icon.svg' />}>
              Assasinate
            </Button>
            <Button startIcon={<Avatar src='/captain-icon.svg' />}>
              Steal
            </Button>
            <Button startIcon={<Avatar src='/ambassador-icon.svg' />}>
              Exchange
            </Button>
          </ButtonGroup>
        </Box>
        {/* <form onSubmit={handleSubmit}>
          <FormControl sx={{ m: 3 }} component='fieldset' variant='standard'>
            <FormLabel component='legend'></FormLabel>
            <RadioGroup
              aria-label='action'
              name='action'
              value={value}
              onChange={handleRadioChange}
            >
              <FormControlLabel
                value='income'
                control={<Radio />}
                label='Income'
                disabled={!props.isActiveUser || props.coinCount >= 10}
              />
              <FormControlLabel
                value='foreignAid'
                control={<Radio />}
                label='Foreign Aid'
              />
              <FormControlLabel
                value='overThrow'
                control={<Radio />}
                label='Overthrow'
                disabled={!props.isActiveUser || props.coinCount < 7}
              />

              <FormControlLabel value='tax' control={<Radio />} label='Tax' />
              <FormControlLabel
                value='assasinate'
                control={<Radio />}
                label='Assasinate'
              />
              <FormControlLabel
                value='steal'
                control={<Radio />}
                label='Steal'
              />
              <FormControlLabel
                value='exchange'
                control={<Radio />}
                label='Exchange'
              />
              <Typography sx={{ fontSize: 24 }} color='text.primary'>
                Counter Actions
              </Typography>

              <FormControlLabel
                value='blockAssasination'
                control={<Radio />}
                label='Block Assasination'
              />
              <FormControlLabel
                value='blockSteal'
                control={<Radio />}
                label='Block Steal'
              />
              <FormControlLabel
                value='blockForeignAid'
                control={<Radio />}
                label='Block Foreign Aid'
              />
            </RadioGroup>

            <Button
              sx={{ mt: 1, mr: 1 }}
              type='submit'
              variant='outlined'
              disabled={!props.isActiveUser}
            >
              Submit
            </Button>
          </FormControl>
        </form> */}
      </CardContent>
    </Card>
  );
}
