import * as React from 'react';

import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import dayjs from 'dayjs';

const TimePicker = ({
  id= '',
  sx = {},
  name = '',
  value,
  onChange = () =>{},
  disabled = false,
  label = '',
  onError = () =>{}
}) => {

  const [time, setTime] = React.useState(value ? dayjs(value) : undefined);

  const handleChange = (newValue ) => {
    setTime(newValue);
    onChange(name, newValue)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopTimePicker

        label={label}
        value={value ? value : time}
        closeOnSelect
        disabled={disabled}
        onError={(reason, v)=>onError(reason, v, name)}
        onChange={handleChange}
        shouldDisableTime={(timeValue, clockType) => {
          if (clockType === 'minutes' && timeValue % 30) {
            return true;
          }
          
          return false;
        }}
        renderInput={(params) => 
          <TextField
            id={id}
            name={name}
            {...params}
            size='small'
            sx = {sx}
          />
        }
      />
    </LocalizationProvider>
    
  )
}

export default TimePicker