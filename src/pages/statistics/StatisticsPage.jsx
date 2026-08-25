import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showLoading } from "../../redux/actions/loadingActions";
import { clearMother, getStatisticsAgeMother, getStatisticsLocalities } from "../../redux/actions/motherActions";
import { clearSupply, getStatisticsSupplies } from "../../redux/actions/supplyActions";
import { clearAssignment, getStatisticsAssignmentMonth, getDurationHug } from "../../redux/actions/assignmentActions";
import { clearBaby, getBabyWeightEvolution, getBabyPermanencia } from "../../redux/actions/babyActions";
import { clearDashboard, getBebesPorEstado, getBebesPorSala, getBebesRangoEdades, getRankingVoluntarias } from "../../redux/actions/dashboardActions";
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
    let idVolunteer = getIdVolunteer();
    const isCoordinadora = isCoordinadoraSession();
    const [stateChart, setStateChart] = React.useState('')
    const [valueChart, setValueChart] = React.useState('')

    const generateChart = (number) => {
        setValueChart(number);
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
                dispatch(getDurationHug());
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
            || dataAssignment?.getDurationHug !== null || dataBaby?.getBabyWeightEvolution !== null
            || dataBaby?.getBabyPermanencia !== null || dataDashboard?.bebesPorSala !== null
            || dataDashboard?.bebesPorEstado !== null || dataDashboard?.bebesRangoEdades !== null
            || dataDashboard?.rankingVoluntarias !== null) && valueChart !== 0) {
            setStateChart('OPEN')
            dispatch(showLoading(false))
        }
    }, [dataMother?.getStatisticsLocalities, dataMother?.getStatisticsAgeMother, dataSupply?.getStatisticsSupplies, dataAssignment?.getStatisticsAssignmentMonth, dataAssignment?.getDurationHug, dataBaby?.getBabyWeightEvolution, dataBaby?.getBabyPermanencia, dataDashboard?.bebesPorSala, dataDashboard?.bebesPorEstado, dataDashboard?.bebesRangoEdades, dataDashboard?.rankingVoluntarias])

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
                statisticsDurationHug={dataAssignment?.getDurationHug}
                statisticsWeightEvolution={dataBaby?.getBabyWeightEvolution?.data}
                statisticsPermanencia={dataBaby?.getBabyPermanencia?.data}
                statisticsPorSala={dataDashboard?.bebesPorSala?.data}
                statisticsPorEstado={dataDashboard?.bebesPorEstado?.data}
                statisticsRangoEdades={dataDashboard?.bebesRangoEdades?.data}
                statisticsRanking={dataDashboard?.rankingVoluntarias?.data}
                isCoordinadora={isCoordinadora}
            />
        </PageWrapper>
    )
}