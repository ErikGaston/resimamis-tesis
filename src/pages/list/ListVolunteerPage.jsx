import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import Footer from '../../components/molecules/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { clearVolunteer, clearVolunteerWrites, getVolunteers, postVolunteerDelete } from '../../redux/actions/volunteerActions';
import Loading from '../../components/atoms/loading/Loading';
import { showLoading } from '../../redux/actions/loadingActions';
import ListVolunteerTemplate from '../../components/templates/list/ListVolunteerTemplate';
import { isCoordinadoraSession } from '../../utils/coordinadoraRole';

export const ListVolunteerPage = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.volunteerReducer.loading);
  const dataVolunteer = useSelector((state) => state.volunteerReducer);
  const isCoordinator = isCoordinadoraSession();
  const [confirmDialog, setConfirmDialog] = useState({ open: false, message: '', onConfirm: null });
  const openConfirm = (message, onConfirm) => setConfirmDialog({ open: true, message, onConfirm });
  const handleConfirm = () => { confirmDialog.onConfirm?.(); setConfirmDialog({ open: false, message: '', onConfirm: null }); };
  const handleCancelConfirm = () => setConfirmDialog({ open: false, message: '', onConfirm: null });

  const handleDeleteVolunteer = (idVoluntaria) => {
    openConfirm(`¿Dar de baja la voluntaria #${idVoluntaria}? Esta acción es irreversible.`, () => {
      dispatch(showLoading(true));
      dispatch(postVolunteerDelete(idVoluntaria));
    });
  };

  useEffect(() => {
    dispatch(clearVolunteer());
    dispatch(showLoading(true));
    dispatch(getVolunteers());
    return () => {
      dispatch(clearVolunteer());
    };
  }, [dispatch]);

  useEffect(() => {
    if (dataVolunteer?.getVolunteers != null) {
      dispatch(showLoading(false));
    }
    if (dataVolunteer?.postVolunteerDelete != null) {
      dispatch(showLoading(false));
      dispatch(getVolunteers());
      dispatch(clearVolunteerWrites());
    }
  }, [dataVolunteer?.getVolunteers, dataVolunteer?.postVolunteerDelete, dispatch]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, width: '100%' }}>
      {loading && <Loading position={'absolute'} height={'100%'} zIndex={9999} />}
      <ListVolunteerTemplate
        volunteers={dataVolunteer?.getVolunteers?.data ?? null}
        isCoordinator={isCoordinator}
        onDeleteVolunteer={isCoordinator ? handleDeleteVolunteer : undefined}
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

export default ListVolunteerPage;
