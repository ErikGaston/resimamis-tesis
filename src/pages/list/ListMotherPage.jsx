import React, { useEffect, useState } from 'react';
import Footer from '../../components/molecules/Footer';
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useDispatch, useSelector } from 'react-redux';
import { clearMother, clearMotherWrites, getMother, postMotherDelete } from '../../redux/actions/motherActions';
import { showLoading } from '../../redux/actions/loadingActions';
import ListMotherTemplate from '../../components/templates/list/ListMotherTemplate';
import { isCoordinadoraSession } from '../../utils/coordinadoraRole';

export const ListMotherPage = () => {
  const dispatch = useDispatch();
  const dataMothers = useSelector((state) => state.motherReducer);
  const isCoordinator = isCoordinadoraSession();
  const [confirmDialog, setConfirmDialog] = useState({ open: false, message: '', onConfirm: null });
  const openConfirm = (message, onConfirm) => setConfirmDialog({ open: true, message, onConfirm });
  const handleConfirm = () => { confirmDialog.onConfirm?.(); setConfirmDialog({ open: false, message: '', onConfirm: null }); };
  const handleCancelConfirm = () => setConfirmDialog({ open: false, message: '', onConfirm: null });

  const handleDeleteMother = (idMadre, nombre) => {
    openConfirm(`¿Dar de baja a ${nombre}? Dejará de aparecer en los listados.`, () => {
      dispatch(showLoading(true));
      dispatch(postMotherDelete(idMadre));
    });
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
    if (dataMothers?.error != null) {
      dispatch(showLoading(false));
    }
    if (dataMothers?.getMother != null) {
      dispatch(showLoading(false));
    }
    if (dataMothers?.postMotherDelete != null) {
      dispatch(showLoading(false));
      dispatch(getMother());
      dispatch(clearMotherWrites());
    }
  }, [dataMothers?.error, dataMothers?.getMother, dataMothers?.postMotherDelete, dispatch]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, width: '100%' }}>
      <ListMotherTemplate
        mothers={dataMothers?.getMother?.data ?? null}
        isCoordinator={isCoordinator}
        onDeleteMother={isCoordinator ? handleDeleteMother : undefined}
      />
      <Footer />
      <ConfirmDialog
        open={confirmDialog.open}
        message={confirmDialog.message}
        onConfirm={handleConfirm}
        onCancel={handleCancelConfirm}
      />
    </div>
  );
};

export default ListMotherPage;
