import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Loading from '../../components/atoms/loading/Loading'
import Footer from '../../components/molecules/Footer'
import ListBabysTemplate from '../../components/templates/list/ListBabysTemplate'
import { getBabys } from '../../redux/actions/babyActions'
import { showLoading } from '../../redux/actions/loadingActions'

export const ListBabysPage = () => {

  const dispatch = useDispatch();
  const loading = useSelector(state => state.babyReducer.loading)
  const dataBabys = useSelector(state => state.babyReducer)
  const [stateChart, setStateChart] = React.useState('')


  useEffect(() => {
    //dispatch(showLoading(true))
    dispatch(getBabys())

    /* dispatch(clearVolunteer())
    return () => {
      dispatch(clearVolunteer())
    } */
  }, [])

  useEffect(() => {
    if (dataBabys?.error !== null) {
      //dispatch(showLoading(false))
    }
    if (dataBabys?.getBabys !== null) {
      dispatch(showLoading(false))
    }
  }, [dataBabys?.error, dataBabys?.getBabys])


  console.log(dataBabys?.getBabys?.listadoBebes, 'dataBabys')


  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {loading &&
        <Loading position={'absolute'} height={'100%'} zIndex={9999} />
      }
      <ListBabysTemplate
        babys={dataBabys?.getBabys?.listadoBebes ?? null}
      />
      <Footer />
    </div>
  )
}

export default ListBabysPage