import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { GameObject, User } from '../game/types/game-types';
import { cardBack, toImage } from '../constants/cards';
import { borderColor } from '@mui/system';
import { Socket } from 'socket.io-client';

type Props = {
  user: User;
  gameObject: GameObject;
  style?: object;
  socket: Socket;
};

export default function Exchange(props: Props) {
  const [open, setOpen] = React.useState(true);
  const [deckCardOne, setDeckCardOne] = React.useState('');
  const [deckCardTwo, setDeckCardTwo] = React.useState('');
  const [deck, setDeck] = React.useState([]);

  let playerActiveCardCount =
    props.user.cardOneActive && props.user.cardTwoActive ? 2 : 1;

  React.useEffect(() => {
    setDeckCardOne(props.gameObject.deck.shift());
    setDeckCardTwo(props.gameObject.deck.shift());
    setDeck(props.gameObject.deck);
  }, []);
  let cardOneImage = toImage(props.user.cardOne);
  let cardTwoImage = toImage(props.user.cardTwo);
  let deckCardOneImage = toImage(deckCardOne);
  let deckCardTwoImage = toImage(deckCardTwo);
  const cardOneId = `${props.user.cardOne}_1`;
  const cardTwoId = `${props.user.cardTwo}_2`;
  const deckCardOneId = `${deckCardOne}_3`;
  const deckCardTwoId = `${deckCardTwo}_4`;
  const allCardsSelectable = [deckCardOneId, deckCardTwoId];

  //TODO initialize state with active cards selected
  const [selectedCards, setSelectedCards] = React.useState([]);

  if (props.user.cardOneActive) {
    allCardsSelectable.push(cardOneId);
  }
  if (props.user.cardTwoActive) {
    allCardsSelectable.push(cardTwoId);
  }

  const handleClose = () => {
    // remove cards from deck.
    // add selected to hand.
    // add remaining cards in array back to deck
    const unselectedCards = allCardsSelectable.filter(
      (card) => !selectedCards.includes(card)
    );
    const selected = selectedCards.map((item) => item.split('_')[0]);
    const unselected = unselectedCards.map((item) => item.split('_')[0]);
    const updatedUser = { ...props.user };
    if (updatedUser.cardOneActive && updatedUser.cardTwoActive) {
      updatedUser.cardOne = selected[0];
      updatedUser.cardTwo = selected[1];
    } else if (updatedUser.cardOneActive) {
      updatedUser.cardOne = selected[0];
    } else {
      updatedUser.cardTwo = selected[0];
    }
    console.log('selected cards: ', JSON.stringify(selected));

    props.socket.emit('exchange', {
      gameId: props.gameObject.id,
      user: updatedUser,
      deck: [...unselected, ...deck],
    });
    setOpen(false);
  };

  const handleCardClick = (card) => {
    if (selectedCards.includes(card)) {
      setSelectedCards(selectedCards.filter((elm) => elm !== card));
    } else {
      setSelectedCards([...selectedCards, card]);
    }
  };

  return (
    <div>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
        open={open}
        //
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 800,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography>
            {`Please select ${playerActiveCardCount} card(s) to keep. The rest will be returned to the deck`}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              p: 1,
              m: 1,
            }}
          >
            {props.user.cardOneActive && (
              <Box
                component='img'
                sx={{
                  padding: 2,
                  maxWidth: '48%',
                  maxHeight: '24vh',
                  border: 1,
                  borderRadius: 10,
                  backgroundColor: selectedCards.includes(cardOneId)
                    ? 'green'
                    : 'white',
                }}
                src={cardOneImage}
                onClick={() => handleCardClick(cardOneId)}
              />
            )}
            {props.user.cardTwoActive && (
              <Box
                component='img'
                sx={{
                  padding: 2,
                  maxWidth: '48%',
                  maxHeight: '24vh',
                  border: 1,
                  borderRadius: 10,
                  backgroundColor: selectedCards.includes(cardTwoId)
                    ? 'green'
                    : 'white',
                }}
                src={cardTwoImage}
                onClick={() => handleCardClick(cardTwoId)}
              />
            )}
            <Box
              component='img'
              sx={{
                padding: 2,
                maxWidth: '48%',
                maxHeight: '24vh',
                border: 1,
                borderRadius: 10,
                backgroundColor: selectedCards.includes(deckCardOneId)
                  ? 'green'
                  : 'white',
              }}
              src={deckCardOneImage}
              onClick={() => handleCardClick(deckCardOneId)}
            />
            <Box
              component='img'
              sx={{
                padding: 2,
                maxWidth: '48%',
                maxHeight: '24vh',
                border: 1,
                borderRadius: 10,
                backgroundColor: selectedCards.includes(deckCardTwoId)
                  ? 'green'
                  : 'white',
              }}
              src={deckCardTwoImage}
              onClick={() => handleCardClick(deckCardTwoId)}
            />
          </Box>
          <Button
            onClick={handleClose}
            disabled={selectedCards.length !== playerActiveCardCount}
          >
            KEEP SELECTED
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
