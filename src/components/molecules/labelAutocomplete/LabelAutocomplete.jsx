import styled from '@emotion/styled'
import { InputLabel } from '@mui/material'
import React from 'react'
import AutocompleteCustomized from '../../atoms/autocomplete/AutocompleteCustomized'

const LabelAutocomplete = (props) => {
    const { id, required, label, value, onChange, placeholder, labelColor, inputColor, styleLabel,
        key, inputValue, options, startAdornment, onInputChange, sx, borderleft, noOptionsText, disabled, error, helperText } = props

    return (
        <div>
            <StyledInputLabel htmlFor={id} labelColor={labelColor} style={styleLabel}>{label}</StyledInputLabel>
            <StyledAutocompleteCustomized
                id={id}
                key={key}
                value={value}
                inputValue={inputValue}
                options={options}
                label={''}
                placeholder={placeholder}
                startAdornment={startAdornment}
                onChange={onChange}
                onInputChange={onInputChange}
                sx={sx}
                borderleft={borderleft}
                required={required}
                noOptionsText={noOptionsText}
                inputColor={inputColor}
                disabled={disabled}
                error={error}
                helperText={helperText}
            />
        </div>
    )
}

export default LabelAutocomplete;

const StyledInputLabel = styled(InputLabel, { shouldForwardProp: (p) => !['labelColor', 'inputColor', 'widthInput'].includes(p) })`
    color: ${(props) => (props.labelColor)};
    font-family: Roboto;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;

`;

const StyledAutocompleteCustomized = styled(AutocompleteCustomized)`
    /* En modo lectura va disabled y MUI pinta el valor a rgba(0,0,0,0.38), con
       lo que el dato queda más claro que el de los campos de al lado. */
    .MuiInputBase-input.Mui-disabled {
        -webkit-text-fill-color: #152C70;
        opacity: 1;
    }
    .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline {
        border-color: rgba(21, 44, 112, 0.25);
    }
`;