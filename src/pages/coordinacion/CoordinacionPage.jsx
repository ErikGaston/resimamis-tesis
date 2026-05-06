import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Divider,
  Paper,
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
} from '../../redux/actions/userActions';
import { postMotherDelete, clearMotherWrites } from '../../redux/actions/motherActions';
import { postBabyDelete, clearBabyWrites } from '../../redux/actions/babyActions';
import {
  getSupplyById,
  putSupplyById,
  postSupplyDelete,
  clearSupplyWrites,
} from '../../redux/actions/supplyActions';
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

  const [tab, setTab] = useState(0);
  const [asigId, setAsigId] = useState('');
  const [asigJson, setAsigJson] = useState('{}');
  const [repIni, setRepIni] = useState(() => dayjs().startOf('month').toISOString());
  const [repFin, setRepFin] = useState(() => dayjs().endOf('day').toISOString());
  const [idAsistenciaDel, setIdAsistenciaDel] = useState('');
  const [usuarioForm, setUsuarioForm] = useState({
    dni: '',
    contrasena: '',
    idVoluntaria: '',
    idEstado: '',
  });
  const [usuarioIdBuscar, setUsuarioIdBuscar] = useState('');
  const [usuarioJsonEdit, setUsuarioJsonEdit] = useState('{}');
  const [idUsuarioDel, setIdUsuarioDel] = useState('');
  const [idMadreDel, setIdMadreDel] = useState('');
  const [idVolDel, setIdVolDel] = useState('');
  const [idBebeDel, setIdBebeDel] = useState('');
  const [idInsumo, setIdInsumo] = useState('');
  const [insumoJson, setInsumoJson] = useState('{}');

  useEffect(() => {
    if (user?.getUsuarioById != null) {
      setUsuarioJsonEdit(JSON.stringify(user.getUsuarioById, null, 2));
    }
  }, [user?.getUsuarioById]);

  const toastOk = useCallback(
    (msg) => dispatch(showToast({ message: msg, severity: 'success' })),
    [dispatch],
  );

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
    if (supply?.getSupplyById != null) {
      try {
        setInsumoJson(JSON.stringify(supply.getSupplyById, null, 2));
      } catch {
        setInsumoJson('{}');
      }
    }
  }, [supply?.getSupplyById]);

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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, width: '100%' }}>
      <PageScrollMain>
        <Paper elevation={0} sx={{ p: 2, mx: 1, mb: 2, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ color: '#152C70', fontWeight: 600 }}>
            Panel de coordinación
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Operaciones administrativas del API. Revisá el contrato OpenAPI antes de enviar JSON.
          </Typography>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" sx={{ mt: 1 }}>
            <Tab label="Asignación" />
            <Tab label="Asistencia" />
            <Tab label="Usuarios" />
            <Tab label="Bajas" />
            <Tab label="Insumos" />
          </Tabs>

          <TabPanel value={tab} index={0}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              sx={{ mb: 2 }}
              onClick={() => {
                if (!window.confirm('¿Resetear abrazos colgados en el servidor?')) return;
                dispatch(postResetAbrazosColgados());
              }}
            >
              Resetear abrazos colgados
            </Button>
            <TextField
              label="idAsignación (PUT/DELETE)"
              value={asigId}
              onChange={(e) => setAsigId(e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
            />
            <TextField
              label="Body JSON (PUT — schema ASIGNACION)"
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
                PUT asignación
              </Button>
              <Button
                color="error"
                variant="outlined"
                onClick={() => {
                  const id = Number(asigId);
                  if (!Number.isFinite(id)) return;
                  if (!window.confirm(`¿Eliminar asignación ${id}?`)) return;
                  dispatch(deleteAssignmentById(id));
                }}
              >
                DELETE
              </Button>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="caption" color="text.secondary">
              Resultado reciente: ver toast / consola. Estados Redux: putAssignmentById, deleteAssignmentById,
              postResetAbrazosColgados.
            </Typography>
          </TabPanel>

          <TabPanel value={tab} index={1}>
            <TextField
              label="fechaInicio (ISO)"
              value={repIni}
              onChange={(e) => setRepIni(e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
            />
            <TextField
              label="fechaFin (ISO)"
              value={repFin}
              onChange={(e) => setRepFin(e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
            />
            <Button variant="contained" onClick={() => dispatch(getAssistanceReporte({ fechaInicio: repIni, fechaFin: repFin }))}>
              Descargar reporte
            </Button>
            {volunteer?.getAssistanceReporte != null && (
              <Box
                component="pre"
                sx={{
                  mt: 2,
                  p: 1,
                  bgcolor: '#f5f5f5',
                  borderRadius: 1,
                  fontSize: 11,
                  overflow: 'auto',
                  maxHeight: 240,
                }}
              >
                {JSON.stringify(volunteer.getAssistanceReporte, null, 2)}
              </Box>
            )}
            <Divider sx={{ my: 2 }} />
            <TextField
              label="idAsistencia (baja)"
              value={idAsistenciaDel}
              onChange={(e) => setIdAsistenciaDel(e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
            />
            <Button
              color="error"
              variant="outlined"
              onClick={() => {
                const id = Number(idAsistenciaDel);
                if (!Number.isFinite(id)) return;
                if (!window.confirm(`¿Eliminar asistencia ${id}?`)) return;
                dispatch(postAssistanceDelete(id));
              }}
            >
              Eliminar asistencia
            </Button>
          </TabPanel>

          <TabPanel value={tab} index={2}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Alta usuario (USUARIO)
            </Typography>
            <TextField
              label="DNI"
              value={usuarioForm.dni}
              onChange={(e) => setUsuarioForm((f) => ({ ...f, dni: e.target.value }))}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
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
            <TextField
              label="idVoluntaria"
              value={usuarioForm.idVoluntaria}
              onChange={(e) => setUsuarioForm((f) => ({ ...f, idVoluntaria: e.target.value }))}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
            />
            <TextField
              label="idEstado (opcional)"
              value={usuarioForm.idEstado}
              onChange={(e) => setUsuarioForm((f) => ({ ...f, idEstado: e.target.value }))}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
            />
            <Button
              variant="contained"
              onClick={() => {
                const body = {
                  dni: Number(usuarioForm.dni),
                  contrasena: usuarioForm.contrasena || null,
                  idVoluntaria: Number(usuarioForm.idVoluntaria),
                  fechaCreacion: new Date().toISOString(),
                  idEstado:
                    usuarioForm.idEstado === '' || usuarioForm.idEstado == null
                      ? null
                      : Number(usuarioForm.idEstado),
                };
                dispatch(postUsuario(body));
              }}
            >
              Crear usuario
            </Button>
            <Divider sx={{ my: 2 }} />
            <TextField
              label="idUsuario a buscar"
              value={usuarioIdBuscar}
              onChange={(e) => setUsuarioIdBuscar(e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
            />
            <Button variant="outlined" onClick={() => dispatch(getUsuarioById(Number(usuarioIdBuscar)))}>
              GET usuario
            </Button>
            <TextField
              label="JSON para PUT"
              value={usuarioJsonEdit}
              onChange={(e) => setUsuarioJsonEdit(e.target.value)}
              fullWidth
              multiline
              minRows={5}
              size="small"
              sx={{ mt: 1 }}
            />
            <Button
              sx={{ mt: 1 }}
              variant="contained"
              onClick={() => {
                const id = Number(usuarioIdBuscar);
                const body = safeJsonParse(usuarioJsonEdit, {});
                if (!Number.isFinite(id)) return;
                dispatch(putUsuario(id, body));
              }}
            >
              PUT usuario
            </Button>
            <Divider sx={{ my: 2 }} />
            <TextField
              label="idUsuario baja"
              value={idUsuarioDel}
              onChange={(e) => setIdUsuarioDel(e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
            />
            <Button
              color="error"
              variant="outlined"
              onClick={() => {
                const id = Number(idUsuarioDel);
                if (!Number.isFinite(id)) return;
                if (!window.confirm(`¿Eliminar usuario ${id}?`)) return;
                dispatch(postUsuarioDelete(id));
              }}
            >
              Eliminar usuario
            </Button>
          </TabPanel>

          <TabPanel value={tab} index={3}>
            <TextField
              label="idMadre"
              value={idMadreDel}
              onChange={(e) => setIdMadreDel(e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
            />
            <Button
              color="error"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              onClick={() => {
                const id = Number(idMadreDel);
                if (!Number.isFinite(id)) return;
                if (!window.confirm(`¿Dar de baja madre ${id}?`)) return;
                dispatch(postMotherDelete(id));
              }}
            >
              Baja madre
            </Button>
            <TextField
              label="idVoluntaria"
              value={idVolDel}
              onChange={(e) => setIdVolDel(e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
            />
            <Button
              color="error"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              onClick={() => {
                const id = Number(idVolDel);
                if (!Number.isFinite(id)) return;
                if (!window.confirm(`¿Dar de baja voluntaria ${id}?`)) return;
                dispatch(postVolunteerDelete(id));
              }}
            >
              Baja voluntaria
            </Button>
            <TextField
              label="idBebe"
              value={idBebeDel}
              onChange={(e) => setIdBebeDel(e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
            />
            <Button
              color="error"
              variant="outlined"
              fullWidth
              onClick={() => {
                const id = Number(idBebeDel);
                if (!Number.isFinite(id)) return;
                if (!window.confirm(`¿Dar de baja bebé ${id}?`)) return;
                dispatch(postBabyDelete(id));
              }}
            >
              Baja bebé
            </Button>
          </TabPanel>

          <TabPanel value={tab} index={4}>
            <TextField
              label="idInsumo"
              value={idInsumo}
              onChange={(e) => setIdInsumo(e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
            />
            <Button variant="outlined" onClick={() => dispatch(getSupplyById(Number(idInsumo)))}>
              Cargar insumo
            </Button>
            <TextField
              label="JSON INSUMO (PUT)"
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
                PUT insumo
              </Button>
              <Button
                color="error"
                variant="outlined"
                onClick={() => {
                  const id = Number(idInsumo);
                  if (!Number.isFinite(id)) return;
                  if (!window.confirm(`¿Eliminar insumo ${id}?`)) return;
                  dispatch(postSupplyDelete(id));
                }}
              >
                Eliminar
              </Button>
            </Box>
            {supply?.getSupplyById != null && (
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Último GET guardado en Redux (referencia).
              </Typography>
            )}
          </TabPanel>
        </Paper>
      </PageScrollMain>
      <Footer />
    </Box>
  );
};

export default CoordinacionPage;
