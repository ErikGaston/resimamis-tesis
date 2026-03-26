import styled from '@emotion/styled';
import { Button } from '@mui/material'
import React from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const ButtonTextCheck = ({ children, onClick, check }) => {
    return (
        <StyledButton
            onClick={onClick}
            style={{ border: check ? '1px solid #8F00FF' : '1px solid #CECECE' }}
        >
            <Title>
                {children}
            </Title>
            <CheckCircleIcon style={{ color: check ? '#8F00FF' : '#CECECE', marginLeft: '10px' }} />
        </StyledButton>
    )
}

export default ButtonTextCheck;

const StyledButton = styled(Button)`
    flex: 0 0 calc(50% - 10px); /* 50% width with some spacing */
    box-sizing: border-box;

    text-transform: inherit;
    margin: 5px;
    
    padding: 5px 8px;

    border-radius: 10px;
    border: 1px solid #8F00FF;
    box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.25);

`;

const Title = styled('h3')`
    color: #8F00FF;
    font-family: Roboto;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 0.8px;
    width:80%;
`;