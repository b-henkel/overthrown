import { initGameState } from "../../game/game-state";

export default function handler(req, res) {
  const newGame = initGameState();

  // should also redirect to that game url
  // XXX Can we like also forward some json to that page? like, form the page with extra data?
  // getStaticProps maybe??
  res.redirect(`/game/${newGame.id}`);
  // res.status(200).json({ name: "John Doe" });
}
