import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getHorarioDias, putHorario, clearHorario, clearHorarioWrites } from '../../../redux/actions/horarioActions';
import { showToast } from '../../../redux/actions/toastActions';

const TURNOS = [
  { value: 'Mañana', label: 'Mañana' },
  { value: 'Tarde', label: 'Tarde' },
  { value: 'Noche', label: 'Noche' },
  { value: 'Jornada completa', label: 'Jornada completa' },
];

export function VolunteerHorarioSection({ idVoluntaria, horarios, onSuccess }) {
  const dispatch = useDispatch();
  const { getHorarioDias: diasPayload, postHorario: postRes } = useSelector(
    (s) => s.horarioReducer,
  );

  const diasOptions = useMemo(() => {
    const raw = diasPayload?.resultado ?? diasPayload?.listadoDias ?? diasPayload?.data ?? diasPayload;
    if (!Array.isArray(raw)) return [];
    return raw
      .map((d) => ({
        value: d.idDia ?? d.id ?? d.value,
        label: d.nombre ?? d.descripcion ?? d.label ?? `Día ${d.idDia ?? d.id}`,
      }))
      .filter((o) => o.value != null);
  }, [diasPayload]);

  const [seleccion, setSeleccion] = useState({});

  useEffect(() => {
    dispatch(getHorarioDias());
    return () => dispatch(clearHorario());
  }, [dispatch]);

  // Pre-carga los horarios activos de la voluntaria al montar o cuando cambian
  useEffect(() => {
    if (!Array.isArray(horarios) || horarios.length === 0) return;
    const initial = {};
    horarios
      .filter((h) => h.activa !== false && h.idDia != null)
      .forEach((h) => {
        // Si ya hay un horario para ese día, se conserva el primero
        if (!initial[h.idDia]) {
          initial[h.idDia] = { turno: h.turno ?? 'Mañana' };
        }
      });
    setSeleccion(initial);
  }, [horarios]);

  useEffect(() => {
    if (postRes != null) {
      dispatch(showToast({ message: 'Disponibilidad guardada correctamente.', severity: 'success' }));
      dispatch(clearHorarioWrites());
      onSuccess?.();
    }
  }, [postRes, dispatch]);

  const toggleDia = (idDia) => {
    setSeleccion((prev) => {
      if (prev[idDia]) {
        const next = { ...prev };
        delete next[idDia];
        return next;
      }
      return { ...prev, [idDia]: { turno: 'Mañana' } };
    });
  };

  const setTurno = (idDia, turno) => {
    setSeleccion((prev) => ({ ...prev, [idDia]: { turno } }));
  };

  const submit = () => {
    const body = Object.entries(seleccion)
      .map(([idDia, { turno }]) => ({
        idDia: Number(idDia),
        idVoluntaria: Number(idVoluntaria),
        turno: turno || null,
      }))
      .filter((r) => Number.isFinite(r.idDia) && Number.isFinite(r.idVoluntaria));

    if (!body.length) {
      dispatch(showToast({ message: 'Seleccioná al menos un día.', severity: 'warning' }));
      return;
    }
    dispatch(putHorario(Number(idVoluntaria), body));
  };

  const diasSeleccionados = Object.keys(seleccion).length;

  return (
    <Box sx={{ pt: 0.5, pb: 1 }}>
      <Typography sx={{ color: 'rgba(21,44,112,0.75)', fontSize: '0.82rem', mb: 2 }}>
        Marcá los días que asiste y el turno correspondiente.
      </Typography>

      {diasOptions.length === 0 ? (
        <Typography sx={{ color: 'rgba(21,44,112,0.72)', fontSize: '0.85rem', fontStyle: 'italic' }}>
          Cargando días disponibles…
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          {diasOptions.map((dia) => {
            const checked = Boolean(seleccion[dia.value]);
            return (
              <Box
                key={dia.value}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  py: 1,
                  px: 1.5,
                  borderRadius: '12px',
                  border: checked
                    ? '1.5px solid rgba(143,0,255,0.4)'
                    : '1.5px solid rgba(21,44,112,0.08)',
                  bgcolor: checked ? 'rgba(143,0,255,0.04)' : '#fafafa',
                  transition: 'all 0.15s',
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={() => toggleDia(dia.value)}
                      sx={{
                        color: 'rgba(21,44,112,0.3)',
                        '&.Mui-checked': { color: '#8F00FF' },
                        p: 0.5,
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontWeight: checked ? 600 : 400, color: '#152C70', fontSize: '0.92rem' }}>
                      {dia.label}
                    </Typography>
                  }
                  sx={{ m: 0, flex: 1 }}
                />
                {checked && (
                  <FormControl size="small" sx={{ minWidth: 148 }}>
                    <InputLabel id={`turno-label-${dia.value}`}>Turno</InputLabel>
                    <Select
                      labelId={`turno-label-${dia.value}`}
                      label="Turno"
                      value={seleccion[dia.value]?.turno ?? 'Mañana'}
                      onChange={(e) => setTurno(dia.value, e.target.value)}
                      sx={{ borderRadius: '8px' }}
                    >
                      {TURNOS.map((t) => (
                        <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Box>
            );
          })}
        </Box>
      )}

      <Button
        variant="contained"
        fullWidth
        onClick={submit}
        disabled={diasSeleccionados === 0}
        sx={{
          mt: 2.5,
          textTransform: 'none',
          fontWeight: 700,
          fontSize: '0.95rem',
          minHeight: 44,
          borderRadius: '10px',
          background: 'linear-gradient(90deg, #7F00FF 0%, #E100FF 100%)',
          boxShadow: '0 4px 14px rgba(127,0,255,0.28)',
          color: '#fff',
          '&.Mui-disabled': { opacity: 0.4, boxShadow: 'none' },
        }}
      >
        {diasSeleccionados === 0
          ? 'Seleccioná al menos un día'
          : `Guardar disponibilidad (${diasSeleccionados} día${diasSeleccionados !== 1 ? 's' : ''})`}
      </Button>
    </Box>
  );
}

export default VolunteerHorarioSection;
