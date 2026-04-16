import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material';
import Loading from '../../components/atoms/loading/Loading';
import { ProfileTemplate } from '../../components/templates/profile/ProfileTemplate';
import { useDispatch, useSelector } from 'react-redux';
import { getVolunteerById, putVolunteer, clearVolunteer, getVolunteers } from '../../redux/actions/volunteerActions';
import { useParams } from 'react-router-dom';
import Footer from '../../components/molecules/Footer';
import PageScrollMain from '../../components/common/PageScrollMain';
import { showLoading } from '../../redux/actions/loadingActions';
import DialogSuccess from '../../components/atoms/dialogSuccess/DialogSuccess';
import {
  validateVolunteerProfile,
  normalizeVolunteerPayload,
  INITIAL_VOLUNTEER_FIELD_ERRORS,
} from '../../utils/volunteerFormValidation';

export const ProfileVolunteerPage = () => {

  const dispatch = useDispatch();
  const loading = useSelector(state => state.volunteerReducer?.loading)
  const dataVolunteer = useSelector(state => state.volunteerReducer)
  const [model, setModel] = useState(null);
  const [error, setError] = useState(null);
  const [stateForm, setStateForm] = useState(null);
  const { id } = useParams();
  const [editForm, setEditForm] = React.useState(false);
  const { getVolunteer } = dataVolunteer;
  const [fieldErrors, setFieldErrors] = useState({ ...INITIAL_VOLUNTEER_FIELD_ERRORS });

  const submitVolunteer = () => {
    const mdl = model || {};
    const volunteers = dataVolunteer?.getVolunteers?.listadoVoluntaria ?? [];
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
    if (getVolunteer?.voluntaria) {
      const { voluntaria } = getVolunteer
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
      setError(dataVolunteer?.error)
    }
    if (dataVolunteer?.putVolunteer !== null) {
      setEditForm(state => !state)
      setFieldErrors({ ...INITIAL_VOLUNTEER_FIELD_ERRORS });
      dispatch(showLoading(false))
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
      {loading && (
        <Loading position={'absolute'} height={'100%'} zIndex={9999} />
      )}
      <PageScrollMain>
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
      </PageScrollMain>
      {stateForm === 'SUCCESS' && (
        <DialogSuccess
          open={stateForm === 'SUCCESS'}
          setOpen={setStateForm}
          message={'La voluntaria se ha modificado con éxito'}
        />
      )}
      {stateForm === 'ERROR' && (
        <DialogSuccess
          open={stateForm === 'ERROR'}
          setOpen={setStateForm}
          message={error}
        />
      )}
      <Footer />
    </Box>
  )
}
