import React, { useEffect, useState } from 'react'
import Loading from '../../components/atoms/loading/Loading';
import { ProfileTemplate } from '../../components/templates/profile/ProfileTemplate';
import { useDispatch, useSelector } from 'react-redux';
import { getVolunteersStates, getVolunteerById, putVolunteer, clearVolunteer } from '../../redux/actions/volunteerActions';
import { useParams } from 'react-router-dom';
import Footer from '../../components/molecules/Footer';
import { showLoading } from '../../redux/actions/loadingActions';
import DialogSuccess from '../../components/atoms/dialogSuccess/DialogSuccess';

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
  const volunterState = dataVolunteer?.getVolunteerStates?.listadoEstadosVoluntarias?.map(state => ({ label: state.nombre, value: state.idEstado })) ?? []

  const submitVolunteer = () => {
    dispatch(showLoading(true))
    dispatch(putVolunteer(model))
  }

  useEffect(() => {
    dispatch(showLoading(true))
    dispatch(getVolunteersStates())
    dispatch(getVolunteerById(id))

    dispatch(clearVolunteer())
    return () => {
      dispatch(clearVolunteer())
    }

  }, [])

  useEffect(() => {
    if (getVolunteer?.voluntaria) {
      const { voluntaria } = getVolunteer
      setModel({
        ...voluntaria,
        celular: voluntaria.celular.toString(),
      })
      dispatch(showLoading(false))
    }
  }, [getVolunteer])

  useEffect(() => {
    if (dataVolunteer?.error !== null) {
      //setStateForm('ERROR')
      dispatch(showLoading(false))
      setError(dataVolunteer?.error)
    }
    if (dataVolunteer?.putVolunteer !== null) {
      //setModel(null)
      setEditForm(state => !state)
      dispatch(showLoading(false))
      setStateForm('SUCCESS')
      setTimeout(() => {
        setStateForm(null);
      }, [2500])
    }
  }, [dataVolunteer?.error, dataVolunteer?.putVolunteer])

  return (
    <>
      {loading &&
        <Loading position={'absolute'} height={'100%'} zIndex={9999} />
      }
      <ProfileTemplate
        model={model}
        setModel={setModel}
        volunteersStates={volunterState}
        submit={submitVolunteer}

        editForm={editForm}
        setEditForm={setEditForm}
        type="VOLUNTEER"
      />
      {
        stateForm === 'SUCCESS' &&
        <DialogSuccess
          open={stateForm === 'SUCCESS'}
          setOpen={setStateForm}
          message={'La voluntaria se ha modificado con éxito'}
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
