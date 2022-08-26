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

const emptyUser: User = {
  id: null,
  name: null,
  coins: null,
  color: null,
  cardOne: null,
  cardTwo: null,
  cardOneActive: null,
  cardTwoActive: null,
  number: null,
  participant: null,
  icon: null,
};

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
  const currentUser = props.gameState.users[props.userId];

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
        encoding = [0, 0, 0, 0, 0, 0];
    }
    const usersArr: User[] = Object.values(props.gameState.users);

    // const yourUserPos = props.gameState.users[props.userId].number - 1;

    usersArr.sort((userA, userB) => {
      return userA.number - userB.number;
    });

    const yourUserIndex = usersArr.findIndex(
      (user) => user.id === props.userId
    );

    usersArr.splice(yourUserIndex, 1);
    const finalUserArr = usersArr;
    // let finalUserArr = usersArr.slice(yourUserIndex, usersArr.length);
    // if (yourUserIndex != 0) {
    //   finalUserArr = finalUserArr.concat(finalUserArr.slice(0, yourUserIndex));
    // }
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
      const user: User = isPlayer ? finalUserArr[isPlayer - 1] : null;
      console.log('user:', user);

      return (
        <Grid item xs={1}>
          <Player
            socket={props.socket}
            user={user ? user : emptyUser}
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
            yourPlayerParticipant={currentUser.participant}
          />
        </Grid>
      );
    });
    return gridItems;
  };
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
            user={currentUser}
            gameState={props.gameState}
            isActiveUser={props.gameState.currentPlayer === props.userId}
            phase={props.gameState.activity.phase}
            loseInfluenceTarget={props.gameState.activity.loseInfluenceTarget}
            isPrimaryPlayerTile={true}
            socket={props.socket}
            yourPlayerParticipant={currentUser.participant}
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
