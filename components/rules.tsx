import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Modal, Box } from '@mui/material';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';

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

const style = {
  width: 800,
  height: 800,
  minWidth: 700,
  maxWidth: 1200,
  minHeight: 700,
  maxHeight: 1200,
  display: 'flex',
  justifyContent: 'center',
  m: 1,
  p: 1,
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  typography: 'body1',
  background: '#FFF',
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function RulesTable() {
  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label='customized table'>
          <TableHead>
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
    </>
  );
}

export default function CustomizedTables(props: Props) {
  const handleClose = () => props.setRulesModal(false);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Modal open={props.rulesModal} onClose={handleClose}>
      <Box sx={style}>
        <Box>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label='basic tabs example'
            >
              <Tab label='Rules' {...a11yProps(0)} />
              <Tab label='Actions' {...a11yProps(1)} />
            </Tabs>
          </Box>

          <TabPanel value={value} index={0}>
            <Box>
              <Box sx={{ overflow: 'scroll', height: 700 }}>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Saepe
                adipisci debitis incidunt dolore veniam qui. Quod, vel dolor?
                Beatae illo veritatis quae. Repellat magni, tenetur velit, dicta
                laborum cupiditate veritatis ad explicabo consequuntur debitis
                nesciunt quo, eum aliquam! Harum saepe ratione, dolorum culpa
                alias perspiciatis doloremque, vitae accusantium eum explicabo
                aliquid distinctio quos nihil possimus consectetur ullam. Autem
                repellendus distinctio omnis consectetur quos? Rerum tempora
                consequuntur totam repudiandae? Eveniet magni error ab cumque
                labore quis nobis tenetur, possimus dolorum iste a veritatis est
                suscipit repellat ullam rem voluptatem praesentium tempora
                voluptates fuga deserunt. Laborum dolorem vel maiores magnam
                nesciunt omnis voluptas quaerat rem assumenda vero culpa qui
                asperiores quibusdam cum, incidunt, tempore eaque amet ex. At
                dignissimos labore, velit consectetur libero hic atque, sequi
                itaque suscipit culpa accusamus mollitia quam cum enim vitae.
                Quia nemo deleniti ipsum dolor dolore tempore natus modi aliquam
                quis ut ex accusantium, non cupiditate nostrum labore.
                Explicabo, quam sapiente. Fuga accusamus beatae magnam
                recusandae quisquam! Veritatis vero vitae nihil magni eveniet.
                Molestias dicta doloremque voluptatibus deleniti totam
                perspiciatis harum similique est aspernatur! Vitae iste
                cupiditate harum, aliquid ea corporis in iusto repellendus quod.
                Adipisci totam corporis vitae quae laborum quo fugit quos,
                voluptatem autem sit provident mollitia temporibus eos,
                distinctio deserunt vel placeat dolores odio necessitatibus
                ipsa, similique pariatur dolor eum ipsum. Mollitia, officia!
                Voluptatibus tempora amet consequatur aperiam consequuntur
                assumenda, repellat corrupti nemo ducimus aspernatur fuga! Nemo
                inventore alias et, distinctio cupiditate autem omnis!
                Voluptates omnis expedita, atque culpa nihil nesciunt quisquam
                error animi quam est numquam quasi laborum maiores ratione
                veniam a inventore ad? Quas amet quis voluptate dignissimos
                quaerat veniam laborum eaque magnam quisquam eos eveniet
                perspiciatis cupiditate dicta, sint rem laudantium fugiat ex
                porro? Tempore provident repellendus, iste voluptatem sunt eaque
                veniam similique quisquam ab, esse nemo voluptatum obcaecati
                minima unde quos! Tempora sunt quae provident tempore dolores
                voluptatibus inventore deserunt animi, mollitia hic porro
                molestias minus illo sequi similique fuga quaerat doloremque,
                beatae voluptas distinctio unde numquam? Unde dolorem
                exercitationem officiis voluptates deleniti ad aut ipsa rerum
                enim, repellat qui a nihil tempora, iusto quia id quisquam
                consectetur assumenda aperiam quo itaque magnam odit minima
                numquam. Cumque iste enim dolorem et quidem excepturi non
                mollitia beatae, facere dolor. Placeat nisi officiis facere!
                Vitae doloremque repudiandae dolores nobis sed. Nulla, molestias
                voluptate? Esse, voluptate! Natus eius cum porro eos fuga
                voluptatibus iure, libero quo! Neque eum corporis ratione
                aperiam nisi incidunt perspiciatis vel, optio fuga! Rerum culpa
                omnis laborum est, assumenda molestiae accusantium eum nemo
                soluta quasi molestias necessitatibus, velit ipsam quidem magni
                corporis porro expedita quos doloremque voluptatum laboriosam?
                Officiis repellat eveniet dicta corrupti recusandae id incidunt
                libero sit, consectetur sed blanditiis placeat dolores natus
                quia, est quibusdam quis cumque, distinctio repudiandae totam ea
                iure minima odit. Delectus, omnis. Ducimus exercitationem ipsam
                qui. Alias veniam laborum ipsum ad modi consequatur nisi
                pariatur quas eius corrupti ea tempora vitae illo sunt quisquam
                incidunt itaque dolorum atque quasi asperiores, eligendi a!
                Minus nihil esse fugiat similique assumenda alias, debitis
                itaque! Rerum, quasi!
              </Box>
            </Box>
          </TabPanel>

          <TabPanel value={value} index={1}>
            <RulesTable />
          </TabPanel>
        </Box>
      </Box>
    </Modal>
  );
}
