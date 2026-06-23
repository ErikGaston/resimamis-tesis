import React from 'react'
import CheckIcon from '@mui/icons-material/Check';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import DialogCustomized from '../dialog/DialogCustomized';

const scaleIn = keyframes`
  from { transform: scale(0.55); opacity: 0; }
  to   { transform: scale(1);    opacity: 1; }
`;

const DialogSuccess = ({ message, open, setOpen, error }) => {
  return (
    <DialogCustomized
      open={open}
      setOpen={setOpen}
      content={
        <ContainerSpinner>
          <IconWrap error={error}>
            {error
              ? <PriorityHighIcon sx={{ fontSize: 48, color: '#ffa600' }} />
              : <CheckIcon sx={{ fontSize: 48, color: '#8F00FF' }} />
            }
          </IconWrap>
          <Title>{message}</Title>
        </ContainerSpinner>
      }
    />
  );
};

export default DialogSuccess;

const Title = styled('p')`
  font-size: 18px;
  font-family: Roboto, sans-serif;
  color: #152C70;
  text-align: center;
  margin: 0 0 28px;
  font-weight: 500;
  line-height: 1.4;
  padding: 0 8px;
`;

const IconWrap = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${({ error }) =>
    error ? 'rgba(255, 166, 0, 0.1)' : 'rgba(143, 0, 255, 0.08)'};
  border: 2px solid ${({ error }) =>
    error ? 'rgba(255, 166, 0, 0.25)' : 'rgba(143, 0, 255, 0.18)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${scaleIn} 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
`;

const ContainerSpinner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 32px 20px 0;
  min-height: 220px;
`;
