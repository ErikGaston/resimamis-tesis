import React from 'react'
import styled from '@emotion/styled'
import { InputLabel } from '@mui/material'
import DatePickerCustomized from '../../atoms/datePicker/DatePickerCustomized'

const LabelDate = (props) => {
    const { id, required, label, value, onChange, helperText, labelColor, inputColor, styleLabel, inputFormat, inputPropsTextfield, disabled } = props

    return (
        <div>
            <StyledInputLabel htmlFor={id} labelColor={labelColor} style={styleLabel}>{label}</StyledInputLabel>
            <StyledDatePickerCustomized
                label={''}
                value={value}
                onChange={onChange}
                inputFormat={inputFormat}
                inputPropsTextfield={inputPropsTextfield}
                helperText={helperText}
                error={false}
                required={required}
                inputColor={inputColor}
                disabled={disabled}
            />
        </div>
    )
}

export default LabelDate;

const StyledInputLabel = styled(InputLabel)`
    color: ${(props) => (props.labelColor)};
    font-family: Roboto;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;

`;

const StyledDatePickerCustomized = styled(DatePickerCustomized)`
    width:100%;
    border-radius: 10px;
    border: 1.5px solid #FFF;
    margin:10px 0;
    
    div{
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