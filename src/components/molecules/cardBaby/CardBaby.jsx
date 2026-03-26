import styled from '@emotion/styled';
import React from 'react';
import { Link } from 'react-router-dom';
import badgeIcon from '../../../assets/babys/location.png';

const CardBaby = ({ id, name, salaInternacion }) => {
    return (
        <ContainerCard>
            <StyledLink to={'/voluntaria/perfil/' + id}>
                <TitleName>{name}</TitleName>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IconImg src={badgeIcon} alt="Badge icon" />
                    <SubtitleDni>{salaInternacion}</SubtitleDni>
                </div>
            </StyledLink>
        </ContainerCard>
    )
}

export default CardBaby;

const ContainerCard = styled('div')`
    width: 300px;
    padding: 10px 25px;
    display:flex;
    flex-direction: row;
    gap: 10px;
    border-radius: 5px;
    background: #FFFFFF;
    box-shadow: 3px 3px 10px 0px rgba(0, 0, 0, 0.25);
`;

const TitleName = styled('p')`
    color: #152C70;
    font-family: Roboto;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 0.8px;
    margin: 0px;
`;

const SubtitleDni = styled('h3')`
    color: #152C70;
    font-family: Roboto;
    font-size: 14px;
    font-style: normal;
    font-weight: 300;
    line-height: normal;
    letter-spacing: 0.7px;
    margin: 0px;
`;

const StyledLink = styled(Link)`
    text-decoration:none;
    display: flex;
    flex-direction: column;
    gap:10px
`;


const IconImg = styled('img')`
    margin-right: 5px;
`;