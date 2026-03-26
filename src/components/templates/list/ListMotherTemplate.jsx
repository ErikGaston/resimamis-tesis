import React, { useEffect } from 'react'
import { Button, IconButton } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import TitleText from '../../atoms/titleText/TitleText';
import styled from '@emotion/styled';
import CardIcon from '../../molecules/cardIcon/CardIcon';
import { Link, useNavigate } from 'react-router-dom';
import imagePNG from "../../../assets/voluntarias/person1.png";
import AddCircleIcon from '@mui/icons-material/AddCircle';

const ListMotherTemplate = (props) => {
    const { mothers } = props;
    const navigate = useNavigate();
    const [listMothers, setListMothers] = React.useState(null)

    const functionBack = () => {
        navigate(-1)
    }

    useEffect(() => {
        if (mothers) {
            mothers?.forEach(item => {
                item.whatsapp = `https://wa.me/${item.celular}?text=Hola,%20¿cómo%20estás%3F`
                item.imgPerfil = imagePNG;
            })

            mothers?.sort((a, b) => {
                const nombreA = a.nombre.toUpperCase();
                const nombreB = b.nombre.toUpperCase();

                return nombreA.localeCompare(nombreB);
            });

            setListMothers(mothers);
        }
    }, [mothers]);


    return (
        <div style={{ height: '100%' }}>
            <div style={{ display: 'flex', backgroundColor: '#8F00FF' }}>
                <IconButton onClick={functionBack}>
                    <HighlightOffIcon style={{ color: 'white' }} />
                </IconButton>
                <TitleText fontsize={'20px'} style={{ width: '85%' }}>MADRES</TitleText>
            </div>
            <ContainerList>
                {listMothers?.map((item) => (
                    <CardIcon
                        id={item.idMadre}
                        img={item.imgPerfil}
                        name={item.nombre + " " + item.apellido}
                        dni={item.dni}
                        whatsapp={item.whatsapp}
                        context={'madre'}
                    />
                ))}
                <StyledIconButton to={'/madre'}>
                    <AddCircleIcon style={{ color: '8F00FF', fontSize: '50px', filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.25))' }} />
                </StyledIconButton>
            </ContainerList>
        </div>
    )
}

export default ListMotherTemplate;

const ContainerList = styled('div')`
    display:flex;
    flex-direction:column;
    align-items:center;

    padding-bottom:70px;
`;



const StyledIconButton = styled(Link)`
    position: fixed;
    bottom: 14%; /* Espacio desde la parte inferior */
    left: 44%; /* Centrar horizontalmente */
    transform: translateX(-50%); /* Centrar horizontalmente */
    width: 1px;
    height: 1px;
`;