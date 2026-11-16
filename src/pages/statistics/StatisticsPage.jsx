import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showLoading } from "../../redux/actions/loadingActions";
import { clearMother, getStatisticsAgeMother, getStatisticsLocalities } from "../../redux/actions/motherActions";
import { clearSupply, getStatisticsSupplies } from "../../redux/actions/supplyActions";
import { clearAssignment, getStatisticsAssignmentMonth } from "../../redux/actions/assignmentActions";
import { clearBaby, getBabys, getBabyWeightEvolution, getBabyPermanencia } from "../../redux/actions/babyActions";
import { clearReporte, getVisitasEstadisticas } from "../../redux/actions/reporteActions";
import { ordenarPorNombre } from "../../utils/textSearch";
import { clearEstadisticaAvanzada, getEstadisticaAvanzada } from "../../redux/actions/estadisticaAvanzadaActions";

const ultimosDias = (dias) => ({
    fechaDesde: dayjs().subtract(dias - 1, 'day').format('YYYY-MM-DD'),
    fechaHasta: dayjs().format('YYYY-MM-DD'),
});

/** Opciones del menú que consumen `api/Estadisticas`, con los filtros con que abren. */
const ESTADISTICAS_AVANZADAS = {
    13: { tipo: 'impacto', paramsIniciales: () => ({}) },
    14: { tipo: 'primer-abrazo', paramsIniciales: () => ({}) },
    15: { tipo: 'equidad-bebes', paramsIniciales: () => ({}) },
    16: { tipo: 'bebes-sin-visitas', paramsIniciales: () => ({ dias: 7 }) },
    17: { tipo: 'proyeccion-insumos', paramsIniciales: () => ({ dias: 30 }) },
    18: { tipo: 'tasa-completados', paramsIniciales: () => ultimosDias(90) },
    19: { tipo: 'cumplimiento-horario', paramsIniciales: () => ultimosDias(30) },
};
import { clearDashboard, getBebesPorEstado, getBebesPorSala, getBebesRangoEdades, getDuracionAbrazos, getRankingVoluntarias } from "../../redux/actions/dashboardActions";
import dayjs from "dayjs";
import DialogSuccess from "../../components/atoms/dialogSuccess/DialogSuccess";
import StatisticsTemplate from "../../components/templates/statistics/StatisticsTemplate";
import { PageWrapper } from "../../components/common/PageWrapper";
import { getIdVolunteer } from '../../utils/localStorage';
import { isCoordinadoraSession } from '../../utils/coordinadoraRole';

export const StatisticsPage = () => {
    const dispatch = useDispatch();
    const loading = useSelector(state => state.motherReducer?.loading)
    const dataMother = useSelector(state => state.motherReducer)
    const dataSupply = useSelector(state => state.supplyReducer)
    const dataAssignment = useSelector(state => state.assignmentReducer)
    const dataBaby = useSelector(state => state.babyReducer)
    const dataDashboard = useSelector(state => state.dashboardReducer)
    const visitasEstadisticas = useSelector(state => state.reporteReducer?.visitasEstadisticas)
    const estadisticaAvanzada = useSelector(state => state.estadisticaAvanzadaReducer)
    const bebesParaFiltro = React.useMemo(() => {
        const lista = dataBaby?.getBabys?.data;
        return Array.isArray(lista)
            ? ordenarPorNombre(lista, (b) => [b.nombre, b.apellido].filter(Boolean).join(' '))
            : [];
    }, [dataBaby?.getBabys])
    let idVolunteer = getIdVolunteer();
    const isCoordinadora = isCoordinadoraSession();
    const [stateChart, setStateChart] = React.useState('')
    const [valueChart, setValueChart] = React.useState('')

    const consultarAvanzada = (params) => {
        const avanzada = ESTADISTICAS_AVANZADAS[valueChart];
        if (avanzada) dispatch(getEstadisticaAvanzada(avanzada.tipo, params));
    };

    const generateChart = (number) => {
        setValueChart(number);
        const avanzada = ESTADISTICAS_AVANZADAS[number];
        if (avanzada) {
            dispatch(clearEstadisticaAvanzada());
            dispatch(getEstadisticaAvanzada(avanzada.tipo, avanzada.paramsIniciales()));
            setStateChart('OPEN');
            return;
        }
        if (number === 12) {
            // Esta estadística tiene filtros propios: se abre vacía y se genera desde el diálogo.
            dispatch(clearReporte());
            dispatch(getBabys());
            setStateChart('OPEN');
            return;
        }
        dispatch(showLoading(true));
        switch (number) {
            case 1:
                dispatch(getStatisticsAgeMother());
                break;
            case 2:
                dispatch(getStatisticsLocalities());
                break;
            case 3:
                dispatch(getStatisticsSupplies());
                break;
            case 4:
                dispatch(getStatisticsAssignmentMonth());
                break;
            case 5:
                dispatch(getDuracionAbrazos());
                break;
            case 6:
                dispatch(getBabyWeightEvolution());
                break;
            case 7:
                dispatch(getBabyPermanencia());
                break;
            case 8:
                dispatch(getBebesPorSala());
                break;
            case 9:
                dispatch(getBebesPorEstado());
                break;
            case 10:
                dispatch(getBebesRangoEdades());
                break;
            case 11:
                // El ranking exige fechas; el backend ya usa 365 días por
                // defecto, así que se pide el mismo rango explícito.
                dispatch(getRankingVoluntarias({
                    fechaDesde: dayjs().subtract(364, 'day').format('YYYY-MM-DD'),
                    fechaHasta: dayjs().format('YYYY-MM-DD'),
                    top: 10,
                }));
                break;
        }
    }

    useEffect(() => {
        dispatch(clearMother())
        dispatch(clearSupply())
        dispatch(clearAssignment())
        dispatch(clearBaby())
        dispatch(clearDashboard())
        return () => {
            dispatch(clearMother())
            dispatch(clearSupply())
            dispatch(clearAssignment())
            dispatch(clearBaby())
            dispatch(clearDashboard())
        }
    }, [])

    useEffect(() => {
        if ((dataMother?.getStatisticsLocalities !== null || dataMother?.getStatisticsAgeMother !== null
            || dataSupply.getStatisticsSupplies !== null || dataAssignment?.getStatisticsAssignmentMonth !== null
            || dataBaby?.getBabyWeightEvolution !== null || dataDashboard?.duracionAbrazos !== null
            || dataBaby?.getBabyPermanencia !== null || dataDashboard?.bebesPorSala !== null
            || dataDashboard?.bebesPorEstado !== null || dataDashboard?.bebesRangoEdades !== null
            || dataDashboard?.rankingVoluntarias !== null) && valueChart !== 0) {
            setStateChart('OPEN')
            dispatch(showLoading(false))
        }
    }, [dataMother?.getStatisticsLocalities, dataMother?.getStatisticsAgeMother, dataSupply?.getStatisticsSupplies, dataAssignment?.getStatisticsAssignmentMonth, dataBaby?.getBabyWeightEvolution, dataDashboard?.duracionAbrazos, dataBaby?.getBabyPermanencia, dataDashboard?.bebesPorSala, dataDashboard?.bebesPorEstado, dataDashboard?.bebesRangoEdades, dataDashboard?.rankingVoluntarias])

    // `showLoading(true)` prende el flag en todos los reducers, pero la saga que
    // falla solo apaga el suyo: sin esto el spinner queda trabado a pantalla
    // completa y el toast de error atrás. La saga ya avisó, acá solo se corta.
    useEffect(() => {
        if (dataMother?.error != null || dataSupply?.error != null
            || dataAssignment?.error != null || dataBaby?.error != null || dataDashboard?.error != null) {
            dispatch(showLoading(false))
        }
    }, [dataMother?.error, dataSupply?.error, dataAssignment?.error, dataBaby?.error, dataDashboard?.error])


    return (
        <PageWrapper loading={loading}>
            <StatisticsTemplate
                stateChart={stateChart}
                setStateChart={setStateChart}
                valueChart={valueChart}
                generateChart={generateChart}
                statisticsMonthMother={dataMother?.getStatisticsAgeMother?.data}
                statisticsLocalities={dataMother?.getStatisticsLocalities?.data}
                statisticsSupplies={dataSupply?.getStatisticsSupplies?.data}
                statisticsAssignment={dataAssignment?.getStatisticsAssignmentMonth?.data}
                statisticsDuracion={dataDashboard?.duracionAbrazos}
                statisticsWeightEvolution={dataBaby?.getBabyWeightEvolution?.data}
                statisticsPermanencia={dataBaby?.getBabyPermanencia?.data}
                statisticsPorSala={dataDashboard?.bebesPorSala?.data}
                statisticsPorEstado={dataDashboard?.bebesPorEstado?.data}
                statisticsRangoEdades={dataDashboard?.bebesRangoEdades?.data}
                statisticsRanking={dataDashboard?.rankingVoluntarias?.data}
                bebesParaFiltro={bebesParaFiltro}
                visitasEstadisticas={visitasEstadisticas}
                onConsultarVisitas={(params) => dispatch(getVisitasEstadisticas(params))}
                estadisticaAvanzada={ESTADISTICAS_AVANZADAS[valueChart] ? {
                    datos: estadisticaAvanzada?.porTipo?.[ESTADISTICAS_AVANZADAS[valueChart].tipo] ?? null,
                    cargando: estadisticaAvanzada?.cargando === ESTADISTICAS_AVANZADAS[valueChart].tipo,
                    onConsultar: consultarAvanzada,
                } : null}
                isCoordinadora={isCoordinadora}
            />
        </PageWrapper>
    )
}