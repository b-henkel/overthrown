import React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';

export default function Actions(props) {
  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState('Select an Action');

  const handleRadioChange = (event) => {
    setValue(event.target.value);
    setHelperText(' ');
    setError(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (value === 'best') {
      setHelperText('You got it!');
      setError(false);
    } else if (value === 'worst') {
      setHelperText('Sorry, wrong answer!');
      setError(true);
    } else {
      setHelperText('Please select an option.');
      setError(true);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl
        sx={{ m: 3 }}
        component='fieldset'
        error={error}
        variant='standard'
      >
        <FormLabel component='legend'></FormLabel>
        <RadioGroup
          aria-label='action'
          name='action'
          value={value}
          onChange={handleRadioChange}
        >
          <h2>General Actions</h2>
          <FormControlLabel value='Income' control={<Radio />} label='Income' />
          <FormControlLabel
            value='foreignAid'
            control={<Radio />}
            label='Foreign Aid'
          />
          <FormControlLabel
            value='Tax'
            control={<Radio />}
            label='Overthrow'
            disabled
          />
          <h2>Character Actions</h2>
          <FormControlLabel value='tax' control={<Radio />} label='Tax' />
          <FormControlLabel
            value='assasinate'
            control={<Radio />}
            label='Assasinate'
          />
          <FormControlLabel value='steal' control={<Radio />} label='Steal' />
          <FormControlLabel
            value='exchange'
            control={<Radio />}
            label='Exchange'
          />
          <h2>Counter Actions</h2>
          <FormControlLabel
            value='blockAssasination'
            control={<Radio />}
            label='Block Assasination'
          />
          <FormControlLabel
            value='blockSteal'
            control={<Radio />}
            label='Block Steal'
          />
          <FormControlLabel
            value='blockForeignAid'
            control={<Radio />}
            label='Block Foreign Aid'
          />
        </RadioGroup>
        <FormHelperText>{helperText}</FormHelperText>
        <Button sx={{ mt: 1, mr: 1 }} type='submit' variant='outlined'>
          Submit
        </Button>
      </FormControl>
    </form>
  );
}
