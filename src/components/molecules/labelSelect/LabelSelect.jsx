import styled from '@emotion/styled'
import { InputLabel } from '@mui/material'
import React from 'react'
import SelectCustomized from '../../atoms/select/SelectCustomized'

const LabelSelect = (props) => {
    const { id, labelColor, styleLabel, name, textDefault, list, onChange, value,
        classes, displayEmpty, labelId, label, placeholder, placeholderColor, sx, required, notched, disabled, other, } = props;

    return (
        <div>
            <StyledInputLabel htmlFor={id} labelColor={labelColor} style={styleLabel}>{label}</StyledInputLabel>
            <StyledSelectCustomized
                name={name}
                textDefault={textDefault}
                list={list}
                onChange={onChange}
                value={value}
                disable
                classes={classes}
                displayEmpty={displayEmpty}
                labelId={labelId}
                // label={label}
                placeholder={placeholder}
                placeholderColor={placeholderColor}
                sx={sx}
                required={required}
                notched={notched}
                disabled={disabled}
            />
        </div>
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