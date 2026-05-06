import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useDispatch, useSelector } from 'react-redux';
import { getHorarioDias, postHorario, clearHorario } from '../../../redux/actions/horarioActions';
import { showToast } from '../../../redux/actions/toastActions';

/**
 * Carga días disponibles y permite armar arreglo `HorarioVoluntaria[]` para POST `/horario`.
 * @param {{ idVoluntaria: number }} props
 */
export function VolunteerHorarioSection({ idVoluntaria }) {
  const dispatch = useDispatch();
  const { getHorarioDias: diasPayload, postHorario: postRes, error } = useSelector(
    (s) => s.horarioReducer,
  );
  const [rows, setRows] = useState([{ idDia: '', idVoluntaria: String(idVoluntaria ?? ''), turno: '' }]);

  useEffect(() => {
    dispatch(getHorarioDias());
    return () => dispatch(clearHorario());
  }, [dispatch]);

  useEffect(() => {
    setRows((r) =>
      r.map((row) => ({
        ...row,
        idVoluntaria: String(idVoluntaria ?? row.idVoluntaria ?? ''),
      })),
    );
  }, [idVoluntaria]);

  useEffect(() => {
    if (postRes != null) {
      dispatch(showToast({ message: 'Horario guardado.', severity: 'success' }));
      dispatch(clearHorario());
    }
  }, [postRes, dispatch]);

  const diasOptions = useMemo(() => {
    const raw = diasPayload?.resultado ?? diasPayload?.listadoDias ?? diasPayload?.data ?? diasPayload;
    if (!Array.isArray(raw)) return [];
    return raw.map((d) => ({
      value: d.idDia ?? d.id ?? d.value,
      label: d.nombre ?? d.descripcion ?? d.label ?? `Día ${d.idDia ?? d.id}`,
    })).filter((o) => o.value != null);
  }, [diasPayload]);

  const submit = () => {
    const body = rows
      .map((r) => ({
        idDia: r.idDia === '' ? null : Number(r.idDia),
        idVoluntaria: Number(r.idVoluntaria || idVoluntaria),
        turno: r.turno === '' ? null : String(r.turno),
      }))
      .filter((r) => Number.isFinite(r.idDia) && Number.isFinite(r.idVoluntaria));
    if (!body.length) {
      dispatch(showToast({ message: 'Agregá al menos una fila con idDia válido.', severity: 'warning' }));
      return;
    }
    dispatch(postHorario(body));
  };

  return (
    <Paper variant="outlined" sx={{ p: 2, mt: 2, borderRadius: 2 }}>
      <Typography variant="subtitle1" sx={{ color: '#152C70', fontWeight: 600 }}>
        Horarios de voluntaria
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Elegí día (desde el catálogo del servidor), turno libre y guardá el arreglo completo.
      </Typography>
      {error != null && (
        <Alert severity="error" sx={{ mb: 1 }}>
          Error al cargar o guardar horarios.
        </Alert>
      )}
      {rows.map((row, idx) => (
        <Box key={idx} sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1, flexWrap: 'wrap' }}>
          <TextField
            select
            label="Día"
            size="small"
            sx={{ minWidth: 140 }}
            value={row.idDia}
            onChange={(e) => {
              const v = e.target.value;
              setRows((rs) => rs.map((x, i) => (i === idx ? { ...x, idDia: v } : x)));
            }}
          >
            <MenuItem value="">—</MenuItem>
            {diasOptions.map((o) => (
              <MenuItem key={String(o.value)} value={String(o.value)}>
                {o.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Turno"
            size="small"
            value={row.turno}
            onChange={(e) => {
              const v = e.target.value;
              setRows((rs) => rs.map((x, i) => (i === idx ? { ...x, turno: v } : x)));
            }}
            sx={{ flex: 1, minWidth: 100 }}
          />
          <IconButton
            aria-label="Quitar fila"
            onClick={() => setRows((rs) => rs.filter((_, i) => i !== idx))}
            disabled={rows.length <= 1}
          >
            <DeleteOutlineIcon />
          </IconButton>
        </Box>
      ))}
      <Button
        startIcon={<AddCircleOutlineIcon />}
        size="small"
        onClick={() =>
          setRows((rs) => [
            ...rs,
            { idDia: '', idVoluntaria: String(idVoluntaria ?? ''), turno: '' },
          ])
        }
        sx={{ mb: 1 }}
      >
        Agregar fila
      </Button>
      <Button variant="contained" fullWidth onClick={submit}>
        Guardar horarios
      </Button>
    </Paper>
  );
}

export default VolunteerHorarioSection;
