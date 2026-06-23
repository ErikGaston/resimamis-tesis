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
import { postBabyDelete, clearBabyWrites, getBabys } from '../../redux/actions/babyActions';
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
import Loading from '../../components/atoms/loading/Loading';
import { showLoading } from '../../redux/actions/loadingActions';

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
  const loading = useSelector((s) => s.assignmentReducer?.loading);

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

  // ── Dismiss loading on individual GET results ──
  useEffect(() => {
    if (user?.getUsuarioById != null) {
      dispatch(showLoading(false));
      setUsuarioJsonEdit(JSON.stringify(user.getUsuarioById, null, 2));
    }
  }, [user?.getUsuarioById, dispatch]);

  useEffect(() => {
    if (supply?.getSupplyById != null) {
      dispatch(showLoading(false));
      try {
        setInsumoJson(JSON.stringify(supply.getSupplyById, null, 2));
      } catch {
        setInsumoJson('{}');
      }
    }
  }, [supply?.getSupplyById, dispatch]);

  useEffect(() => {
    if (tarea?.getTareaById != null) {
      dispatch(showLoading(false));
      const t = tarea.getTareaById;
      setTareaEditForm({
        nombre: t?.nombre ?? '',
        Estado: t?.Estado ?? true,
        esUnica: t?.esUnica ?? false,
      });
    }
  }, [tarea?.getTareaById, dispatch]);

  useEffect(() => {
    if (visita?.getVisitaById != null) {
      dispatch(showLoading(false));
      try {
        setVisitaEditJson(JSON.stringify(visita.getVisitaById, null, 2));
      } catch {
        setVisitaEditJson('{}');
      }
    }
  }, [visita?.getVisitaById, dispatch]);

  // ── Success effects (write operations) ──
  useEffect(() => {
    if (assignment?.postResetAbrazosColgados != null) {
      dispatch(showLoading(false));
      toastOk('Operación de asignación ejecutada.');
      dispatch(clearAssignmentWrites());
    }
  }, [assignment?.postResetAbrazosColgados, dispatch, toastOk]);

  useEffect(() => {
    if (assignment?.putAssignmentById != null || assignment?.deleteAssignmentById != null) {
      dispatch(showLoading(false));
      toastOk('Asignación actualizada.');
      dispatch(clearAssignmentWrites());
    }
  }, [assignment?.putAssignmentById, assignment?.deleteAssignmentById, dispatch, toastOk]);

  useEffect(() => {
    if (volunteer?.postAssistanceDelete != null || volunteer?.postVolunteerDelete != null) {
      dispatch(showLoading(false));
      toastOk('Baja registrada.');
      dispatch(clearVolunteerWrites());
    }
  }, [volunteer?.postAssistanceDelete, volunteer?.postVolunteerDelete, dispatch, toastOk]);

  useEffect(() => {
    if (user?.postUsuario != null || user?.putUsuario != null || user?.postUsuarioDelete != null) {
      dispatch(showLoading(false));
      toastOk('Usuario: operación OK.');
      dispatch(clearUserAdmin());
    }
  }, [user?.postUsuario, user?.putUsuario, user?.postUsuarioDelete, dispatch, toastOk]);

  useEffect(() => {
    if (user?.putUsuarioContrasena != null) {
      dispatch(showLoading(false));
      toastOk('Contraseña actualizada.');
      setContrasenaForm({ ContrasenaActual: '', ContrasenaNueva: '' });
      dispatch(clearUserAdmin());
    }
  }, [user?.putUsuarioContrasena, dispatch, toastOk]);

  useEffect(() => {
    if (mother?.postMotherDelete != null) {
      dispatch(showLoading(false));
      toastOk('Madre dada de baja.');
      dispatch(clearMotherWrites());
    }
  }, [mother?.postMotherDelete, dispatch, toastOk]);

  useEffect(() => {
    if (baby?.postBabyDelete != null) {
      dispatch(showLoading(false));
      toastOk('Bebé dado de baja.');
      dispatch(clearBabyWrites());
    }
  }, [baby?.postBabyDelete, dispatch, toastOk]);

  useEffect(() => {
    if (supply?.putSupplyById != null || supply?.postSupplyDelete != null) {
      dispatch(showLoading(false));
      toastOk('Insumo actualizado.');
      dispatch(clearSupplyWrites());
    }
  }, [supply?.putSupplyById, supply?.postSupplyDelete, dispatch, toastOk]);

  useEffect(() => {
    if (tarea?.postTarea != null || tarea?.putTarea != null || tarea?.postTareaDelete != null) {
      dispatch(showLoading(false));
      toastOk('Tarea: operación OK.');
      dispatch(clearTareaWrites());
      dispatch(getTareas());
    }
  }, [tarea?.postTarea, tarea?.putTarea, tarea?.postTareaDelete, dispatch, toastOk]);

  useEffect(() => {
    if (visita?.postVisita != null || visita?.putVisita != null || visita?.postVisitaDelete != null) {
      dispatch(showLoading(false));
      toastOk('Visita: operación OK.');
      dispatch(clearVisitaWrites());
      if (visitaBebeId) dispatch(getVisitasByBebe(Number(visitaBebeId)));
    }
  }, [visita?.postVisita, visita?.putVisita, visita?.postVisitaDelete, dispatch, toastOk, visitaBebeId]);

  // ── Dismiss loading on list-type GET results and errors ──
  useEffect(() => {
    const anyResult = [
      user?.getUsuarios,
      user?.getVoluntariasSinUsuario,
      volunteer?.getAssistanceReporte,
      tarea?.getTareas,
      visita?.getVisitasByBebe,
    ].some((r) => r != null);
    const anyError = [
      assignment?.error,
      volunteer?.error,
      user?.error,
      mother?.error,
      supply?.error,
      tarea?.error,
      visita?.error,
    ].some((e) => e != null);
    if (anyResult || anyError) dispatch(showLoading(false));
  }, [
    user?.getUsuarios,
    user?.getVoluntariasSinUsuario,
    volunteer?.getAssistanceReporte,
    tarea?.getTareas,
    visita?.getVisitasByBebe,
    assignment?.error,
    volunteer?.error,
    user?.error,
    mother?.error,
    supply?.error,
    tarea?.error,
    visita?.error,
    dispatch,
  ]);

  // ── Initial load ──
  useEffect(() => {
    dispatch(showLoading(true));
    dispatch(getBabys());
  }, [dispatch]);

  useEffect(() => {
    if (baby?.getBabys != null || baby?.error != null) {
      dispatch(showLoading(false));
    }
  }, [baby?.getBabys, baby?.error, dispatch]);

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

  const babyOptions = Array.isArray(baby?.getBabys?.data)
    ? baby.getBabys.data.map((b) => ({
        id: b.ID ?? b.id,
        label: `${b.nombre ?? ''} ${b.apellido ?? ''}`.trim(),
      }))
    : [];

  const asistenciaReporteRows = (() => {
    const raw = volunteer?.getAssistanceReporte;
    if (!raw) return null;
    const d = raw?.data ?? raw;
    if (Array.isArray(d)) return d;
    return [];
  })();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, width: '100%', position: 'relative' }}>
      {loading && <Loading position="absolute" height="100%" />}
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
                  () => { dispatch(showLoading(true)); dispatch(postResetAbrazosColgados()); },
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
                  dispatch(showLoading(true));
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
                  openConfirm(`¿Eliminar asignación ${id}?`, () => { dispatch(showLoading(true)); dispatch(deleteAssignmentById(id)); });
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
              onClick={() => {
                dispatch(showLoading(true));
                dispatch(
                  getAssistanceReporte({
                    fechaInicio: new Date(repIni).toISOString(),
                    fechaFin: new Date(repFin).toISOString(),
                  }),
                );
              }}
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
                openConfirm(`¿Eliminar asistencia ${id}?`, () => { dispatch(showLoading(true)); dispatch(postAssistanceDelete(id)); });
              }}
            >
              Eliminar asistencia
            </Button>
          </TabPanel>

          {/* ── 2: Usuarios ── */}
          <TabPanel value={tab} index={2}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
              <Button variant="outlined" size="small" onClick={() => { dispatch(showLoading(true)); dispatch(getUsuarios()); }}>
                Ver todos los usuarios
              </Button>
              <Button variant="outlined" size="small" onClick={() => { dispatch(showLoading(true)); dispatch(getVoluntariasSinUsuario()); }}>
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
                dispatch(showLoading(true));
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
            <Button variant="outlined" onClick={() => { dispatch(showLoading(true)); dispatch(getUsuarioById(Number(usuarioIdBuscar))); }}>
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
                  dispatch(showLoading(true));
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
                openConfirm(`¿Eliminar usuario ${id}?`, () => { dispatch(showLoading(true)); dispatch(postUsuarioDelete(id)); });
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
              onClick={() => { dispatch(showLoading(true)); dispatch(putUsuarioContrasena(contrasenaForm)); }}
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
                openConfirm(`¿Dar de baja madre ${id}?`, () => { dispatch(showLoading(true)); dispatch(postMotherDelete(id)); });
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
                openConfirm(`¿Dar de baja voluntaria ${id}?`, () => { dispatch(showLoading(true)); dispatch(postVolunteerDelete(id)); });
              }}
            >
              Baja voluntaria
            </Button>
            <FormControl fullWidth size="small" sx={{ mb: 1 }}>
              <InputLabel>Bebé</InputLabel>
              <Select
                value={idBebeDel}
                label="Bebé"
                onChange={(e) => setIdBebeDel(e.target.value)}
              >
                {babyOptions.map((b) => (
                  <MenuItem key={b.id} value={String(b.id)}>
                    {b.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              color="error"
              variant="outlined"
              fullWidth
              onClick={() => {
                const id = Number(idBebeDel);
                if (!Number.isInteger(id) || id <= 0) return;
                openConfirm(`¿Dar de baja bebé ${id}?`, () => { dispatch(showLoading(true)); dispatch(postBabyDelete(id)); });
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
            <Button
              variant="outlined"
              onClick={() => { dispatch(showLoading(true)); dispatch(getSupplyById(Number(idInsumo))); }}
            >
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
                  dispatch(showLoading(true));
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
                  openConfirm(`¿Eliminar insumo ${id}?`, () => { dispatch(showLoading(true)); dispatch(postSupplyDelete(id)); });
                }}
              >
                Eliminar
              </Button>
            </Box>
          </TabPanel>

          {/* ── 5: Tareas ── */}
          <TabPanel value={tab} index={5}>
            <Button variant="outlined" fullWidth sx={{ mb: 2 }} onClick={() => { dispatch(showLoading(true)); dispatch(getTareas()); }}>
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
                        dispatch(showLoading(true));
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
                dispatch(showLoading(true));
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
                  dispatch(showLoading(true));
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
                  dispatch(showLoading(true));
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
                  openConfirm(`¿Eliminar tarea ${id}?`, () => { dispatch(showLoading(true)); dispatch(postTareaDelete(id)); });
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
              <FormControl size="small" sx={{ flex: 1 }}>
                <InputLabel>Bebé</InputLabel>
                <Select
                  value={visitaBebeId}
                  label="Bebé"
                  onChange={(e) => setVisitaBebeId(e.target.value)}
                >
                  {babyOptions.map((b) => (
                    <MenuItem key={b.id} value={String(b.id)}>
                      {b.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                onClick={() => {
                  const id = Number(visitaBebeId);
                  if (!Number.isInteger(id) || id <= 0) return;
                  dispatch(showLoading(true));
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
            <FormControl fullWidth size="small" sx={{ mb: 1 }}>
              <InputLabel>Bebé</InputLabel>
              <Select
                value={visitaForm.idBebe}
                label="Bebé"
                onChange={(e) => setVisitaForm((f) => ({ ...f, idBebe: e.target.value }))}
              >
                {babyOptions.map((b) => (
                  <MenuItem key={b.id} value={String(b.id)}>
                    {b.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
                dispatch(showLoading(true));
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
                  dispatch(showLoading(true));
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
                  dispatch(showLoading(true));
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
                  openConfirm(`¿Eliminar visita ${id}?`, () => { dispatch(showLoading(true)); dispatch(postVisitaDelete(id)); });
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
