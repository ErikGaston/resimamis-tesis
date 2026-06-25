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
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PeopleIcon from '@mui/icons-material/People';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
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
  clearVolunteerWrites,
} from '../../redux/actions/volunteerActions';
import {
  postUsuario,
  putUsuario,
  postUsuarioDelete,
  clearUserAdmin,
  getUsuarios,
  getVoluntariasSinUsuario,
} from '../../redux/actions/userActions';
import {
  getTareas,
  getTareaById,
  postTarea,
  putTarea,
  postTareaDelete,
  clearTareaWrites,
} from '../../redux/actions/tareaActions';
import { getMother, postMotherDelete, clearMotherWrites } from '../../redux/actions/motherActions';
import { getBabys, postBabyDelete, clearBabyWrites } from '../../redux/actions/babyActions';
import { showToast } from '../../redux/actions/toastActions';
import Loading from '../../components/atoms/loading/Loading';
import { showLoading } from '../../redux/actions/loadingActions';

const VIOLET = '#7A659B';
const VIOLET_LIGHT = '#F3EEFF';

const MENU_ITEMS = [
  { label: 'Asignación', icon: <AssignmentIcon /> },
  { label: 'Asistencia', icon: <EventNoteIcon /> },
  { label: 'Usuarios', icon: <PeopleIcon /> },
  { label: 'Tareas', icon: <PlaylistAddCheckIcon /> },
  { label: 'Bajas', icon: <PersonRemoveIcon /> },
];

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
    raw.listadoUsuarios,
    raw.listadoVoluntaria,
  ];
  for (const c of candidates) {
    if (Array.isArray(c)) return c;
  }
  return [];
}

export const CoordinacionPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isCoord = isCoordinadoraSession();

  const assignment = useSelector((s) => s.assignmentReducer);
  const volunteer = useSelector((s) => s.volunteerReducer);
  const user = useSelector((s) => s.userReducer);
  const tarea = useSelector((s) => s.tareaReducer);
  const mother = useSelector((s) => s.motherReducer);
  const baby = useSelector((s) => s.babyReducer);
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
  const [editUserTarget, setEditUserTarget] = useState(null);
  const [editUserDni, setEditUserDni] = useState('');
  const [editUserPwd, setEditUserPwd] = useState('');

  // Tareas
  const [tareaForm, setTareaForm] = useState({ nombre: '', Estado: true, esUnica: false });
  const [tareaEditId, setTareaEditId] = useState('');
  const [tareaEditForm, setTareaEditForm] = useState({ nombre: '', Estado: true, esUnica: false });

  // Bajas
  const [bajasSubTab, setBajasSubTab] = useState('madres');
  const [bajasSearch, setBajasSearch] = useState('');

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

  // Auto-cargar datos al cambiar de pestaña
  useEffect(() => {
    if (tab === 2) {
      dispatch(showLoading(true));
      dispatch(getUsuarios());
      dispatch(getVoluntariasSinUsuario());
    } else if (tab === 3) {
      dispatch(showLoading(true));
      dispatch(getTareas());
    } else if (tab === 4) {
      dispatch(showLoading(true));
      dispatch(getBabys());
      dispatch(getMother());
    }
  }, [tab, dispatch]);

  // Tarea detail loaded
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

  // Success effects (write operations)
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
    if (volunteer?.postAssistanceDelete != null) {
      dispatch(showLoading(false));
      toastOk('Asistencia eliminada.');
      dispatch(clearVolunteerWrites());
    }
  }, [volunteer?.postAssistanceDelete, dispatch, toastOk]);

  useEffect(() => {
    if (user?.postUsuario != null || user?.putUsuario != null || user?.postUsuarioDelete != null) {
      dispatch(showLoading(false));
      toastOk('Usuario: operación OK.');
      setEditUserTarget(null);
      setEditUserDni('');
      setEditUserPwd('');
      setUsuarioForm({ dni: '', contrasena: '', idVoluntaria: '' });
      dispatch(clearUserAdmin());
      dispatch(getUsuarios());
      dispatch(getVoluntariasSinUsuario());
    }
  }, [user?.postUsuario, user?.putUsuario, user?.postUsuarioDelete, dispatch, toastOk]);

  useEffect(() => {
    if (tarea?.postTarea != null || tarea?.putTarea != null || tarea?.postTareaDelete != null) {
      dispatch(showLoading(false));
      toastOk('Tarea: operación OK.');
      dispatch(clearTareaWrites());
      dispatch(getTareas());
    }
  }, [tarea?.postTarea, tarea?.putTarea, tarea?.postTareaDelete, dispatch, toastOk]);

  useEffect(() => {
    if (mother?.postMotherDelete != null) {
      dispatch(showLoading(false));
      toastOk('Madre dada de baja.');
      dispatch(clearMotherWrites());
      dispatch(getMother());
    }
  }, [mother?.postMotherDelete, dispatch, toastOk]);

  useEffect(() => {
    if (baby?.postBabyDelete != null) {
      dispatch(showLoading(false));
      toastOk('Bebé dado de baja.');
      dispatch(clearBabyWrites());
      dispatch(getBabys());
    }
  }, [baby?.postBabyDelete, dispatch, toastOk]);

  // Dismiss loading on list GET results and errors
  useEffect(() => {
    const anyResult = [
      user?.getUsuarios,
      user?.getVoluntariasSinUsuario,
      volunteer?.getAssistanceReporte,
      tarea?.getTareas,
      mother?.getMother,
      baby?.getBabys,
    ].some((r) => r != null);
    const anyError = [
      assignment?.error,
      volunteer?.error,
      user?.error,
      user?.userAdminError,
      tarea?.error,
      mother?.error,
      baby?.error,
    ].some((e) => e != null);
    if (anyResult || anyError) dispatch(showLoading(false));
  }, [
    user?.getUsuarios,
    user?.getVoluntariasSinUsuario,
    volunteer?.getAssistanceReporte,
    tarea?.getTareas,
    mother?.getMother,
    baby?.getBabys,
    assignment?.error,
    volunteer?.error,
    user?.error,
    user?.userAdminError,
    tarea?.error,
    mother?.error,
    baby?.error,
    dispatch,
  ]);

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
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, width: '100%', position: 'relative' }}>
      {loading && <Loading position="absolute" height="100%" />}
      <PageHeader title="Coordinación" />
      <PageScrollMain>
        <Paper elevation={0} sx={{ p: 2, mx: 1, mb: 2, borderRadius: 2 }}>

          {/* Card-grid menu */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 2 }}>
            {MENU_ITEMS.map((item, index) => (
              <Paper
                key={index}
                elevation={tab === index ? 2 : 0}
                onClick={() => setTab(index)}
                sx={{
                  p: 1.5,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.5,
                  cursor: 'pointer',
                  borderRadius: 2,
                  border: `2px solid ${tab === index ? VIOLET : 'rgba(0,0,0,0.08)'}`,
                  bgcolor: tab === index ? VIOLET_LIGHT : 'background.paper',
                  transition: 'border-color 0.15s, background-color 0.15s',
                  userSelect: 'none',
                  '&:active': { opacity: 0.85 },
                }}
              >
                <Box sx={{ color: tab === index ? VIOLET : 'text.secondary', display: 'flex', '& svg': { fontSize: 28 } }}>
                  {item.icon}
                </Box>
                <Typography
                  variant="caption"
                  fontWeight={tab === index ? 700 : 500}
                  color={tab === index ? VIOLET : 'text.secondary'}
                  textAlign="center"
                  lineHeight={1.2}
                >
                  {item.label}
                </Typography>
              </Paper>
            ))}
          </Box>

          {/* ── 0: Asignación ── */}
          <TabPanel value={tab} index={0}>
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
            <Button
              variant="outlined"
              color="warning"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() =>
                openConfirm(
                  '¿Cerrar todos los abrazos sin finalizar de días anteriores?',
                  () => { dispatch(showLoading(true)); dispatch(postResetAbrazosColgados()); },
                )
              }
            >
              Cerrar abrazos sin finalizar
            </Button>
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
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, color: '#152C70' }}>
              Voluntarias con acceso al sistema
            </Typography>

            {Array.isArray(usuariosList) && usuariosList.length > 0 ? (
              <Box sx={{ mb: 2 }}>
                {usuariosList.map((u) => (
                  <Box
                    key={u.idUsuario ?? u.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1,
                      px: 0.5,
                      borderBottom: '1px solid rgba(21,44,112,0.08)',
                    }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {u.nombreVoluntaria ?? u.nombre ?? `Usuario #${u.idUsuario ?? u.id}`}{' '}
                        {u.apellidoVoluntaria ?? u.apellido ?? ''}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        DNI {u.dni ?? '—'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setEditUserTarget({
                            id: u.idUsuario ?? u.id,
                            nombre: `${u.nombreVoluntaria ?? u.nombre ?? ''} ${u.apellidoVoluntaria ?? u.apellido ?? ''}`.trim(),
                            idVoluntaria: u.idVoluntaria,
                            idEstado: u.idEstado,
                          });
                          setEditUserDni(u.dni != null ? String(u.dni) : '');
                          setEditUserPwd('');
                        }}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => {
                          const id = u.idUsuario ?? u.id;
                          openConfirm(
                            `¿Eliminar acceso de ${u.nombreVoluntaria ?? u.nombre ?? 'este usuario'}?`,
                            () => { dispatch(showLoading(true)); dispatch(postUsuarioDelete(id)); },
                          );
                        }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : Array.isArray(usuariosList) && usuariosList.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                No hay voluntarias con acceso registrado.
              </Typography>
            ) : null}

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Dar acceso a una voluntaria
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
              label="DNI de acceso"
              value={usuarioForm.dni}
              onChange={(e) => setUsuarioForm((f) => ({ ...f, dni: e.target.value }))}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
              inputProps={{ inputMode: 'numeric' }}
            />
            <TextField
              label="Contraseña (8–15 caracteres)"
              type="password"
              value={usuarioForm.contrasena}
              onChange={(e) => setUsuarioForm((f) => ({ ...f, contrasena: e.target.value }))}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
            />
            <Button
              variant="contained"
              disabled={!usuarioForm.dni || !usuarioForm.contrasena || !usuarioForm.idVoluntaria}
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
          </TabPanel>

          {/* ── 3: Tareas ── */}
          <TabPanel value={tab} index={3}>
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
              Editar / eliminar tarea
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

          {/* ── 4: Bajas ── */}
          <TabPanel value={tab} index={4}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Button
                variant={bajasSubTab === 'madres' ? 'contained' : 'outlined'}
                size="small"
                fullWidth
                onClick={() => { setBajasSubTab('madres'); setBajasSearch(''); }}
              >
                Madres
              </Button>
              <Button
                variant={bajasSubTab === 'bebes' ? 'contained' : 'outlined'}
                size="small"
                fullWidth
                onClick={() => { setBajasSubTab('bebes'); setBajasSearch(''); }}
              >
                Bebés
              </Button>
            </Box>

            <TextField
              value={bajasSearch}
              onChange={(e) => setBajasSearch(e.target.value)}
              placeholder={bajasSubTab === 'madres' ? 'Buscar por nombre o DNI…' : 'Buscar por nombre o madre…'}
              fullWidth
              size="small"
              sx={{ mb: 2 }}
            />

            {bajasSubTab === 'madres' && (() => {
              const list = mother?.getMother?.data;
              if (!Array.isArray(list)) {
                return <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', textAlign: 'center', py: 3 }}>Cargando madres…</Typography>;
              }
              const q = bajasSearch.trim().toLowerCase();
              const filtered = list.filter((m) => {
                if (!q) return true;
                const full = `${m.nombre ?? ''} ${m.apellido ?? ''}`.toLowerCase();
                const dniStr = String(m.dni ?? '');
                return full.includes(q) || dniStr.includes(q.replace(/\D/g, ''));
              });
              if (!filtered.length) {
                return <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', textAlign: 'center', py: 3 }}>Sin resultados.</Typography>;
              }
              return (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {filtered.map((m) => (
                    <Box
                      key={m.IdMadre}
                      sx={{
                        display: 'flex', alignItems: 'center', gap: 1.5,
                        p: 1.5, bgcolor: '#fff', borderRadius: 2,
                        border: '1px solid rgba(0,0,0,0.08)',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                      }}
                    >
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography noWrap sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                          {`${m.nombre ?? ''} ${m.apellido ?? ''}`.trim() || 'Sin nombre'}
                        </Typography>
                        <Typography noWrap sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>
                          DNI: {m.dni ?? '—'}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => openConfirm(
                          `¿Dar de baja a ${`${m.nombre ?? ''} ${m.apellido ?? ''}`.trim()}?`,
                          () => { dispatch(showLoading(true)); dispatch(postMotherDelete(m.IdMadre)); },
                        )}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              );
            })()}

            {bajasSubTab === 'bebes' && (() => {
              const list = baby?.getBabys?.data;
              if (!Array.isArray(list)) {
                return <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', textAlign: 'center', py: 3 }}>Cargando bebés…</Typography>;
              }
              const q = bajasSearch.trim().toLowerCase();
              const filtered = list.filter((b) => {
                if (!q) return true;
                const full = `${b.nombre ?? ''} ${b.apellido ?? ''}`.toLowerCase();
                const madreFull = `${b.madre?.nombre ?? b.madre?.Nombre ?? ''} ${b.madre?.apellido ?? b.madre?.Apellido ?? ''}`.toLowerCase().trim();
                return full.includes(q) || madreFull.includes(q);
              });
              if (!filtered.length) {
                return <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', textAlign: 'center', py: 3 }}>Sin resultados.</Typography>;
              }
              return (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {filtered.map((b) => {
                    const id = b.ID ?? b.id;
                    const nombreBebe = `${b.nombre ?? ''} ${b.apellido ?? ''}`.trim() || 'Sin nombre';
                    const salaStr = b.sala?.nombre ?? b.nombreSala ?? b.salaInternacion ?? '';
                    const madreStr = `${b.madre?.nombre ?? b.madre?.Nombre ?? ''} ${b.madre?.apellido ?? b.madre?.Apellido ?? ''}`.trim();
                    const secondary = [salaStr && `Sala: ${salaStr}`, madreStr && `Madre: ${madreStr}`].filter(Boolean).join(' · ');
                    return (
                      <Box
                        key={id}
                        sx={{
                          display: 'flex', alignItems: 'center', gap: 1.5,
                          p: 1.5, bgcolor: '#fff', borderRadius: 2,
                          border: '1px solid rgba(0,0,0,0.08)',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                        }}
                      >
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography noWrap sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                            {nombreBebe}
                          </Typography>
                          {secondary ? (
                            <Typography noWrap sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>
                              {secondary}
                            </Typography>
                          ) : null}
                        </Box>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => openConfirm(
                            `¿Dar de baja al bebé ${nombreBebe}?`,
                            () => { dispatch(showLoading(true)); dispatch(postBabyDelete(id)); },
                          )}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    );
                  })}
                </Box>
              );
            })()}
          </TabPanel>

        </Paper>
      </PageScrollMain>

      {/* Edit User Dialog */}
      <Dialog
        open={!!editUserTarget}
        onClose={() => { setEditUserTarget(null); setEditUserDni(''); setEditUserPwd(''); }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600, color: '#152C70' }}>Editar acceso</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body1" fontWeight={600} sx={{ mb: 0.5 }}>
            {editUserTarget?.nombre}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
            Nombre y apellido vienen de la voluntaria y no se editan aquí.
          </Typography>
          <TextField
            label="DNI de acceso"
            value={editUserDni}
            onChange={(e) => setEditUserDni(e.target.value)}
            fullWidth
            size="small"
            sx={{ mb: 1.5 }}
            inputProps={{ inputMode: 'numeric' }}
          />
          <TextField
            label="Nueva contraseña (dejar vacío para no cambiar)"
            type="password"
            value={editUserPwd}
            onChange={(e) => setEditUserPwd(e.target.value)}
            fullWidth
            size="small"
            helperText="8–15 caracteres si se ingresa"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setEditUserTarget(null); setEditUserDni(''); setEditUserPwd(''); }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            disabled={!editUserDni}
            onClick={() => {
              dispatch(showLoading(true));
              dispatch(
                putUsuario(editUserTarget.id, {
                  idUsuario: editUserTarget.id,
                  dni: Number(editUserDni),
                  idVoluntaria: editUserTarget.idVoluntaria,
                  contrasena: editUserPwd || '',
                  ...(editUserTarget.idEstado != null && { idEstado: editUserTarget.idEstado }),
                }),
              );
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Dialog */}
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
