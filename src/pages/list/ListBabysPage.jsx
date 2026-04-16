import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Loading from '../../components/atoms/loading/Loading'
import Footer from '../../components/molecules/Footer'
import ListBabysTemplate from '../../components/templates/list/ListBabysTemplate'
import { getBabys } from '../../redux/actions/babyActions'
import { showLoading } from '../../redux/actions/loadingActions'

export const ListBabysPage = () => {

  const dispatch = useDispatch();
  const loadingBaby = useSelector(state => state.babyReducer?.loading)
  const dataBabys = useSelector(state => state.babyReducer)

  useEffect(() => {
    dispatch(showLoading(true))
    dispatch(getBabys())
  }, [dispatch])

  useEffect(() => {
    if (dataBabys?.error != null) {
      dispatch(showLoading(false))
    }
    if (dataBabys?.getBabys != null) {
      dispatch(showLoading(false))
    }
  }, [dataBabys?.error, dataBabys?.getBabys, dispatch])

  const showOverlay = loadingBaby

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, width: '100%' }}>
      {showOverlay &&
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
