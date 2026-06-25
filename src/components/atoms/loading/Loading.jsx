import React from 'react'
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import CircularProgress from '@mui/material/CircularProgress';

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const pulse = keyframes`
  0%   { transform: scale(1);    opacity: 0.6; }
  50%  { transform: scale(1.15); opacity: 0.25; }
  100% { transform: scale(1);    opacity: 0.6; }
`;

const ContainerLoading = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100dvh;
  width: 100%;
  z-index: 9999;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${fadeIn} 0.18s ease-in;
  }
`;

const ContainerSpinner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 14px;
  height: 100%;
  width: 100%;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(14px) saturate(1.3);
  -webkit-backdrop-filter: blur(14px) saturate(1.3);
`;

const SpinnerWrap = styled.div`
  position: relative;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PulseRing = styled.div`
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  border: 2px solid rgba(122, 101, 155, 0.35);

  @media (prefers-reduced-motion: no-preference) {
    animation: ${pulse} 1.6s ease-in-out infinite;
  }
`;

const LoadingText = styled.span`
  color: #7A659B;
  font-size: 0.8125rem;
  font-family: 'Roboto', 'Open Sans', sans-serif;
  font-weight: 500;
  letter-spacing: 0.07em;
  opacity: 0.85;
`;

const Loading = () => {
  return (
    <ContainerLoading>
      <ContainerSpinner>
        <SpinnerWrap>
          <PulseRing />
          <CircularProgress sx={{ color: '#7A659B', width: '44px !important', height: '44px !important' }} />
        </SpinnerWrap>
        <LoadingText>Cargando…</LoadingText>
      </ContainerSpinner>
    </ContainerLoading>
  );
};

export default Loading;
