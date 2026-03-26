import React, { useEffect } from 'react'
import Footer from '../../components/molecules/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { clearVolunteer, getVolunteers } from '../../redux/actions/volunteerActions'
import Loading from '../../components/atoms/loading/Loading'
import { showLoading } from '../../redux/actions/loadingActions'
import ListVolunteerTemplate from '../../components/templates/list/ListVolunteerTemplate'

export const ListVolunteerPage = () => {

    const dispatch = useDispatch();
    const loading = useSelector(state => state.volunteerReducer.loading)
    const dataVolunteer = useSelector(state => state.volunteerReducer)
    const [stateChart, setStateChart] = React.useState('')


    useEffect(() => {
        dispatch(showLoading(true))
        dispatch(getVolunteers())

        dispatch(clearVolunteer())
        return () => {
            dispatch(clearVolunteer())
        }
    }, [])

    useEffect(() => {
        if (dataVolunteer?.error !== null) {
            // dispatch(showLoading(false))
        }
        if (dataVolunteer?.getVolunteers !== null) {
            dispatch(showLoading(false))
        }
    }, [dataVolunteer?.error, dataVolunteer?.getVolunteers])


    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {loading &&
                <Loading position={'absolute'} height={'100%'} zIndex={9999} />
            }
            <ListVolunteerTemplate
                volunteers={dataVolunteer?.getVolunteers?.listadoVoluntaria ?? null}
            />
            <Footer />
        </div>
    )
}

export default ListVolunteerPage