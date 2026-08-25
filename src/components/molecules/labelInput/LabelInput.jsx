import styled from '@emotion/styled'
import { InputAdornment, InputLabel, TextField } from '@mui/material'
import React from 'react'

const LabelInput = (props) => {
    const { id, required, label, defaultValue, value, type, name, className, fullWidth, autoComplete, onChange, multiline, helperText, placeholder, InputProps, inputProps, rows,
        labelColor, inputColor, styleLabel, maxRows, variant, disabled, error } = props

    const helperColorSx =
        error && helperText ? { sx: { color: '#d32f2f', marginLeft: 0 } } : undefined;

    return (
        <div>
            <StyledInputLabel htmlFor={id} labelColor={labelColor} style={styleLabel}>{label}</StyledInputLabel>
            <StyledTextfield
                id={id}
                variant={variant}
                label={''}
                defaultValue={defaultValue}
                value={value}
                type={type}
                name={name}
                className={className}
                fullWidth={fullWidth}
                autoComplete={autoComplete}
                onChange={onChange}
                multiline={multiline}
                error={Boolean(error)}
                helperText={helperText}
                FormHelperTextProps={helperColorSx}
                required={required}
                placeholder={placeholder}
                rows={rows}
                inputProps={inputProps}
                inputColor={inputColor}
                InputProps={InputProps}
                maxRows={maxRows}
                disabled={disabled}
            />
        </div>
    )
}

export default LabelInput;

const StyledInputLabel = styled(InputLabel)`
    color: ${(props) => (props.labelColor)};
    font-family: Roboto;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;

`;

const StyledTextfield = styled(TextField)`
    /* En modo lectura los campos van disabled; sin esto MUI los pinta a
       rgba(0,0,0,0.38) (2.66:1) y el perfil queda ilegible. */
    .MuiInputBase-input.Mui-disabled {
        -webkit-text-fill-color: #152C70;
        opacity: 1;
    }
    .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline {
        border-color: rgba(21,44,112,0.25);
    }

    width:100%;
    border-radius: 10px;
    border: 1.5px solid #FFF;
    margin:10px 0;
    /* width: 260px; */
    width: ${(props) => (props.widthInput)};
    /* height: 40px; */
    
    div{
        /* width: 260px; */
        color: ${(props) => (props.widthInput)};
        /* height: 40px; */
        border-radius: 10px;
        border: 1.5px solid #FFF;
        color:#FFF;
        color: ${(props) => (props.inputColor)};

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