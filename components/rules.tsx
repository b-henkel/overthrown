import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Modal } from '@mui/material';

type Props = {
  rulesModal: boolean;
  setRulesModal: Function;
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function createData(icon, character, action, effect, counterAction) {
  return { icon, character, action, effect, counterAction };
}

const rows = [
  createData('banker-icon.svg', '', 'Income', 'Take 1 Coin', 'X'),
  createData('aid-icon.svg', '', 'Foreign Aid', 'take 2 Coins', 'X'),
  createData(
    'assassin-icon.svg',
    '',
    'Overthrow',
    "Pay 7 Coins to remove an Opponent's card",
    'x'
  ),
  createData(
    'duke-icon.svg',
    'Duke',
    'Tax',
    'Take 3 Coins from the Bank',
    'Blocks Foreign Aid'
  ),
  createData(
    'assassin-icon.svg',
    'Assassin',
    'Assassinate',
    'Pay 3 Coins to remove and Opponents Card',
    'X'
  ),
  createData(
    'ambassador-icon.svg',
    'Ambassador',
    'Echange',
    'Swap up to 2 cards with Deck',
    'Blocks Stealing'
  ),
  createData(
    'captain-icon.svg',
    'Captain',
    'Steal',
    'Take 2 Coins from and Opponent',
    'Blocks Stealing'
  ),
  createData('contessa-icon.svg', 'Contessa', 'X', 'X', 'Blocks Assassination'),
];

export default function CustomizedTables(props: Props) {
  const handleClose = () => props.setRulesModal(false);

  return (
    <Modal open={props.rulesModal} onClose={handleClose}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label='customized table'>
          <TableHead>
            <TableRow>
              <StyledTableCell>Rules</StyledTableCell>
            </TableRow>
            <TableRow>
              <StyledTableCell>Character</StyledTableCell>
              <StyledTableCell align='right'>Action</StyledTableCell>
              <StyledTableCell align='right'>Effect</StyledTableCell>
              <StyledTableCell align='right'>
                Character Counter Action
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row.character}>
                <StyledTableCell component='th' scope='row'>
                  <img src={`/${row.icon}`}></img>
                  {row.character}
                </StyledTableCell>
                <StyledTableCell align='right'>{row.action}</StyledTableCell>
                <StyledTableCell align='right'>{row.effect}</StyledTableCell>
                <StyledTableCell align='right'>
                  {row.counterAction}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Modal>
  );
}
