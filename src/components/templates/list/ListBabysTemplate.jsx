import styled from '@emotion/styled';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ChildCareOutlined from '@mui/icons-material/ChildCareOutlined';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import SearchIcon from '@mui/icons-material/Search';
import { Alert, Box, Button, Fab, InputAdornment, TextField, Typography } from '@mui/material';
import { PageHeader } from '../../common/PageHeader';
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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
  const {
    babys,
    isCoordinator,
    onDeleteBaby,
    onConsultarDniApi,
    babyByDniPayload,
  } = props;
  const [listBabys, setListBabys] = React.useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dniResultDismissed, setDniResultDismissed] = useState(true);

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

  useEffect(() => {
    setDniResultDismissed(true);
  }, [searchQuery]);

  useEffect(() => {
    if (babyByDniPayload != null) setDniResultDismissed(false);
  }, [babyByDniPayload]);

  const filteredBabys = useMemo(() => {
    if (!listBabys?.length) return null;
    return listBabys.filter((b) => babyMatchesQuery(b, searchQuery));
  }, [listBabys, searchQuery]);

  const isCoordinatorDniQuery =
    Boolean(isCoordinator && onConsultarDniApi) &&
    /^\d{6,}$/.test(searchQuery.trim());

  const handleConsultarDni = () => {
    const digits = searchQuery.trim().replace(/\D/g, '');
    if (digits) onConsultarDniApi?.(digits);
  };

  const dniResultBaby = babyByDniPayload?.data;
  const dniResultSuccess = babyByDniPayload?.success !== false;
  const showDniResult = babyByDniPayload != null && !dniResultDismissed;

  const listadoCargado = babys != null;
  const sinResultados = listadoCargado && Array.isArray(babys) && babys.length === 0;
  const sinCoincidenciasBusqueda =
    Boolean(listBabys?.length && searchQuery.trim() && filteredBabys && filteredBabys.length === 0);

  return (
    <PageWrap>
      <PageHeader title="Bebés" />

      <SearchWrap>
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar por nombre, apellido o DNI"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && isCoordinatorDniQuery) handleConsultarDni();
          }}
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

        {isCoordinatorDniQuery && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              maxWidth: 560,
              width: '100%',
              mx: 'auto',
              pt: 0.5,
            }}
          >
            <Button
              size="small"
              variant="text"
              endIcon={<ManageSearchIcon sx={{ fontSize: '15px !important' }} />}
              onClick={handleConsultarDni}
              sx={{
                fontSize: '0.72rem',
                color: '#7A659B',
                textTransform: 'none',
                py: 0,
                px: 0.5,
                minHeight: 'unset',
                '&:hover': { bgcolor: 'rgba(122, 101, 155, 0.08)' },
              }}
            >
              Consultar en el sistema
            </Button>
          </Box>
        )}
      </SearchWrap>

      {showDniResult && (
        <Box sx={{ maxWidth: 560, mx: 'auto', px: 2, pb: 1.5 }}>
          <Alert
            severity={dniResultSuccess && dniResultBaby ? 'success' : 'warning'}
            onClose={() => setDniResultDismissed(true)}
            sx={{ fontSize: '0.82rem', alignItems: 'flex-start' }}
          >
            {dniResultSuccess && dniResultBaby ? (
              <>
                <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.4 }}>
                  {[dniResultBaby.nombre, dniResultBaby.apellido].filter(Boolean).join(' ') || '—'}
                </Typography>
                <Typography variant="caption" component="div" sx={{ opacity: 0.85 }}>
                  DNI {dniResultBaby.Dni ?? dniResultBaby.dni ?? '—'}
                  {(dniResultBaby.sala?.nombre ?? dniResultBaby.nombreSala) ? ` · ${dniResultBaby.sala?.nombre ?? dniResultBaby.nombreSala}` : dniResultBaby.IdSala ? ` · Sala ${dniResultBaby.IdSala}` : ''}
                </Typography>
              </>
            ) : (
              <Typography variant="body2">
                {babyByDniPayload?.message ?? 'No se encontró ningún bebé con ese DNI.'}
              </Typography>
            )}
          </Alert>
        </Box>
      )}

      <ContentScroll>
        {filteredBabys?.length ? (
          <ListStack>
            {filteredBabys.map((item, index) => (
              <CardBaby
                key={item?.idBebe ?? item?.id ?? index}
                baby={item}
                onAdminDelete={
                  isCoordinator && onDeleteBaby
                    ? (idBebe) => onDeleteBaby(idBebe)
                    : undefined
                }
              />
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
  width: 100%;
  box-sizing: border-box;
  height: 100vh;
  height: 100dvh;
  max-height: 100vh;
  max-height: 100dvh;
  overflow: hidden;
  background: linear-gradient(180deg, #f3f0ff 0%, #faf8fc 32%, #ffffff 100%);
`;


const SearchWrap = styled(Box)`
  flex-shrink: 0;
  padding: 12px 16px 8px;
  background: linear-gradient(180deg, rgba(143, 0, 255, 0.06) 0%, transparent 100%);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
`;

const ContentScroll = styled(Box)`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
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
