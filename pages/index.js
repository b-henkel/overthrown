import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea, Box } from '@mui/material';

// TODO This will become the Join/Create Game page

export default function Home() {
  return (
    <Box
      sx={{
        display: 'block',
        marginTop: 10,
        textAlign: 'center',
      }}
    >
      <Box component='img' sx={{}} alt='characters' src='./splash.svg' />
      <Typography variant='h1'>Welcome to Overthrown!</Typography>
      <Card sx={{ maxWidth: 345, margin: 'auto' }}>
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
  );
}
