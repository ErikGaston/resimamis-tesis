import React, { useEffect } from 'react';
import Footer from '../../components/molecules/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { clearMother, clearMotherWrites, getMother, postMotherDelete } from '../../redux/actions/motherActions';
import Loading from '../../components/atoms/loading/Loading';
import { showLoading } from '../../redux/actions/loadingActions';
import ListMotherTemplate from '../../components/templates/list/ListMotherTemplate';
import { isCoordinadoraSession } from '../../utils/coordinadoraRole';

export const ListMotherPage = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.motherReducer.loading);
  const dataMothers = useSelector((state) => state.motherReducer);
  const isCoordinator = isCoordinadoraSession();

  const handleDeleteMother = (idMadre) => {
    if (!window.confirm(`¿Dar de baja la madre ${idMadre}? Esta acción suele ser irreversible.`)) return;
    dispatch(showLoading(true));
    dispatch(postMotherDelete(idMadre));
  };

  useEffect(() => {
    dispatch(clearMother());
    dispatch(showLoading(true));
    dispatch(getMother());
    return () => {
      dispatch(clearMother());
    };
  }, [dispatch]);

  useEffect(() => {
    if (dataMothers?.getMother != null) {
      dispatch(showLoading(false));
    }
    if (dataMothers?.postMotherDelete != null) {
      dispatch(showLoading(false));
      dispatch(getMother());
      dispatch(clearMotherWrites());
    }
  }, [dataMothers?.getMother, dataMothers?.postMotherDelete, dispatch]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, width: '100%' }}>
      {loading && <Loading position={'absolute'} height={'100%'} zIndex={9999} />}
      <ListMotherTemplate
        mothers={dataMothers?.getMother?.listadoMadres ?? null}
        isCoordinator={isCoordinator}
        onDeleteMother={isCoordinator ? handleDeleteMother : undefined}
      />
      <Footer />
    </div>
  );
};

export default ListMotherPage;
