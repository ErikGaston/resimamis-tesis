import styled from '@emotion/styled'
import { InputAdornment, InputLabel, TextField } from '@mui/material'
import React from 'react'

const LabelInput = (props) => {
    const { id, required, label, defaultValue, value, type, name, className, fullWidth, autoComplete, onChange, multiline, helperText, placeholder, InputProps, rows,
        labelColor, inputColor, styleLabel, maxRows, variant, disabled } = props

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
                error={false}
                helperText={helperText}
                required={required}
                placeholder={placeholder}
                rows={rows}
                // endAdornment={endAdornment}
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