import React from 'react'
import BadgeIcon from '@mui/icons-material/Badge';
import whatsappImg from '../../../assets/list/whatsapp.png';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

const CardIcon = ({ id, img, name, dni, whatsapp, context }) => {

    const handleWhatsappClick = (event) => {
        // Aquí puedes definir la lógica para abrir WhatsApp
        event.stopPropagation(); // Detener la propagación del evento al contenedor principal
        window.open(whatsapp, '_blank');
    };

    return (
        <ContainerCard>
            <StyledImage src={img} />
            <StyledLink to={'/' + context + '/perfil/' + id} style={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
                <TitleName>{name}</TitleName>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <BadgeIcon style={{ marginRight: '5px' }} />
                    <SubtitleDni>
                        {dni}
                    </SubtitleDni>
                </div>
            </StyledLink>
            <StyledWhatsapp src={whatsappImg} onClick={handleWhatsappClick} />
        </ContainerCard>
    )
}

export default CardIcon;

const StyledImage = styled('img')`
    width:60px;
    height:60px;
`;

const ContainerCard = styled('div')`
    width: 300px;
    padding: 5px;
    display:flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    margin: 10px 0;
    
    border-radius: 5px;
    background: #FFF;
    box-shadow: 3px 3px 10px 0px rgba(0, 0, 0, 0.25);

`;

const TitleName = styled('h3')`
    color: #152C70;
    font-family: Roboto;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 0.8px;

    margin: 10px 0;

`;

const SubtitleDni = styled('h3')`
    color: #152C70;
    font-family: Roboto;
    font-size: 14px;
    font-style: normal;
    font-weight: 300;
    line-height: normal;
    letter-spacing: 0.7px;
    margin: 0 0 0 0;

`;

const StyledWhatsapp = styled('img')`
    display: flex;
    width: 40px;
    height: 40px;
    justify-content: center;
    align-items: center;
`;

const StyledLink = styled(Link)`
    text-decoration:none;
`;
