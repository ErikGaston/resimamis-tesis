import React from "react";
import { Box, Typography } from "@mui/material";


import bebe from "../../../assets/home/carousel-work/bebe-home.png";
import mama from "../../../assets/home/carousel-work/mama-home.png";
import voluntaria from "../../../assets/home/carousel-work/voluntaria-home.png";
import insumo from "../../../assets/home/carousel-work/insumo-home.png";

import styled from "@emotion/styled";
import CarouselWork from "../../molecules/carouselWork/CarouselWork";

const DATA_TRABAJO = [
    {
        name: "Mamás",
        image: mama,
        url: '/madres'
    },
    {
        name: "Bebés",
        image: bebe,
        url: '/bebes'
    },
    {
        name: "Voluntarias",
        image: voluntaria,
        url: '/voluntarias'
    },
    {
        name: "Insumos",
        image: insumo,
        url: '/insumos'
    },
];

const VolutariasDisponible = () => {

    const TITLE = 'Panel de trabajo';

    return (
        <StyledVolutariasDisponible>
            <Typography className="title-voluntarias" >{TITLE}</Typography>
            <CarouselWork
                data={DATA_TRABAJO}
            />
        </StyledVolutariasDisponible>
    );
};

export default VolutariasDisponible;

const StyledVolutariasDisponible = styled(Box)`
  .title-voluntarias {
    color: #152c70;
    font-family: Roboto;
    font-size: 20px;
    margin-left:25px; 
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    letter-spacing: 1px;
    margin-bottom:10px 
  }
`;
