import React from "react";
import CauroselSecundary from "../../molecules/CauroselSecundary";
import { Box, Skeleton, Typography } from "@mui/material";

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
  if (listVolunteersFree === null) {
    return (
      <StyledVolutariasDisponible>
        <Skeleton variant="text" width="55%" height={28} sx={{ ml: '25px', mb: '10px' }} />
        <Box sx={{ display: 'flex', gap: 2, px: '25px', overflow: 'hidden' }}>
          {[0, 1, 2, 3].map((i) => (
            <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.75, flexShrink: 0 }}>
              <Skeleton variant="circular" width={64} height={64} />
              <Skeleton variant="text" width={56} height={16} />
            </Box>
          ))}
        </Box>
      </StyledVolutariasDisponible>
    );
  }

  return (
    <StyledVolutariasDisponible>
      {(listVolunteersFree && listVolunteersFree?.length !== 0) ?
        <>
          <Typography className="title-voluntarias">{TITLE}</Typography>
          <CauroselSecundary data={listVolunteersFree} />
        </>
        :
        <Typography className="title-voluntarias">¡No se encontraron voluntarias con asistencia registrada en este momento!</Typography>
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
