import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Player from './player';
import { Container } from '@mui/material';
import Log from './log';
import Actions from './actions';
import { cardBack } from '../constants/cards';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Game(props) {
  const setUpOtherPlayers = () => {
    const playerCount = Object.keys(props.gameState.users).length - 1;
    let encoding;
    switch (playerCount) {
      case 1:
        // code block
        encoding = [0, 1, 0, 0, 0, 0];
        break;
      case 2:
        // code block
        encoding = [1, 0, 2, 0, 0, 0];
        break;
      case 3:
        // code block
        encoding = [0, 2, 0, 1, 0, 3];
        break;
      case 4:
        // code block
        encoding = [2, 3, 0, 1, 0, 4];
        break;
      case 5:
        // code block
        encoding = [2, 3, 4, 1, 0, 5];
        break;
      default:
      // code block
    }
    const usersArr = Object.values(props.gameState.users);
    const yourUserPos = props.gameState.users[props.userId].number - 1;
    usersArr.sort((userA, userB) => {
      userA.number - userB.number;
    });
    let finalUserArr = usersArr.slice(yourUserPos, usersArr.length);
    if (yourUserPos != 0) {
      finalUserArr = finalUserArr.concat(usersArr.slice(0, yourUserPos));
    }
    console.log('finalUserArr:', JSON.stringify(finalUserArr));
    const gridItems = encoding.map((isPlayer) => {
      const user = isPlayer ? finalUserArr[isPlayer] : null;
      console.log('user:', user);

      return (
        <Grid item xs={1}>
          <Player
            cardOne={user ? cardBack : null}
            cardTwo={user ? cardBack : null}
            userName={user ? user.name : null}
            color={user ? user.color : null}
            coinCount={user ? user.coins : null}
            isActiveUser={
              user ? props.gameState.currentPlayer === user.id : null
            }
          />
        </Grid>
      );
    });
    return gridItems;
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} columns={3} justifyContent={'center'}>
        {/* <Grid item xs={1}>
          <Player />
        </Grid>
        <Grid item xs={1}>
          <Player />
        </Grid>
        <Grid item xs={1}>
          <Player />
        </Grid>
        <Grid item xs={1}>
          <Player />
        </Grid>
        <Grid item xs={1}>          
        </Grid>
        <Grid item xs={1}>
          <Player />
        </Grid> 
        */}
        {setUpOtherPlayers()}
        <Grid item xs={1}>
          {/* chat/ log */}
          <Log gameState={props.gameState} />
        </Grid>
        <Grid item xs={1}>
          <Player
            userName={props.gameState.users[props.userId].name}
            color={props.gameState.users[props.userId].color}
            cardOne={`/${props.gameState.users[props.userId].cardOne}.svg`}
            cardTwo={`/${props.gameState.users[props.userId].cardTwo}.svg`}
            coinCount={props.gameState.users[props.userId].coins}
            isActiveUser={props.gameState.currentPlayer === props.userId}
            // style={{ height: '47.5vh', width: '30vw' }}
          />
        </Grid>
        <Grid item xs={1}>
          {/* action panel. lie indicator*/}
          <Actions
            socket={props.socket}
            isActiveUser={props.gameState.currentPlayer === props.userId}
            cardOne={props.gameState.users[props.userId].cardOne}
            cardTwo={props.gameState.users[props.userId].cardTwo}
            gameId={props.gameState.id}
            coinCount={props.gameState.users[props.userId].coins}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
