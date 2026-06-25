import React, { useEffect, useRef, useState } from 'react';
import {
  Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Skeleton, TextField, Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useDispatch, useSelector } from 'react-redux';
import Footer from '../../components/molecules/Footer';
import PageScrollMain from '../../components/common/PageScrollMain';
import Loading from '../../components/atoms/loading/Loading';
import { showLoading } from '../../redux/actions/loadingActions';
import { showToast } from '../../redux/actions/toastActions';
import { getVolunteerById, putVolunteer, clearVolunteer, getVolunteers } from '../../redux/actions/volunteerActions';
import { putUsuarioContrasena, clearUserAdmin } from '../../redux/actions/userActions';
import { ProfileTemplate } from '../../components/templates/profile/ProfileTemplate';
import {
  validateVolunteerProfile,
  normalizeVolunteerPayload,
  INITIAL_VOLUNTEER_FIELD_ERRORS,
} from '../../utils/volunteerFormValidation';
import { getIdVolunteer } from '../../utils/localStorage';

const VIOLET = '#7A659B';
const NAVY = '#152C70';
const GRADIENT = 'linear-gradient(135deg, #7F00FF 0%, #9B59B6 60%, #7A659B 100%)';

const BOTTOM_SHEET_SX = {
  maxWidth: 444,
  width: '100%',
  mx: 'auto',
  mb: 0,
  mt: 'auto',
  borderRadius: '20px 20px 0 0',
  maxHeight: '90dvh',
  display: 'flex',
  flexDirection: 'column',
};

function getInitials(nombre, apellido) {
  const n = (nombre ?? '').trim();
  const a = (apellido ?? '').trim();
  return `${n[0] ?? ''}${a[0] ?? ''}`.toUpperCase();
}

function AvatarSkeleton() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 5, pb: 3 }}>
      <Skeleton variant="circular" width={80} height={80} sx={{ mb: 1.5 }} />
      <Skeleton variant="text" width={140} height={24} sx={{ mb: 0.5 }} />
      <Skeleton variant="text" width={90} height={18} />
    </Box>
  );
}

function FieldSkeleton() {
  return (
    <Box sx={{ mb: 1.5 }}>
      <Skeleton variant="text" width="38%" height={18} sx={{ mb: 0.5 }} />
      <Skeleton variant="rounded" height={44} />
    </Box>
  );
}

export const MyProfilePage = () => {
  const dispatch = useDispatch();
  const volunteerState = useSelector((s) => s.volunteerReducer);
  const userState = useSelector((s) => s.userReducer);
  const loading = useSelector((s) => s.volunteerReducer?.loading);

  const id = getIdVolunteer();
  const [model, setModel] = useState(null);
  const modelRef = useRef(null);
  const originalModel = useRef(null);
  useEffect(() => { modelRef.current = model; }, [model]);

  const [editForm, setEditFormRaw] = useState(false);
  const setEditForm = (val) => {
    if (val === true && !editForm) {
      originalModel.current = JSON.stringify(modelRef.current);
    }
    setEditFormRaw(val);
  };
  const [fieldErrors, setFieldErrors] = useState({ ...INITIAL_VOLUNTEER_FIELD_ERRORS });

  const [pwdOpen, setPwdOpen] = useState(false);
  const [pwdActual, setPwdActual] = useState('');
  const [pwdNueva, setPwdNueva] = useState('');
  const [pwdConfirm, setPwdConfirm] = useState('');
  const [pwdError, setPwdError] = useState('');

  const closePwdDialog = () => {
    setPwdOpen(false);
    setPwdActual('');
    setPwdNueva('');
    setPwdConfirm('');
    setPwdError('');
  };

  useEffect(() => {
    dispatch(showLoading(true));
    dispatch(getVolunteers());
    dispatch(getVolunteerById(id));
    return () => {
      dispatch(clearVolunteer());
      dispatch(showLoading(false));
    };
  }, []);

  useEffect(() => {
    if (volunteerState?.getVolunteer?.data) {
      const v = volunteerState.getVolunteer.data;
      setModel({
        ...v,
        idVoluntaria: v.idVoluntaria ?? v.id,
        celular: v.celular != null ? String(v.celular) : '',
      });
      dispatch(showLoading(false));
    }
  }, [volunteerState?.getVolunteer]);

  useEffect(() => {
    if (volunteerState?.error != null) dispatch(showLoading(false));
    if (volunteerState?.putVolunteer != null) {
      setEditFormRaw(false);
      setFieldErrors({ ...INITIAL_VOLUNTEER_FIELD_ERRORS });
      dispatch(showLoading(false));
      originalModel.current = JSON.stringify(modelRef.current);
      dispatch(showToast({ message: 'Datos actualizados.', severity: 'success' }));
    }
  }, [volunteerState?.error, volunteerState?.putVolunteer]);

  useEffect(() => {
    if (userState?.userAdminError != null) dispatch(showLoading(false));
    if (userState?.putUsuarioContrasena != null) {
      dispatch(showLoading(false));
      dispatch(showToast({ message: 'Contraseña actualizada.', severity: 'success' }));
      closePwdDialog();
      dispatch(clearUserAdmin());
    }
  }, [userState?.userAdminError, userState?.putUsuarioContrasena]);

  const submitVolunteer = () => {
    const mdl = model || {};
    if (originalModel.current != null && JSON.stringify(mdl) === originalModel.current) {
      dispatch(showToast({ message: 'No se detectaron cambios.', severity: 'info' }));
      return;
    }
    const volunteers = volunteerState?.getVolunteers?.data ?? [];
    const selfId = mdl?.idVoluntaria ?? mdl?.id ?? (id != null ? Number(id) : null);
    const { ok, errors } = validateVolunteerProfile(mdl, {
      volunteers,
      excludeVolunteerId: Number.isFinite(selfId) ? selfId : null,
      myProfile: true,
    });
    setFieldErrors(errors);
    if (!ok) return;
    dispatch(showLoading(true));
    const payload = normalizeVolunteerPayload({
      ...mdl,
      idVoluntaria: Number.isFinite(selfId) ? selfId : mdl.idVoluntaria,
    });
    dispatch(putVolunteer(payload));
  };

  const submitContrasena = () => {
    setPwdError('');
    if (!pwdActual) { setPwdError('Ingresá la contraseña actual.'); return; }
    if (pwdNueva.length < 8 || pwdNueva.length > 15) { setPwdError('La nueva contraseña debe tener entre 8 y 15 caracteres.'); return; }
    if (pwdNueva !== pwdConfirm) { setPwdError('Las contraseñas no coinciden.'); return; }
    dispatch(showLoading(true));
    dispatch(putUsuarioContrasena({ ContrasenaActual: pwdActual, ContrasenaNueva: pwdNueva }));
  };

  const initials = model ? getInitials(model.nombre, model.apellido) : '';
  const fullName = model ? [model.nombre, model.apellido].filter(Boolean).join(' ') : '';
  const rol = model?.rol ?? '';

  return (
    <Box
      sx={{
        display: 'flex', flexDirection: 'column',
        width: '100%', height: '100dvh', maxHeight: '100dvh',
        minHeight: 0, overflow: 'hidden', position: 'relative',
      }}
    >
      {loading && model !== null && (
        <Loading position="absolute" height="100%" zIndex={9999} />
      )}

      <PageScrollMain>
        {/* Avatar header */}
        {model === null ? (
          <AvatarSkeleton />
        ) : (
          <Box
            sx={{
              background: GRADIENT,
              pt: 5,
              pb: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'rgba(255,255,255,0.22)',
                border: '3px solid rgba(255,255,255,0.6)',
                fontSize: '2rem',
                fontWeight: 700,
                color: '#fff',
                mb: 1.5,
                boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
              }}
            >
              {initials}
            </Avatar>
            <Typography variant="h6" fontWeight={700} sx={{ color: '#fff', lineHeight: 1.2 }}>
              {fullName}
            </Typography>
            {rol ? (
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 0.5 }}>
                {rol}
              </Typography>
            ) : null}
          </Box>
        )}

        {/* Form */}
        {model === null ? (
          <Box sx={{ px: 2.5, pt: 2, pb: 4 }}>
            <FieldSkeleton /><FieldSkeleton /><FieldSkeleton /><FieldSkeleton />
          </Box>
        ) : (
          <div style={{ marginTop: '10px' }}>
            <ProfileTemplate
              model={model}
              setModel={setModel}
              submit={submitVolunteer}
              editForm={editForm}
              setEditForm={setEditForm}
              type="VOLUNTEER"
              fieldErrors={fieldErrors}
              setFieldErrors={setFieldErrors}
              disableAccordion
              myProfile
              hideHeader
            />
          </div>
        )}

        {/* Cambiar contraseña */}
        {model !== null && (
          <Box sx={{ px: 2.5, pt: 0, pb: 4 }}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<LockOutlinedIcon />}
              sx={{
                borderColor: VIOLET,
                color: VIOLET,
                minHeight: 44,
                borderRadius: '10px',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { bgcolor: '#F3EEFF', borderColor: VIOLET },
              }}
              onClick={() => setPwdOpen(true)}
            >
              Cambiar contraseña
            </Button>
          </Box>
        )}
      </PageScrollMain>

      {/* Bottom-sheet cambio de contraseña */}
      <Dialog
        open={pwdOpen}
        onClose={closePwdDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: BOTTOM_SHEET_SX }}
        sx={{ '& .MuiDialog-container': { alignItems: 'flex-end' } }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1.25, pb: 0.25 }}>
          <Box sx={{ width: 36, height: 4, borderRadius: 2, bgcolor: 'rgba(21,44,112,0.15)' }} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 3, pt: 1, pb: 0.5 }}>
          <Box
            sx={{
              width: 36, height: 36, borderRadius: '50%',
              background: GRADIENT,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <LockOutlinedIcon sx={{ color: '#fff', fontSize: 18 }} />
          </Box>
          <DialogTitle sx={{ p: 0, fontWeight: 700, color: NAVY, fontSize: '1.1rem' }}>
            Cambiar contraseña
          </DialogTitle>
        </Box>
        <DialogContent sx={{ pt: 2.5 }}>
          <TextField
            label="Contraseña actual"
            type="password"
            value={pwdActual}
            onChange={(e) => setPwdActual(e.target.value)}
            fullWidth size="small" sx={{ mb: 1.5 }}
            autoComplete="current-password"
          />
          <TextField
            label="Nueva contraseña (8–15 caracteres)"
            type="password"
            value={pwdNueva}
            onChange={(e) => setPwdNueva(e.target.value)}
            fullWidth size="small" sx={{ mb: 1.5 }}
            autoComplete="new-password"
          />
          <TextField
            label="Confirmar nueva contraseña"
            type="password"
            value={pwdConfirm}
            onChange={(e) => setPwdConfirm(e.target.value)}
            fullWidth size="small"
            autoComplete="new-password"
          />
          {pwdError && (
            <Typography variant="caption" color="error" display="block" sx={{ mt: 1 }}>
              {pwdError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2.5, gap: 1 }}>
          <Button
            variant="outlined"
            onClick={closePwdDialog}
            sx={{ flex: 1, minHeight: 44, borderRadius: '10px', borderColor: 'rgba(21,44,112,0.22)', color: VIOLET, textTransform: 'none', fontWeight: 600 }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            disabled={!pwdActual || !pwdNueva || !pwdConfirm}
            sx={{ flex: 1, minHeight: 44, borderRadius: '10px', background: GRADIENT, boxShadow: '0 4px 14px rgba(127,0,255,0.28)', textTransform: 'none', fontWeight: 700 }}
            onClick={submitContrasena}
          >
            Actualizar
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  );
};

export default MyProfilePage;
