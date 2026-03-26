import React from "react";
import CardCarrucelSecundary from "../atoms/CardCarouselSecundary";
import { ScrollingCarousel } from "@trendyol-js/react-carousel";
import { Box } from "@mui/material";
import styled from "@emotion/styled";

const CauroselSecundary = ({ data = [] }) => {
  return (
    <ScrollingCarousel>
      <StyledCards>
        {data.map((card, i) => {
          const { url, name, label } = card;
          return (
            <CardCarrucelSecundary
              key={i}
              label={label}
              name={name}
              image={url}
              isFirst={i === 0}
            />
          );
        })}
      </StyledCards>
    </ScrollingCarousel>
  );
};

export default CauroselSecundary;

const StyledCards = styled(Box)`
  display:flex;
  justify-content:center;
  gap:5px
`;



