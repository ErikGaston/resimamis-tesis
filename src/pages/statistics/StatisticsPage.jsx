import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showLoading } from "../../redux/actions/loadingActions";
import { clearMother, getStatisticsAgeMother, getStatisticsLocalities } from "../../redux/actions/motherActions";
import { clearSupply, getStatisticsSupplies } from "../../redux/actions/supplyActions";
import { clearAssignment, getStatisticsAssignmentMonth } from "../../redux/actions/assignmentActions";
import Loading from "../../components/atoms/loading/Loading";
import Footer from "../../components/molecules/Footer";
import DialogSuccess from "../../components/atoms/dialogSuccess/DialogSuccess";
import StatisticsTemplate from "../../components/templates/statistics/StatisticsTemplate";
import { getIdVolunteer } from '../../utils/localStorage';

export const StatisticsPage = () => {
    const dispatch = useDispatch();
    const loading = useSelector(state => state.motherReducer?.loading)
    const dataMother = useSelector(state => state.motherReducer)
    const dataSupply = useSelector(state => state.supplyReducer)
    const dataAssignment = useSelector(state => state.assignmentReducer)
    let idVolunteer = getIdVolunteer();
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
        }
    }

    useEffect(() => {
        dispatch(clearMother())
        dispatch(clearSupply())
        dispatch(clearAssignment())
        return () => {
            dispatch(clearMother())
            dispatch(clearSupply())
            dispatch(clearAssignment())
        }
    }, [])

    useEffect(() => {
        if ((dataMother?.getStatisticsLocalities !== null || dataMother?.getStatisticsAgeMother !== null
            || dataSupply.getStatisticsSupplies !== null || dataAssignment?.getStatisticsAssignmentMonth !== null) && valueChart !== 0) {
            setStateChart('OPEN')
            dispatch(showLoading(false))
        }
    }, [dataMother?.getStatisticsLocalities, dataMother?.getStatisticsAgeMother, dataSupply?.getStatisticsSupplies, dataAssignment?.getStatisticsAssignmentMonth])


    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {loading &&
                <Loading position={'absolute'} height={'100%'} zIndex={9999} />
            }
            <StatisticsTemplate
                stateChart={stateChart}
                setStateChart={setStateChart}

                valueChart={valueChart}
                generateChart={generateChart}
                statisticsMonthMother={dataMother?.getStatisticsAgeMother?.resultado}
                statisticsLocalities={dataMother?.getStatisticsLocalities?.resultado}
                statisticsSupplies={dataSupply?.getStatisticsSupplies?.listadoInsumo}
                statisticsAssignment={dataAssignment?.getStatisticsAssignmentMonth?.listadoAsignaciones}
            />
            {/* {
                stateForm === 'ASSISTENCE' &&
                <DialogSuccess
                    open={stateForm === 'ASSISTENCE'}
                    setOpen={setStateForm}
                    message={'¡La asistencia se ha registrado con éxito!'}
                />
            } */}
            <Footer />
        </div>
    )
}