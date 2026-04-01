import styled from '@emotion/styled';
import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import ChildCareOutlined from '@mui/icons-material/ChildCareOutlined';
import ChevronRight from '@mui/icons-material/ChevronRight';

/**
 * @param {object} props
 * @param {object} props.baby — fila del listado (nombre, apellido, salaInternacion, idMadre, idBebe, etc.)
 */
const CardBaby = ({ baby }) => {
  const name =
    [baby?.nombre, baby?.apellido].filter(Boolean).join(' ').trim() || 'Sin nombre';
  const sala = baby?.salaInternacion?.trim() || 'Sin sala indicada';
  const idMadre = baby?.idMadre ?? baby?.id_madre;
  const to =
    idMadre != null && idMadre !== ''
      ? `/madre/perfil/${idMadre}`
      : '/madres';

  return (
    <StyledLink to={to}>
      <CardOuter>
        <IconWrap>
          <ChildCareOutlined sx={{ fontSize: 28, color: '#7A659B' }} />
        </IconWrap>
        <TextBlock>
          <Typography
            component="span"
            sx={{
              color: '#152C70',
              fontWeight: 600,
              fontSize: '1rem',
              lineHeight: 1.3,
              letterSpacing: '0.02em',
            }}
          >
            {name}
          </Typography>
          <Typography
            component="span"
            sx={{
              color: 'rgba(21, 44, 112, 0.72)',
              fontSize: '0.875rem',
              fontWeight: 400,
              mt: 0.5,
              display: 'block',
            }}
          >
            Sala: {sala}
          </Typography>
        </TextBlock>
        <ChevronRight sx={{ color: 'rgba(143, 0, 255, 0.55)', flexShrink: 0 }} />
      </CardOuter>
    </StyledLink>
  );
};

export default CardBaby;

const StyledLink = styled(Link)`
  text-decoration: none;
  display: block;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
`;

const CardOuter = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 14px;
  width: 100%;
  box-sizing: border-box;
  padding: 16px 18px;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 2px 12px rgba(21, 44, 112, 0.08);
  border: 1px solid rgba(143, 0, 255, 0.08);
  transition: box-shadow 0.2s ease, transform 0.15s ease;

  &:active {
    transform: scale(0.99);
    box-shadow: 0 1px 8px rgba(21, 44, 112, 0.1);
  }
`;

const IconWrap = styled('div')`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(145deg, rgba(216, 190, 255, 0.45) 0%, rgba(143, 0, 255, 0.12) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const TextBlock = styled('div')`
  flex: 1;
  min-width: 0;
`;
