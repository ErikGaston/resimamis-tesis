import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Skeleton, Typography } from '@mui/material';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AccordionCustomized from '../../components/atoms/accordionCustomized/AccordionCustomized';
import BabyForm from '../../components/molecules/motherForm/BabyForm';
import { PageHeader } from '../../components/common/PageHeader';
import Loading from '../../components/atoms/loading/Loading';
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
import VisitasBebe from '../../components/organisms/visitasBebe/VisitasBebe';

const GRADIENT = 'linear-gradient(90deg, #7F00FF 0%, #E100FF 100%)';
const btnSave = {
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '1rem',
  minHeight: 44,
  borderRadius: '10px',
  background: GRADIENT,
  boxShadow: '0 4px 14px rgba(127,0,255,0.28)',
  color: '#fff',
  '&.Mui-disabled': { opacity: 0.45, boxShadow: 'none', color: '#fff' },
};
const btnCancel = {
  textTransform: 'none',
  fontWeight: 600,
  minHeight: 44,
  borderRadius: '10px',
  borderColor: 'rgba(21,44,112,0.25)',
  color: '#152C70',
};
const btnEdit = {
  textTransform: 'none',
  fontWeight: 600,
  minHeight: 44,
  borderRadius: '10px',
  background: GRADIENT,
  boxShadow: '0 4px 14px rgba(127,0,255,0.18)',
  color: '#fff',
};

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

function FieldSkeleton({ multiline = false }) {
  return (
    <Box sx={{ mb: 1.5 }}>
      <Skeleton variant="text" width="38%" height={18} sx={{ mb: 0.5 }} />
      <Skeleton variant="rounded" height={multiline ? 76 : 44} />
    </Box>
  );
}

function BabyProfileSkeleton() {
  return (
    <Box sx={{ px: 2.5, pt: 2, pb: 4 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 1.5,
          px: 1,
          mb: 1.5,
          borderBottom: '1px solid rgba(0,0,0,0.10)',
        }}
      >
        <Skeleton variant="text" width="60%" height={26} />
        <Skeleton variant="circular" width={24} height={24} />
      </Box>

      {/* Nombre, Apellido, DNI, Fecha nac., Lugar nac., Sexo, Madre, Fecha ingreso NEO, Sala, Peso nac., Diagnóstico, Peso día abrazo */}
      <FieldSkeleton />
      <FieldSkeleton />
      <FieldSkeleton />
      <FieldSkeleton />
      <FieldSkeleton />
      <FieldSkeleton />
      <FieldSkeleton />
      <FieldSkeleton />
      <FieldSkeleton />
      <FieldSkeleton />
      <FieldSkeleton />
      <FieldSkeleton />

      <Skeleton variant="rounded" height={44} sx={{ mt: 1, borderRadius: '10px' }} />
    </Box>
  );
}

export const ProfileBabyPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const babyState = useSelector((s) => s.babyReducer);
  const motherState = useSelector((s) => s.motherReducer);
  const loading = useSelector((s) => s.babyReducer?.loading);
  const visita = useSelector((s) => s.visitaReducer);

  const [babyModel, setBabyModel] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, message: '', onConfirm: null });
  // Used to know whether the next getBabys refresh should update the model
  const pendingModelRefresh = useRef(false);
  const originalBabyModel = useRef(null);

  const openConfirm = (message, onConfirm) =>
    setConfirmDialog({ open: true, message, onConfirm });
  const handleConfirm = () => {
    confirmDialog.onConfirm?.();
    setConfirmDialog({ open: false, message: '', onConfirm: null });
  };
  const handleCancelConfirm = () =>
    setConfirmDialog({ open: false, message: '', onConfirm: null });

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

  useEffect(() => {
    const list = normalizarBabyList(babyState?.getBabys);
    if (list.length > 0) {
      dispatch(showLoading(false));
      const found = list.find((b) => String(b.id ?? b.ID ?? b.idBebe) === String(id));
      if (found) {
        if (pendingModelRefresh.current) {
          // After a successful save, update with server data
          setBabyModel(found);
          originalBabyModel.current = JSON.stringify(found);
          pendingModelRefresh.current = false;
        } else {
          // Initial load: only set if not already set
          setBabyModel((prev) => prev ?? found);
        }
        if (found.idMadre != null && !found.madre) {
          dispatch(getMotherId(found.idMadre));
        }
      }
    } else if (babyState?.getBabys != null) {
      // List loaded but empty or unexpected format
      dispatch(showLoading(false));
    }
  }, [babyState?.getBabys, id, dispatch]);

  useEffect(() => {
    if (babyState?.putBaby != null) {
      dispatch(showLoading(false));
      setEditMode(false);
      pendingModelRefresh.current = true;
      dispatch(showToast({ message: 'Datos del bebé actualizados correctamente.', severity: 'success' }));
      dispatch(clearBabyWrites());
      dispatch(getBabys());
    }
  }, [babyState?.putBaby, dispatch]);

  useEffect(() => {
    if (babyState?.error != null) {
      dispatch(showLoading(false));
    }
  }, [babyState?.error, dispatch]);

  useEffect(() => {
    if (visita?.postVisita != null || visita?.putVisita != null || visita?.postVisitaDelete != null) {
      dispatch(showToast({ message: 'Visita: operación realizada con éxito.', severity: 'success' }));
      dispatch(clearVisitaWrites());
      dispatch(getVisitasByBebe(Number(id)));
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

  const madreData = babyModel?.madre ?? motherState?.getMotherId?.data ?? null;
  const madreNombre = madreData
    ? [madreData.nombre, madreData.apellido].filter(Boolean).join(' ').trim()
    : null;

  const visitasList = normalizarVisitas(visita?.getVisitasByBebe);

  const handleSaveBaby = () => {
    if (!babyModel) return;
    if (originalBabyModel.current != null && JSON.stringify(babyModel) === originalBabyModel.current) {
      dispatch(showToast({ message: 'No se detectaron cambios.', severity: 'info' }));
      return;
    }
    const payload = normalizeBabyApiPayload(babyModel, babyModel?.idMadre);
    if (payload.id == null) {
      dispatch(showToast({ message: 'No se pudo identificar el bebé. Recargá la página e intentá de nuevo.', severity: 'error' }));
      return;
    }
    dispatch(showLoading(true));
    dispatch(putBaby(payload));
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    // Restore to server data
    const list = normalizarBabyList(babyState?.getBabys);
    const found = list.find((b) => String(b.id ?? b.ID ?? b.idBebe) === String(id));
    if (found) setBabyModel(found);
  };

  const babyNombre =
    babyModel
      ? [babyModel.nombre, babyModel.apellido].filter(Boolean).join(' ').trim() || 'Sin nombre'
      : `Bebé #${id}`;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100dvh', maxHeight: '100dvh', minHeight: 0, overflow: 'hidden', position: 'relative' }}>
      {loading && babyModel !== null && <Loading position="absolute" height="100%" zIndex={9999} />}
      <PageHeader title="Perfil del bebé" />

      <PageScrollMain>
        {babyModel === null ? (
          <BabyProfileSkeleton />
        ) : null}
        {babyModel !== null && <Box sx={{ px: 2.5, pt: 1, pb: 1 }}>

          {/* Acordeón datos del bebé */}
          <AccordionCustomized
            item="datos-bebe"
            defaultExpanded
            expandIcon={<ExpandCircleDownIcon style={{ color: '#8F00FF' }} />}
            summary={<TitleAccordion>Datos del bebé: {babyNombre}</TitleAccordion>}
            details={
              babyModel ? (
                <>
                  <BabyForm
                    model={babyModel}
                    setModel={setBabyModel}
                    readOnly={!editMode}
                    salaOptions={babySalasOptions}
                    listMothers={null}
                    listLocalities={null}
                    madreDisplayName={madreNombre ?? ''}
                  />

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                    {!editMode ? (
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => {
                          originalBabyModel.current = JSON.stringify(babyModel);
                          setEditMode(true);
                        }}
                        sx={btnEdit}
                      >
                        Editar bebé
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={handleSaveBaby}
                          sx={btnSave}
                        >
                          Guardar bebé
                        </Button>
                        <Button
                          variant="outlined"
                          fullWidth
                          onClick={handleCancelEdit}
                          sx={btnCancel}
                        >
                          Descartar cambios
                        </Button>
                      </>
                    )}
                  </Box>
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
              <VisitasBebe
                visitasList={visitasList}
                idBebe={Number(id)}
                onCrear={(payload) => dispatch(postVisita(payload))}
                onEditar={(idVisita, payload) => dispatch(putVisita(idVisita, payload))}
                onEliminar={(idVisita) =>
                  openConfirm('¿Eliminar esta visita?', () => dispatch(postVisitaDelete(idVisita)))
                }
              />
            }
          />

        </Box>}
      </PageScrollMain>

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
