import React, { useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
  Paper,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import dayjs from 'dayjs';

const PALETTE = {
  text: '#152C70',
  border: 'rgba(143, 0, 255, 0.15)',
};

const DIALOG_SX = {
  maxWidth: 444,
  width: '100%',
  mx: 'auto',
  height: '100dvh',
  maxHeight: '100dvh',
  m: 0,
  borderRadius: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
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
  return d != null && String(d).trim() !== '' ? String(d) : null;
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
  if (iso == null || iso === '') return null;
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
    </Box>
  );
}

function AssistanceCard({ row, fallback }) {
  const name = rowDisplayName(row, fallback);
  const dni = rowDni(row, fallback);
  const ingreso = formatDateTime(row.fechaHoraIngreso);
  const salida = formatDateTime(row.fechaHoraSalida);
  const enCentro = !row.fechaHoraSalida;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 1.25,
        borderRadius: '14px',
        border: '1.5px solid rgba(143,0,255,0.12)',
        bgcolor: '#fff',
        boxShadow: '0 2px 10px rgba(21,44,112,0.06)',
      }}
    >
      {/* Nombre + DNI */}
      <Box sx={{ mb: 1.25 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: PALETTE.text, lineHeight: 1.3 }}>
          {name}
        </Typography>
        {dni && (
          <Typography sx={{ fontSize: '0.78rem', color: 'rgba(21,44,112,0.5)', fontWeight: 500, mt: 0.25 }}>
            DNI {dni}
          </Typography>
        )}
      </Box>

      {/* Ingreso / Salida en dos filas */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 28, height: 28, borderRadius: '8px',
              bgcolor: 'rgba(0,168,107,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <LoginIcon sx={{ fontSize: 15, color: '#00A86B' }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(21,44,112,0.45)', textTransform: 'uppercase', letterSpacing: '0.07em', lineHeight: 1 }}>
              Ingreso
            </Typography>
            <Typography sx={{ fontSize: '0.88rem', color: PALETTE.text, fontWeight: 500, lineHeight: 1.3 }}>
              {ingreso ?? '—'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 28, height: 28, borderRadius: '8px',
              bgcolor: enCentro ? 'rgba(143,0,255,0.08)' : 'rgba(197,56,20,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <LogoutIcon sx={{ fontSize: 15, color: enCentro ? '#7A659B' : '#C53814' }} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box>
              <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(21,44,112,0.45)', textTransform: 'uppercase', letterSpacing: '0.07em', lineHeight: 1 }}>
                Salida
              </Typography>
              <Typography sx={{ fontSize: '0.88rem', color: enCentro ? 'rgba(21,44,112,0.45)' : PALETTE.text, fontStyle: enCentro ? 'italic' : 'normal', fontWeight: 500, lineHeight: 1.3 }}>
                {salida ?? 'En centro'}
              </Typography>
            </Box>
            {enCentro && (
              <Chip
                label="En centro"
                size="small"
                sx={{
                  bgcolor: 'rgba(122,101,155,0.12)',
                  color: '#7A659B',
                  fontWeight: 700,
                  fontSize: '0.65rem',
                  height: 20,
                  '& .MuiChip-label': { px: 0.75 },
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

const AssistanceDataDialog = ({
  open,
  title,
  onClose,
  data,
  volunteerFallback = null,
  presentation = 'auto',
}) => {
  const rows = useMemo(() => {
    const extracted = extractAssistanceRows(data);
    return extracted.map(normalizeAssistanceRow);
  }, [data]);

  const showAssignmentView =
    presentation === 'assignment' || (presentation === 'auto' && isAssignmentLikePayload(data));

  const showCards = !showAssignmentView && rows.length > 0 && rows.every(isAssistanceShape);
  const showEmptyList = !showAssignmentView && isExplicitlyEmptyAssistancePayload(data);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={false}
      PaperProps={{ sx: DIALOG_SX }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pr: 1,
          py: 1.75,
          px: 2.5,
          background: 'linear-gradient(90deg, #8f00ff 0%, #a54dff 100%)',
          color: '#fff',
          flexShrink: 0,
        }}
      >
        <Typography component="span" sx={{ fontWeight: 700, fontSize: '1.05rem', letterSpacing: '0.02em' }}>
          {title}
        </Typography>
        <IconButton aria-label="Cerrar" onClick={onClose} sx={{ color: '#fff', minWidth: 44, minHeight: 44 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Contenido scrollable */}
      <DialogContent sx={{ flex: 1, overflowY: 'auto', p: 0, bgcolor: '#faf8fc' }}>
        {showEmptyList ? (
          <Box sx={{ p: 4, textAlign: 'center', pt: 8 }}>
            <Typography sx={{ color: PALETTE.text, fontWeight: 600, fontSize: '1rem' }}>
              No hay registros en esta consulta.
            </Typography>
            <Typography sx={{ color: 'rgba(21,44,112,0.5)', fontSize: '0.9rem', mt: 1, lineHeight: 1.6 }}>
              Cuando haya asistencias, aparecerán aquí.
            </Typography>
          </Box>
        ) : showAssignmentView ? (
          <AssignmentReadableBlock data={data} />
        ) : showCards ? (
          <Box sx={{ px: 2, pt: 2, pb: 4 }}>
            <Typography
              sx={{
                fontSize: '0.68rem', fontWeight: 700, color: 'rgba(21,44,112,0.45)',
                textTransform: 'uppercase', letterSpacing: '0.09em', mb: 1.5,
              }}
            >
              {rows.length} {rows.length === 1 ? 'registro' : 'registros'}
            </Typography>
            {rows.map((row, idx) => (
              <AssistanceCard
                key={row.idAsistencia ?? row.idVoluntaria ?? idx}
                row={row}
                fallback={volunteerFallback}
              />
            ))}
          </Box>
        ) : (
          <Box sx={{ px: 2, pt: 2, pb: 4 }}>
            <Typography sx={{ color: PALETTE.text, fontSize: '0.9rem', mb: 1, fontWeight: 500 }}>
              Respuesta en formato libre
            </Typography>
            <Box
              component="pre"
              sx={{
                m: 0, p: 1.5, fontSize: 11, lineHeight: 1.5,
                whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                color: PALETTE.text, overflow: 'auto',
                bgcolor: '#fff', borderRadius: 2,
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
