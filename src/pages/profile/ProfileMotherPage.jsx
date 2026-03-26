import React, { useEffect, useState } from 'react'
import Loading from '../../components/atoms/loading/Loading';
import { ProfileTemplate } from '../../components/templates/profile/ProfileTemplate';
import { useDispatch, useSelector } from 'react-redux';
import { getVolunteersStates, getVolunteerById, putVolunteer, clearVolunteer } from '../../redux/actions/volunteerActions';
import { getMotherId, clearMother, putMother } from '../../redux/actions/motherActions';
import { useParams } from 'react-router-dom';
import Footer from '../../components/molecules/Footer';
import { formattedDate } from '../../utils/dateFormat';
import { showLoading } from '../../redux/actions/loadingActions';
import { getLocalities } from '../../redux/actions/genericsActions';
import DialogSuccess from '../../components/atoms/dialogSuccess/DialogSuccess';

export const ProfileMotherPage = () => {

  const dispatch = useDispatch();
  const localities = useSelector(state => state.genericsReducer?.getLocalities)
  const loading = useSelector(state => state.motherReducer?.loading)
  const dataMother = useSelector(state => state.motherReducer)
  const [model, setModel] = useState(null);
  const [error, setError] = useState(null);
  const [stateForm, setStateForm] = useState(null);
  const { id } = useParams();
  const [editForm, setEditForm] = React.useState(false);

  const submitMother = () => {
    dispatch(showLoading(true))
    dispatch(putMother(model))
  }

  useEffect(() => {
    dispatch(showLoading(true))
    // dispatch(getVolunteersStates())
    dispatch(getMotherId(id))
    dispatch(getLocalities())

    dispatch(clearMother())
    return () => {
      dispatch(clearMother())
    }

  }, [])

  useEffect(() => {
    if (dataMother?.getMotherId !== null) {
      dispatch(showLoading(false))
      setModel(dataMother?.getMotherId?.madre)
    }
  }, [dataMother?.getMotherId])

  useEffect(() => {
    if (dataMother?.error !== null) {
      //setStateForm('ERROR')
      dispatch(showLoading(false))
      setError(dataMother?.error)
    }
    if (dataMother?.putMother !== null) {
      //setModel(null)
      setEditForm(state => !state)
      dispatch(showLoading(false))
      setStateForm('SUCCESS')
      setTimeout(() => {
        setStateForm(null);
      }, [2500])
    }
  }, [dataMother?.error, dataMother?.putMother])

  return (
    <>
      {loading &&
        <Loading position={'absolute'} height={'100%'} zIndex={9999} />
      }
      <ProfileTemplate
        model={model}
        setModel={setModel}
        // volunteersStates={volunterState}
        submit={submitMother}
        localities={localities?.localidades ?? null}

        editForm={editForm}
        setEditForm={setEditForm}
        typeForm="EDITAR"
        
        type={"MOTHER"}
      />
      {
        stateForm === 'SUCCESS' &&
        <DialogSuccess
          open={stateForm === 'SUCCESS'}
          setOpen={setStateForm}
          message={'La madre se ha modificado con éxito'}
        />
      }
      {
        stateForm === 'ERROR' &&
        <DialogSuccess
          open={stateForm === 'ERROR'}
          setOpen={setStateForm}
          message={error}
        />
      }
      <Footer />
    </>
  )
}
