import styled from '@emotion/styled'
import { FormControl, FormHelperText, InputLabel } from '@mui/material'
import React from 'react'
import SelectCustomized from '../../atoms/select/SelectCustomized'

const LabelSelect = (props) => {
    const { id, labelColor, styleLabel, name, textDefault, list, onChange, value,
        classes, displayEmpty, labelId, label, placeholder, placeholderColor, sx, required, disabled, helperText, error, } = props;

    return (
        <div>
            <StyledInputLabel
                htmlFor={id}
                labelColor={labelColor}
                style={styleLabel}
                id={labelId}
                required={Boolean(required)}
                disabled={disabled}
                error={Boolean(error)}
            >
                {label}
            </StyledInputLabel>
            <FormControl
                fullWidth
                required={Boolean(required)}
                error={Boolean(error)}
                disabled={disabled}
            >
                <StyledSelectCustomized
                    name={name}
                    textDefault={textDefault}
                    list={list}
                    onChange={onChange}
                    value={value}
                    classes={classes}
                    displayEmpty={displayEmpty}
                    labelId={labelId}
                    placeholder={placeholder}
                    placeholderColor={placeholderColor}
                    sx={sx}
                    required={required}
                    disabled={disabled}
                    error={error}
                />
                {helperText ? (
                    <FormHelperText
                        error={Boolean(error)}
                        sx={error ? { color: '#d32f2f', marginLeft: 0 } : { marginLeft: 0 }}
                    >
                        {helperText}
                    </FormHelperText>
                ) : null}
            </FormControl>
        </div>
    )
}

export default LabelSelect;

/* Misma etiqueta estática que LabelInput: fuera del FormControl para que MUI no
   la flote sobre el notchedOutline, donde tapaba el borde del combo. */
const StyledInputLabel = styled(InputLabel, { shouldForwardProp: (p) => !['labelColor', 'inputColor', 'widthInput'].includes(p) })`
    color: ${(props) => (props.labelColor)};
    font-family: Roboto;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`;

const StyledSelectCustomized = styled(SelectCustomized)`
    /* En modo lectura el select va disabled y MUI pinta el valor a
       rgba(0,0,0,0.38): el dato queda más claro que el de los TextField de al
       lado, que sí reciben este tratamiento. */
    &.Mui-disabled,
    .MuiSelect-select.Mui-disabled {
        -webkit-text-fill-color: #152C70;
        color: #152C70;
        opacity: 1;
    }
    &.Mui-disabled .MuiOutlinedInput-notchedOutline {
        border-color: rgba(21, 44, 112, 0.25);
    }
`;