import React, { useEffect } from 'react';
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

  const handleDeleteVolunteer = (idVoluntaria) => {
    if (!window.confirm(`¿Dar de baja la voluntaria ${idVoluntaria}?`)) return;
    dispatch(showLoading(true));
    dispatch(postVolunteerDelete(idVoluntaria));
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
        volunteers={dataVolunteer?.getVolunteers?.listadoVoluntaria ?? null}
        isCoordinator={isCoordinator}
        onDeleteVolunteer={isCoordinator ? handleDeleteVolunteer : undefined}
      />
      <Footer />
    </div>
  );
};

export default ListVolunteerPage;
