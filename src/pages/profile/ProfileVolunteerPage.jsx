import React, { useEffect, useRef, useState } from 'react'
import { Box, Skeleton } from '@mui/material';
import Loading from '../../components/atoms/loading/Loading';
import { ProfileTemplate } from '../../components/templates/profile/ProfileTemplate';
import { useDispatch, useSelector } from 'react-redux';
import { getVolunteerById, putVolunteer, clearVolunteer, getVolunteers } from '../../redux/actions/volunteerActions';
import { useParams } from 'react-router-dom';
import Footer from '../../components/molecules/Footer';
import PageScrollMain from '../../components/common/PageScrollMain';
import { PageHeader } from '../../components/common/PageHeader';
import { showLoading } from '../../redux/actions/loadingActions';
import { showToast } from '../../redux/actions/toastActions';
import DialogSuccess from '../../components/atoms/dialogSuccess/DialogSuccess';
import {
  validateVolunteerProfile,
  normalizeVolunteerPayload,
  INITIAL_VOLUNTEER_FIELD_ERRORS,
} from '../../utils/volunteerFormValidation';
import { VolunteerHorarioSection } from '../../components/molecules/volunteerHorario/VolunteerHorarioSection';
import AccordionCustomized from '../../components/atoms/accordionCustomized/AccordionCustomized';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

function FieldSkeleton({ multiline = false }) {
  return (
    <Box sx={{ mb: 1.5 }}>
      <Skeleton variant="text" width="38%" height={18} sx={{ mb: 0.5 }} />
      <Skeleton variant="rounded" height={multiline ? 76 : 44} />
    </Box>
  );
}

function VolunteerProfileSkeleton() {
  return (
    <>
      <PageHeader title="Cargando..." />
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
          <Skeleton variant="text" width="65%" height={26} />
          <Skeleton variant="circular" width={24} height={24} />
        </Box>

        {/* Nombre, Apellido, DNI, E-mail, Celular, Fecha nacimiento, Fecha inicio, Fecha baja */}
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
    </>
  );
}

export const ProfileVolunteerPage = () => {

  const dispatch = useDispatch();
  const loading = useSelector(state => state.volunteerReducer?.loading)
  const dataVolunteer = useSelector(state => state.volunteerReducer)
  const [model, setModel] = useState(null);
  const modelRef = useRef(null);
  const originalModel = useRef(null);
  useEffect(() => { modelRef.current = model; }, [model]);
  const [stateForm, setStateForm] = useState(null);
  const { id } = useParams();
  const [editForm, setEditFormRaw] = React.useState(false);
  const setEditForm = (val) => {
    if (val === true && !editForm) {
      originalModel.current = JSON.stringify(modelRef.current);
    }
    setEditFormRaw(val);
  };
  const { getVolunteer } = dataVolunteer;
  const [fieldErrors, setFieldErrors] = useState({ ...INITIAL_VOLUNTEER_FIELD_ERRORS });

  const submitVolunteer = () => {
    const mdl = model || {};
    if (originalModel.current != null && JSON.stringify(mdl) === originalModel.current) {
      dispatch(showToast({ message: 'No se detectaron cambios.', severity: 'info' }));
      return;
    }
    const volunteers = dataVolunteer?.getVolunteers?.data ?? [];
    const selfId =
      mdl?.idVoluntaria ??
      mdl?.id ??
      (id != null && id !== '' ? Number(id) : null);
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

  useEffect(() => {
    dispatch(showLoading(true))
    dispatch(getVolunteers())
    dispatch(getVolunteerById(id))

    return () => {
      dispatch(clearVolunteer())
    }

  }, [])

  useEffect(() => {
    if (getVolunteer?.data) {
      const voluntaria = getVolunteer.data
      setModel({
        ...voluntaria,
        idVoluntaria: voluntaria.idVoluntaria ?? voluntaria.id,
        celular: voluntaria.celular != null ? String(voluntaria.celular) : '',
      })
      dispatch(showLoading(false))
    }
  }, [getVolunteer])

  useEffect(() => {
    if (dataVolunteer?.error !== null) {
      dispatch(showLoading(false))
    }
    if (dataVolunteer?.putVolunteer !== null) {
      setEditFormRaw(false);
      setFieldErrors({ ...INITIAL_VOLUNTEER_FIELD_ERRORS });
      dispatch(showLoading(false));
      originalModel.current = JSON.stringify(modelRef.current);
      setStateForm('SUCCESS')
      setTimeout(() => {
        setStateForm(null);
      }, [2500])
    }
  }, [dataVolunteer?.error, dataVolunteer?.putVolunteer])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100dvh',
        maxHeight: '100dvh',
        minHeight: 0,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Overlay solo para mutaciones (putVolunteer), no para la carga inicial */}
      {loading && model !== null && (
        <Loading />
      )}
      <PageScrollMain>
        {model === null ? (
          <VolunteerProfileSkeleton />
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
        {model?.idVoluntaria != null && (
          <Box sx={{ px: 2.5, pt: 0.5, pb: 1 }}>
            <AccordionCustomized
              item="horario-voluntaria"
              expandIcon={<ExpandCircleDownIcon style={{ color: '#8F00FF' }} />}
              summary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarMonthIcon sx={{ color: '#8F00FF', fontSize: 20 }} />
                  <span style={{ color: '#152C70', fontFamily: 'Roboto', fontSize: 19, fontWeight: 400, letterSpacing: '0.8px' }}>
                    Disponibilidad horaria
                  </span>
                </Box>
              }
              details={
                <VolunteerHorarioSection
                  idVoluntaria={Number(model.idVoluntaria)}
                  horarios={model?.horarios ?? []}
                  onSuccess={() => dispatch(getVolunteerById(id))}
                />
              }
            />
          </Box>
        )}
      </PageScrollMain>
      {stateForm === 'SUCCESS' && (
        <DialogSuccess
          open={stateForm === 'SUCCESS'}
          setOpen={setStateForm}
          message={'La voluntaria se ha modificado con éxito'}
        />
      )}
      <Footer />
    </Box>
  )
}
