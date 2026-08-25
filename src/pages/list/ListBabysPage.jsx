import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Footer from '../../components/molecules/Footer';
import ConfirmDialog from "../../components/common/ConfirmDialog";
import ListBabysTemplate from '../../components/templates/list/ListBabysTemplate';
import { clearBaby, getBabyByDni, getBabys, postBabyDelete, clearBabyWrites } from '../../redux/actions/babyActions';
import { showLoading } from '../../redux/actions/loadingActions';
import { isCoordinadoraSession } from '../../utils/coordinadoraRole';

export const ListBabysPage = () => {
  const dispatch = useDispatch();
  const dataBabys = useSelector((state) => state.babyReducer);
  const isCoordinator = isCoordinadoraSession();
  const [confirmDialog, setConfirmDialog] = useState({ open: false, message: '', onConfirm: null });
  const openConfirm = (message, onConfirm) => setConfirmDialog({ open: true, message, onConfirm });
  const handleConfirm = () => { confirmDialog.onConfirm?.(); setConfirmDialog({ open: false, message: '', onConfirm: null }); };
  const handleCancelConfirm = () => setConfirmDialog({ open: false, message: '', onConfirm: null });

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

  const handleConsultDni = (digits) => {
    if (!digits) return;
    dispatch(showLoading(true));
    dispatch(getBabyByDni(digits));
  };

  const handleDeleteBaby = (idBebe, nombre) => {
    openConfirm(`¿Dar de baja al bebé ${nombre}? Dejará de aparecer en los listados.`, () => {
      dispatch(showLoading(true));
      dispatch(postBabyDelete(idBebe));
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, width: '100%' }}>
      <ListBabysTemplate
        babys={dataBabys?.getBabys?.data ?? null}
        isCoordinator={isCoordinator}
        onDeleteBaby={isCoordinator ? handleDeleteBaby : undefined}
        onConsultarDniApi={isCoordinator ? handleConsultDni : undefined}
        babyByDniPayload={dataBabys?.getBabyByDni ?? null}
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

export default ListBabysPage;
