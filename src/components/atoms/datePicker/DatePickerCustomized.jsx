import React, { useState } from 'react'
import styled from '@emotion/styled';
import { TextField } from '@mui/material'
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/es'

const DatePickerCustomized = (props) => {
    const { label, inputFormat, value, onChange, inputProps, sx, inputPropsTextfield, disabled, minDate, maxDate, error, helperText, disableFuture, shouldDisableDate, defaultCalendarMonth, ...other } = props;
    const [open, setOpen] = useState(false);

    const helperColorSx =
        error && helperText ? { sx: { color: '#d32f2f', marginLeft: 0 } } : undefined;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'es'}>
            <MobileDatePicker
                label={label}
                inputFormat={inputFormat}
                value={value}
                onChange={onChange}
                minDate={minDate}
                maxDate={maxDate}
                disableFuture={disableFuture}
                shouldDisableDate={shouldDisableDate}
                defaultCalendarMonth={defaultCalendarMonth}
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
                        FormHelperTextProps={helperColorSx}
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