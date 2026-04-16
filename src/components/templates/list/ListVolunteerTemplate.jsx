import styled from '@emotion/styled';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import SearchIcon from '@mui/icons-material/Search';
import { Fab, IconButton, InputAdornment, TextField, Typography, Box } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

const ListVolunteerTemplate = (props) => {
  const { volunteers } = props;
  const navigate = useNavigate();
  const [listVolunteers, setListVolunteers] = React.useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const functionBack = () => {
    navigate(-1);
  };

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

  const sinCoincidenciasBusqueda = Boolean(
    listVolunteers?.length && searchQuery.trim() && filteredVolunteers && filteredVolunteers.length === 0,
  );

  return (
    <div style={{ height: '100%' }}>
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
          id="list-volunteers-title"
          sx={{
            flex: 1,
            textAlign: 'center',
            color: '#fff',
            fontWeight: 600,
            fontSize: '1.15rem',
            letterSpacing: '0.04em',
            pr: '48px',
          }}
        >
          Voluntarias
        </Typography>
      </HeaderBar>
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
      <ContainerList component="section" aria-labelledby="list-volunteers-title">
        {filteredVolunteers?.length ? (
          <ListStack>
            {filteredVolunteers.map((item) => (
              <CardIcon
                key={item.idVoluntaria}
                id={item.idVoluntaria}
                name={`${item.nombre} ${item.apellido}`}
                dni={item.dni}
                whatsapp={item.whatsapp}
                context="voluntaria"
              />
            ))}
          </ListStack>
        ) : sinCoincidenciasBusqueda ? (
          <Typography sx={{ color: '#152C70', textAlign: 'center', px: 2, py: 3, maxWidth: 360 }}>
            No se encontraron voluntarias con ese criterio. Probá con otro nombre o DNI.
          </Typography>
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
    </div>
  );
};

export default ListVolunteerTemplate;

const HeaderBar = styled(Box)`
  display: flex;
  align-items: center;
  background: linear-gradient(90deg, #8f00ff 0%, #a54dff 100%);
  padding: 8px 4px 10px;
`;

const SearchWrap = styled('div')`
  padding: 12px 16px 8px;
  background: linear-gradient(180deg, rgba(143, 0, 255, 0.06) 0%, transparent 100%);
`;

const ContainerList = styled(Box)`
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
