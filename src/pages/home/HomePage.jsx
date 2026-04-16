import { Box } from '@mui/system'
import React, { useEffect } from 'react'
import Footer from '../../components/molecules/Footer'
import { HomeTemplate } from '../../components/templates/home/HomeTemplate'
import { useDispatch, useSelector } from 'react-redux'
import { clearVolunteer, getVolunteersFree } from '../../redux/actions/volunteerActions'
import VolutariasDisponible from '../../components/organisms/homeCarousels/VolutariasDisponible'
import Loading from '../../components/atoms/loading/Loading'
import { showLoading } from '../../redux/actions/loadingActions'
import { getNameVolunteer } from '../../utils/localStorage'

export const HomePage = () => {
  const dispatch = useDispatch();
  const dataVolunteer = useSelector(state => state.volunteerReducer)
  const loading = useSelector(state => state.volunteerReducer?.loading)
  const [stateChart, setStateChart] = React.useState('')
  const [valueChart, setValueChart] = React.useState('')
  let nameVolunteer = getNameVolunteer();

  useEffect(() => {
    dispatch(showLoading(true))
    dispatch(getVolunteersFree())

    dispatch(clearVolunteer())
    return () => {
      dispatch(clearVolunteer())
    }
  }, [])

  useEffect(() => {
    if (dataVolunteer?.error !== null) {
      dispatch(showLoading(false))
    }
    if (dataVolunteer?.getVolunteersFree !== null) {
      dispatch(showLoading(false))
    }
  }, [dataVolunteer?.error, dataVolunteer?.getVolunteersFree, dispatch])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, width: '100%' }}>
      {
        loading &&
        <Loading position={'absolute'} height={'100%'} zIndex={9999} />
      }
      <HomeTemplate
        nameVolunteer={nameVolunteer}
        volunteersFree={dataVolunteer?.getVolunteersFree?.listadoVoluntariasLibres ?? null}
      />
      <Footer />
    </div>
  )
}