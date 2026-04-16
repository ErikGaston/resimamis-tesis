import React from "react";
import CauroselSecundary from "../../molecules/CauroselSecundary";
import { Box, Typography } from "@mui/material";

const TITLE = "Voluntarias de hoy";

import styled from "@emotion/styled";

// const DATA_VOLUNTARIOS = [
//   {
//     name: "Marilina Aramayo",
//     url: imagePNG,
//   },
//   {
//     name: "Marilina Aramayo",
//     url: imagePNG,
//   },
//   {
//     name: "Marilina Aramayo",
//     url: imagePNG,
//   },
//   {
//     name: "Marilina Aramayo",
//     url: imagePNG,
//   },
//   {
//     name: "Marilina Aramayo",
//     url: imagePNG,
//   },
//   {
//     name: "Marilina Aramayo",
//     url: imagePNG,
//   },
//   {
//     name: "Marilina Aramayo",
//     url: imagePNG,
//   },
// ];

const VolutariasDisponible = ({ listVolunteersFree }) => {
  
  return (
    <StyledVolutariasDisponible>
      {
        (listVolunteersFree && listVolunteersFree?.length !== 0) ?
          <>
            <Typography className="title-voluntarias" >{TITLE}</Typography>
            <CauroselSecundary data={listVolunteersFree} />
          </>
          :
          <Typography className="title-voluntarias" >¡No se encontraron voluntarias con asistencia registrada en este momento!</Typography>
      }

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
