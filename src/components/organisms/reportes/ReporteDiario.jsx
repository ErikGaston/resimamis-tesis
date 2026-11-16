import React, { useState } from 'react';
import { Box, Button, Chip, TextField, Typography } from '@mui/material';
import dayjs from 'dayjs';

const VIOLET = '#7A659B';
const NAVY = '#152C70';

const ReporteDiario = ({ reporte, onConsultar }) => {
  const [fecha, setFecha] = useState(() => dayjs().format('YYYY-MM-DD'));
  const futura = dayjs(fecha).isAfter(dayjs(), 'day');

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5, color: NAVY }}>
        Reporte diario
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: 'rgba(21,44,112,0.75)' }}>
        Abrazos, insumos, altas, bajas, asignaciones y asistencias del día, en orden cronológico.
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          label="Fecha"
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          size="small"
          InputLabelProps={{ shrink: true }}
          inputProps={{ max: dayjs().format('YYYY-MM-DD') }}
          sx={{ flex: 1 }}
          error={futura}
          helperText={futura ? 'No puede ser futura' : ''}
        />
        <Button
          variant="contained"
          disabled={!fecha || futura}
          sx={{ bgcolor: VIOLET, '&:hover': { bgcolor: '#6A549A' }, alignSelf: 'flex-start' }}
          onClick={() => onConsultar(fecha)}
        >
          Ver reporte
        </Button>
      </Box>

      {reporte && (reporte.totalMovimientos === 0 ? (
        <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', textAlign: 'center', py: 3 }}>
          No hay movimientos registrados el {dayjs(reporte.fecha).format('DD/MM/YYYY')}.
        </Typography>
      ) : (
        <Box>
          <Typography variant="caption" sx={{ color: 'rgba(21,44,112,0.75)', display: 'block', mb: 1 }}>
            {dayjs(reporte.fecha).format('DD/MM/YYYY')} · {reporte.totalMovimientos} movimientos
          </Typography>
          {(reporte.categorias ?? []).filter((c) => c.cantidad > 0).map((c) => (
            <Box key={c.categoria} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                <Typography sx={{ fontWeight: 700, color: NAVY, fontSize: '0.95rem' }}>{c.categoria}</Typography>
                <Chip label={c.cantidad} size="small" sx={{ bgcolor: 'rgba(122,101,155,0.12)', color: '#5F1FA8', fontWeight: 700, height: 20 }} />
              </Box>
              {c.movimientos.map((m, i) => (
                <Box
                  key={`${c.categoria}-${i}`}
                  sx={{ display: 'flex', gap: 1.25, py: 0.9, px: 0.5, borderBottom: '1px solid rgba(21,44,112,0.08)' }}
                >
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: VIOLET, width: 44, flexShrink: 0 }}>
                    {dayjs(m.fechaHora).format('HH:mm')}
                  </Typography>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: '0.88rem', color: NAVY }}>
                      {m.tipo ? <strong>{m.tipo}: </strong> : null}{m.descripcion}
                    </Typography>
                    {m.responsable && (
                      <Typography sx={{ fontSize: '0.78rem', color: 'rgba(21,44,112,0.75)' }}>
                        {m.responsable}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default ReporteDiario;
