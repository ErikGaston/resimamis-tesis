import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, TextField, Typography } from '@mui/material';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AccordionCustomized from '../../components/atoms/accordionCustomized/AccordionCustomized';
import BabyForm from '../../components/molecules/motherForm/BabyForm';
import { PageHeader } from '../../components/common/PageHeader';
import Loading from '../../components/atoms/loading/Loading';
import DialogSuccess from '../../components/atoms/dialogSuccess/DialogSuccess';
import Footer from '../../components/molecules/Footer';
import PageScrollMain from '../../components/common/PageScrollMain';
import { showLoading } from '../../redux/actions/loadingActions';
import { getBabys, getBabySalas, putBaby, clearBabyWrites } from '../../redux/actions/babyActions';
import { getMotherId, clearMotherWrites } from '../../redux/actions/motherActions';
import {
  getVisitasByBebe,
  postVisita,
  putVisita,
  postVisitaDelete,
  clearVisitaWrites,
} from '../../redux/actions/visitaActions';
import { showToast } from '../../redux/actions/toastActions';
import { normalizeBabyApiPayload } from '../../utils/babyPayload';

function normalizarBabyList(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  const candidates = [raw.data, raw.listadoBebes, raw.listado, raw.resultado];
  for (const c of candidates) {
    if (Array.isArray(c)) return c;
  }
  return [];
}

function normalizarVisitas(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  const candidates = [raw.data, raw.listado, raw.listadoVisitas];
  for (const c of candidates) {
    if (Array.isArray(c)) return c;
  }
  return [];
}

const VISITA_FORM_INIT = {
  nombreVisitante: '',
  familiar: '',
  fechaHoraVisita: '',
  documentoVisitante: '',
  telefonoVisitante: '',
};

export const ProfileBabyPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const babyState = useSelector((s) => s.babyReducer);
  const motherState = useSelector((s) => s.motherReducer);
  const loading = useSelector((s) => s.babyReducer?.loading);
  const visita = useSelector((s) => s.visitaReducer);

  const [babyModel, setBabyModel] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [saveNotice, setSaveNotice] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, message: '', onConfirm: null });
  const openConfirm = (message, onConfirm) => setConfirmDialog({ open: true, message, onConfirm });
  const handleConfirm = () => { confirmDialog.onConfirm?.(); setConfirmDialog({ open: false, message: '', onConfirm: null }); };
  const handleCancelConfirm = () => setConfirmDialog({ open: false, message: '', onConfirm: null });

  const [visitaForm, setVisitaForm] = useState(VISITA_FORM_INIT);
  const [editingVisitaId, setEditingVisitaId] = useState(null);
  const [editVisitaForm, setEditVisitaForm] = useState(VISITA_FORM_INIT);

  useEffect(() => {
    dispatch(showLoading(true));
    dispatch(getBabys());
    dispatch(getBabySalas());
    dispatch(getVisitasByBebe(Number(id)));
    return () => {
      dispatch(clearBabyWrites());
      dispatch(clearMotherWrites());
    };
  }, [id, dispatch]);

  // Find baby in list and set model
  useEffect(() => {
    const list = normalizarBabyList(babyState?.getBabys);
    if (list.length > 0) {
      const found = list.find((b) => String(b.id ?? b.idBebe) === String(id));
      if (found) {
        setBabyModel((prev) => prev ?? found);
        dispatch(showLoading(false));
        if (found.idMadre != null) {
          dispatch(getMotherId(found.idMadre));
        }
      } else {
        dispatch(showLoading(false));
      }
    }
  }, [babyState?.getBabys, id, dispatch]);

  useEffect(() => {
    if (babyState?.putBaby != null) {
      dispatch(showLoading(false));
      setEditMode(false);
      setSaveNotice('SUCCESS');
      dispatch(clearBabyWrites());
      dispatch(getBabys());
      setTimeout(() => setSaveNotice(null), 2500);
    }
  }, [babyState?.putBaby, dispatch]);

  useEffect(() => {
    if (babyState?.error != null) {
      dispatch(showLoading(false));
    }
  }, [babyState?.error, dispatch]);

  useEffect(() => {
    if (visita?.postVisita != null || visita?.putVisita != null || visita?.postVisitaDelete != null) {
      dispatch(showToast({ message: 'Visita: operación OK.', severity: 'success' }));
      dispatch(clearVisitaWrites());
      dispatch(getVisitasByBebe(Number(id)));
      setVisitaForm(VISITA_FORM_INIT);
      setEditingVisitaId(null);
    }
  }, [visita?.postVisita, visita?.putVisita, visita?.postVisitaDelete, dispatch, id]);

  const babySalasOptions = useMemo(() => {
    const raw = babyState?.getBabySalas;
    const list = raw?.resultado ?? raw?.listadoSalas ?? raw?.data;
    if (!Array.isArray(list)) return null;
    return list
      .map((s) => ({
        label: s.nombre ?? s.nombreSala ?? s.descripcion ?? `Sala ${s.idSala ?? s.id ?? ''}`,
        value: s.idSala ?? s.id,
      }))
      .filter((o) => o.value != null);
  }, [babyState?.getBabySalas]);

  const madreData = motherState?.getMotherId?.data ?? null;
  const madreNombre = madreData
    ? [madreData.nombre, madreData.apellido].filter(Boolean).join(' ').trim()
    : null;

  const visitasList = normalizarVisitas(visita?.getVisitasByBebe);

  const handleSaveBaby = () => {
    if (!babyModel) return;
    const payload = normalizeBabyApiPayload(babyModel, babyModel?.idMadre);
    if (payload.id == null) return;
    dispatch(showLoading(true));
    dispatch(putBaby(payload));
  };

  const handleCrearVisita = () => {
    if (!visitaForm.nombreVisitante || !visitaForm.familiar || !visitaForm.fechaHoraVisita) return;
    dispatch(
      postVisita({
        idBebe: Number(id),
        nombreVisitante: visitaForm.nombreVisitante,
        familiar: visitaForm.familiar,
        fechaHoraVisita: new Date(visitaForm.fechaHoraVisita).toISOString(),
        documentoVisitante: visitaForm.documentoVisitante !== '' ? visitaForm.documentoVisitante : null,
        telefonoVisitante: visitaForm.telefonoVisitante !== '' ? visitaForm.telefonoVisitante : null,
      }),
    );
  };

  const handleGuardarEditVisita = () => {
    if (!editingVisitaId) return;
    dispatch(
      putVisita(Number(editingVisitaId), {
        idBebe: Number(id),
        nombreVisitante: editVisitaForm.nombreVisitante,
        familiar: editVisitaForm.familiar,
        fechaHoraVisita: new Date(editVisitaForm.fechaHoraVisita).toISOString(),
        documentoVisitante: editVisitaForm.documentoVisitante !== '' ? editVisitaForm.documentoVisitante : null,
        telefonoVisitante: editVisitaForm.telefonoVisitante !== '' ? editVisitaForm.telefonoVisitante : null,
      }),
    );
  };

  const startEditVisita = (v) => {
    setEditingVisitaId(v.idVisita);
    setEditVisitaForm({
      nombreVisitante: v.nombreVisitante ?? '',
      familiar: v.familiar ?? '',
      fechaHoraVisita: v.fechaHoraVisita ? new Date(v.fechaHoraVisita).toISOString().slice(0, 16) : '',
      documentoVisitante: v.documentoVisitante != null ? String(v.documentoVisitante) : '',
      telefonoVisitante: v.telefonoVisitante != null ? String(v.telefonoVisitante) : '',
    });
  };

  const babyNombre =
    babyModel
      ? [babyModel.nombre, babyModel.apellido].filter(Boolean).join(' ').trim() || 'Sin nombre'
      : `Bebé #${id}`;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100dvh', maxHeight: '100dvh', minHeight: 0, overflow: 'hidden', position: 'relative' }}>
      {loading && <Loading position="absolute" height="100%" zIndex={9999} />}
      <PageHeader
        title="Perfil del bebé"
        rightAction={
          <IconButton
            onClick={editMode ? handleSaveBaby : () => setEditMode(true)}
            aria-label={editMode ? 'Guardar cambios' : 'Editar datos del bebé'}
            sx={{ color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' } }}
          >
            {editMode ? <CheckIcon /> : <EditIcon />}
          </IconButton>
        }
      />

      <PageScrollMain>
        <Box sx={{ px: 2.5, pt: 1, pb: 1 }}>

          {/* Acordeón datos del bebé */}
          <AccordionCustomized
            item="datos-bebe"
            defaultExpanded
            expandIcon={<ExpandCircleDownIcon style={{ color: '#8F00FF' }} />}
            summary={<TitleAccordion>Datos del bebé: {babyNombre}</TitleAccordion>}
            details={
              babyModel ? (
                <>
                  {editMode && (
                    <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={handleSaveBaby}
                        sx={{ textTransform: 'none' }}
                      >
                        Guardar en servidor
                      </Button>
                      <Button
                        size="small"
                        variant="text"
                        onClick={() => {
                          setEditMode(false);
                          const list = normalizarBabyList(babyState?.getBabys);
                          const found = list.find((b) => String(b.id ?? b.idBebe) === String(id));
                          if (found) setBabyModel(found);
                        }}
                        sx={{ textTransform: 'none' }}
                      >
                        Cancelar
                      </Button>
                    </Box>
                  )}
                  <BabyForm
                    model={babyModel}
                    setModel={setBabyModel}
                    readOnly={!editMode}
                    salaOptions={babySalasOptions}
                    listMothers={null}
                    madreDisplayName={madreNombre ?? ''}
                  />
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">Cargando datos del bebé…</Typography>
              )
            }
          />

          {/* Acordeón madre */}
          {(madreData != null || babyModel?.idMadre != null) && (
            <AccordionCustomized
              item="datos-madre"
              expandIcon={<ExpandCircleDownIcon style={{ color: '#8F00FF' }} />}
              summary={
                <TitleAccordion>
                  Madre{madreNombre ? `: ${madreNombre}` : ''}
                </TitleAccordion>
              }
              details={
                <Box>
                  {madreData && (
                    <>
                      <Typography variant="body2" sx={{ color: '#152C70', mb: 0.5 }}>
                        <strong>Nombre:</strong> {[madreData.nombre, madreData.apellido].filter(Boolean).join(' ')}
                      </Typography>
                      {madreData.dni && (
                        <Typography variant="body2" sx={{ color: '#152C70', mb: 0.5 }}>
                          <strong>DNI:</strong> {madreData.dni}
                        </Typography>
                      )}
                      {madreData.celular && (
                        <Typography variant="body2" sx={{ color: '#152C70', mb: 0.5 }}>
                          <strong>Celular:</strong> {madreData.celular}
                        </Typography>
                      )}
                    </>
                  )}
                  {(babyModel?.idMadre ?? madreData?.idMadre) != null && (
                    <Box sx={{ mt: 1 }}>
                      <Link
                        to={`/madre/perfil/${babyModel?.idMadre ?? madreData?.idMadre}`}
                        style={{ color: '#7A659B', fontWeight: 600, fontSize: '0.875rem' }}
                      >
                        Ver perfil completo de la madre →
                      </Link>
                    </Box>
                  )}
                </Box>
              }
            />
          )}

          {/* Visitas */}
          <AccordionCustomized
            item="visitas"
            expandIcon={<ExpandCircleDownIcon style={{ color: '#8F00FF' }} />}
            summary={<TitleAccordion>Visitas registradas ({visitasList.length})</TitleAccordion>}
            details={
              <Box>
                {visitasList.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Sin visitas registradas para este bebé.
                  </Typography>
                )}

                {visitasList.map((v) => (
                  <Box key={v.idVisita}>
                    {editingVisitaId === v.idVisita ? (
                      <Box sx={{ py: 1 }}>
                        <TextField label="Nombre del visitante" value={editVisitaForm.nombreVisitante} onChange={(e) => setEditVisitaForm((f) => ({ ...f, nombreVisitante: e.target.value }))} fullWidth size="small" sx={{ mb: 1 }} />
                        <TextField label="Vínculo familiar" value={editVisitaForm.familiar} onChange={(e) => setEditVisitaForm((f) => ({ ...f, familiar: e.target.value }))} fullWidth size="small" sx={{ mb: 1 }} />
                        <TextField label="Fecha y hora" type="datetime-local" value={editVisitaForm.fechaHoraVisita} onChange={(e) => setEditVisitaForm((f) => ({ ...f, fechaHoraVisita: e.target.value }))} fullWidth size="small" sx={{ mb: 1 }} InputLabelProps={{ shrink: true }} />
                        <TextField label="Documento (opcional)" value={editVisitaForm.documentoVisitante} onChange={(e) => setEditVisitaForm((f) => ({ ...f, documentoVisitante: e.target.value }))} fullWidth size="small" sx={{ mb: 1 }} inputProps={{ inputMode: 'numeric' }} />
                        <TextField label="Teléfono (opcional)" value={editVisitaForm.telefonoVisitante} onChange={(e) => setEditVisitaForm((f) => ({ ...f, telefonoVisitante: e.target.value }))} fullWidth size="small" sx={{ mb: 1 }} inputProps={{ inputMode: 'numeric' }} />
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button variant="contained" size="small" onClick={handleGuardarEditVisita}>Guardar</Button>
                          <Button size="small" onClick={() => setEditingVisitaId(null)}>Cancelar</Button>
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', py: 1 }}>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>{v.nombreVisitante}</Typography>
                          <Typography variant="caption" display="block" color="text.secondary">{v.familiar}</Typography>
                          <Typography variant="caption" display="block" color="text.secondary">
                            {v.fechaHoraVisita ? new Date(v.fechaHoraVisita).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}
                          </Typography>
                          {v.documentoVisitante && <Typography variant="caption" display="block" color="text.secondary">Doc: {v.documentoVisitante}</Typography>}
                          {v.telefonoVisitante && <Typography variant="caption" display="block" color="text.secondary">Tel: {v.telefonoVisitante}</Typography>}
                        </Box>
                        <Box sx={{ display: 'flex', flexShrink: 0 }}>
                          <IconButton size="small" aria-label="Editar visita" onClick={() => startEditVisita(v)} sx={{ color: '#7A659B' }}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" aria-label="Eliminar visita" onClick={() => openConfirm('¿Eliminar esta visita?', () => dispatch(postVisitaDelete(v.idVisita)))} sx={{ color: '#b71c1c' }}>
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    )}
                    <Divider />
                  </Box>
                ))}

                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" sx={{ mb: 1, color: '#152C70' }}>Registrar nueva visita</Typography>
                <TextField label="Nombre del visitante" value={visitaForm.nombreVisitante} onChange={(e) => setVisitaForm((f) => ({ ...f, nombreVisitante: e.target.value }))} fullWidth size="small" sx={{ mb: 1 }} />
                <TextField label="Vínculo familiar" value={visitaForm.familiar} onChange={(e) => setVisitaForm((f) => ({ ...f, familiar: e.target.value }))} fullWidth size="small" sx={{ mb: 1 }} placeholder="Ej: Madre, Padre, Abuelos" />
                <TextField label="Fecha y hora" type="datetime-local" value={visitaForm.fechaHoraVisita} onChange={(e) => setVisitaForm((f) => ({ ...f, fechaHoraVisita: e.target.value }))} fullWidth size="small" sx={{ mb: 1 }} InputLabelProps={{ shrink: true }} />
                <TextField label="Documento visitante (opcional)" value={visitaForm.documentoVisitante} onChange={(e) => setVisitaForm((f) => ({ ...f, documentoVisitante: e.target.value }))} fullWidth size="small" sx={{ mb: 1 }} inputProps={{ inputMode: 'numeric' }} />
                <TextField label="Teléfono (opcional)" value={visitaForm.telefonoVisitante} onChange={(e) => setVisitaForm((f) => ({ ...f, telefonoVisitante: e.target.value }))} fullWidth size="small" sx={{ mb: 1 }} inputProps={{ inputMode: 'numeric' }} />
                <Button
                  variant="contained"
                  disabled={!visitaForm.nombreVisitante || !visitaForm.familiar || !visitaForm.fechaHoraVisita}
                  onClick={handleCrearVisita}
                  fullWidth
                  sx={{ background: 'linear-gradient(90deg, #7F00FF 0%, #E100FF 100%)' }}
                >
                  Registrar visita
                </Button>
              </Box>
            }
          />

        </Box>
      </PageScrollMain>

      {saveNotice === 'SUCCESS' && (
        <DialogSuccess
          open={saveNotice === 'SUCCESS'}
          setOpen={setSaveNotice}
          message="Los datos del bebé se actualizaron correctamente"
        />
      )}
      <Dialog open={confirmDialog.open} onClose={handleCancelConfirm} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, color: '#152C70' }}>Confirmar</DialogTitle>
        <DialogContent><Typography>{confirmDialog.message}</Typography></DialogContent>
        <DialogActions>
          <Button onClick={handleCancelConfirm}>Cancelar</Button>
          <Button onClick={handleConfirm} color="error" variant="contained">Eliminar</Button>
        </DialogActions>
      </Dialog>
      <Footer />
    </Box>
  );
};

const TitleAccordion = ({ children }) => (
  <span style={{ color: '#152C70', fontFamily: 'Roboto', fontSize: 19, fontWeight: 400, letterSpacing: '0.8px' }}>
    {children}
  </span>
);

export default ProfileBabyPage;
