import React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import { Card } from '@mui/material';
import CardContent from '@mui/material/CardContent';

export default function Actions(props) {
  const [value, setValue] = React.useState('');

  const handleRadioChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (value === 'income') {
      props.socket.emit('user-action', {
        gameId: props.gameId,
        action: { type: 'income', target: null },
      });
    }
    if (value === 'overThrow') {
      props.socket.emit('user-action', {
        gameId: props.gameId,
        action: { type: 'overThrow', target: null },
      });
    }
  };

  return (
    <Card sx={{ height: '32.5vh' }}>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FormControl sx={{ m: 3 }} component='fieldset' variant='standard'>
            <FormLabel component='legend'></FormLabel>
            <RadioGroup
              aria-label='action'
              name='action'
              value={value}
              onChange={handleRadioChange}
            >
              <Typography sx={{ fontSize: 24 }} color='text.primary'>
                General Actions
              </Typography>

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
              <Typography sx={{ fontSize: 24 }} color='text.primary'>
                Character Actions
              </Typography>

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
        </form>
      </CardContent>
    </Card>
  );
}
