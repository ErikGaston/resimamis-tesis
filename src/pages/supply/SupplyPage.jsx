import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearSupply, getSupplies, postSupplyConsultMovements, getSupplyProviders, postSupplyRegisterMovement } from "../../redux/actions/supplyActions";
import { showLoading } from "../../redux/actions/loadingActions";
import Loading from "../../components/atoms/loading/Loading";
import Footer from "../../components/molecules/Footer";
import SupplyTemplate from "../../components/templates/supply/SupplyTemplate";
import { getIdVolunteer } from "../../utils/localStorage";
import DialogSuccess from "../../components/atoms/dialogSuccess/DialogSuccess";

export const SupplyPage = () => {
    const dispatch = useDispatch();
    const dataSupply = useSelector(state => state.supplyReducer)
    const loading = useSelector(state => state.supplyReducer?.loading)
    const [valueTask, setValueTask] = useState(1);
    const [stateForm, setStateForm] = useState(null);

    const changeTask = (number) => e => {
        setValueTask(number)
    }

    useEffect(() => {
        dispatch(clearSupply());
        return () => {
            dispatch(clearSupply());
        }
    }, [])

    useEffect(() => {
        if (valueTask === 1) {
            dispatch(showLoading(true))
            dispatch(getSupplies())

        }
        else {
            dispatch(showLoading(true))
            dispatch(getSupplies())
            const hasta = new Date()
            const desde = new Date(hasta)
            desde.setDate(desde.getDate() - 30)
            dispatch(postSupplyConsultMovements({
                fechaDesde: desde.toISOString(),
                fechaHasta: hasta.toISOString(),
            }))
            dispatch(getSupplyProviders())
        }
    }, [valueTask, dispatch])

    useEffect(() => {
        if (dataSupply?.getSupplies !== null) {
            dispatch(showLoading(false))
        }
    }, [dataSupply?.getSupplies, dispatch])

    useEffect(() => {
        if (valueTask !== 2) return
        if (dataSupply?.postSupplyConsultMovements != null || dataSupply?.error != null) {
            dispatch(showLoading(false))
        }
    }, [valueTask, dataSupply?.postSupplyConsultMovements, dataSupply?.error, dispatch])

    useEffect(() => {
        if (dataSupply?.postSupplyRegisterMovement == null) return
        dispatch(showLoading(false))
        setStateForm('MOVIMIENTO_OK')
        const hasta = new Date()
        const desde = new Date(hasta)
        desde.setDate(desde.getDate() - 30)
        dispatch(postSupplyConsultMovements({
            fechaDesde: desde.toISOString(),
            fechaHasta: hasta.toISOString(),
        }))
        dispatch(getSupplies())
        setTimeout(() => setStateForm(null), 2200)
    }, [dataSupply?.postSupplyRegisterMovement, dispatch])

    const registerMovement = (body) => {
        dispatch(showLoading(true))
        dispatch(postSupplyRegisterMovement(body))
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, width: '100%' }}>
            {loading &&
                <Loading position={'absolute'} height={'100%'} zIndex={9999} />
            }
            <SupplyTemplate
                valueTask={valueTask}
                changeTask={changeTask}
                supplies={dataSupply?.getSupplies?.resultado ?? null}
                movementsData={dataSupply?.postSupplyConsultMovements}
                providersData={dataSupply?.getSupplyProviders}
                onRegisterSupplyMovement={registerMovement}
                idVoluntariaDefault={getIdVolunteer()}
            />
            {stateForm === 'MOVIMIENTO_OK' && (
                <DialogSuccess
                    open={stateForm === 'MOVIMIENTO_OK'}
                    setOpen={setStateForm}
                    message="Movimiento registrado."
                />
            )}
            <Footer />
        </div>
    )
}