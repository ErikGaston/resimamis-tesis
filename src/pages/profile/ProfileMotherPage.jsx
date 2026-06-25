import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Box } from '@mui/material';
import Loading from '../../components/atoms/loading/Loading';
import { ProfileTemplate } from '../../components/templates/profile/ProfileTemplate';
import { useDispatch, useSelector } from 'react-redux';
import { getMotherId, clearMother, putMother, getMother, clearMotherApiError } from '../../redux/actions/motherActions';
import { useParams } from 'react-router-dom';
import Footer from '../../components/molecules/Footer';
import PageScrollMain from '../../components/common/PageScrollMain';
import { showLoading } from '../../redux/actions/loadingActions';
import { getLocalities, getEstadosCiviles } from '../../redux/actions/genericsActions';
import { showToast } from '../../redux/actions/toastActions';
import {
  validateMotherForm,
  normalizeMotherPayload,
  INITIAL_MOTHER_FIELD_ERRORS,
} from '../../utils/motherFormValidation';
import { mapAspNetErrorsToMotherFieldErrors } from '../../utils/apiErrorMessage';
import { clearBaby, getBabySalas, putBaby } from '../../redux/actions/babyActions';

export const ProfileMotherPage = () => {

  const dispatch = useDispatch();
  const localities = useSelector(state => state.genericsReducer?.getLocalities)
  const estadosCiviles = useSelector(state => state.genericsReducer?.getEstadosCiviles)
  const loading = useSelector(state => state.motherReducer?.loading)
  const dataMother = useSelector(state => state.motherReducer)
  const dataBaby = useSelector(state => state.babyReducer)
  const [model, setModel] = useState(null);
  const modelRef = useRef(null);
  const originalModel = useRef(null);
  useEffect(() => { modelRef.current = model; }, [model]);
  const { id } = useParams();
  const [editForm, setEditFormRaw] = React.useState(false);
  const setEditForm = (val) => {
    if (val === true && !editForm) {
      originalModel.current = JSON.stringify(modelRef.current);
    }
    setEditFormRaw(val);
  };
  const [fieldErrors, setFieldErrors] = useState({ ...INITIAL_MOTHER_FIELD_ERRORS });

  const submitMother = () => {
    dispatch(clearMotherApiError());
    const mdl = model || {};
    if (originalModel.current != null && JSON.stringify(mdl) === originalModel.current) {
      dispatch(showToast({ message: 'No se detectaron cambios.', severity: 'info' }));
      return;
    }
    const mothers = dataMother?.getMother?.data ?? [];
    const { ok, errors } = validateMotherForm(mdl, {
      mothers,
      excludeMadreId: mdl?.idMadre ?? mdl?.IdMadre ?? mdl?.id ?? null,
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
    if (editForm && dataMother?.getMother == null) {
      dispatch(getMother());
    }
  }, [editForm]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    dispatch(showLoading(true))
    dispatch(clearMother())
    dispatch(getMotherId(id))
    dispatch(getLocalities())
    dispatch(getEstadosCiviles())
    dispatch(getBabySalas())

    return () => {
      dispatch(clearMother())
      dispatch(clearBaby())
    }

  }, [id, dispatch])

  useEffect(() => {
    if (dataMother?.getMotherId !== null) {
      dispatch(showLoading(false))
      setModel(dataMother?.getMotherId?.data)
    }
  }, [dataMother?.getMotherId, dispatch])

  useEffect(() => {
    if (dataMother?.error !== null && dataMother?.error !== undefined) {
      dispatch(showLoading(false));
      const mapped = mapAspNetErrorsToMotherFieldErrors(dataMother.error);
      if (Object.keys(mapped).length > 0) {
        setFieldErrors({ ...INITIAL_MOTHER_FIELD_ERRORS, ...mapped });
        dispatch(clearMotherApiError());
      }
    }
    if (dataMother?.putMother !== null) {
      setEditFormRaw(false);
      setFieldErrors({ ...INITIAL_MOTHER_FIELD_ERRORS });
      dispatch(showLoading(false));
      originalModel.current = JSON.stringify(modelRef.current);
      dispatch(showToast({ message: 'La madre se ha modificado con éxito.', severity: 'success' }));
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
      dispatch(showToast({ message: 'Los datos del bebé se actualizaron correctamente.', severity: 'success' }));
      dispatch(getMotherId(id));
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
          localities={localities?.data ?? null}
          estadosCiviles={estadosCiviles?.data ?? null}
          mothers={dataMother?.getMother?.data ?? null}
          editForm={editForm}
          setEditForm={setEditForm}
          typeForm="EDITAR"
          fieldErrors={fieldErrors}
          setFieldErrors={setFieldErrors}
          type={"MOTHER"}
          profileBabyExtras={profileBabyExtras}
        />
      </PageScrollMain>
      <Footer />
    </Box>
  )
}
