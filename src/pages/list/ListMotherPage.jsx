import React, { useEffect } from 'react'
import Footer from '../../components/molecules/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { clearMother, getMother } from '../../redux/actions/motherActions'
import Loading from '../../components/atoms/loading/Loading'
import { showLoading } from '../../redux/actions/loadingActions'
import ListMotherTemplate from '../../components/templates/list/ListMotherTemplate'

export const ListMotherPage = () => {

    const dispatch = useDispatch();
    const loading = useSelector(state => state.motherReducer.loading)
    const dataMothers = useSelector(state => state.motherReducer)


    useEffect(() => {
        dispatch(showLoading(true))
        dispatch(getMother())

        dispatch(clearMother())
        return () => {
            dispatch(clearMother())
        }
    }, [])

    useEffect(() => {
        if (dataMothers?.error !== null) {
            // dispatch(showLoading(false))
        }
        if (dataMothers?.getMother !== null) {
            dispatch(showLoading(false))
        }
    }, [dataMothers?.error, dataMothers?.getMother])


    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {loading &&
                <Loading position={'absolute'} height={'100%'} zIndex={9999} />
            }
            <ListMotherTemplate
                mothers={dataMothers?.getMother?.listadoMadres ?? null}
            />
            <Footer />
        </div>
    )
}

export default ListMotherPage