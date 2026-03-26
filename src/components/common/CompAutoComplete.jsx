import { Autocomplete, Chip, TextField } from '@mui/material'
import CancelSharpIcon from '@mui/icons-material/CancelSharp';
import { useState } from 'react';

const CompAutoComplete = (props) => {

  //para el correcto funcionamiento del control del valor del autocomplete si se le pasa value como props se le tiene que pasar 
  //tambien el onChange y guardar (esto es el estado del componente padre)
  const { 
    label, variant, placeholder,
    freeSolo, options, defaultValue,
    id, multiple, disableClearable,
    value, onChange,
    fullWidth, sx, autoFocus = false, 
    sxTextFiled
  } = props;

  const [data, setData] = useState([])

  const handleChange = (event, values, reason) => {
 
    let tags = []
    //para eliminar todos los tags (clearable)
    if(reason === 'clear'){
      setData([])
    }

    const newValue = event.target.value

    //Para seleccionar y eliminar desde una opcion
    if(reason === 'selectOption' || reason === 'removeOption'){
      setData(values)
      tags = [...values]
    }

    //Verifica si se agregaron solamente espacios vacios por lo tanto lo omite
    if(reason === 'createOption' && newValue.trim() !== ''){
      const info = values.map(i => i.trim());
      tags = [...info]
      setData(prevTags=>[...prevTags, newValue.trim()])
    }

    //si existe un estado como props para setear el valor, lo guardo
    if(onChange){
      if(reason === 'createOption' && newValue.trim() === ''){
        onChange(value)
      }else{
        onChange(tags)
      }
    }
  }

  return (
    <>
    <Autocomplete
        multiple = {multiple ? multiple : false}
        fullWidth={fullWidth}
        sx={sx}
        id={id}
        clearIcon={<CancelSharpIcon sx={{color:'red'}}/>}
        options={options ? options : []}
        defaultValue={defaultValue}
        freeSolo = {freeSolo ? freeSolo : false}
        value={value ? value : data}
        onChange={handleChange}
        disableClearable={disableClearable ? disableClearable : false}
        renderTags={(value, getTagProps, ownerState) =>{
          return value.map((option, index) => {
            return(
            <Chip 
              sx={{color:'#000000DE', fontSize:14}} 
            
            deleteIcon={<CancelSharpIcon sx={{width:14, color:'black', '&.MuiSvgIcon-root':{color:'#00000099',':hover':{color:'#00000099'}}}} />}
            variant="outlined" 
            label={option} 
            {...getTagProps({ index })}
            />
            )})
          }
        }
        renderInput={(params) => {
            return <TextField
              {...params}
              sx={sxTextFiled}
              InputLabelProps={{
                shrink: true,
              }}
              autoFocus = {autoFocus}
              aria-current
              variant={variant ? variant : "outlined" }
              label={label ? label : "Label" }
              placeholder={placeholder ? placeholder : "Placeholder" }
            />
          
        }
      }
      />
    </>
  )
}

export default CompAutoComplete

