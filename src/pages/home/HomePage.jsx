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
    dispatch(clearVolunteer())
    dispatch(showLoading(true))
    dispatch(getVolunteersFree())
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

  const volunteersFree = dataVolunteer?.getVolunteersFree?.data ?? null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, width: '100%' }}>
      {loading && volunteersFree !== null && (
        <Loading position={'absolute'} height={'100%'} zIndex={9999} />
      )}
      <HomeTemplate
        nameVolunteer={nameVolunteer}
        volunteersFree={volunteersFree}
      />
      <Footer />
    </div>
  )
}