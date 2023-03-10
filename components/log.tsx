import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Paper } from '@mui/material';
import { GameObject } from '../game/types/game-types';

type Props = {
  gameState: GameObject;
};

export default function Log(props: Props) {
  const usersArr = Object.keys(props.gameState.users);
  console.log('userArr', usersArr);
  return (
    <Card sx={{ height: '32vh', backgroundColor: 'rgba(255,255,255,0.7)' }}>
      <CardContent>
        <Typography sx={{ fontSize: 24 }} color='text.primary'>
          Action Log
        </Typography>
        <Paper style={{ maxHeight: 360, overflow: 'auto', paddingTop: '0px' }}>
          <Typography sx={{ fontSize: 18 }} color='text.secondary'>
            {/* {JSON.stringify(props.gameState)} */}
            Current player:{' '}
            {props.gameState.users[props.gameState.currentPlayer].name}
            <ul
              style={{
                paddingLeft: '18px',
                paddingTop: '0px',
                marginTop: '0px',
              }}
            >
              {props.gameState.log.map((logElm) => {
                return <li>{logElm}</li>;
              })}
            </ul>
          </Typography>
        </Paper>
      </CardContent>
    </Card>
  );
}
// {usersArr.map((elm) => {
//   JSON.stringify(props.gameState[elm].name);
// }
