import React from 'react';
import { GameObject } from '../game/types/game-types';

type Props = {
  gameState: GameObject;
  userId: string;
};

export default function GameOver(props: Props) {
  return (
    <>
      <img src={props.gameState.winner.icon} alt='winner image' />
      <h1>GAME OVER</h1>
      <p>{props.gameState.winner.name} WON!</p>
    </>
  );
}
