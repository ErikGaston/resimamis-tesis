import styled from '@emotion/styled';
import { Autocomplete, TextField } from '@mui/material';
import React from 'react'

const AutocompleteCustomized = (props) => {
    const { id, key, value, inputValue, options, label, placeholder, startAdornment, onChange, onInputChange, sx, borderleft, required, noOptionsText, inputColor, error, helperText, ...other } = props;
    return (
        <Autocomplete
            disableClearable
            key={key}
            id={id}
            value={value}
            inputValue={inputValue}
            onChange={(e, newValue) => onChange(e, newValue)}
            onInputChange={onInputChange}
            options={options?.map((option) => option)}
            noOptionsText={noOptionsText}
            filterSelectedOptions
            inputColor={inputColor}
            // getOptionLabel={option => option.label}
            {...other}
            sx={sx}
            renderInput={(params) => (
                <StyledTextField
                    {...params}
                    label={label}
                    placeholder={placeholder}
                    error={Boolean(error)}
                    helperText={helperText}
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: startAdornment,
                        type: 'search'
                    }}
                    borderleft={borderleft}
                    required={required}
                />
            )}
        />
    )
}

export default AutocompleteCustomized

const StyledTextField = styled(TextField)`
    border-radius: 10px;
    border: 1.5px solid #FFF;
    margin:10px 0;
    /* width:100%; */
    color: #152C70;
    
    div{
        /* width: 260px; */
        /* height: 40px; */
        border-radius: 10px;
        border: 1.5px solid #FFF;
        color: #152C70;

        :hover{
            border-color: transparent !important; // Elimina la línea negra al pasar el mouse
        }
    }

    &.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
        border-color: transparent !important; // Elimina la línea negra al pasar el mouse
    }

    &.Mui-focused .MuiOutlinedInput-notchedOutline {
        border-color: transparent !important; // Elimina la línea verde cuando está enfocado
    }
`;