import React from 'react'
import { Button } from '@mui/material';
import styled from '@emotion/styled';

const ButtonCustomized = (props) => {
    const { colorButton, colorText, variant, onClick, disabled, sx, style, children, type, ...other } = props;

    return (
        <StyledButton
            button={colorButton}
            text={colorText}
            variant={variant}
            onClick={onClick}
            disabled={disabled}
            sx={sx}
            style={style}
            type={type}
            {...other}
        >
            {children}
        </StyledButton>
    )
}

export default ButtonCustomized;

const StyledButton = styled(Button)`
      font-family: 'Roboto'; 
      text-transform:capitalize;
      background-color: ${props => props.button};
      color: ${props => props.text};
      :hover{
        background-color: ${props => props.button};
      }
`;

