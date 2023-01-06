import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea, Box } from '@mui/material';
import { fontSize } from '@mui/system';

// TODO This will become the Join/Create Game page

export default function Home() {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        backgroundImage: "url('/board.png')",
        position: 'fixed',
      }}
    >
      <Box
        sx={{
          display: 'block',
          marginTop: '25vh',
          textAlign: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
        }}
      >
        <Box
          component='img'
          sx={{ maxWidth: '90vw' }}
          alt='characters'
          src='./splash.svg'
        />
        <Typography
          sx={{
            backgroundColor: '#000',
            color: '#fff',
            textAlign: 'center',
            fontSize: '5vh',
            fontFamily: 'serif',
            fontStyle: 'italic',
          }}
        >
          WELCOME TO OVERTHROWN!
        </Typography>
        <Card sx={{ maxWidth: '35vw', margin: 'auto' }}>
          <CardActionArea href='api/create'>
            <CardContent>
              <Typography gutterBottom variant='h5' component='div'>
                New Game
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Click here to start a new game of Overthrown!
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>
    </Box>
  );
}
