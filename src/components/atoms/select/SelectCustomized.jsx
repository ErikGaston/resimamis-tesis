import styled from '@emotion/styled';
import { MenuItem, Select } from '@mui/material';
import React from 'react'

const SelectCustomized = (props) => {
    const { name, textDefault, list, onChange, value,
        classes, displayEmpty, labelId, label, placeholder, placeholderColor, sx, required, notched, disabled, other } = props;

    return (
        <StyledSelect
            name={name}
            labelId={labelId}
            label={label}
            sx={sx}
            displayEmpty={displayEmpty}
            value={value}
            onChange={onChange}
            classes={classes}
            MenuProps={{ classes: classes }}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            renderValue={
                value !== "" ? undefined : () => <span style={{ color: placeholderColor }}>{placeholder}</span>
            }
            notched={notched}
            {...other}
        >
            {
                textDefault &&
                <MenuItem value={""}>
                    <em>{textDefault}</em>
                </MenuItem>
            }
            {list?.map((item) => (
                <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
            ))
            }
        </StyledSelect >
    )
}

export default SelectCustomized;

const StyledSelect = styled(Select)`
    width:100%;
    border-radius: 10px;
    border: 1.5px solid #FFF;
    margin:10px 0;
    color:#152C70;
    
    svg {
        color: #C2CFDB;
    }
    
    .MuiOutlinedInput-notchedOutline{
        border-color: #C2CFDB !important;
        border: 2px solid #C2CFDB;
    } 
`;