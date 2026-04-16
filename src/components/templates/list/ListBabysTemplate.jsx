import styled from '@emotion/styled';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ChildCareOutlined from '@mui/icons-material/ChildCareOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Fab, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fabRightInsetInColumn } from '../../../helpers/const/appLayout';
import { fabBottomAboveNav, listSearchTextFieldSx } from '../../../utils/listScreenAccessibility';
import CardBaby from '../../molecules/cardBaby/CardBaby';

function babyMatchesQuery(baby, rawQuery) {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return true;
  const nombre = (baby?.nombre ?? '').toLowerCase();
  const apellido = (baby?.apellido ?? '').toLowerCase();
  const full = `${nombre} ${apellido}`.trim();
  const dniStr =
    baby?.dni != null ? String(baby.dni) : baby?.Dni != null ? String(baby.Dni) : '';
  const qDigits = q.replace(/\D/g, '');
  const dniDigits = dniStr.replace(/\D/g, '');
  if (full.includes(q) || nombre.includes(q) || apellido.includes(q)) return true;
  if (qDigits.length > 0 && dniDigits.includes(qDigits)) return true;
  if (dniStr.toLowerCase().includes(q)) return true;
  return false;
}

const ListBabysTemplate = (props) => {
  const { babys } = props;
  const navigate = useNavigate();
  const [listBabys, setListBabys] = React.useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredBabys = useMemo(() => {
    if (!listBabys?.length) return null;
    return listBabys.filter((b) => babyMatchesQuery(b, searchQuery));
  }, [listBabys, searchQuery]);

  const listadoCargado = babys != null;
  const sinResultados = listadoCargado && Array.isArray(babys) && babys.length === 0;
  const sinCoincidenciasBusqueda =
    Boolean(listBabys?.length && searchQuery.trim() && filteredBabys && filteredBabys.length === 0);

  return (
    <PageWrap>
      <HeaderBar>
        <IconButton
          onClick={functionBack}
          aria-label="Volver a la pantalla anterior"
          sx={{
            color: '#fff',
            minWidth: 48,
            minHeight: 48,
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.12)' },
          }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 22 }} />
        </IconButton>
        <Typography
          component="h1"
          sx={{
            flex: 1,
            textAlign: 'center',
            color: '#fff',
            fontWeight: 600,
            fontSize: '1.05rem',
            letterSpacing: '0.04em',
            pr: '48px',
            textShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          Bebés
        </Typography>
      </HeaderBar>

      <SearchWrap>
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar por nombre, apellido o DNI"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Buscar bebé"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#8F00FF' }} aria-hidden />
              </InputAdornment>
            ),
          }}
          sx={{
            maxWidth: 560,
            margin: '0 auto',
            ...listSearchTextFieldSx,
          }}
        />
      </SearchWrap>

      <ContentScroll>
        {filteredBabys?.length ? (
          <ListStack>
            {filteredBabys.map((item, index) => (
              <CardBaby key={item?.idBebe ?? item?.id ?? index} baby={item} />
            ))}
          </ListStack>
        ) : sinCoincidenciasBusqueda ? (
          <EmptyState>
            <ChildCareOutlined sx={{ fontSize: 56, color: 'rgba(122, 101, 155, 0.5)', mb: 1 }} />
            <Typography sx={{ color: '#152C70', fontWeight: 600, textAlign: 'center' }}>
              No se encontraron bebés con ese criterio
            </Typography>
            <Typography
              sx={{
                color: 'rgba(21, 44, 112, 0.65)',
                fontSize: '0.9rem',
                textAlign: 'center',
                mt: 0.5,
                maxWidth: 320,
              }}
            >
              Probá con otro nombre o DNI.
            </Typography>
          </EmptyState>
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
          bottom: fabBottomAboveNav,
          right: fabRightInsetInColumn,
          zIndex: 9,
          width: 56,
          height: 56,
          background: 'linear-gradient(135deg, #A54DFF 0%, #8F00FF 100%)',
          boxShadow: '0 6px 20px rgba(143, 0, 255, 0.35)',
          '&:hover': {
            background: 'linear-gradient(135deg, #B55DFF 0%, #9F10FF 100%)',
          },
          '&:focus-visible': { outline: '3px solid #FFEB3B', outlineOffset: 2 },
        }}
      >
        <AddCircleIcon sx={{ fontSize: 32, color: '#fff' }} />
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

const SearchWrap = styled(Box)`
  padding: 12px 16px 8px;
  background: linear-gradient(180deg, rgba(143, 0, 255, 0.06) 0%, transparent 100%);
  display: flex;
  justify-content: center;
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
