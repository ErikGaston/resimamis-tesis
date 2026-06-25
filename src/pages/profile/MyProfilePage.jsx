import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Skeleton, TextField, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Footer from '../../components/molecules/Footer';
import PageScrollMain from '../../components/common/PageScrollMain';
import { PageHeader } from '../../components/common/PageHeader';
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

  // Cambio de contraseña
  const [pwdActual, setPwdActual] = useState('');
  const [pwdNueva, setPwdNueva] = useState('');
  const [pwdConfirm, setPwdConfirm] = useState('');
  const [pwdError, setPwdError] = useState('');

  useEffect(() => {
    dispatch(showLoading(true));
    dispatch(getVolunteers());
    dispatch(getVolunteerById(id));
    return () => { dispatch(clearVolunteer()); };
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
      setPwdActual('');
      setPwdNueva('');
      setPwdConfirm('');
      setPwdError('');
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
        {model === null ? (
          <>
            <PageHeader title="Mi perfil" />
            <Box sx={{ px: 2.5, pt: 2, pb: 4 }}>
              <FieldSkeleton /><FieldSkeleton /><FieldSkeleton /><FieldSkeleton /><FieldSkeleton />
            </Box>
          </>
        ) : (
          <ProfileTemplate
            model={model}
            setModel={setModel}
            submit={submitVolunteer}
            editForm={editForm}
            setEditForm={setEditForm}
            type="VOLUNTEER"
            fieldErrors={fieldErrors}
            setFieldErrors={setFieldErrors}
          />
        )}

        {/* Sección cambio de contraseña */}
        <Box sx={{ px: 2.5, pt: 0.5, pb: 3 }}>
          <Typography
            variant="subtitle2"
            sx={{ color: VIOLET, fontWeight: 700, mb: 1.5, fontSize: '0.95rem', letterSpacing: '0.4px' }}
          >
            Cambiar contraseña
          </Typography>
          <TextField
            label="Contraseña actual"
            type="password"
            value={pwdActual}
            onChange={(e) => setPwdActual(e.target.value)}
            fullWidth size="small" sx={{ mb: 1 }}
          />
          <TextField
            label="Nueva contraseña (8–15 caracteres)"
            type="password"
            value={pwdNueva}
            onChange={(e) => setPwdNueva(e.target.value)}
            fullWidth size="small" sx={{ mb: 1 }}
          />
          <TextField
            label="Confirmar nueva contraseña"
            type="password"
            value={pwdConfirm}
            onChange={(e) => setPwdConfirm(e.target.value)}
            fullWidth size="small" sx={{ mb: 1 }}
          />
          {pwdError && (
            <Typography variant="caption" color="error" display="block" sx={{ mb: 1 }}>
              {pwdError}
            </Typography>
          )}
          <Button
            variant="contained"
            fullWidth
            disabled={!pwdActual || !pwdNueva || !pwdConfirm}
            sx={{ bgcolor: VIOLET, '&:hover': { bgcolor: '#6A549A' } }}
            onClick={submitContrasena}
          >
            Actualizar contraseña
          </Button>
        </Box>
      </PageScrollMain>
      <Footer />
    </Box>
  );
};

export default MyProfilePage;
