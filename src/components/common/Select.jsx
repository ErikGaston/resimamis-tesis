import { FormControl, InputLabel, MenuItem, Select  } from '@mui/material'
import { Box } from '@mui/system';
import React from 'react'

const styledSelect = {
  width:150,
  '& > .MuiFormControl-root':{
    '& label':{
      font: 'normal normal normal 16px/20px Open Sans',
      letterSpacing: '0.25px',
      color: '#000000DE',
    },
    '& > .MuiInputBase-root.MuiFilledInput-root': {
      border: '1px solid #F8F8FA',
      backgroundColor:'#FFFFFF',
      borderRadius: '4px',
      '&::before, &::after':{
        color:'red',
        content:'none'
      },
      '& > .MuiSelect-select':{
        font: 'normal normal normal 14px/20px Open Sans',
        letterSpacing: '0.25px',
        color: '#000000DE',
        paddingTop:'15px',
        paddingBottom:'15px',
        borderRadius: '4px',
        '&:focus':{
          backgroundColor:'#FFFFFF',
        },
      },
      '& svg':{
        fill:'black'
      }
    },
  }
}


export const Selects = ({ 
  id, 
  labelId, 
  label, 
  value, 
  onChange, 
  options, 
  disabled, 
  multiple, 
  error, 
  textInfo, 
  placeholder, 
  name, 
  empty, 
  sx, 
  fullWidth, 
  size, 
  variant
}) => {

  const [data, setData] = React.useState('');

  const handleChange = (event) => {
    setData(event.target.value);
  };
  
  return (
    <Box sx={sx}>
      <FormControl sx={{ m: 0, minWidth: 100 }} fullWidth={fullWidth} error={error} size={size}>
          <InputLabel id="demo-simple-select-helper-label">{label}</InputLabel>
          <Select
            labelId={labelId}
            name={name}
            id={id}
            value={value ? value : data}
            label={label}
            onChange={onChange ? onChange : handleChange}
            disabled={disabled}
            multiple={multiple}
            placeholder={placeholder}
            variant={variant}
          >
            {empty && 
              <MenuItem value=""> 
                <em>Ninguno</em>
              </MenuItem>
            }
            {
              options && options.length > 0 && options.map((item,i) => <MenuItem key={i} value={item.value}>{item.label}</MenuItem> )
            }
          </Select>
          {textInfo && 
            <FormHelperText>{textInfo}</FormHelperText>
          }
        </FormControl>
    </Box>
  )
}
