import React, { useState } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import dayjs from 'dayjs';

const VIOLET = '#7A659B';
const NAVY = '#152C70';

const DiasTurnosVoluntarias = ({ voluntarias, resultado, onConsultar }) => {
  const [desde, setDesde] = useState(() => dayjs().startOf('month').format('YYYY-MM-DD'));
  const [hasta, setHasta] = useState(() => dayjs().format('YYYY-MM-DD'));
  const [idVoluntaria, setIdVoluntaria] = useState('');

  const rangoInvalido = !desde || !hasta || dayjs(hasta).isBefore(dayjs(desde));
  const registros = resultado?.registros;

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1.5, color: NAVY }}>
        Días y turnos de las voluntarias
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 1 }}>
        <TextField label="Desde *" type="date" value={desde} onChange={(e) => setDesde(e.target.value)} size="small" InputLabelProps={{ shrink: true }} />
        <TextField
          label="Hasta *"
          type="date"
          value={hasta}
          onChange={(e) => setHasta(e.target.value)}
          size="small"
          InputLabelProps={{ shrink: true }}
          error={!!desde && !!hasta && rangoInvalido}
          helperText={!!desde && !!hasta && rangoInvalido ? 'Anterior a "desde"' : ''}
        />
      </Box>
      <FormControl fullWidth size="small" sx={{ mb: 1 }}>
        <InputLabel id="dias-turnos-vol" shrink>Voluntaria</InputLabel>
        <Select labelId="dias-turnos-vol" label="Voluntaria" notched displayEmpty value={idVoluntaria} onChange={(e) => setIdVoluntaria(e.target.value)}>
          <MenuItem value="">Todas</MenuItem>
          {(voluntarias ?? []).map((v) => (
            <MenuItem key={v.idVoluntaria} value={String(v.idVoluntaria)}>
              {[v.nombre, v.apellido].filter(Boolean).join(' ')}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        variant="contained"
        fullWidth
        disabled={rangoInvalido}
        sx={{ bgcolor: VIOLET, '&:hover': { bgcolor: '#6A549A' }, mb: 2 }}
        onClick={() => onConsultar({
          fechaDesde: desde,
          fechaHasta: hasta,
          ...(idVoluntaria ? { idVoluntaria: Number(idVoluntaria) } : {}),
        })}
      >
        Consultar días y turnos
      </Button>

      {Array.isArray(registros) && (registros.length === 0 ? (
        <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', textAlign: 'center', py: 2 }}>
          No hay datos disponibles para el período seleccionado.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mb: 1 }}>
          <Typography variant="caption" sx={{ color: 'rgba(21,44,112,0.75)' }}>
            {registros.length} {registros.length === 1 ? 'registro' : 'registros'}
          </Typography>
          {registros.map((r) => (
            <Box
              key={`${r.idVoluntaria}-${r.fecha}`}
              sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1, px: 0.5, borderBottom: '1px solid rgba(21,44,112,0.08)' }}
            >
              <Box sx={{ width: 64, flexShrink: 0 }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: NAVY, lineHeight: 1.2 }}>
                  {dayjs(r.fecha).format('DD/MM')}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'rgba(21,44,112,0.75)' }}>{r.dia}</Typography>
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography noWrap sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                  {[r.nombre, r.apellido].filter(Boolean).join(' ')}
                </Typography>
                <Typography noWrap sx={{ fontSize: '0.78rem', color: 'rgba(21,44,112,0.75)' }}>
                  {r.turno}
                  {r.fechaHoraIngreso ? ` · Ingreso ${dayjs(r.fechaHoraIngreso).format('HH:mm')}` : ''}
                  {r.fechaHoraSalida ? ` · Salida ${dayjs(r.fechaHoraSalida).format('HH:mm')}` : ''}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default DiasTurnosVoluntarias;
