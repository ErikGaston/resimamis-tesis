import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import TimerIcon from '@mui/icons-material/Timer';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import Footer from '../../components/molecules/Footer';
import PageScrollMain from '../../components/common/PageScrollMain';
import { PageHeader } from '../../components/common/PageHeader';
import { isCoordinadoraSession } from '../../utils/coordinadoraRole';
import {
  getAssignmentToday,
  putAssignmentById,
  deleteAssignmentById,
  postResetAbrazosColgados,
  clearAssignmentWrites,
} from '../../redux/actions/assignmentActions';
import {
  getAssistanceReporte,
  getAssistanceAll,
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
import { getMother, postMotherDelete, clearMotherWrites } from '../../redux/actions/motherActions';
import { getBabys, postBabyDelete, clearBabyWrites } from '../../redux/actions/babyActions';
import { showToast } from '../../redux/actions/toastActions';
import Loading from '../../components/atoms/loading/Loading';
import { showLoading } from '../../redux/actions/loadingActions';

const VIOLET = '#7A659B';
const VIOLET_LIGHT = '#F3EEFF';
const NAVY = '#152C70';

const DIALOG_FULL_SX = {
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

const MENU_ITEMS = [
  { label: 'Asignación', icon: <AssignmentIcon /> },
  { label: 'Asistencia', icon: <EventNoteIcon /> },
  { label: 'Usuarios', icon: <PeopleIcon /> },
  { label: 'Bajas', icon: <PersonRemoveIcon /> },
];

function TabPanel({ children, value, index }) {
  if (value !== index) return null;
  return <Box sx={{ pt: 2 }}>{children}</Box>;
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
  const mother = useSelector((s) => s.motherReducer);
  const baby = useSelector((s) => s.babyReducer);
  const loading = useSelector((s) => s.assignmentReducer?.loading);

  const [tab, setTab] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, message: '', onConfirm: null });

  // Asignación
  const [editAsig, setEditAsig] = useState(null);
  const [editAsigComentario, setEditAsigComentario] = useState('');
  const [editAsigInicio, setEditAsigInicio] = useState('');
  const [editAsigFin, setEditAsigFin] = useState('');

  // Asistencia
  const [repIni, setRepIni] = useState(() => dayjs().startOf('month').format('YYYY-MM-DDTHH:mm'));
  const [repFin, setRepFin] = useState(() => dayjs().endOf('day').format('YYYY-MM-DDTHH:mm'));
  const [repLastQuery, setRepLastQuery] = useState(null);
  const [reporteOpen, setReporteOpen] = useState(false);

  // Usuarios
  const [usuarioForm, setUsuarioForm] = useState({ dni: '', contrasena: '', idVoluntaria: '' });
  const [editUserTarget, setEditUserTarget] = useState(null);
  const [editUserDni, setEditUserDni] = useState('');
  const [editUserPwd, setEditUserPwd] = useState('');

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
    if (tab === 0) {
      dispatch(showLoading(true));
      dispatch(getAssignmentToday());
    } else if (tab === 1) {
      dispatch(showLoading(true));
      dispatch(getAssistanceAll());
    } else if (tab === 2) {
      dispatch(showLoading(true));
      dispatch(getUsuarios());
      dispatch(getVoluntariasSinUsuario());
    } else if (tab === 3) {
      dispatch(showLoading(true));
      dispatch(getBabys());
      dispatch(getMother());
    }
  }, [tab, dispatch]);

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
      setEditAsig(null);
      dispatch(clearAssignmentWrites());
      dispatch(getAssignmentToday());
    }
  }, [assignment?.putAssignmentById, assignment?.deleteAssignmentById, dispatch, toastOk]);

  useEffect(() => {
    if (volunteer?.getAssistanceReporte != null) {
      setReporteOpen(true);
    }
  }, [volunteer?.getAssistanceReporte]);

  useEffect(() => {
    if (volunteer?.postAssistanceDelete != null) {
      dispatch(showLoading(false));
      toastOk('Asistencia eliminada.');
      dispatch(clearVolunteerWrites());
      dispatch(getAssistanceAll());
      if (repLastQuery) dispatch(getAssistanceReporte(repLastQuery));
    }
  }, [volunteer?.postAssistanceDelete, dispatch, toastOk, repLastQuery]);

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
      assignment?.getAssignmentToday,
      user?.getUsuarios,
      user?.getVoluntariasSinUsuario,
      volunteer?.getAssistanceReporte,
      volunteer?.getAssistanceAll,
      mother?.getMother,
      baby?.getBabys,
    ].some((r) => r != null);
    const anyError = [
      assignment?.error,
      volunteer?.error,
      user?.error,
      user?.userAdminError,
      mother?.error,
      baby?.error,
    ].some((e) => e != null);
    if (anyResult || anyError) dispatch(showLoading(false));
  }, [
    assignment?.getAssignmentToday,
    user?.getUsuarios,
    user?.getVoluntariasSinUsuario,
    volunteer?.getAssistanceReporte,
    volunteer?.getAssistanceAll,
    mother?.getMother,
    baby?.getBabys,
    assignment?.error,
    volunteer?.error,
    user?.error,
    user?.userAdminError,
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

  const asignacionesList = normalizarLista(assignment?.getAssignmentToday);
  const usuariosList = normalizarLista(user?.getUsuarios);
  const volsSinUsuario = normalizarLista(user?.getVoluntariasSinUsuario);
  const asistenciasList = normalizarLista(volunteer?.getAssistanceAll);

  const asistenciaReporteRows = (() => {
    const raw = volunteer?.getAssistanceReporte;
    if (!raw) return null;
    const body = raw?.data ?? raw;
    if (Array.isArray(body)) return body;
    if (Array.isArray(body?.registros)) return body.registros;
    if (Array.isArray(body?.data)) return body.data;
    return [];
  })();

  const asistenciaReporteMeta = (() => {
    const raw = volunteer?.getAssistanceReporte;
    if (!raw) return null;
    const body = raw?.data ?? raw;
    return {
      fechaInicio: body?.fechaInicio ?? null,
      fechaFin: body?.fechaFin ?? null,
      total: body?.totalRegistros ?? asistenciaReporteRows?.length ?? 0,
    };
  })();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, width: '100%', position: 'relative' }}>
      {loading && <Loading position="absolute" height="100%" />}
      <PageHeader title="Administracion" />
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
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, color: '#152C70' }}>
              Asignaciones del día
            </Typography>

            {Array.isArray(asignacionesList) && asignacionesList.length > 0 ? (
              <Box sx={{ mb: 2 }}>
                {asignacionesList.map((a) => {
                  const subject = a.nombreBebe ?? a.nombreTarea ?? `Asignación #${a.idAsignacion}`;
                  const enProgreso = !!a.fechaHoraInicio && !a.fechaHoraFin;
                  return (
                    <Box
                      key={a.idAsignacion}
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
                          {subject}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block" noWrap>
                          {a.nombreVoluntaria ?? '—'}{a.nombreSala ? ` · ${a.nombreSala}` : ''}
                        </Typography>
                        {enProgreso && (
                          <Typography variant="caption" sx={{ color: '#00A86B', fontWeight: 600 }}>
                            En progreso
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setEditAsig(a);
                            setEditAsigComentario(a.comentario ?? '');
                            setEditAsigInicio(
                              a.fechaHoraInicio
                                ? dayjs(a.fechaHoraInicio).format('YYYY-MM-DDTHH:mm')
                                : '',
                            );
                            setEditAsigFin(
                              a.fechaHoraFin
                                ? dayjs(a.fechaHoraFin).format('YYYY-MM-DDTHH:mm')
                                : '',
                            );
                          }}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() =>
                            openConfirm(
                              `¿Eliminar asignación de ${subject}?`,
                              () => { dispatch(showLoading(true)); dispatch(deleteAssignmentById(a.idAsignacion)); },
                            )
                          }
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            ) : Array.isArray(asignacionesList) && asignacionesList.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                No hay asignaciones para hoy.
              </Typography>
            ) : null}

            <Divider sx={{ my: 2 }} />

            <Button
              variant="outlined"
              fullWidth
              sx={{
                borderColor: VIOLET,
                color: VIOLET,
                '&:hover': { bgcolor: VIOLET_LIGHT, borderColor: VIOLET },
              }}
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
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, color: NAVY }}>
              Asistencias registradas
            </Typography>

            {Array.isArray(asistenciasList) && asistenciasList.length > 0 ? (
              <Box sx={{ mb: 2 }}>
                {asistenciasList.map((a, i) => {
                  const nombre = [a.nombreVoluntaria, a.apellidoVoluntaria].filter(Boolean).join(' ') || `Voluntaria #${a.idVoluntaria ?? i}`;
                  const ingreso = a.fechaHoraIngreso ? dayjs(a.fechaHoraIngreso).format('DD/MM HH:mm') : '—';
                  const salida = a.fechaHoraSalida ? dayjs(a.fechaHoraSalida).format('DD/MM HH:mm') : null;
                  const enCentro = !!a.fechaHoraIngreso && !a.fechaHoraSalida;
                  return (
                    <Box
                      key={a.idAsistencia ?? i}
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
                          {nombre}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block" noWrap>
                          {ingreso}{salida ? ` → ${salida}` : ''}
                        </Typography>
                        {enCentro && (
                          <Typography variant="caption" sx={{ color: VIOLET, fontWeight: 600 }}>
                            En centro
                          </Typography>
                        )}
                      </Box>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() =>
                          openConfirm(
                            `¿Eliminar asistencia de ${nombre}?`,
                            () => { dispatch(showLoading(true)); dispatch(postAssistanceDelete(a.idAsistencia)); },
                          )
                        }
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  );
                })}
              </Box>
            ) : Array.isArray(asistenciasList) && asistenciasList.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                No hay asistencias registradas.
              </Typography>
            ) : null}

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ mb: 1.5, color: NAVY }}>
              Reporte por período
            </Typography>
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
              fullWidth
              sx={{ bgcolor: VIOLET, '&:hover': { bgcolor: '#6A549A' } }}
              onClick={() => {
                const q = {
                  fechaInicio: new Date(repIni).toISOString(),
                  fechaFin: new Date(repFin).toISOString(),
                };
                setRepLastQuery(q);
                dispatch(showLoading(true));
                dispatch(getAssistanceReporte(q));
              }}
            >
              Ver reporte
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

          {/* ── 3: Bajas ── */}
          <TabPanel value={tab} index={3}>
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

      {/* Reporte de Asistencia Dialog */}
      <Dialog
        open={reporteOpen}
        onClose={() => setReporteOpen(false)}
        fullWidth
        maxWidth={false}
        PaperProps={{ sx: DIALOG_FULL_SX }}
      >
        {/* Header */}
        <DialogTitle
          sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            pr: 1, py: 1.75, px: 2.5,
            background: 'linear-gradient(90deg, #7A659B 0%, #a54dff 100%)',
            color: '#fff', flexShrink: 0,
          }}
        >
          <Box>
            <Typography component="span" sx={{ fontWeight: 700, fontSize: '1.05rem', display: 'block' }}>
              Reporte de asistencia
            </Typography>
            {asistenciaReporteMeta && (
              <Typography component="span" sx={{ fontSize: '0.75rem', opacity: 0.85, display: 'block' }}>
                {asistenciaReporteMeta.fechaInicio && asistenciaReporteMeta.fechaFin
                  ? `${asistenciaReporteMeta.fechaInicio} → ${asistenciaReporteMeta.fechaFin}`
                  : ''}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {asistenciaReporteMeta?.total != null && (
              <Chip
                label={`${asistenciaReporteMeta.total} registros`}
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700, fontSize: '0.72rem' }}
              />
            )}
            <IconButton onClick={() => setReporteOpen(false)} sx={{ color: '#fff', minWidth: 44, minHeight: 44 }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        {/* Contenido scrollable */}
        <DialogContent sx={{ flex: 1, overflowY: 'auto', p: 0, bgcolor: '#faf8fc' }}>
          {!asistenciaReporteRows || asistenciaReporteRows.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center', pt: 8 }}>
              <Typography sx={{ color: NAVY, fontWeight: 600, fontSize: '1rem' }}>
                Sin registros en el período.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ px: 2, pt: 2, pb: 4 }}>
              {asistenciaReporteRows.map((r, i) => {
                const nombre = [r.nombreVoluntaria ?? r.nombre, r.apellidoVoluntaria ?? r.apellido]
                  .filter(Boolean).join(' ') || `Voluntaria #${r.idVoluntaria ?? i}`;
                const ingreso = r.fechaHoraIngreso ? dayjs(r.fechaHoraIngreso).format('DD/MM/YYYY HH:mm') : null;
                const salida = r.fechaHoraSalida ? dayjs(r.fechaHoraSalida).format('DD/MM/YYYY HH:mm') : null;
                const enCentro = !!r.fechaHoraIngreso && !r.fechaHoraSalida;
                const dur = r.duracionMinutos;
                const durFmt = dur != null
                  ? (dur < 60 ? `${Math.round(dur)} min` : `${Math.floor(dur / 60)} h ${Math.round(dur % 60)} min`)
                  : null;

                return (
                  <Paper
                    key={r.idAsistencia ?? i}
                    elevation={0}
                    sx={{
                      p: 2, mb: 1.25, borderRadius: '14px',
                      border: '1.5px solid rgba(122,101,155,0.14)',
                      bgcolor: '#fff',
                      boxShadow: '0 2px 10px rgba(21,44,112,0.06)',
                    }}
                  >
                    {/* Nombre + delete */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.25 }}>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: NAVY, lineHeight: 1.3 }}>
                          {nombre}
                        </Typography>
                        {durFmt && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                            <TimerIcon sx={{ fontSize: 13, color: VIOLET }} />
                            <Typography sx={{ fontSize: '0.75rem', color: VIOLET, fontWeight: 600 }}>
                              {durFmt}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      <IconButton
                        size="small"
                        aria-label={`Eliminar asistencia de ${nombre}`}
                        onClick={() =>
                          openConfirm(
                            `¿Eliminar asistencia de ${nombre}?`,
                            () => { dispatch(showLoading(true)); dispatch(postAssistanceDelete(r.idAsistencia)); },
                          )
                        }
                        sx={{
                          ml: 1,
                          flexShrink: 0,
                          minWidth: 36,
                          minHeight: 36,
                          color: 'rgba(197,56,20,0.55)',
                          '&:hover': { bgcolor: 'rgba(197,56,20,0.08)', color: '#C53814' },
                          transition: 'color 0.15s, background-color 0.15s',
                        }}
                      >
                        <DeleteOutlineIcon sx={{ fontSize: 19 }} />
                      </IconButton>
                    </Box>

                    {/* Ingreso / Salida */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 28, height: 28, borderRadius: '8px', bgcolor: 'rgba(0,168,107,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <LoginIcon sx={{ fontSize: 15, color: '#00A86B' }} />
                        </Box>
                        <Box>
                          <Typography sx={{ fontSize: '0.67rem', fontWeight: 700, color: 'rgba(21,44,112,0.42)', textTransform: 'uppercase', letterSpacing: '0.07em', lineHeight: 1 }}>
                            Ingreso
                          </Typography>
                          <Typography sx={{ fontSize: '0.87rem', color: NAVY, fontWeight: 500, lineHeight: 1.3 }}>
                            {ingreso ?? '—'}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 28, height: 28, borderRadius: '8px', bgcolor: enCentro ? 'rgba(122,101,155,0.1)' : 'rgba(197,56,20,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <LogoutIcon sx={{ fontSize: 15, color: enCentro ? VIOLET : '#C53814' }} />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box>
                            <Typography sx={{ fontSize: '0.67rem', fontWeight: 700, color: 'rgba(21,44,112,0.42)', textTransform: 'uppercase', letterSpacing: '0.07em', lineHeight: 1 }}>
                              Salida
                            </Typography>
                            <Typography sx={{ fontSize: '0.87rem', color: enCentro ? 'rgba(21,44,112,0.4)' : NAVY, fontStyle: enCentro ? 'italic' : 'normal', fontWeight: 500, lineHeight: 1.3 }}>
                              {salida ?? 'Sin registrar'}
                            </Typography>
                          </Box>
                          {enCentro && (
                            <Chip
                              label="En centro"
                              size="small"
                              sx={{ bgcolor: 'rgba(122,101,155,0.12)', color: VIOLET, fontWeight: 700, fontSize: '0.65rem', height: 20, '& .MuiChip-label': { px: 0.75 } }}
                            />
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                );
              })}
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Assignment Dialog */}
      <Dialog
        open={Boolean(editAsig)}
        onClose={() => setEditAsig(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { maxWidth: 444, width: '100%', mx: 'auto', mb: 0, mt: 'auto', borderRadius: '20px 20px 0 0' } }}
        sx={{ '& .MuiDialog-container': { alignItems: 'flex-end' } }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1.25, pb: 0.25 }}>
          <Box sx={{ width: 36, height: 4, borderRadius: 2, bgcolor: 'rgba(21,44,112,0.15)' }} />
        </Box>
        <DialogTitle sx={{ fontWeight: 700, color: '#152C70', pb: 0.5 }}>
          Editar asignación #{editAsig?.idAsignacion}
          <Typography variant="body2" color="text.secondary" fontWeight={400}>
            {editAsig?.nombreBebe ?? editAsig?.nombreTarea ?? '—'} · {editAsig?.nombreVoluntaria ?? '—'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <TextField
            label="Comentario"
            value={editAsigComentario}
            onChange={(e) => setEditAsigComentario(e.target.value)}
            fullWidth
            multiline
            minRows={2}
            size="small"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Inicio abrazo"
            type="datetime-local"
            value={editAsigInicio}
            onChange={(e) => setEditAsigInicio(e.target.value)}
            fullWidth
            size="small"
            sx={{ mb: 1.5 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Fin abrazo"
            type="datetime-local"
            value={editAsigFin}
            onChange={(e) => setEditAsigFin(e.target.value)}
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2, gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => setEditAsig(null)}
            sx={{ flex: 1, borderColor: 'rgba(21,44,112,0.22)', color: '#4A148C' }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            sx={{ flex: 1, bgcolor: VIOLET, '&:hover': { bgcolor: '#6A549A' } }}
            onClick={() => {
              if (!editAsig) return;
              const body = {
                ...editAsig,
                comentario: editAsigComentario || null,
                fechaHoraInicio: editAsigInicio ? new Date(editAsigInicio).toISOString() : null,
                fechaHoraFin: editAsigFin ? new Date(editAsigFin).toISOString() : null,
              };
              dispatch(showLoading(true));
              dispatch(putAssignmentById(editAsig.idAsignacion, body));
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
