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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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

function pickAssignmentRoot(raw) {
  if (raw == null || typeof raw !== 'object') return null;
  return raw.asignacion ?? raw.Asignacion ?? raw.resultado ?? raw.data ?? raw;
}

function isAssignmentLikePayload(raw) {
  const o = pickAssignmentRoot(raw);
  if (!o || typeof o !== 'object') return false;
  if (o.idAsignacion != null || o.IdAsignacion != null) return true;
  if (
    o.idVoluntaria != null &&
    (o.idBebe != null || o.idTarea != null || o.IdBebe != null || o.IdTarea != null)
  ) {
    return true;
  }
  return false;
}

function pickStr(...cands) {
  for (const c of cands) {
    if (c != null && String(c).trim() !== '') return String(c);
  }
  return null;
}

function AssignmentReadableBlock({ data }) {
  const o = pickAssignmentRoot(data) || data || {};
  const vol = o.voluntaria ?? o.Voluntaria ?? {};
  const bebe = o.bebe ?? o.Bebe ?? {};
  const rows = [
    ['ID asignación', pickStr(o.idAsignacion, o.IdAsignacion)],
    ['Voluntaria', pickStr([vol.nombre, vol.apellido].filter(Boolean).join(' '), vol.nombreCompleto, o.nombreVoluntaria)],
    ['DNI voluntaria', pickStr(vol.dni, vol.Dni)],
    ['Bebé / tarea', pickStr(bebe.nombre, bebe.apellido, o.descripcionTarea, o.nombreBebe)],
    ['DNI bebé', pickStr(bebe.dni, bebe.Dni)],
    ['Estado', pickStr(o.estado, o.estadoAbrazo, o.Estado)],
  ].filter(([, v]) => v != null);

  return (
    <Box sx={{ p: 2 }}>
      <Typography sx={{ color: PALETTE.text, fontWeight: 600, mb: 1.5 }}>
        Resumen
      </Typography>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ borderRadius: 2, border: `1px solid ${PALETTE.border}`, mb: 2 }}
      >
        <Table size="small">
          <TableBody>
            {rows.map(([k, v]) => (
              <TableRow key={k}>
                <TableCell sx={{ fontWeight: 600, color: PALETTE.text, width: '38%', borderColor: PALETTE.border }}>
                  {k}
                </TableCell>
                <TableCell sx={{ color: PALETTE.text, borderColor: PALETTE.border }}>{v}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Accordion
        disableGutters
        elevation={0}
        sx={{ border: `1px solid ${PALETTE.border}`, borderRadius: 2, '&:before': { display: 'none' } }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: PALETTE.text }} />}>
          <Typography sx={{ color: PALETTE.text, fontWeight: 600, fontSize: '0.9rem' }}>
            JSON completo (depuración)
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0 }}>
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
              maxHeight: '40vh',
              overflow: 'auto',
              bgcolor: '#fff',
              borderRadius: 1,
              border: `1px solid ${PALETTE.border}`,
              fontFamily: 'ui-monospace, monospace',
            }}
          >
            {formatAssistancePayload(data)}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

/**
 * Diálogo para GET asistencia/hoy, históricas, detalle de asignación u otras respuestas.
 * Si reconoce filas de asistencia, muestra tabla; asignación: resumen + JSON plegable; si no, JSON legible.
 *
 * @param {{ idVoluntaria?: number, nombre?: string, apellido?: string, dni?: string|number } | null | undefined} volunteerFallback
 * @param {'auto' | 'assistance' | 'assignment'} [presentation] — `assignment` fuerza vista de asignación; `auto` infiere.
 */
const AssistanceDataDialog = ({
  open,
  title,
  onClose,
  data,
  volunteerFallback = null,
  presentation = 'auto',
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const rows = useMemo(() => {
    const extracted = extractAssistanceRows(data);
    return extracted.map(normalizeAssistanceRow);
  }, [data]);

  const showAssignmentView =
    presentation === 'assignment' || (presentation === 'auto' && isAssignmentLikePayload(data));

  const showTable =
    !showAssignmentView && rows.length > 0 && rows.every(isAssistanceShape);
  const showEmptyList = !showAssignmentView && isExplicitlyEmptyAssistancePayload(data);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      fullScreen={fullScreen}
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 3,
          overflow: 'hidden',
          border: fullScreen ? 'none' : `1px solid ${PALETTE.border}`,
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
        ) : showAssignmentView ? (
          <AssignmentReadableBlock data={data} />
        ) : showTable ? (
          <Box sx={{ p: 2 }}>
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                borderRadius: 2,
                border: `1px solid ${PALETTE.border}`,
                overflow: 'auto',
                maxHeight: fullScreen ? 'calc(100vh - 130px)' : '62vh',
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
