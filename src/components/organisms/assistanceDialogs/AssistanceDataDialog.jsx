import React, { useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';

const PALETTE = {
  text: '#152C70',
  border: 'rgba(143, 0, 255, 0.15)',
};

const ARRAY_KEYS = [
  'listadoAsistencias',
  'listado',
  'asistencias',
  'resultado',
  'data',
  'items',
  'listadoHistorico',
  'historico',
  'historicos',
];

/** Intenta obtener un arreglo de filas desde distintas formas de respuesta del API. */
function extractAssistanceRows(raw) {
  if (raw == null) return [];
  if (Array.isArray(raw)) return raw.filter((r) => r != null && typeof r === 'object');
  if (typeof raw !== 'object') return [];
  for (const k of ARRAY_KEYS) {
    const v = raw[k];
    if (Array.isArray(v)) return v.filter((r) => r != null && typeof r === 'object');
  }
  if (
    raw.fechaHoraIngreso != null ||
    raw.fechaHoraSalida != null ||
    raw.FechaHoraIngreso != null ||
    raw.FechaHoraSalida != null ||
    raw.idAsistencia !== undefined ||
    raw.IdAsistencia !== undefined ||
    (raw.voluntaria && typeof raw.voluntaria === 'object') ||
    (raw.Voluntaria && typeof raw.Voluntaria === 'object')
  ) {
    return [raw];
  }
  return [];
}

/** Unifica PascalCase / camelCase y referencias anidadas típicas de .NET. */
function normalizeAssistanceRow(row) {
  if (!row || typeof row !== 'object') return row;
  const vol = row.voluntaria ?? row.Voluntaria;
  return {
    ...row,
    fechaHoraIngreso: row.fechaHoraIngreso ?? row.FechaHoraIngreso,
    fechaHoraSalida: row.fechaHoraSalida ?? row.FechaHoraSalida,
    idVoluntaria: row.idVoluntaria ?? row.IdVoluntaria,
    idAsistencia: row.idAsistencia ?? row.IdAsistencia,
    voluntaria: vol && typeof vol === 'object' ? vol : null,
  };
}

function isAssistanceShape(row) {
  if (!row || typeof row !== 'object' || Array.isArray(row)) return false;
  const ing = row.fechaHoraIngreso;
  const sal = row.fechaHoraSalida;
  const hasVolNested = row.voluntaria != null && typeof row.voluntaria === 'object';
  const hasIdAsp = row.idAsistencia !== undefined && row.idAsistencia !== null;
  const hasIdVol = row.idVoluntaria != null;
  const hasTime = ing != null || sal != null;
  return hasVolNested || hasIdAsp || (hasIdVol && hasTime) || hasTime;
}

/**
 * @param {object} row
 * @param {{ idVoluntaria?: number, nombre?: string, apellido?: string, dni?: string|number } | null} fallback — p. ej. sesión desde localStorage cuando el API devuelve `voluntaria: null` en históricos.
 */
function volunteerFromRow(row, fallback) {
  if (row.voluntaria && typeof row.voluntaria === 'object') return row.voluntaria;
  if (
    fallback &&
    fallback.idVoluntaria != null &&
    row.idVoluntaria != null &&
    Number(fallback.idVoluntaria) === Number(row.idVoluntaria)
  ) {
    return {
      nombre: fallback.nombre,
      apellido: fallback.apellido,
      dni: fallback.dni,
      idVoluntaria: fallback.idVoluntaria,
    };
  }
  if (row.nombre || row.apellido || row.dni != null) return row;
  return {};
}

function rowDisplayName(row, fallback) {
  const v = volunteerFromRow(row, fallback);
  const n = [v.nombre, v.apellido].filter(Boolean).join(' ').trim();
  if (n) return n;
  if (row.idVoluntaria != null) return `Voluntaria #${row.idVoluntaria}`;
  return '—';
}

function rowDni(row, fallback) {
  const v = volunteerFromRow(row, fallback);
  const d = v.dni ?? v.Dni;
  return d != null && String(d).trim() !== '' ? String(d) : '—';
}

function isExplicitlyEmptyAssistancePayload(raw) {
  if (Array.isArray(raw) && raw.length === 0) return true;
  if (raw == null || typeof raw !== 'object') return false;
  for (const k of ARRAY_KEYS) {
    if (Array.isArray(raw[k]) && raw[k].length === 0) return true;
  }
  return false;
}

function formatDateTime(iso) {
  if (iso == null || iso === '') return '—';
  const d = dayjs(iso);
  return d.isValid() ? d.format('DD/MM/YYYY HH:mm') : String(iso);
}

function formatAssistancePayload(data) {
  if (data == null) return 'Sin datos';
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return String(data);
  }
}

/**
 * Diálogo para GET asistencia/hoy, históricas u otras respuestas.
 * Si reconoce filas de asistencia, muestra tabla; si no, JSON legible.
 *
 * @param {{ idVoluntaria?: number, nombre?: string, apellido?: string, dni?: string|number } | null | undefined} volunteerFallback — datos de la voluntaria logueada cuando el listado no incluye el objeto anidado (típico en históricos).
 */
const AssistanceDataDialog = ({ open, title, onClose, data, volunteerFallback = null }) => {
  const rows = useMemo(() => {
    const extracted = extractAssistanceRows(data);
    return extracted.map(normalizeAssistanceRow);
  }, [data]);

  const showTable = rows.length > 0 && rows.every(isAssistanceShape);
  const showEmptyList = isExplicitlyEmptyAssistancePayload(data);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
          border: `1px solid ${PALETTE.border}`,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pr: 1,
          py: 2,
          background: 'linear-gradient(90deg, #8f00ff 0%, #a54dff 100%)',
          color: '#fff',
        }}
      >
        <Typography component="span" sx={{ fontWeight: 600, fontSize: '1.05rem', letterSpacing: '0.02em' }}>
          {title}
        </Typography>
        <IconButton aria-label="Cerrar" onClick={onClose} size="small" sx={{ color: '#fff' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          p: 0,
          bgcolor: 'linear-gradient(180deg, #f9f6ff 0%, #fff 100%)',
          background: '#faf8fc',
        }}
      >
        {showEmptyList ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography sx={{ color: PALETTE.text, fontWeight: 600 }}>
              No hay registros en esta consulta.
            </Typography>
            <Typography sx={{ color: 'rgba(21, 44, 112, 0.6)', fontSize: '0.9rem', mt: 1 }}>
              Cuando haya asistencias, aparecerán en la tabla.
            </Typography>
          </Box>
        ) : showTable ? (
          <Box sx={{ p: 2 }}>
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                borderRadius: 2,
                border: `1px solid ${PALETTE.border}`,
                overflow: 'auto',
                maxHeight: '62vh',
                bgcolor: '#fff',
              }}
            >
                <Table size="small" stickyHeader aria-label="Listado de asistencias">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          color: PALETTE.text,
                          bgcolor: 'rgba(143, 0, 255, 0.08)',
                          borderBottom: `1px solid ${PALETTE.border}`,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Voluntaria
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 700,
                          color: PALETTE.text,
                          bgcolor: 'rgba(143, 0, 255, 0.08)',
                          borderBottom: `1px solid ${PALETTE.border}`,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        DNI
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          color: PALETTE.text,
                          bgcolor: 'rgba(143, 0, 255, 0.08)',
                          borderBottom: `1px solid ${PALETTE.border}`,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Ingreso
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          color: PALETTE.text,
                          bgcolor: 'rgba(143, 0, 255, 0.08)',
                          borderBottom: `1px solid ${PALETTE.border}`,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Salida
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row, idx) => (
                      <TableRow
                        key={
                          row.idAsistencia ??
                          row.idVoluntaria ??
                          volunteerFromRow(row, volunteerFallback).idVoluntaria ??
                          idx
                        }
                        sx={{
                          '&:nth-of-type(even)': { bgcolor: 'rgba(143, 0, 255, 0.03)' },
                          '&:last-child td': { borderBottom: 0 },
                        }}
                      >
                        <TableCell
                          sx={{
                            color: PALETTE.text,
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            borderBottom: `1px solid ${PALETTE.border}`,
                          }}
                        >
                          {rowDisplayName(row, volunteerFallback)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            color: PALETTE.text,
                            fontWeight: 500,
                            fontSize: '0.875rem',
                            borderBottom: `1px solid ${PALETTE.border}`,
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          {rowDni(row, volunteerFallback)}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: PALETTE.text,
                            fontSize: '0.85rem',
                            borderBottom: `1px solid ${PALETTE.border}`,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {formatDateTime(row.fechaHoraIngreso)}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: row.fechaHoraSalida ? PALETTE.text : 'rgba(21, 44, 112, 0.55)',
                            fontSize: '0.85rem',
                            fontStyle: row.fechaHoraSalida ? 'normal' : 'italic',
                            borderBottom: `1px solid ${PALETTE.border}`,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {row.fechaHoraSalida ? formatDateTime(row.fechaHoraSalida) : 'En centro / sin salida'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            <Typography
              variant="caption"
              sx={{ display: 'block', mt: 1.5, color: 'rgba(21, 44, 112, 0.55)', px: 0.5 }}
            >
              Horarios según el servidor (UTC convertidos por el navegador).
            </Typography>
          </Box>
        ) : (
          <Box sx={{ p: 2 }}>
            <Typography sx={{ color: PALETTE.text, fontSize: '0.9rem', mb: 1, fontWeight: 500 }}>
              Respuesta en formato libre
            </Typography>
            <Box
              component="pre"
              sx={{
                m: 0,
                p: 2,
                fontSize: 11,
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                color: PALETTE.text,
                maxHeight: '58vh',
                overflow: 'auto',
                bgcolor: '#fff',
                borderRadius: 2,
                border: `1px solid ${PALETTE.border}`,
                fontFamily: 'ui-monospace, monospace',
              }}
            >
              {formatAssistancePayload(data)}
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AssistanceDataDialog;
