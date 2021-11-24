// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  // TODO should generate the unique game id

  const randomGameId = 7;

  // TODO need to load this game id into the actual game state store object

  // should also redirect to that game url
  res.redirect(`/lobby/${randomGameId}`);
  // res.status(200).json({ name: "John Doe" });
}
