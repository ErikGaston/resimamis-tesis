import styled from '@emotion/styled';
import { Box, Typography, Button } from '@mui/material';
import React from 'react'
import TitleText from '../../atoms/titleText/TitleText';
import { useNavigate } from 'react-router-dom';

const Modules = (props) => {
    const { nameVolunteer } = props;
    const navigate = useNavigate();

    const TITLE = `¡Hola ${nameVolunteer}!`

    const logout = () => {
        localStorage.clear();
        navigate('/login')
    }

    return (
        <>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                <Button style={{ textTransform: 'inherit' }}
                    onClick={logout}
                >
                    <TitleButton>
                        Cerrar sesión
                    </TitleButton>
                </Button>
            </div>
            <StyledModules>

                <TitleText style={{ color: '#152C70', fontWeight: 100 }}>{TITLE}</TitleText>
            </StyledModules>
        </>
    )
}

export default Modules



const StyledTitle = styled(Typography)`
    color: #152C70;
    text-align: center;
    font-family: Roboto;
    font-size: 28px;
    font-style: normal;
    font-weight: bold;
    line-height: normal;
    letter-spacing: 2.8px;
`;
const StyledModules = styled('div')`
    margin:60px 0;
`;

const TitleButton = styled('h3')`
    color: #8F00FF;
    font-family: Roboto;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 0.8px;
`;