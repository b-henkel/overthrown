const cards = [
  'duke',
  'contessa',
  'assassin',
  'captain',
  'ambassador',
  'duke',
  'contessa',
  'assassin',
  'captain',
  'ambassador',
  'duke',
  'contessa',
  'assassin',
  'captain',
  'ambassador',
];

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

export const swap = (deck, cardIn) => {
  const cardOut = deck.shift();
  deck.push(cardIn);
  shuffle(deck);
  return { deck, cardOut };
};

export const deal = (userCount) => {
  // new deck
  const deck = [...cards];
  // shuffle
  shuffle(deck);
  // return hands and remainder
  const hands = [...Array(userCount).keys()].map((item) => {
    return {
      cardOne: deck.shift(),
      cardTwo: deck.shift(),
    };
  });
  return { hands, deck };
};
