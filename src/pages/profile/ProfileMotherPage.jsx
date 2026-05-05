import React, { useEffect, useMemo, useState } from 'react'
import { Box } from '@mui/material';
import Loading from '../../components/atoms/loading/Loading';
import { ProfileTemplate } from '../../components/templates/profile/ProfileTemplate';
import { useDispatch, useSelector } from 'react-redux';
import { getMotherId, clearMother, putMother, getMother, clearMotherApiError } from '../../redux/actions/motherActions';
import { useParams } from 'react-router-dom';
import Footer from '../../components/molecules/Footer';
import PageScrollMain from '../../components/common/PageScrollMain';
import { showLoading } from '../../redux/actions/loadingActions';
import { getLocalities } from '../../redux/actions/genericsActions';
import DialogSuccess from '../../components/atoms/dialogSuccess/DialogSuccess';
import {
  validateMotherForm,
  normalizeMotherPayload,
  INITIAL_MOTHER_FIELD_ERRORS,
} from '../../utils/motherFormValidation';
import {
  mapAspNetErrorsToMotherFieldErrors,
  resolveApiErrorMessage,
} from '../../utils/apiErrorMessage';
import { clearBaby, getBabySalas, putBaby } from '../../redux/actions/babyActions';

export const ProfileMotherPage = () => {

  const dispatch = useDispatch();
  const localities = useSelector(state => state.genericsReducer?.getLocalities)
  const loading = useSelector(state => state.motherReducer?.loading)
  const dataMother = useSelector(state => state.motherReducer)
  const dataBaby = useSelector(state => state.babyReducer)
  const [model, setModel] = useState(null);
  const [error, setError] = useState(null);
  const [stateForm, setStateForm] = useState(null);
  const { id } = useParams();
  const [editForm, setEditForm] = React.useState(false);
  const [fieldErrors, setFieldErrors] = useState({ ...INITIAL_MOTHER_FIELD_ERRORS });
  const [babySaveNotice, setBabySaveNotice] = useState(null);

  const submitMother = () => {
    dispatch(clearMotherApiError());
    const mdl = model || {};
    const mothers = dataMother?.getMother?.listadoMadres ?? [];
    const { ok, errors } = validateMotherForm(mdl, {
      mothers,
      excludeMadreId: mdl?.idMadre ?? null,
    });
    setFieldErrors(errors);
    if (!ok) return;
    dispatch(showLoading(true));
    dispatch(putMother(normalizeMotherPayload(mdl)));
  }

  const salasRes = dataBaby?.getBabySalas;
  const babySalasOptions = useMemo(() => {
    const raw = salasRes?.resultado ?? salasRes?.listadoSalas ?? salasRes?.data;
    if (!Array.isArray(raw)) return null;
    return raw
      .map((s) => ({
        label: s.nombre ?? s.nombreSala ?? s.descripcion ?? `Sala ${s.idSala ?? s.id ?? ''}`,
        value: s.idSala ?? s.id,
      }))
      .filter((o) => o.value != null);
  }, [salasRes]);

  const profileBabyExtras = useMemo(
    () => ({
      babySalasOptions,
      onPutBaby: (payload) => {
        if (payload?.id == null) {
          return;
        }
        dispatch(showLoading(true));
        dispatch(putBaby(payload));
      },
      onReloadMother: () => {
        dispatch(showLoading(true));
        dispatch(getMotherId(id));
      },
    }),
    [babySalasOptions, dispatch, id],
  );

  useEffect(() => {
    dispatch(showLoading(true))
    dispatch(getMotherId(id))
    dispatch(getLocalities())
    dispatch(getMother())
    dispatch(getBabySalas())

    dispatch(clearMother())
    return () => {
      dispatch(clearMother())
      dispatch(clearBaby())
    }

  }, [id, dispatch])

  useEffect(() => {
    if (dataMother?.getMotherId !== null) {
      dispatch(showLoading(false))
      setModel(dataMother?.getMotherId?.madre)
    }
  }, [dataMother?.getMotherId, dispatch])

  useEffect(() => {
    if (dataMother?.error !== null && dataMother?.error !== undefined) {
      dispatch(showLoading(false));
      const mapped = mapAspNetErrorsToMotherFieldErrors(dataMother.error);
      if (Object.keys(mapped).length > 0) {
        setFieldErrors({ ...INITIAL_MOTHER_FIELD_ERRORS, ...mapped });
        dispatch(clearMotherApiError());
      } else {
        setError(resolveApiErrorMessage({ data: dataMother.error }));
        setStateForm('ERROR');
      }
    }
    if (dataMother?.putMother !== null) {
      setEditForm(state => !state)
      setFieldErrors({ ...INITIAL_MOTHER_FIELD_ERRORS });
      dispatch(showLoading(false))
      setStateForm('SUCCESS')
      setTimeout(() => {
        setStateForm(null);
      }, [2500])
    }
  }, [dataMother?.error, dataMother?.putMother, dispatch])

  useEffect(() => {
    if (dataBaby?.getBabySalas != null) {
      dispatch(showLoading(false));
    }
  }, [dataBaby?.getBabySalas, dispatch]);

  useEffect(() => {
    if (dataBaby?.putBaby != null) {
      dispatch(showLoading(false));
      setBabySaveNotice('SUCCESS');
      dispatch(getMotherId(id));
      setTimeout(() => setBabySaveNotice(null), 2500);
    }
  }, [dataBaby?.putBaby, dispatch, id]);

  useEffect(() => {
    if (dataBaby?.error != null) {
      dispatch(showLoading(false));
    }
  }, [dataBaby?.error, dispatch]);

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
          submit={submitMother}
          localities={localities?.localidades ?? null}
          mothers={dataMother?.getMother?.listadoMadres ?? null}
          editForm={editForm}
          setEditForm={setEditForm}
          typeForm="EDITAR"
          fieldErrors={fieldErrors}
          setFieldErrors={setFieldErrors}
          type={"MOTHER"}
          profileBabyExtras={profileBabyExtras}
        />
      </PageScrollMain>
      {stateForm === 'SUCCESS' && (
        <DialogSuccess
          open={stateForm === 'SUCCESS'}
          setOpen={setStateForm}
          message={'La madre se ha modificado con éxito'}
        />
      )}
      {babySaveNotice === 'SUCCESS' && (
        <DialogSuccess
          open={babySaveNotice === 'SUCCESS'}
          setOpen={setBabySaveNotice}
          message={'Los datos del bebé se actualizaron correctamente'}
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
