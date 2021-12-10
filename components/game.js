import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import PlayingCard from './playing-card';
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
          <Container>
            <PlayingCard />
          </Container>
        </Grid>
        <Grid item xs={1}>
          <Item>
            <PlayingCard /> hello
          </Item>
        </Grid>
        <Grid item xs={1}>
          <Item>
            <PlayingCard />
          </Item>
        </Grid>
        <Grid item xs={1}>
          <Item>a grid item</Item>
        </Grid>
        <Grid item xs={1}>
          <Item>a grid item</Item>
        </Grid>
        <Grid item xs={1}>
          <Item>a grid item</Item>
        </Grid>
        <Grid item xs={1}>
          <Item>a grid item</Item>
        </Grid>
        <Grid item xs={1}>
          <Item>a grid item</Item>
        </Grid>
        <Grid item xs={1}>
          <Item>a grid item</Item>
        </Grid>
      </Grid>
    </Box>
  );
}
