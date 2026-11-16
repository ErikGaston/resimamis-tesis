import React, { useState } from 'react';
import { Box, Button, Chip, TextField, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { coincideBusqueda } from '../../../utils/textSearch';

const VIOLET = '#7A659B';
const NAVY = '#152C70';

const TIPOS = [
  { valor: null, label: 'Todos' },
  { valor: 'Madre', label: 'Madres' },
  { valor: 'Bebé', label: 'Bebés' },
  { valor: 'Voluntaria', label: 'Voluntarias' },
];

const COLOR_TIPO = {
  Madre: { bgcolor: 'rgba(122,101,155,0.12)', color: '#5F1FA8' },
  'Bebé': { bgcolor: 'rgba(0,120,200,0.1)', color: '#0B5394' },
  Voluntaria: { bgcolor: 'rgba(0,168,107,0.1)', color: '#00795C' },
};

const HistorialBajas = ({ historial, tipo, onCambiarTipo }) => {
  const [busqueda, setBusqueda] = useState('');
  const registros = historial?.registros;

  const filtrados = (registros ?? []).filter((r) =>
    coincideBusqueda(busqueda, [`${r.nombre ?? ''} ${r.apellido ?? ''}`], r.dni));

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5, color: NAVY }}>
        Historial de bajas
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: 'rgba(21,44,112,0.75)' }}>
        Registros dados de baja. No se borran: dejan de figurar en los listados activos.
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0.75, mb: 1.5 }}>
        {TIPOS.map((t) => {
          const activo = (tipo ?? null) === t.valor;
          return (
            <Button
              key={t.label}
              size="small"
              variant={activo ? 'contained' : 'outlined'}
              onClick={() => onCambiarTipo(t.valor)}
              sx={activo
                ? { bgcolor: VIOLET, '&:hover': { bgcolor: '#6A549A' }, px: 0.5 }
                : { borderColor: VIOLET, color: VIOLET, px: 0.5 }}
            >
              {t.label}
            </Button>
          );
        })}
      </Box>

      <TextField
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar por nombre o DNI…"
        fullWidth
        size="small"
        sx={{ mb: 2 }}
      />

      {!Array.isArray(registros) ? (
        <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', textAlign: 'center', py: 3 }}>
          Cargando historial…
        </Typography>
      ) : filtrados.length === 0 ? (
        <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', textAlign: 'center', py: 3 }}>
          {registros.length === 0 ? 'No hay bajas registradas.' : 'Sin resultados.'}
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="caption" sx={{ color: 'rgba(21,44,112,0.75)' }}>
            {filtrados.length} {filtrados.length === 1 ? 'registro' : 'registros'}
          </Typography>
          {filtrados.map((r) => (
            <Box
              key={`${r.tipoRegistro}-${r.idRegistro}`}
              sx={{
                p: 1.5, bgcolor: '#fff', borderRadius: 2,
                border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                <Typography noWrap sx={{ fontWeight: 600, fontSize: '0.9rem', flex: 1, minWidth: 0 }}>
                  {`${r.nombre ?? ''} ${r.apellido ?? ''}`.trim() || 'Sin nombre'}
                </Typography>
                <Chip
                  label={r.tipoRegistro}
                  size="small"
                  sx={{ ...COLOR_TIPO[r.tipoRegistro], fontWeight: 600, fontSize: '0.7rem', height: 22 }}
                />
              </Box>
              <Typography sx={{ fontSize: '0.8rem', color: 'rgba(21,44,112,0.75)' }}>
                {r.dni ? `DNI ${r.dni} · ` : ''}
                {r.fechaBaja ? `Baja el ${dayjs(r.fechaBaja).format('DD/MM/YYYY HH:mm')}` : 'Fecha de baja sin registrar'}
              </Typography>
              {(r.motivo || r.responsable) && (
                <Typography sx={{ fontSize: '0.8rem', color: 'rgba(21,44,112,0.75)' }}>
                  {[r.motivo, r.responsable && `Por ${r.responsable}`].filter(Boolean).join(' · ')}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default HistorialBajas;
