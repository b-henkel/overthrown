import React from 'react';
import { Card, CardMedia } from '@mui/material';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { GameObject } from '../game/types/game-types';
import {
  ACTION,
  CHALLENGE_ACTION,
  RESOLVE_CHALLENGE_ACTION,
  COUNTER_ACTION,
  CHALLENGE_COUNTER_ACTION,
  RESOLVE_CHALLENGE_COUNTER_ACTION,
  RESOLVE_COUNTER_ACTION,
  RESOLVE_ACTION,
  LOSE_INFLUENCE,
  EXCHANGE,
} from '../game/phase-action-order';

type Props = {
  gameObject: GameObject;
  style?: object;
};
const actionCards = {
  tax: '/duke.svg',
  assassinate: '/assassin.svg',
  steal: '/captain.svg',
  exchange: '/ambassador.svg',
};

export default function Banker(props: Props) {
  const users = props.gameObject.users;
  const activity = props.gameObject.activity;
  const currentPlayer = users[props.gameObject.currentPlayer].name;

  const phase = activity.phase;
  const action = activity.action;

  let target;
  if (activity.actionTarget) {
    target = users[activity.actionTarget].name;
  }
  let challenger;
  if (activity.actionChallenger) {
    challenger = users[activity.actionChallenger].name;
  }
  let counterActor;
  if (activity.counterActor) {
    counterActor = users[activity.counterActor].name;
  }
  const counterActorCard = activity.counterActorCard;
  let counterActionChallenger;
  if (activity.counterActionChallenger) {
    counterActionChallenger = users[activity.counterActionChallenger].name;
  }
  let loseInfluenceTarget;
  if (activity.loseInfluenceTarget) {
    loseInfluenceTarget = users[activity.loseInfluenceTarget].name;
  }
  const passingUsers = activity.passingUsers;
  let dialogue;
  if (phase === ACTION) {
    dialogue = `player ${currentPlayer} is making their move.`;
  }
  if (phase === CHALLENGE_ACTION) {
    dialogue = `player ${currentPlayer} is ${action}ing ${target}. Do you want to challenge ${currentPlayer}?`;
  }

  return (
    <Card sx={{ height: '32vh', whiteSpace: 'nowrap' }}>
      <div
        style={{
          position: 'relative',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <CardMedia
            sx={{
              ...props.style,
              marginLeft: 'auto',
              marginRight: 'auto',
              display: 'inline',
              width: 'auto',
              height: '32vh',
              opacity: '0.2',
            }}
            component='img'
            image={
              props.gameObject.activity.phase === 'action'
                ? '/banker.svg'
                : actionCards[props.gameObject.activity.action]
            }
          />
          <div
            style={{
              position: 'absolute',
              color: 'black',
              top: 8,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            <Typography sx={{ fontSize: 20, bgcolor: 'white' }} gutterBottom>
              {dialogue}
              <br></br>
              Current Player:
              {currentPlayer}
              <br></br>
              Phase: {phase}
              <br></br>
              Action:{action}
              <br></br>
              Target:{target}
              <br></br>
              Challenger: {challenger}
              <br></br>
              CounterActor: {counterActor}
              <br></br>
              Counter Actor Card: {counterActorCard}
              <br></br>
              Counter Action Challenger: {counterActionChallenger}
              <br></br>
              Lose Influence Target: {loseInfluenceTarget}
              <br></br>
              Passing Users: {passingUsers}
            </Typography>
          </div>
        </Box>
      </div>
    </Card>
  );
}
