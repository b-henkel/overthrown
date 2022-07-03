import { initGameState } from '../../game/game-state';

export default function handler(req, res) {
  const newGame = initGameState();
  res.redirect(`/game/${newGame.id}`);
}
