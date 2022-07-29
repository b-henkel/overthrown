import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Player from './player';
import Log from './log';
import Actions from './actions';
import { cardBack, toImage } from '../constants/cards';
import Banker from './banker';
import { useState } from 'react';
import { User, GameObject } from '../game/types/game-types';
import { Socket } from 'socket.io-client';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

type Props = {
  socket: Socket;
  gameState: GameObject;
  userId: string;
};

export default function Game(props: Props) {
  const [targetedAction, setTargetedAction] = useState(null);
  React.useEffect(() => {
    setTargetedAction(null);
  }, [props.gameState]);

  const targetOtherPlayers = (action) => {
    setTargetedAction(action);
  };

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
    const usersArr: User[] = Object.values(props.gameState.users);
    const yourUserPos = props.gameState.users[props.userId].number - 1;
    usersArr.sort((userA, userB) => {
      return userA.number - userB.number;
    });
    let finalUserArr = usersArr.slice(yourUserPos, usersArr.length);
    if (yourUserPos != 0) {
      finalUserArr = finalUserArr.concat(usersArr.slice(0, yourUserPos));
    }
    console.log('finalUserArr:', JSON.stringify(finalUserArr));
    const gridItems = encoding.map((isPlayer, index) => {
      if (index === 4) {
        return (
          <Grid item xs={1}>
            <Banker
              currentPlayer={
                props.gameState.users[props.gameState.currentPlayer].name
              }
              currentPhase={props.gameState.activity.phase}
            />
          </Grid>
        );
      }
      const user: User = isPlayer ? finalUserArr[isPlayer] : null;
      console.log('user:', user);

      return (
        <Grid item xs={1}>
          <Player
            socket={props.socket}
            cardOne={
              user
                ? user.cardOneActive
                  ? cardBack
                  : toImage(user.cardOne)
                : null
            }
            cardTwo={
              user
                ? user.cardTwoActive
                  ? cardBack
                  : toImage(user.cardTwo)
                : null
            }
            cardOneActive={user ? user.cardOneActive : null}
            cardTwoActive={user ? user.cardTwoActive : null}
            userName={user ? user.name : null}
            userId={user ? user.id : null}
            color={user ? user.color : null}
            coinCount={user ? user.coins : null}
            isActiveUser={
              user ? props.gameState.currentPlayer === user.id : null
            }
            action={
              user ? targetedAction || props.gameState.activity.action : null
            }
            phase={user ? props.gameState.activity.phase : null}
            isPrimaryPlayerTile={false}
            gameId={props.gameState.id}
            gameState={props.gameState}
          />
        </Grid>
      );
    });
    return gridItems;
  };
  const currentUser = props.gameState.users[props.userId];
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} columns={3} justifyContent={'center'}>
        {setUpOtherPlayers()}
        <Grid item xs={1}>
          {/* chat/ log */}
          <Log gameState={props.gameState} />
        </Grid>
        <Grid item xs={1}>
          <Player
            userName={currentUser.name}
            userId={props.userId}
            gameState={props.gameState}
            color={currentUser.color}
            cardOne={currentUser.cardOne && `/${currentUser.cardOne}.svg`}
            cardTwo={currentUser.cardTwo && `/${currentUser.cardTwo}.svg`}
            cardOneActive={currentUser.cardOneActive}
            cardTwoActive={currentUser.cardTwoActive}
            coinCount={currentUser.coins}
            isActiveUser={props.gameState.currentPlayer === props.userId}
            // style={{ height: '47.5vh', width: '30vw' }}
            phase={props.gameState.activity.phase}
            loseInfluenceTarget={props.gameState.activity.loseInfluenceTarget}
            isPrimaryPlayerTile={true}
            socket={props.socket}
          />
        </Grid>
        <Grid item xs={1}>
          {/* action panel. lie indicator*/}
          <Actions
            socket={props.socket}
            isActiveUser={props.gameState.currentPlayer === props.userId}
            cardOne={currentUser.cardOne}
            cardTwo={currentUser.cardTwo}
            gameId={props.gameState.id}
            coinCount={currentUser.coins}
            targetOtherPlayers={targetOtherPlayers}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
