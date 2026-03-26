import React from "react";
import { ScrollingCarousel } from "@trendyol-js/react-carousel";
import { Box } from "@mui/material";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

const CarouselWork = ({ data }) => {

    return (
        <ScrollingCarousel>
            <StyledCards>
                {data?.map((card, i) => {
                    const { name, image, url } = card;
                    return (
                        <ContainerImage to={url}>
                            <StyledImage src={image} />
                        </ContainerImage>
                    );
                })}
            </StyledCards>
        </ScrollingCarousel>
    );
};

export default CarouselWork;

const StyledCards = styled(Box)`
  display:flex;
  justify-content:center;
  gap:5px;
  margin-left:25px;
`;

const ContainerImage = styled(Link)`
  display:flex;
  justify-content:center;
  gap:5px
`;

const StyledImage = styled('img')`
  display:flex;
  justify-content:center;
  gap:5px
`;
