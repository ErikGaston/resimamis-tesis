import React, { useEffect, useMemo, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, TextField, Typography, Box } from '@mui/material';
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

const ListMotherTemplate = (props) => {
  const { mothers, isCoordinator, onDeleteMother } = props;
  const [listMothers, setListMothers] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!mothers?.length) {
      setListMothers(null);
      return;
    }
    const enriched = [...mothers].map((item) => ({
      ...item,
      whatsapp: `https://wa.me/${item.celular}?text=Hola,%20¿cómo%20estás%3F`,
    }));

    enriched.sort((a, b) => {
      const nombreA = (a.nombre ?? '').toUpperCase();
      const nombreB = (b.nombre ?? '').toUpperCase();
      return nombreA.localeCompare(nombreB);
    });

    setListMothers(enriched);
  }, [mothers]);

  const filteredMothers = useMemo(() => {
    if (!listMothers) return null;
    return listMothers.filter((m) => motherMatchesQuery(m, searchQuery));
  }, [listMothers, searchQuery]);

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
        {filteredMothers?.length ? (
          <ListStack>
            {filteredMothers.map((item) => (
              <CardIcon
                key={item.idMadre}
                id={item.idMadre}
                name={`${item.nombre} ${item.apellido}`}
                dni={item.dni}
                whatsapp={item.whatsapp}
                context="madre"
                onAdminDelete={isCoordinator && onDeleteMother ? () => onDeleteMother(item.idMadre) : undefined}
              />
            ))}
          </ListStack>
        ) : listMothers?.length ? (
          <Typography sx={{ color: '#152C70', textAlign: 'center', px: 2, py: 3, maxWidth: 360 }}>
            No se encontraron madres con ese criterio. Probá con otro nombre o DNI.
          </Typography>
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

/** Mismo ritmo que la lista de bebés (`ListBabysTemplate`). */
const ListStack = styled('div')`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
  gap: 12px;
`;
