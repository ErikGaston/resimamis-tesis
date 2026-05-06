import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../../components/atoms/loading/Loading';
import Footer from '../../components/molecules/Footer';
import ListBabysTemplate from '../../components/templates/list/ListBabysTemplate';
import { clearBaby, getBabyByDni, getBabys, postBabyDelete, clearBabyWrites } from '../../redux/actions/babyActions';
import { showLoading } from '../../redux/actions/loadingActions';
import { isCoordinadoraSession } from '../../utils/coordinadoraRole';

export const ListBabysPage = () => {
  const dispatch = useDispatch();
  const loadingBaby = useSelector((state) => state.babyReducer?.loading);
  const dataBabys = useSelector((state) => state.babyReducer);
  const isCoordinator = isCoordinadoraSession();
  const [dniApi, setDniApi] = useState('');

  useEffect(() => {
    dispatch(clearBaby());
    dispatch(showLoading(true));
    dispatch(getBabys());
  }, [dispatch]);

  useEffect(() => {
    if (dataBabys?.error != null) {
      dispatch(showLoading(false));
    }
    if (dataBabys?.getBabys != null) {
      dispatch(showLoading(false));
    }
    if (dataBabys?.getBabyByDni != null) {
      dispatch(showLoading(false));
    }
  }, [dataBabys?.error, dataBabys?.getBabys, dataBabys?.getBabyByDni, dispatch]);

  useEffect(() => {
    if (dataBabys?.postBabyDelete != null) {
      dispatch(showLoading(false));
      dispatch(clearBabyWrites());
      dispatch(showLoading(true));
      dispatch(getBabys());
    }
  }, [dataBabys?.postBabyDelete, dispatch]);

  const handleConsultDni = () => {
    const digits = String(dniApi || '').replace(/\D/g, '');
    if (!digits) return;
    dispatch(showLoading(true));
    dispatch(getBabyByDni(digits));
  };

  const handleDeleteBaby = (idBebe) => {
    if (!window.confirm(`¿Dar de baja el bebé ${idBebe}?`)) return;
    dispatch(showLoading(true));
    dispatch(postBabyDelete(idBebe));
  };

  const showOverlay = loadingBaby;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, width: '100%' }}>
      {showOverlay && <Loading position={'absolute'} height={'100%'} zIndex={9999} />}
      <ListBabysTemplate
        babys={dataBabys?.getBabys?.listadoBebes ?? null}
        isCoordinator={isCoordinator}
        onDeleteBaby={isCoordinator ? handleDeleteBaby : undefined}
        dniApiSearch={dniApi}
        onDniApiSearchChange={setDniApi}
        onConsultarDniApi={isCoordinator ? handleConsultDni : undefined}
        babyByDniPayload={dataBabys?.getBabyByDni ?? null}
      />
      <Footer />
    </div>
  );
};

export default ListBabysPage;
