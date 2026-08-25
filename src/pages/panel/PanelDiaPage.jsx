import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button } from '@mui/material';
import Footer from '../../components/molecules/Footer';
import PanelDiaTemplate from '../../components/templates/panel/PanelDiaTemplate';
import { clearDashboard, getCoberturaHoy, getCoordinacionHoy } from '../../redux/actions/dashboardActions';
import { showLoading } from '../../redux/actions/loadingActions';
import { isCoordinadoraSession } from '../../utils/coordinadoraRole';

export const PanelDiaPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isCoord = isCoordinadoraSession();
    const data = useSelector((state) => state.dashboardReducer);

    useEffect(() => {
        if (!isCoord) return;
        dispatch(clearDashboard());
        dispatch(showLoading(true));
        dispatch(getCoordinacionHoy());
        dispatch(getCoberturaHoy());
        return () => {
            dispatch(clearDashboard());
            dispatch(showLoading(false));
        };
    }, [dispatch, isCoord]);

    // Son dos requests independientes: se corta el loading cuando llegan ambas
    // o cuando alguna falla. La saga ya mostró el toast del error.
    useEffect(() => {
        const listo = data?.coordinacionHoy != null && data?.coberturaHoy != null;
        if (listo || data?.error != null) dispatch(showLoading(false));
    }, [data?.coordinacionHoy, data?.coberturaHoy, data?.error, dispatch]);

    if (!isCoord) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Esta sección es solo para coordinadoras.
                </Alert>
                <Button variant="contained" onClick={() => navigate('/overview')} sx={{ textTransform: 'none', minHeight: 44 }}>
                    Volver al inicio
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, width: '100%' }}>
            {/* El reducer guarda el body del envelope ({ data }), así que acá se
                desenvuelve el payload, igual que en Estadísticas. */}
            <PanelDiaTemplate
                coordinacion={data?.coordinacionHoy?.data}
                cobertura={data?.coberturaHoy?.data}
                cargando={data?.coordinacionHoy == null && data?.error == null}
            />
            <Footer />
        </Box>
    );
};

export default PanelDiaPage;
