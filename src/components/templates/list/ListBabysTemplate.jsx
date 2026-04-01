import styled from '@emotion/styled';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ChildCareOutlined from '@mui/icons-material/ChildCareOutlined';
import { Box, Fab, IconButton, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CardBaby from '../../molecules/cardBaby/CardBaby';

const ListBabysTemplate = (props) => {
  const { babys } = props;
  const navigate = useNavigate();
  const [listBabys, setListBabys] = React.useState(null);

  const functionBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (!babys || !Array.isArray(babys)) {
      setListBabys(null);
      return;
    }
    const sorted = [...babys].sort((a, b) => {
      const nombreA = (a?.nombre ?? '').toUpperCase();
      const nombreB = (b?.nombre ?? '').toUpperCase();
      return nombreA.localeCompare(nombreB);
    });
    setListBabys(sorted);
  }, [babys]);

  const listadoCargado = babys != null;
  const sinResultados = listadoCargado && Array.isArray(babys) && babys.length === 0;

  return (
    <PageWrap>
      <HeaderBar>
        <IconButton
          onClick={functionBack}
          aria-label="Volver"
          sx={{
            color: '#fff',
            p: 1,
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.12)' },
          }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 20 }} />
        </IconButton>
        <Typography
          component="h1"
          sx={{
            flex: 1,
            textAlign: 'center',
            color: '#fff',
            fontWeight: 600,
            fontSize: '1.05rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            pr: '40px',
            textShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          Bebés
        </Typography>
      </HeaderBar>

      <ContentScroll>
        {listBabys?.length ? (
          <ListStack>
            {listBabys.map((item, index) => (
              <CardBaby key={item?.idBebe ?? item?.id ?? index} baby={item} />
            ))}
          </ListStack>
        ) : sinResultados ? (
          <EmptyState>
            <ChildCareOutlined sx={{ fontSize: 56, color: 'rgba(122, 101, 155, 0.5)', mb: 1 }} />
            <Typography sx={{ color: '#152C70', fontWeight: 600, textAlign: 'center' }}>
              No hay bebés registrados
            </Typography>
            <Typography
              sx={{
                color: 'rgba(21, 44, 112, 0.65)',
                fontSize: '0.9rem',
                textAlign: 'center',
                mt: 0.5,
                maxWidth: 280,
              }}
            >
              Podés dar de alta un bebé desde la ficha de una madre.
            </Typography>
          </EmptyState>
        ) : null}
      </ContentScroll>

      <Fab
        component={Link}
        to="/madre"
        color="primary"
        aria-label="Registrar bebé"
        sx={{
          position: 'fixed',
          bottom: 'calc(3.75rem + 20px)',
          right: 20,
          zIndex: 8,
          width: 56,
          height: 56,
          background: 'linear-gradient(135deg, #A54DFF 0%, #8F00FF 100%)',
          boxShadow: '0 6px 20px rgba(143, 0, 255, 0.35)',
          '&:hover': {
            background: 'linear-gradient(135deg, #B55DFF 0%, #9F10FF 100%)',
          },
        }}
      >
        <AddCircleIcon sx={{ fontSize: 32 }} />
      </Fab>
    </PageWrap>
  );
};

export default ListBabysTemplate;

const PageWrap = styled(Box)`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: linear-gradient(180deg, #f3f0ff 0%, #faf8fc 32%, #ffffff 100%);
`;

const HeaderBar = styled(Box)`
  display: flex;
  align-items: center;
  background: linear-gradient(90deg, #8f00ff 0%, #a54dff 55%, #c18aff 100%);
  padding: 8px 4px 10px;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 4px 14px rgba(143, 0, 255, 0.22);
`;

const ContentScroll = styled(Box)`
  flex: 1;
  padding: 16px 16px 120px;
  box-sizing: border-box;
  width: 100%;
`;

const ListStack = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
`;

const EmptyState = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  min-height: 40vh;
`;
