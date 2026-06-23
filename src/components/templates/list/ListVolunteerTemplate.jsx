import styled from '@emotion/styled';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Fab, InputAdornment, Skeleton, TextField, Typography } from '@mui/material';
import { PageHeader } from '../../common/PageHeader';
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import CardIcon from '../../molecules/cardIcon/CardIcon';
import { fabRightInsetInColumn } from '../../../helpers/const/appLayout';
import { fabBottomAboveNav, listSearchTextFieldSx } from '../../../utils/listScreenAccessibility';

function volunteerMatchesQuery(volunteer, rawQuery) {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return true;
  const nombre = (volunteer?.nombre ?? '').toLowerCase();
  const apellido = (volunteer?.apellido ?? '').toLowerCase();
  const full = `${nombre} ${apellido}`.trim();
  const dniStr = volunteer?.dni != null ? String(volunteer.dni) : '';
  const qDigits = q.replace(/\D/g, '');
  const dniDigits = dniStr.replace(/\D/g, '');
  if (full.includes(q) || nombre.includes(q) || apellido.includes(q)) return true;
  if (qDigits.length > 0 && dniDigits.includes(qDigits)) return true;
  if (dniStr.toLowerCase().includes(q)) return true;
  return false;
}

const SkeletonCard = () => (
  <Box sx={{
    display: 'flex', alignItems: 'center', gap: 2, p: 2,
    borderRadius: 2, bgcolor: '#fff',
    boxShadow: '0 2px 12px rgba(21,44,112,0.06)',
    border: '1px solid rgba(143,0,255,0.06)',
  }}>
    <Skeleton variant="rounded" width={48} height={48} sx={{ borderRadius: '14px', flexShrink: 0 }} />
    <Box sx={{ flex: 1 }}>
      <Skeleton variant="text" width="55%" height={20} />
      <Skeleton variant="text" width="38%" height={16} sx={{ mt: 0.5 }} />
    </Box>
    <Skeleton variant="circular" width={24} height={24} sx={{ flexShrink: 0 }} />
  </Box>
);

const ListVolunteerTemplate = (props) => {
  const { volunteers, isCoordinator, onDeleteVolunteer } = props;
  const [listVolunteers, setListVolunteers] = React.useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (volunteers == null) {
      setListVolunteers(null);
      return;
    }
    if (!Array.isArray(volunteers) || volunteers.length === 0) {
      setListVolunteers([]);
      return;
    }
    const enriched = [...volunteers].map((item) => ({
      ...item,
      whatsapp: `https://wa.me/${item.celular}?text=Hola,%20¿cómo%20estás%3F`,
    }));

    enriched.sort((a, b) => {
      const nombreA = (a.nombre ?? '').toUpperCase();
      const nombreB = (b.nombre ?? '').toUpperCase();
      return nombreA.localeCompare(nombreB);
    });

    setListVolunteers(enriched);
  }, [volunteers]);

  const filteredVolunteers = useMemo(() => {
    if (!listVolunteers?.length) return null;
    return listVolunteers.filter((v) => volunteerMatchesQuery(v, searchQuery));
  }, [listVolunteers, searchQuery]);

  const isLoading = volunteers === null;
  const isEmpty = Array.isArray(volunteers) && volunteers.length === 0;
  const sinCoincidenciasBusqueda = Boolean(
    listVolunteers?.length && searchQuery.trim() && filteredVolunteers && filteredVolunteers.length === 0,
  );

  return (
    <PageRoot>
      <PageHeader title="Voluntarias" />
      <SearchWrap>
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar por nombre, apellido o DNI"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          id="search-volunteers"
          name="buscar-voluntarias"
          aria-label="Buscar voluntaria por nombre, apellido o DNI"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#8F00FF' }} aria-hidden />
              </InputAdornment>
            ),
          }}
          sx={listSearchTextFieldSx}
        />
      </SearchWrap>
      <ContainerList component="section">
        {isLoading ? (
          <ListStack>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </ListStack>
        ) : filteredVolunteers?.length ? (
          <ListStack>
            {filteredVolunteers.map((item) => (
              <CardIcon
                key={item.idVoluntaria}
                id={item.idVoluntaria}
                name={`${item.nombre} ${item.apellido}`}
                dni={item.dni}
                whatsapp={item.whatsapp}
                context="voluntaria"
                onAdminDelete={
                  isCoordinator && onDeleteVolunteer
                    ? () => onDeleteVolunteer(item.idVoluntaria)
                    : undefined
                }
              />
            ))}
          </ListStack>
        ) : sinCoincidenciasBusqueda ? (
          <EmptyState>
            <GroupOutlinedIcon sx={{ fontSize: 56, color: 'rgba(122,101,155,0.45)', mb: 1 }} />
            <Typography sx={{ color: '#152C70', fontWeight: 600, textAlign: 'center' }}>
              No se encontraron voluntarias con ese criterio
            </Typography>
            <Typography sx={{ color: 'rgba(21,44,112,0.6)', fontSize: '0.9rem', textAlign: 'center', mt: 0.5, maxWidth: 300 }}>
              Probá con otro nombre o DNI.
            </Typography>
          </EmptyState>
        ) : isEmpty ? (
          <EmptyState>
            <GroupOutlinedIcon sx={{ fontSize: 56, color: 'rgba(122,101,155,0.45)', mb: 1 }} />
            <Typography sx={{ color: '#152C70', fontWeight: 600, textAlign: 'center' }}>
              No hay voluntarias registradas
            </Typography>
            <Typography sx={{ color: 'rgba(21,44,112,0.6)', fontSize: '0.9rem', textAlign: 'center', mt: 0.5, maxWidth: 300 }}>
              Podés dar de alta una voluntaria desde el botón +.
            </Typography>
          </EmptyState>
        ) : null}
      </ContainerList>
      <Fab
        component={Link}
        to="/voluntaria"
        color="primary"
        aria-label="Registrar nueva voluntaria"
        sx={{
          position: 'fixed',
          right: fabRightInsetInColumn,
          bottom: fabBottomAboveNav,
          zIndex: 9,
          width: 56,
          height: 56,
          background: 'linear-gradient(135deg, #A54DFF 0%, #8F00FF 100%)',
          boxShadow: '0 6px 20px rgba(143, 0, 255, 0.35)',
          '&:hover': { background: 'linear-gradient(135deg, #B55DFF 0%, #9F10FF 100%)' },
          '&:focus-visible': { outline: '3px solid #FFEB3B', outlineOffset: 2 },
        }}
      >
        <AddCircleIcon sx={{ fontSize: 32, color: '#fff' }} />
      </Fab>
    </PageRoot>
  );
};

export default ListVolunteerTemplate;

const PageRoot = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  height: 100vh;
  height: 100dvh;
  max-height: 100vh;
  max-height: 100dvh;
  overflow: hidden;
`;

const SearchWrap = styled('div')`
  flex-shrink: 0;
  padding: 12px 16px 8px;
  background: linear-gradient(180deg, rgba(143, 0, 255, 0.06) 0%, transparent 100%);
`;

const ContainerList = styled(Box)`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 16px 16px 120px;
  width: 100%;
  box-sizing: border-box;
`;

const ListStack = styled('div')`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
  gap: 12px;
`;

const EmptyState = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  min-height: 40vh;
`;
