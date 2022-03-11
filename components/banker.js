import React from 'react';
import { Card, CardMedia } from '@mui/material';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function Banker(props) {
  return (
    <Card
      sx={{
        whiteSpace: 'nowrap',
      }}
    >
      <div
        style={{
          position: 'relative',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <CardMedia
            sx={{
              ...props.style,
              width: 'auto',
              height: '23.5vh',
            }}
            component='img'
            image='/banker.svg'
          />
          <div
            style={{
              position: 'absolute',
              color: 'black',
              top: 8,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            <Typography sx={{ fontSize: 20, bgcolor: 'white' }} gutterBottom>
              Current Player: {props.currentPlayer}
            </Typography>

            <Typography sx={{ fontSize: 20, bgcolor: 'white' }} gutterBottom>
              Phase: {props.currentPhase}
            </Typography>
          </div>
        </Box>
      </div>
    </Card>
  );
}
