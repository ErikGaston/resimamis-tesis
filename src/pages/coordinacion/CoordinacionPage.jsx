import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import Footer from '../../components/molecules/Footer';
import PageScrollMain from '../../components/common/PageScrollMain';
import { PageHeader } from '../../components/common/PageHeader';
import { isCoordinadoraSession } from '../../utils/coordinadoraRole';
import {
  putAssignmentById,
  deleteAssignmentById,
  postResetAbrazosColgados,
  clearAssignmentWrites,
} from '../../redux/actions/assignmentActions';
import {
  getAssistanceReporte,
  postAssistanceDelete,
  postVolunteerDelete,
  clearVolunteerWrites,
} from '../../redux/actions/volunteerActions';
import {
  postUsuario,
  getUsuarioById,
  putUsuario,
  postUsuarioDelete,
  clearUserAdmin,
  getUsuarios,
  getVoluntariasSinUsuario,
  putUsuarioContrasena,
} from '../../redux/actions/userActions';
import { postMotherDelete, clearMotherWrites } from '../../redux/actions/motherActions';
import { postBabyDelete, clearBabyWrites } from '../../redux/actions/babyActions';
import {
  getSupplyById,
  putSupplyById,
  postSupplyDelete,
  clearSupplyWrites,
} from '../../redux/actions/supplyActions';
import {
  getTareas,
  getTareaById,
  postTarea,
  putTarea,
  postTareaDelete,
  clearTareaWrites,
} from '../../redux/actions/tareaActions';
import {
  getVisitasByBebe,
  getVisitaById,
  postVisita,
  putVisita,
  postVisitaDelete,
  clearVisitaWrites,
} from '../../redux/actions/visitaActions';
import { showToast } from '../../redux/actions/toastActions';

function TabPanel({ children, value, index }) {
  if (value !== index) return null;
  return <Box sx={{ pt: 2 }}>{children}</Box>;
}

function safeJsonParse(raw, fallback) {
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function normalizarLista(raw) {
  if (!raw) return null;
  if (Array.isArray(raw)) return raw;
  const candidates = [
    raw.data,
    raw.listado,
    raw.listadoTareas,
    raw.listadoVisitas,
    raw.listadoUsuarios,
    raw.listadoVoluntaria,
  ];
  for (const c of candidates) {
    if (Array.isArray(c)) return c;
  }
  return [];
}

const VISITA_FORM_INIT = {
  idBebe: '',
  nombreVisitante: '',
  familiar: '',
  fechaHoraVisita: '',
  documentoVisitante: '',
  telefonoVisitante: '',
};

export const CoordinacionPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isCoord = isCoordinadoraSession();

  const assignment = useSelector((s) => s.assignmentReducer);
  const volunteer = useSelector((s) => s.volunteerReducer);
  const user = useSelector((s) => s.userReducer);
  const mother = useSelector((s) => s.motherReducer);
  const baby = useSelector((s) => s.babyReducer);
  const supply = useSelector((s) => s.supplyReducer);
  const tarea = useSelector((s) => s.tareaReducer);
  const visita = useSelector((s) => s.visitaReducer);

  const [tab, setTab] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, message: '', onConfirm: null });

  // Asignación
  const [asigId, setAsigId] = useState('');
  const [asigJson, setAsigJson] = useState('{}');

  // Asistencia
  const [repIni, setRepIni] = useState(() => dayjs().startOf('month').format('YYYY-MM-DDTHH:mm'));
  const [repFin, setRepFin] = useState(() => dayjs().endOf('day').format('YYYY-MM-DDTHH:mm'));
  const [idAsistenciaDel, setIdAsistenciaDel] = useState('');

  // Usuarios
  const [usuarioForm, setUsuarioForm] = useState({ dni: '', contrasena: '', idVoluntaria: '' });
  const [usuarioIdBuscar, setUsuarioIdBuscar] = useState('');
  const [usuarioJsonEdit, setUsuarioJsonEdit] = useState('{}');
  const [idUsuarioDel, setIdUsuarioDel] = useState('');
  const [contrasenaForm, setContrasenaForm] = useState({ ContrasenaActual: '', ContrasenaNueva: '' });

  // Bajas
  const [idMadreDel, setIdMadreDel] = useState('');
  const [idVolDel, setIdVolDel] = useState('');
  const [idBebeDel, setIdBebeDel] = useState('');

  // Insumos
  const [idInsumo, setIdInsumo] = useState('');
  const [insumoJson, setInsumoJson] = useState('{}');

  // Tareas
  const [tareaForm, setTareaForm] = useState({ nombre: '', Estado: true, esUnica: false });
  const [tareaEditId, setTareaEditId] = useState('');
  const [tareaEditForm, setTareaEditForm] = useState({ nombre: '', Estado: true, esUnica: false });

  // Visitas
  const [visitaBebeId, setVisitaBebeId] = useState('');
  const [visitaForm, setVisitaForm] = useState(VISITA_FORM_INIT);
  const [visitaEditId, setVisitaEditId] = useState('');
  const [visitaEditJson, setVisitaEditJson] = useState('{}');

  const toastOk = useCallback(
    (msg) => dispatch(showToast({ message: msg, severity: 'success' })),
    [dispatch],
  );

  const openConfirm = (message, onConfirm) => setConfirmDialog({ open: true, message, onConfirm });
  const handleConfirm = () => {
    confirmDialog.onConfirm?.();
    setConfirmDialog({ open: false, message: '', onConfirm: null });
  };
  const handleCancelConfirm = () => setConfirmDialog({ open: false, message: '', onConfirm: null });

  useEffect(() => {
    if (user?.getUsuarioById != null) {
      setUsuarioJsonEdit(JSON.stringify(user.getUsuarioById, null, 2));
    }
  }, [user?.getUsuarioById]);

  useEffect(() => {
    if (supply?.getSupplyById != null) {
      try {
        setInsumoJson(JSON.stringify(supply.getSupplyById, null, 2));
      } catch {
        setInsumoJson('{}');
      }
    }
  }, [supply?.getSupplyById]);

  useEffect(() => {
    if (tarea?.getTareaById != null) {
      const t = tarea.getTareaById;
      setTareaEditForm({
        nombre: t?.nombre ?? '',
        Estado: t?.Estado ?? true,
        esUnica: t?.esUnica ?? false,
      });
    }
  }, [tarea?.getTareaById]);

  useEffect(() => {
    if (visita?.getVisitaById != null) {
      try {
        setVisitaEditJson(JSON.stringify(visita.getVisitaById, null, 2));
      } catch {
        setVisitaEditJson('{}');
      }
    }
  }, [visita?.getVisitaById]);

  useEffect(() => {
    if (assignment?.postResetAbrazosColgados != null) {
      toastOk('Operación de asignación ejecutada.');
      dispatch(clearAssignmentWrites());
    }
  }, [assignment?.postResetAbrazosColgados, dispatch, toastOk]);

  useEffect(() => {
    if (assignment?.putAssignmentById != null || assignment?.deleteAssignmentById != null) {
      toastOk('Asignación actualizada.');
      dispatch(clearAssignmentWrites());
    }
  }, [assignment?.putAssignmentById, assignment?.deleteAssignmentById, dispatch, toastOk]);

  useEffect(() => {
    if (volunteer?.postAssistanceDelete != null || volunteer?.postVolunteerDelete != null) {
      toastOk('Baja registrada.');
      dispatch(clearVolunteerWrites());
    }
  }, [volunteer?.postAssistanceDelete, volunteer?.postVolunteerDelete, dispatch, toastOk]);

  useEffect(() => {
    if (user?.postUsuario != null || user?.putUsuario != null || user?.postUsuarioDelete != null) {
      toastOk('Usuario: operación OK.');
      dispatch(clearUserAdmin());
    }
  }, [user?.postUsuario, user?.putUsuario, user?.postUsuarioDelete, dispatch, toastOk]);

  useEffect(() => {
    if (user?.putUsuarioContrasena != null) {
      toastOk('Contraseña actualizada.');
      setContrasenaForm({ ContrasenaActual: '', ContrasenaNueva: '' });
      dispatch(clearUserAdmin());
    }
  }, [user?.putUsuarioContrasena, dispatch, toastOk]);

  useEffect(() => {
    if (mother?.postMotherDelete != null) {
      toastOk('Madre dada de baja.');
      dispatch(clearMotherWrites());
    }
  }, [mother?.postMotherDelete, dispatch, toastOk]);

  useEffect(() => {
    if (baby?.postBabyDelete != null) {
      toastOk('Bebé dado de baja.');
      dispatch(clearBabyWrites());
    }
  }, [baby?.postBabyDelete, dispatch, toastOk]);

  useEffect(() => {
    if (supply?.putSupplyById != null || supply?.postSupplyDelete != null) {
      toastOk('Insumo actualizado.');
      dispatch(clearSupplyWrites());
    }
  }, [supply?.putSupplyById, supply?.postSupplyDelete, dispatch, toastOk]);

  useEffect(() => {
    if (tarea?.postTarea != null || tarea?.putTarea != null || tarea?.postTareaDelete != null) {
      toastOk('Tarea: operación OK.');
      dispatch(clearTareaWrites());
      dispatch(getTareas());
    }
  }, [tarea?.postTarea, tarea?.putTarea, tarea?.postTareaDelete, dispatch, toastOk]);

  useEffect(() => {
    if (visita?.postVisita != null || visita?.putVisita != null || visita?.postVisitaDelete != null) {
      toastOk('Visita: operación OK.');
      dispatch(clearVisitaWrites());
      if (visitaBebeId) dispatch(getVisitasByBebe(Number(visitaBebeId)));
    }
  }, [visita?.postVisita, visita?.putVisita, visita?.postVisitaDelete, dispatch, toastOk, visitaBebeId]);

  if (!isCoord) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="warning">
          Solo perfil <strong>coordinadora</strong> puede usar esta pantalla.
        </Alert>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/overview')}>
          Volver al inicio
        </Button>
        <Footer />
      </Box>
    );
  }

  const tareasList = normalizarLista(tarea?.getTareas);
  const visitasList = normalizarLista(visita?.getVisitasByBebe);
  const usuariosList = normalizarLista(user?.getUsuarios);
  const volsSinUsuario = normalizarLista(user?.getVoluntariasSinUsuario);

  const asistenciaReporteRows = (() => {
    const raw = volunteer?.getAssistanceReporte;
    if (!raw) return null;
    const d = raw?.data ?? raw;
    if (Array.isArray(d)) return d;
    return [];
  })();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, width: '100%' }}>
      <PageHeader title="Coordinación" />
      <PageScrollMain>
        <Paper elevation={0} sx={{ p: 2, mx: 1, mb: 2, borderRadius: 2 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.85rem' },
              '& .Mui-selected': { color: '#8F00FF' },
              '& .MuiTabs-indicator': { backgroundColor: '#8F00FF' },
            }}
          >
            <Tab label="Asignación" />
            <Tab label="Asistencia" />
            <Tab label="Usuarios" />
            <Tab label="Bajas" />
            <Tab label="Insumos" />
            <Tab label="Tareas" />
            <Tab label="Visitas" />
          </Tabs>

          {/* ── 0: Asignación ── */}
          <TabPanel value={tab} index={0}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              sx={{ mb: 2 }}
              onClick={() =>
                openConfirm(
                  '¿Resetear abrazos colgados en el servidor?',
                  () => dispatch(postResetAbrazosColgados()),
                )
              }
            >
              Resetear abrazos colgados
            </Button>
            <TextField
              label="ID de asignación"
              value={asigId}
              onChange={(e) => setAsigId(e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
              inputProps={{ inputMode: 'numeric' }}
            />
            <TextField
              label="Datos de asignación (JSON)"
              value={asigJson}
              onChange={(e) => setAsigJson(e.target.value)}
              fullWidth
              multiline
              minRows={4}
              size="small"
            />
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Button
                variant="outlined"
                onClick={() => {
                  const id = Number(asigId);
                  const body = safeJsonParse(asigJson, {});
                  if (!Number.isFinite(id)) return;
                  dispatch(putAssignmentById(id, body));
                }}
              >
                Guardar asignación
              </Button>
              <Button
                color="error"
                variant="outlined"
                onClick={() => {
                  const id = Number(asigId);
                  if (!Number.isFinite(id)) return;
                  openConfirm(`¿Eliminar asignación ${id}?`, () => dispatch(deleteAssignmentById(id)));
                }}
              >
                Eliminar
              </Button>
            </Box>
          </TabPanel>

          {/* ── 1: Asistencia ── */}
          <TabPanel value={tab} index={1}>
            <TextField
              label="Fecha inicio"
              type="datetime-local"
              value={repIni}
              onChange={(e) => setRepIni(e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Fecha fin"
              type="datetime-local"
              value={repFin}
              onChange={(e) => setRepFin(e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
              InputLabelProps={{ shrink: true }}
            />
            <Button
              variant="contained"
              onClick={() =>
                dispatch(
                  getAssistanceReporte({
                    fechaInicio: new Date(repIni).toISOString(),
                    fechaFin: new Date(repFin).toISOString(),
                  }),
                )
              }
            >
              Ver reporte
            </Button>
            {asistenciaReporteRows !== null && (
              <Box sx={{ mt: 2 }}>
                {asistenciaReporteRows.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Sin registros en el período.
                  </Typography>
                ) : (
                  asistenciaReporteRows.map((r, i) => (
                    <Box
                      key={r.idAsistencia ?? i}
                      sx={{ py: 0.75, borderBottom: '1px solid rgba(21,44,112,0.08)' }}
                    >
                      <Typography variant="body2" fontWeight={600}>
                        {r.nombre ?? r.nombreVoluntaria ?? `Voluntaria #${r.idVoluntaria ?? i}`}{' '}
                        {r.apellido ?? ''}
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        {r.fechaHoraIngreso
                          ? `Entrada: ${new Date(r.fechaHoraIngreso).toLocaleString('es-AR')}`
                          : '—'}
                        {r.fechaHoraSalida
                          ? ` · Salida: ${new Date(r.fechaHoraSalida).toLocaleString('es-AR')}`
                          : ''}
                      </Typography>
                    </Box>
                  ))
                )}
              </Box>
            )}
            <Divider sx={{ my: 2 }} />
            <TextField
              label="ID de la asistencia"
              value={idAsistenciaDel}
              onChange={(e) => setIdAsistenciaDel(e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
              inputProps={{ inputMode: 'numeric' }}
            />
            <Button
              color="error"
              variant="outlined"
              onClick={() => {
                const id = Number(idAsistenciaDel);
                if (!Number.isFinite(id)) return;
                openConfirm(`¿Eliminar asistencia ${id}?`, () => dispatch(postAssistanceDelete(id)));
              }}
            >
              Eliminar asistencia
            </Button>
          </TabPanel>

          {/* ── 2: Usuarios ── */}
          <TabPanel value={tab} index={2}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
              <Button variant="outlined" size="small" onClick={() => dispatch(getUsuarios())}>
                Ver todos los usuarios
              </Button>
              <Button variant="outlined" size="small" onClick={() => dispatch(getVoluntariasSinUsuario())}>
                Voluntarias sin usuario
              </Button>
            </Box>
            {Array.isArray(usuariosList) && usuariosList.length > 0 && (
              <Box sx={{ mb: 2 }}>
                {usuariosList.map((u) => (
                  <Box
                    key={u.idUsuario ?? u.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 0.75,
                      borderBottom: '1px solid rgba(21,44,112,0.08)',
                    }}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {u.nombre ?? u.voluntariaNombre ?? `Usuario #${u.idUsuario ?? u.id}`}{' '}
                        {u.apellido ?? ''}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        DNI {u.dni ?? '—'}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      #{u.idUsuario ?? u.id}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Nuevo usuario
            </Typography>
            {Array.isArray(volsSinUsuario) && volsSinUsuario.length > 0 ? (
              <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                <InputLabel>Voluntaria</InputLabel>
                <Select
                  value={usuarioForm.idVoluntaria}
                  label="Voluntaria"
                  onChange={(e) => {
                    const selId = e.target.value;
                    const vol = volsSinUsuario.find(
                      (v) => String(v.idVoluntaria ?? v.id) === String(selId),
                    );
                    setUsuarioForm((f) => ({
                      ...f,
                      idVoluntaria: selId,
                      dni: vol?.dni != null ? String(vol.dni) : f.dni,
                    }));
                  }}
                >
                  {volsSinUsuario.map((v) => (
                    <MenuItem key={v.idVoluntaria ?? v.id} value={String(v.idVoluntaria ?? v.id)}>
                      {v.nombre} {v.apellido} — DNI {v.dni}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TextField
                label="ID de voluntaria"
                value={usuarioForm.idVoluntaria}
                onChange={(e) => setUsuarioForm((f) => ({ ...f, idVoluntaria: e.target.value }))}
                fullWidth
                size="small"
                sx={{ mb: 1 }}
                inputProps={{ inputMode: 'numeric' }}
              />
            )}
            <TextField
              label="DNI"
              value={usuarioForm.dni}
              onChange={(e) => setUsuarioForm((f) => ({ ...f, dni: e.target.value }))}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
              inputProps={{ inputMode: 'numeric' }}
            />
            <TextField
              label="Contraseña"
              type="password"
              value={usuarioForm.contrasena}
              onChange={(e) => setUsuarioForm((f) => ({ ...f, contrasena: e.target.value }))}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
            />
            <Button
              variant="contained"
              onClick={() => {
                dispatch(
                  postUsuario({
                    dni: Number(usuarioForm.dni),
                    contrasena: usuarioForm.contrasena || null,
                    idVoluntaria: Number(usuarioForm.idVoluntaria),
                    fechaCreacion: new Date().toISOString(),
                    idEstado: null,
                  }),
                );
              }}
            >
              Crear usuario
            </Button>
            <Divider sx={{ my: 2 }} />

            <TextField
              label="ID del usuario"
              value={usuarioIdBuscar}
              onChange={(e) => setUsuarioIdBuscar(e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
              inputProps={{ inputMode: 'numeric' }}
            />
            <Button variant="outlined" onClick={() => dispatch(getUsuarioById(Number(usuarioIdBuscar)))}>
              Buscar usuario
            </Button>
            <TextField
              label="Datos del usuario (JSON)"
              value={usuarioJsonEdit}
              onChange={(e) => setUsuarioJsonEdit(e.target.value)}
              fullWidth
              multiline
              minRows={5}
              size="small"
              sx={{ mt: 1 }}
            />
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Button
                variant="contained"
                onClick={() => {
                  const id = Number(usuarioIdBuscar);
                  const body = safeJsonParse(usuarioJsonEdit, {});
                  if (!Number.isFinite(id)) return;
                  dispatch(putUsuario(id, body));
                }}
              >
                Guardar usuario
              </Button>
            </Box>
            <Divider sx={{ my: 2 }} />

            <TextField
              label="ID del usuario (baja)"
              value={idUsuarioDel}
              onChange={(e) => setIdUsuarioDel(e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
              inputProps={{ inputMode: 'numeric' }}
            />
            <Button
              color="error"
              variant="outlined"
              onClick={() => {
                const id = Number(idUsuarioDel);
                if (!Number.isFinite(id)) return;
                openConfirm(`¿Eliminar usuario ${id}?`, () => dispatch(postUsuarioDelete(id)));
              }}
            >
              Eliminar usuario
            </Button>
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Cambiar contraseña (sesión actual)
            </Typography>
            <TextField
              label="Contraseña actual"
              type="password"
              value={contrasenaForm.ContrasenaActual}
              onChange={(e) => setContrasenaForm((f) => ({ ...f, ContrasenaActual: e.target.value }))}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
            />
            <TextField
              label="Contraseña nueva"
              type="password"
              value={contrasenaForm.ContrasenaNueva}
              onChange={(e) => setContrasenaForm((f) => ({ ...f, ContrasenaNueva: e.target.value }))}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
            />
            <Button
              variant="contained"
              disabled={!contrasenaForm.ContrasenaActual || !contrasenaForm.ContrasenaNueva}
              onClick={() => dispatch(putUsuarioContrasena(contrasenaForm))}
            >
              Cambiar contraseña
            </Button>
          </TabPanel>

          {/* ── 3: Bajas ── */}
          <TabPanel value={tab} index={3}>
            <TextField
              label="ID de la madre"
              value={idMadreDel}
              onChange={(e) => setIdMadreDel(e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
              inputProps={{ inputMode: 'numeric' }}
            />
            <Button
              color="error"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              onClick={() => {
                const id = Number(idMadreDel);
                if (!Number.isFinite(id)) return;
                openConfirm(`¿Dar de baja madre ${id}?`, () => dispatch(postMotherDelete(id)));
              }}
            >
              Baja madre
            </Button>
            <TextField
              label="ID de la voluntaria"
              value={idVolDel}
              onChange={(e) => setIdVolDel(e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
              inputProps={{ inputMode: 'numeric' }}
            />
            <Button
              color="error"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              onClick={() => {
                const id = Number(idVolDel);
                if (!Number.isFinite(id)) return;
                openConfirm(`¿Dar de baja voluntaria ${id}?`, () => dispatch(postVolunteerDelete(id)));
              }}
            >
              Baja voluntaria
            </Button>
            <TextField
              label="ID del bebé"
              value={idBebeDel}
              onChange={(e) => setIdBebeDel(e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
              inputProps={{ inputMode: 'numeric' }}
            />
            <Button
              color="error"
              variant="outlined"
              fullWidth
              onClick={() => {
                const id = Number(idBebeDel);
                if (!Number.isFinite(id)) return;
                openConfirm(`¿Dar de baja bebé ${id}?`, () => dispatch(postBabyDelete(id)));
              }}
            >
              Baja bebé
            </Button>
          </TabPanel>

          {/* ── 4: Insumos ── */}
          <TabPanel value={tab} index={4}>
            <TextField
              label="ID del insumo"
              value={idInsumo}
              onChange={(e) => setIdInsumo(e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
              inputProps={{ inputMode: 'numeric' }}
            />
            <Button variant="outlined" onClick={() => dispatch(getSupplyById(Number(idInsumo)))}>
              Cargar insumo
            </Button>
            <TextField
              label="Datos del insumo (JSON)"
              value={insumoJson}
              onChange={(e) => setInsumoJson(e.target.value)}
              fullWidth
              multiline
              minRows={6}
              size="small"
              sx={{ mt: 1 }}
            />
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Button
                variant="contained"
                onClick={() => {
                  const id = Number(idInsumo);
                  const body = safeJsonParse(insumoJson, {});
                  if (!Number.isFinite(id)) return;
                  dispatch(putSupplyById(id, body));
                }}
              >
                Guardar insumo
              </Button>
              <Button
                color="error"
                variant="outlined"
                onClick={() => {
                  const id = Number(idInsumo);
                  if (!Number.isFinite(id)) return;
                  openConfirm(`¿Eliminar insumo ${id}?`, () => dispatch(postSupplyDelete(id)));
                }}
              >
                Eliminar
              </Button>
            </Box>
          </TabPanel>

          {/* ── 5: Tareas ── */}
          <TabPanel value={tab} index={5}>
            <Button variant="outlined" fullWidth sx={{ mb: 2 }} onClick={() => dispatch(getTareas())}>
              Cargar lista de tareas
            </Button>
            {Array.isArray(tareasList) && tareasList.length > 0 && (
              <Box sx={{ mb: 2 }}>
                {tareasList.map((t) => (
                  <Box
                    key={t.idTarea}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 0.75,
                      borderBottom: '1px solid #eee',
                    }}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {t.nombre}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t.Estado ? 'Activa' : 'Inactiva'} · {t.esUnica ? 'Única' : 'Múltiple'}
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      onClick={() => {
                        setTareaEditId(String(t.idTarea));
                        dispatch(getTareaById(t.idTarea));
                      }}
                    >
                      Editar
                    </Button>
                  </Box>
                ))}
              </Box>
            )}
            {Array.isArray(tareasList) && tareasList.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                No hay tareas registradas.
              </Typography>
            )}
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Nueva tarea
            </Typography>
            <TextField
              label="Nombre"
              value={tareaForm.nombre}
              onChange={(e) => setTareaForm((f) => ({ ...f, nombre: e.target.value }))}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={tareaForm.Estado}
                  onChange={(e) => setTareaForm((f) => ({ ...f, Estado: e.target.checked }))}
                />
              }
              label="Activa"
              sx={{ mb: 0.5, display: 'flex' }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={tareaForm.esUnica}
                  onChange={(e) => setTareaForm((f) => ({ ...f, esUnica: e.target.checked }))}
                />
              }
              label="Es única (una activa a la vez)"
              sx={{ mb: 1, display: 'flex' }}
            />
            <Button
              variant="contained"
              disabled={!tareaForm.nombre.trim()}
              onClick={() => {
                dispatch(
                  postTarea({
                    nombre: tareaForm.nombre.trim(),
                    Estado: tareaForm.Estado,
                    esUnica: tareaForm.esUnica,
                  }),
                );
                setTareaForm({ nombre: '', Estado: true, esUnica: false });
              }}
            >
              Crear tarea
            </Button>
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Editar / eliminar
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                label="ID de tarea"
                value={tareaEditId}
                onChange={(e) => setTareaEditId(e.target.value)}
                size="small"
                sx={{ flex: 1 }}
                inputProps={{ inputMode: 'numeric' }}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  const id = Number(tareaEditId);
                  if (!Number.isFinite(id)) return;
                  dispatch(getTareaById(id));
                }}
              >
                Cargar
              </Button>
            </Box>
            {tarea?.getTareaById != null && (
              <>
                <TextField
                  label="Nombre"
                  value={tareaEditForm.nombre}
                  onChange={(e) => setTareaEditForm((f) => ({ ...f, nombre: e.target.value }))}
                  fullWidth
                  size="small"
                  sx={{ mb: 1 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={tareaEditForm.Estado}
                      onChange={(e) => setTareaEditForm((f) => ({ ...f, Estado: e.target.checked }))}
                    />
                  }
                  label="Activa"
                  sx={{ mb: 0.5, display: 'flex' }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={tareaEditForm.esUnica}
                      onChange={(e) =>
                        setTareaEditForm((f) => ({ ...f, esUnica: e.target.checked }))
                      }
                    />
                  }
                  label="Es única"
                  sx={{ mb: 1, display: 'flex' }}
                />
              </>
            )}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                disabled={!tareaEditId || !tareaEditForm.nombre.trim()}
                onClick={() => {
                  const id = Number(tareaEditId);
                  if (!Number.isFinite(id)) return;
                  dispatch(
                    putTarea(id, {
                      nombre: tareaEditForm.nombre.trim(),
                      Estado: tareaEditForm.Estado,
                      esUnica: tareaEditForm.esUnica,
                    }),
                  );
                }}
              >
                Guardar cambios
              </Button>
              <Button
                color="error"
                variant="outlined"
                disabled={!tareaEditId}
                onClick={() => {
                  const id = Number(tareaEditId);
                  if (!Number.isFinite(id)) return;
                  openConfirm(`¿Eliminar tarea ${id}?`, () => dispatch(postTareaDelete(id)));
                }}
              >
                Eliminar
              </Button>
            </Box>
          </TabPanel>

          {/* ── 6: Visitas ── */}
          <TabPanel value={tab} index={6}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Visitas por bebé
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                label="ID del bebé"
                value={visitaBebeId}
                onChange={(e) => setVisitaBebeId(e.target.value)}
                size="small"
                sx={{ flex: 1 }}
                inputProps={{ inputMode: 'numeric' }}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  const id = Number(visitaBebeId);
                  if (!Number.isFinite(id)) return;
                  dispatch(getVisitasByBebe(id));
                }}
              >
                Buscar
              </Button>
            </Box>
            {Array.isArray(visitasList) && visitasList.length > 0 && (
              <Box sx={{ mb: 2 }}>
                {visitasList.map((v) => (
                  <Box key={v.idVisita} sx={{ py: 0.75, borderBottom: '1px solid #eee' }}>
                    <Typography variant="body2" fontWeight={600}>
                      {v.nombreVisitante}
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      {v.familiar} ·{' '}
                      {v.fechaHoraVisita
                        ? new Date(v.fechaHoraVisita).toLocaleString('es-AR')
                        : '—'}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
            {Array.isArray(visitasList) &&
              visitasList.length === 0 &&
              visita?.getVisitasByBebe != null && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Sin visitas para ese bebé.
                </Typography>
              )}
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Registrar visita
            </Typography>
            <TextField
              label="ID del bebé"
              value={visitaForm.idBebe}
              onChange={(e) => setVisitaForm((f) => ({ ...f, idBebe: e.target.value }))}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
              inputProps={{ inputMode: 'numeric' }}
            />
            <TextField
              label="Nombre del visitante"
              value={visitaForm.nombreVisitante}
              onChange={(e) => setVisitaForm((f) => ({ ...f, nombreVisitante: e.target.value }))}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
            />
            <TextField
              label="Vínculo familiar"
              value={visitaForm.familiar}
              onChange={(e) => setVisitaForm((f) => ({ ...f, familiar: e.target.value }))}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
              placeholder="Ej: Madre, Padre, Abuelos"
            />
            <TextField
              label="Fecha y hora"
              type="datetime-local"
              value={visitaForm.fechaHoraVisita}
              onChange={(e) => setVisitaForm((f) => ({ ...f, fechaHoraVisita: e.target.value }))}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Documento visitante (opcional)"
              value={visitaForm.documentoVisitante}
              onChange={(e) => setVisitaForm((f) => ({ ...f, documentoVisitante: e.target.value }))}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
              inputProps={{ inputMode: 'numeric' }}
            />
            <TextField
              label="Teléfono (opcional)"
              value={visitaForm.telefonoVisitante}
              onChange={(e) => setVisitaForm((f) => ({ ...f, telefonoVisitante: e.target.value }))}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
              inputProps={{ inputMode: 'numeric' }}
            />
            <Button
              variant="contained"
              disabled={
                !visitaForm.idBebe ||
                !visitaForm.nombreVisitante ||
                !visitaForm.familiar ||
                !visitaForm.fechaHoraVisita
              }
              onClick={() => {
                dispatch(
                  postVisita({
                    idBebe: Number(visitaForm.idBebe),
                    nombreVisitante: visitaForm.nombreVisitante,
                    familiar: visitaForm.familiar,
                    fechaHoraVisita: new Date(visitaForm.fechaHoraVisita).toISOString(),
                    documentoVisitante:
                      visitaForm.documentoVisitante !== '' ? visitaForm.documentoVisitante : null,
                    telefonoVisitante:
                      visitaForm.telefonoVisitante !== '' ? visitaForm.telefonoVisitante : null,
                  }),
                );
                setVisitaForm(VISITA_FORM_INIT);
              }}
            >
              Registrar visita
            </Button>
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Editar / eliminar visita
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                label="ID de visita"
                value={visitaEditId}
                onChange={(e) => setVisitaEditId(e.target.value)}
                size="small"
                sx={{ flex: 1 }}
                inputProps={{ inputMode: 'numeric' }}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  const id = Number(visitaEditId);
                  if (!Number.isFinite(id)) return;
                  dispatch(getVisitaById(id));
                }}
              >
                Cargar
              </Button>
            </Box>
            <TextField
              label="Datos de la visita (JSON)"
              value={visitaEditJson}
              onChange={(e) => setVisitaEditJson(e.target.value)}
              fullWidth
              multiline
              minRows={5}
              size="small"
              sx={{ mb: 1 }}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                disabled={!visitaEditId}
                onClick={() => {
                  const id = Number(visitaEditId);
                  const body = safeJsonParse(visitaEditJson, {});
                  if (!Number.isFinite(id)) return;
                  dispatch(putVisita(id, body));
                }}
              >
                Guardar visita
              </Button>
              <Button
                color="error"
                variant="outlined"
                disabled={!visitaEditId}
                onClick={() => {
                  const id = Number(visitaEditId);
                  if (!Number.isFinite(id)) return;
                  openConfirm(`¿Eliminar visita ${id}?`, () => dispatch(postVisitaDelete(id)));
                }}
              >
                Eliminar
              </Button>
            </Box>
          </TabPanel>
        </Paper>
      </PageScrollMain>

      <Dialog open={confirmDialog.open} onClose={handleCancelConfirm} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, color: '#152C70' }}>Confirmar</DialogTitle>
        <DialogContent>
          <Typography>{confirmDialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelConfirm}>Cancelar</Button>
          <Button onClick={handleConfirm} color="error" variant="contained">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  );
};

export default CoordinacionPage;
