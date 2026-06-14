import styled from "@emotion/styled";
import { Avatar, Box, Typography } from "@mui/material";
import React from "react";

const AVATAR_COLORS = ['#7A659B', '#6A1B9A', '#8F00FF', '#152C70', '#4A148C', '#A54DFF', '#00695C'];

function getInitials(name) {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function nameToColor(name) {
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

const CardCarouselSecundary = ({
  name = "nombre",
  isFirst = false,
}) => {
  return (
    <StyledCardCarouselSecundary isFirst={isFirst}>
      <Avatar
        alt={name}
        sx={{
          width: 70,
          height: 70,
          borderRadius: '10px',
          bgcolor: nameToColor(name),
          fontSize: '1.35rem',
          fontWeight: 700,
          fontFamily: 'Roboto',
          border: '2px solid rgba(143,0,255,0.18)',
          flexShrink: 0,
        }}
      >
        {getInitials(name)}
      </Avatar>
      <Typography className="title" variant="caption">
        {name}
      </Typography>
    </StyledCardCarouselSecundary>
  );
};

export default CardCarouselSecundary;

const StyledCardCarouselSecundary = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 70px;
  margin-left: ${(props) => (props.isFirst ? "25px" : "0")};
  .title {
    color: #152c70;
    font-family: Roboto;
    font-size: 10px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 0.8px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    margin-top: 5px;
  }
`;
