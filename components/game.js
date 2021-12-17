import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Player from './player';
import { Container } from '@mui/material';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function BasicGrid() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} columns={3} justifyContent={'center'}>
        <Grid item xs={1}>
          <Player />
        </Grid>
        <Grid item xs={1}>
          <Player />
        </Grid>
        <Grid item xs={1}>
          <Player />
        </Grid>
        <Grid item xs={1}>
          <Player />
        </Grid>
        <Grid item xs={1}>
          {/* static image of coins and deck of cards */}
        </Grid>
        <Grid item xs={1}>
          <Player />
        </Grid>
        <Grid item xs={1}>
          {/* chat/ log */}
        </Grid>
        <Grid item xs={1}>
          <Player cardA={'/assassin.svg'} style={{ height: '25vh' }} />
        </Grid>
        <Grid item xs={1}>
          {/* rules/ action panel. lie indicator*/}
        </Grid>
      </Grid>
    </Box>
  );
}
