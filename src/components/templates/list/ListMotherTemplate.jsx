import React, { useEffect, useMemo, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import { Box, InputAdornment, Skeleton, TextField, Typography } from '@mui/material';
import { PageHeader } from '../../common/PageHeader';
import styled from '@emotion/styled';
import CardIcon from '../../molecules/cardIcon/CardIcon';
import { listSearchTextFieldSx } from '../../../utils/listScreenAccessibility';

function motherMatchesQuery(mother, rawQuery) {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return true;
  const nombre = (mother?.nombre ?? '').toLowerCase();
  const apellido = (mother?.apellido ?? '').toLowerCase();
  const full = `${nombre} ${apellido}`.trim();
  const dniStr = mother?.dni != null ? String(mother.dni) : '';
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

const ListMotherTemplate = (props) => {
  const { mothers, isCoordinator, onDeleteMother } = props;
  const [listMothers, setListMothers] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (mothers === null || mothers === undefined) {
      setListMothers(null);
      return;
    }
    if (!Array.isArray(mothers) || mothers.length === 0) {
      setListMothers([]);
      return;
    }
    const enriched = [...mothers].map((item) => ({
      ...item,
      whatsapp: `https://wa.me/${item.celular}?text=Hola,%20¿cómo%20estás%3F`,
    }));
    enriched.sort((a, b) =>
      (a.nombre ?? '').toUpperCase().localeCompare((b.nombre ?? '').toUpperCase()),
    );
    setListMothers(enriched);
  }, [mothers]);

  const filteredMothers = useMemo(() => {
    if (!listMothers?.length) return null;
    return listMothers.filter((m) => motherMatchesQuery(m, searchQuery));
  }, [listMothers, searchQuery]);

  const isLoading = mothers === null;
  const isEmpty = Array.isArray(mothers) && mothers.length === 0;
  const sinCoincidencias = Boolean(
    listMothers?.length && searchQuery.trim() && filteredMothers && filteredMothers.length === 0,
  );

  return (
    <PageRoot>
      <PageHeader title="Madres" />
      <SearchWrap>
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar por nombre, apellido o DNI"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          id="search-mothers"
          name="buscar-madres"
          aria-label="Buscar madre por nombre, apellido o DNI"
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

      <ContainerList component="section" aria-labelledby="list-mothers-title">
        {isLoading ? (
          <ListStack>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </ListStack>
        ) : filteredMothers?.length ? (
          <ListStack>
            {filteredMothers.map((item) => (
              <CardIcon
                key={item.idMadre}
                id={item.idMadre}
                name={`${item.nombre} ${item.apellido}`}
                dni={item.dni}
                whatsapp={item.whatsapp}
                context="madre"
                onAdminDelete={isCoordinator && onDeleteMother ? () => onDeleteMother(item.idMadre, `${item.nombre ?? ''} ${item.apellido ?? ''}`.trim()) : undefined}
              />
            ))}
          </ListStack>
        ) : sinCoincidencias ? (
          <EmptyState>
            <PeopleOutlineIcon sx={{ fontSize: 56, color: 'rgba(122,101,155,0.45)', mb: 1 }} />
            <Typography sx={{ color: '#152C70', fontWeight: 600, textAlign: 'center' }}>
              No se encontraron madres con ese criterio
            </Typography>
            <Typography sx={{ color: 'rgba(21,44,112,0.6)', fontSize: '0.9rem', textAlign: 'center', mt: 0.5, maxWidth: 300 }}>
              Probá con otro nombre o DNI.
            </Typography>
          </EmptyState>
        ) : isEmpty ? (
          <EmptyState>
            <PeopleOutlineIcon sx={{ fontSize: 56, color: 'rgba(122,101,155,0.45)', mb: 1 }} />
            <Typography sx={{ color: '#152C70', fontWeight: 600, textAlign: 'center' }}>
              No hay madres registradas
            </Typography>
            <Typography sx={{ color: 'rgba(21,44,112,0.6)', fontSize: '0.9rem', textAlign: 'center', mt: 0.5, maxWidth: 300 }}>
              Podés dar de alta una madre desde el menú principal.
            </Typography>
          </EmptyState>
        ) : null}
      </ContainerList>
    </PageRoot>
  );
};

export default ListMotherTemplate;

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
