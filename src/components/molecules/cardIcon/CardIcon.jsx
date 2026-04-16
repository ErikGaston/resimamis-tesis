import React from 'react';
import BadgeIcon from '@mui/icons-material/Badge';
import GroupsOutlined from '@mui/icons-material/GroupsOutlined';
import PersonOutline from '@mui/icons-material/PersonOutline';
import whatsappImg from '../../../assets/list/whatsapp.png';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { Box, IconButton } from '@mui/material';

const AVATAR_BY_CONTEXT = {
  madre: PersonOutline,
  voluntaria: GroupsOutlined,
};

const CardIcon = ({ id, name, dni, whatsapp, context }) => {
  const profilePath = `/${context}/perfil/${id}`;
  const dniLabel = dni != null ? String(dni) : '';
  const AvatarIcon = AVATAR_BY_CONTEXT[context] ?? PersonOutline;

  return (
    <ContainerCard as="article" aria-label={`${name}, DNI ${dniLabel}`}>
      <IconWrap aria-hidden>
        <AvatarIcon sx={{ fontSize: 28, color: '#7A659B' }} />
      </IconWrap>
      <StyledLink to={profilePath} aria-label={`Ver perfil de ${name}`}>
        <TitleName>{name}</TitleName>
        <DniRow>
          <BadgeIcon sx={{ mr: '5px', color: '#5c4d96', fontSize: '1.125rem' }} aria-hidden />
          <SubtitleDni as="span">DNI {dniLabel}</SubtitleDni>
        </DniRow>
      </StyledLink>
      <IconButton
        component="a"
        href={whatsapp}
        aria-label={`Enviar mensaje de WhatsApp a ${name}`}
        rel="noopener noreferrer"
        target="_blank"
        sx={{
          p: 1,
          minWidth: 48,
          minHeight: 48,
          borderRadius: 2,
          flexShrink: 0,
        }}
      >
        <img src={whatsappImg} alt="" width={40} height={40} />
      </IconButton>
    </ContainerCard>
  );
};

export default CardIcon;

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

/** Mismas medidas que `CardBaby` (`CardOuter`) para listados uniformes. */
const ContainerCard = styled(Box)`
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

const TitleName = styled('span')`
  display: block;
  color: #152c70;
  font-family: Roboto, sans-serif;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: 0.02em;
  margin: 0;
`;

const DniRow = styled('div')`
  display: flex;
  align-items: center;
  margin-top: 4px;
`;

const SubtitleDni = styled('span')`
  color: rgba(21, 44, 112, 0.88);
  font-family: Roboto, sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: 0.02em;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 8px;
  outline: none;
  &:focus-visible {
    box-shadow: 0 0 0 3px rgba(143, 0, 255, 0.45);
  }
`;
