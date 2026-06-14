import React from "react";
import { ScrollingCarousel } from "@trendyol-js/react-carousel";
import { Box, Typography } from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

const CarouselWork = ({ data }) => {
    return (
        <ScrollingCarousel>
            <StyledCards>
                {data?.map((card, i) => {
                    const { name, image, url, special } = card;
                    return (
                        <ContainerImage key={i} to={url}>
                            <Box sx={{ position: 'relative' }}>
                                {image ? (
                                    <StyledImage
                                        src={image}
                                        alt={name}
                                        style={{
                                            borderRadius: '10px',
                                            border: special ? '2.5px solid #8F00FF' : '2px solid transparent',
                                            boxShadow: special ? '0 2px 10px rgba(143,0,255,0.25)' : 'none',
                                        }}
                                    />
                                ) : (
                                    <IconBox special={special}>
                                        <AdminPanelSettingsIcon sx={{ fontSize: 36, color: special ? '#8F00FF' : '#7A659B' }} />
                                    </IconBox>
                                )}
                                {special && (
                                    <Box sx={{
                                        position: 'absolute',
                                        top: 4,
                                        right: 4,
                                        bgcolor: '#8F00FF',
                                        color: '#fff',
                                        borderRadius: '5px',
                                        px: 0.6,
                                        py: 0.15,
                                        fontSize: '8px',
                                        fontWeight: 800,
                                        lineHeight: 1.5,
                                        letterSpacing: '0.3px',
                                    }}>
                                        ★
                                    </Box>
                                )}
                            </Box>
                            <Typography sx={{
                                color: special ? '#8F00FF' : '#152C70',
                                fontSize: '10px',
                                textAlign: 'center',
                                mt: '5px',
                                fontWeight: special ? 700 : 400,
                                letterSpacing: '0.5px',
                                maxWidth: '70px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}>
                                {name}
                            </Typography>
                        </ContainerImage>
                    );
                })}
            </StyledCards>
        </ScrollingCarousel>
    );
};

export default CarouselWork;

const StyledCards = styled(Box)`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-left: 25px;
`;

const ContainerImage = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  text-decoration: none;
`;

const StyledImage = styled('img')`
  display: block;
  width: 70px;
  height: 70px;
  object-fit: contain;
`;

const IconBox = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  border-radius: 10px;
  background: ${({ special }) => special
    ? 'linear-gradient(135deg, rgba(143,0,255,0.1) 0%, rgba(143,0,255,0.18) 100%)'
    : 'rgba(21,44,112,0.06)'};
  border: ${({ special }) => special ? '2.5px solid #8F00FF' : '2px solid rgba(21,44,112,0.08)'};
  box-shadow: ${({ special }) => special ? '0 2px 10px rgba(143,0,255,0.25)' : 'none'};
`;
