import React, { useState } from 'react'
import styled from '@emotion/styled';
import { Button, DialogActions, TextField } from '@mui/material'
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/es'

const DatePickerCustomized = (props) => {
    const { label, inputFormat, value, onChange, inputProps, sx, inputPropsTextfield, disabled, minDate, maxDate, error, helperText, ...other } = props;
    const [open, setOpen] = useState(false);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'es'}>
            <MobileDatePicker
                label={label}
                inputFormat={inputFormat}
                value={value}
                onChange={onChange}
                minDate={minDate}
                maxDate={maxDate}
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                inputProps={inputProps}
                {...other}
                disabled={disabled}
                renderInput={(params) =>
                    <TextCustom
                        {...params}
                        error={error}
                        helperText={helperText}
                        onClick={() => setOpen(true)}
                    />
                }
            />
        </LocalizationProvider>
    )
}

export default DatePickerCustomized;

const TextCustom = styled(TextField)`
    .MuiOutlinedInput-notchedOutline{
        border-color: #C2CFDB !important;
    }
`;