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
        <Paper style={{ maxHeight: 360, overflow: 'auto' }}>
          <Typography sx={{ fontSize: 18 }} color='text.secondary'>
            {/* {JSON.stringify(props.gameState)} */}
            Game ID: {props.gameState.id} Current player:{' '}
            {props.gameState.currentPlayer}
            <ul>
              Users
              {usersArr.map((user) => {
                return (
                  <ul>
                    <li>{props.gameState.users[user].name}</li>
                    <ul>
                      <li>id: {props.gameState.users[user].id}</li>
                      <li>name: {props.gameState.users[user].name}</li>{' '}
                      <li>number:{props.gameState.users[user].number}</li>
                      <li>coins: {props.gameState.users[user].coins}</li>{' '}
                      <li>cardOne: {props.gameState.users[user].cardOne}</li>{' '}
                      <li>cardTwo: {props.gameState.users[user].cardTwo}</li>
                    </ul>
                  </ul>
                );
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
