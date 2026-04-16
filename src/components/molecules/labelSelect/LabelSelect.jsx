import styled from '@emotion/styled'
import { FormControl, FormHelperText, InputLabel } from '@mui/material'
import React from 'react'
import SelectCustomized from '../../atoms/select/SelectCustomized'

const LabelSelect = (props) => {
    const { id, labelColor, styleLabel, name, textDefault, list, onChange, value,
        classes, displayEmpty, labelId, label, placeholder, placeholderColor, sx, required, notched, disabled, helperText, error, } = props;

    return (
        <FormControl fullWidth error={Boolean(error)} disabled={disabled} sx={{ margin: '10px 0' }}>
            <StyledInputLabel htmlFor={id} labelColor={labelColor} style={styleLabel} id={labelId}>{label}</StyledInputLabel>
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
                notched={notched}
                disabled={disabled}
                error={error}
            />
            {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
        </FormControl>
    )
}

export default LabelSelect;

const StyledInputLabel = styled(InputLabel)`
    color: ${(props) => (props.labelColor)};
    font-family: Roboto;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;

`;

const StyledSelectCustomized = styled(SelectCustomized)`
`;