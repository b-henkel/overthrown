import React from 'react';
import { Card, CardMedia } from '@mui/material';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { GameObject, User } from '../game/types/game-types';
import {
  ACTION,
  CHALLENGE_ACTION,
  COUNTER_ACTION,
  CHALLENGE_COUNTER_ACTION,
  LOSE_INFLUENCE,
  EXCHANGE,
} from '../game/phase-action-order';

type Props = {
  user: User;
  gameObject: GameObject;
  style?: object;
  seconds: number;
  isTimerActive: boolean;
};
const actionCards = {
  tax: '/duke.svg',
  assassinate: '/assassin.svg',
  steal: '/captain.svg',
  exchange: '/ambassador.svg',
  income: '/banker.svg',
  foreignAid: '/banker.svg',
  overthrow: '/assassin-icon.svg',
};

export default function Banker(props: Props) {
  const currentUser = props.user;
  const users = props.gameObject.users;
  const activity = props.gameObject.activity;
  const currentPlayer = users[props.gameObject.currentPlayer].name;
  const currentPlayerId = props.gameObject.currentPlayer;

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
    if (currentUser.id === currentPlayerId) {
      dialogue = `It's your turn. Pick an available action.`;
    } else {
      dialogue = `Player ${currentPlayer} is making their move.`;
    }
  }
  if (phase === CHALLENGE_ACTION) {
    if (currentUser.id === currentPlayerId) {
      dialogue = `The other players are judging you...`;
    } else if (activity.actionTarget === currentUser.id) {
      dialogue = `Player ${currentPlayer} is performing the ${action} action on you. Do you want to challenge them?`;
    } else {
      if (target) {
        dialogue = `Player ${currentPlayer} is performing the ${action} action on ${target}. Do you want to challenge ${currentPlayer}?`;
      } else {
        dialogue = `Player ${currentPlayer} is performing the ${action} action. Do you want to challenge them?`;
      }
    }
  }
  if (phase === COUNTER_ACTION) {
    if (currentUser.id === currentPlayerId) {
      dialogue = `The other players are judging you...`;
    } else if (activity.actionTarget === currentUser.id) {
      dialogue = `Player ${currentPlayer} is performing the ${action} action on you. Do you want to block them?`;
    } else {
      if (target) {
        dialogue = `Player ${currentPlayer} is performing the ${action} action on ${target}. Do you want to block ${currentPlayer}?`;
      } else {
        dialogue = `Player ${currentPlayer} is performing the ${action} action. Do you want to block them.`;
      }
    }
  }
  if (phase === CHALLENGE_COUNTER_ACTION) {
    if (activity.counterActor === currentUser.id) {
      dialogue = `The other players are judging if you have the ${counterActorCard} card...`;
    } else {
      dialogue = `Do you think ${counterActor} has the ${counterActorCard} card?`;
    }
  }
  if (phase === LOSE_INFLUENCE) {
    if (activity.loseInfluenceTarget === currentUser.id) {
      dialogue = `Select which influence to lose.`;
    } else {
      dialogue = `Player ${loseInfluenceTarget} is deciding what influence to lose.`;
    }
  }
  if (phase === EXCHANGE) {
    dialogue = `Player ${currentPlayer} is exchanging cards!`;
  }

  return (
    <Card sx={{ height: '32vh', backgroundColor: 'rgba(255,255,255,0.8)' }}>
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
                : actionCards[props.gameObject.activity.action] || '/banker.svg'
            }
          />
          <div
            style={{
              position: 'absolute',
              color: 'black',
              top: '65%',
              // left: '50%',
              // transform: 'translate(-50%,-50%)',
              width: '100%',
            }}
          >
            <Typography
              sx={{
                fontSize: 32,
                color: 'white',
                bgcolor: 'rgba(0, 0, 0, 0.75)',
                padding: 1,
                textAlign: 'center',
                fontFamily: 'serif',
                fontStyle: 'italic',
              }}
              gutterBottom
            >
              {props.isTimerActive && `${props.seconds} seconds to choose.`}
              {dialogue}
              {/* <br />
              Current Player:
              {currentPlayer}
              <br />
              Phase: {phase}
              <br />
              Action:{action}
              <br />
              Target:{target}
              <br />
              Challenger: {challenger}
              <br />
              CounterActor: {counterActor}
              <br />
              Counter Actor Card: {counterActorCard}
              <br />
              Counter Action Challenger: {counterActionChallenger}
              <br />
              Lose Influence Target: {loseInfluenceTarget}
              <br />
              Passing Users: {passingUsers} */}
            </Typography>
          </div>
        </Box>
      </div>
    </Card>
  );
}
