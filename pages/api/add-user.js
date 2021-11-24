// receive a username, get back a unique user id
// store this username + userid under the given game id's object
export default function handler(req, res) {
  const username = req.query.username;
  console.log(username);
  // gen a user id
  // store user name + user id inside game object
  // return user name + user id?
  res.status(200).json({ value: `You did it ${username}` });
}
