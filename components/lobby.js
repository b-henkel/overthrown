import React from 'react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import styles from '../styles/Home.module.css';
import copy from 'copy-to-clipboard';

export default function Lobby(props) {
  const router = useRouter();
  const { id: gameId } = router.query;
  const [username, setUsername] = useState('');

  const addUser = async () => {
    // grab the text box's information
    // and then fire an http request
    if (props.socket) {
      console.log('Trying to emit?');
      props.socket.emit('add-user', { username, gameId });
    } else {
      console.log('no socket available');
    }
  };
  const startGame = async () => {
    if (props.socket) {
      props.socket.emit('start-game', { gameId });
    } else {
      console.log('no socket available');
    }
  };

  const copyToClipboard = () => {
    copy(`http://localhost:3000/game/${router.query.id}`);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to the Lobby!</h1>
        <h3>Your Game ID:</h3>
        <h2>{router.query.id}</h2>
        <button onClick={copyToClipboard}>Copy Link to Clipboard</button>

        <div className={styles.grid}>
          <button
            onClick={startGame}
            className={styles.card}
            disabled={
              props.gameState && Object.values(props.gameState.users).length < 2
            }
          >
            <h2>Start Game &rarr;</h2>
          </button>
        </div>
        <h3>Input a User Name: </h3>
        <span>
          <input
            id='text_box'
            type='text'
            label='user name'
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          ></input>
          <button onClick={addUser}>submit</button>
        </span>

        <h2>Players: </h2>
        <List sx={{ fontSize: 24 }}>
          {props.gameState &&
            Object.entries(props.gameState.users).map(([userID, userObj]) => {
              return <ListItem>&rarr; {userObj.name}</ListItem>;
            })}
        </List>
      </main>
    </div>
  );
}
