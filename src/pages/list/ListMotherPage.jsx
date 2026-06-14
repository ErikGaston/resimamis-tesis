import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
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
  const [confirmDialog, setConfirmDialog] = useState({ open: false, message: '', onConfirm: null });
  const openConfirm = (message, onConfirm) => setConfirmDialog({ open: true, message, onConfirm });
  const handleConfirm = () => { confirmDialog.onConfirm?.(); setConfirmDialog({ open: false, message: '', onConfirm: null }); };
  const handleCancelConfirm = () => setConfirmDialog({ open: false, message: '', onConfirm: null });

  const handleDeleteMother = (idMadre) => {
    openConfirm(`¿Dar de baja la madre #${idMadre}? Esta acción es irreversible.`, () => {
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
        mothers={dataMothers?.getMother?.data ?? null}
        isCoordinator={isCoordinator}
        onDeleteMother={isCoordinator ? handleDeleteMother : undefined}
      />
      <Footer />
      <Dialog open={confirmDialog.open} onClose={handleCancelConfirm} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, color: '#152C70' }}>Confirmar baja</DialogTitle>
        <DialogContent><Typography>{confirmDialog.message}</Typography></DialogContent>
        <DialogActions>
          <Button onClick={handleCancelConfirm}>Cancelar</Button>
          <Button onClick={handleConfirm} color="error" variant="contained">Dar de baja</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ListMotherPage;
