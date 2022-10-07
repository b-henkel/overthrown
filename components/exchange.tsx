import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { GameObject, User } from '../game/types/game-types';
import { cardBack, toImage } from '../constants/cards';
import { borderColor } from '@mui/system';

type Props = {
  user: User;
  gameObject: GameObject;
  style?: object;
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function Exchange(props: Props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  let playerActiveCardCount =
    props.user.cardOneActive && props.user.cardTwoActive ? 2 : 1;

  let cardOneImage = toImage(props.user.cardOne);
  let cardTwoImage = toImage(props.user.cardTwo);
  let deckCardOneImage = toImage(props.gameObject.deck[0]);
  let deckCardTwoImage = toImage(props.gameObject.deck[1]);
  const cardOneId = `${props.user.cardOne}_1`;
  const cardTwoId = `${props.user.cardTwo}_2`;
  const deckCardOneId = `${props.gameObject.deck[0]}_3`;
  const deckCardTwoId = `${props.gameObject.deck[1]}_4`;

  //TODO initialize state with active cards selected
  const [selectedCards, setSelectedCards] = React.useState([]);

  const handleCardClick = (card) => {
    if (selectedCards.includes(card)) {
      setSelectedCards(selectedCards.filter((elm) => elm !== card));
    } else {
      setSelectedCards([...selectedCards, card]);
    }
  };

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        //
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
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
