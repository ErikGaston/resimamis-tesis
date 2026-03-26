import styled from "@emotion/styled";
import { Box, Typography } from "@mui/material";
import React from "react";

const CardCarouselWork = ({
    image = "",
    label = "img",
    name = "nombre",
    isFirst = false,
}) => {
    return (
        <StyledContainer isFirst={isFirst}>
            <img className="image" src={image} alt={label} />
            <Typography className="title" variant="caption">
                {name}
            </Typography>
        </StyledContainer>
    );
};

export default CardCarouselWork;

const StyledContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  width:70px;
  margin-left: ${(props) => (props.isFirst ? "25px" : "0")};
  .image {
    width: 70px;
    height: 70px;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    border-radius: 5px;
  }
  .title {
    color: #152c70;
    font-family: Roboto;
    font-size: 10px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 0.8px;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* Límite de 2 líneas */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align:center;
    justify-content:'center'
  }
`;
