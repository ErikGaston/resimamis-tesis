import PropTypes from 'prop-types'
import { TextField } from '@mui/material'
import React from 'react'

const TextfieldCustomized = (props) => {
    const { id, required, label, defaultValue, value, type, name, className, fullWidth, autoComplete, onChange, multiline, helperText } = props

    return (
        <TextField
            variant='outlined'
            required={required}
            id={id}
            label={label}
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
            {...props}
        />
    )
}

export default TextfieldCustomized

TextfieldCustomized.propTypes = {
    value: PropTypes.any,
    id: PropTypes.string,
    required: PropTypes.bool,
    label: PropTypes.string,
    defaultValue: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    variant: PropTypes.string,
    className: PropTypes.string,
    fullWidth: PropTypes.bool,
    autoComplete: PropTypes.string,
    onChange: PropTypes.func,
    inputProps: PropTypes.object,
    multiline: PropTypes.bool,
    helperText: PropTypes.string,

}

