import styled from '@emotion/styled';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { IconButton } from '@mui/material';
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import imagePNG from "../../../assets/voluntarias/person1.png";
import TitleText from '../../atoms/titleText/TitleText';
import CardBaby from '../../molecules/cardBaby/CardBaby';

const ListBabysTemplate = (props) => {
  const { babys } = props;
  const navigate = useNavigate();
  const [listBabys, setListBabys] = React.useState(null)

  const functionBack = () => {
    navigate(-1)
  }

  useEffect(() => {
    if (babys) {
      babys?.forEach(item => {
        item.whatsapp = `https://wa.me/${item.celular}?text=Hola,%20¿cómo%20estás%3F`
        item.imgPerfil = imagePNG;
      })

      babys?.sort((a, b) => {
        const nombreA = a.nombre.toUpperCase();
        const nombreB = b.nombre.toUpperCase();

        return nombreA.localeCompare(nombreB);
      });

      setListBabys(babys);
    }
  }, [babys]);

  return (
    <div style={{ height: '100%' }}>
      <div style={{ display: 'flex', backgroundColor: '#8F00FF' }}>
        <IconButton onClick={functionBack}>
          <HighlightOffIcon style={{ color: 'white' }} />
        </IconButton>
        <TitleText fontsize={'20px'} style={{ width: '100%' }}>BEBES</TitleText>
      </div>
      <ContainerListBabys>
        {listBabys?.map((item) => (
          <CardBaby
            id={item.idVoluntaria}
            name={item.nombre + " " + (item?.apellido ?? '')}
            salaInternacion={item?.salaInternacion}
          />
        ))}
        <StyledIconButton to={'/voluntaria'}>
          <AddCircleIcon style={{ color: '8F00FF', fontSize: '50px', filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.25))' }} />
        </StyledIconButton>
      </ContainerListBabys>
    </div>
  )
}

export default ListBabysTemplate;

const ContainerListBabys = styled('div')`
    display:flex;
    flex-direction:column;
    align-items:center;
    gap: 10px;
`;



const StyledIconButton = styled(Link)`
    position: fixed;
    bottom: 14%; /* Espacio desde la parte inferior */
    left: 44%; /* Centrar horizontalmente */
    transform: translateX(-50%); /* Centrar horizontalmente */
    width: 1px;
    height: 1px;
`;