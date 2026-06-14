import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearSupply, getSupplies, postSupplyConsultMovements, getSupplyProviders, postSupplyRegisterMovement, postSupplyCreate } from "../../redux/actions/supplyActions";
import { showLoading } from "../../redux/actions/loadingActions";
import { hideToast } from "../../redux/actions/toastActions";
import Loading from "../../components/atoms/loading/Loading";
import Footer from "../../components/molecules/Footer";
import SupplyTemplate from "../../components/templates/supply/SupplyTemplate";
import { getIdVolunteer } from "../../utils/localStorage";
import DialogSuccess from "../../components/atoms/dialogSuccess/DialogSuccess";

function rangeUltimos30DiasISO() {
    const hasta = new Date();
    const desde = new Date(hasta);
    desde.setDate(desde.getDate() - 30);
    return { fechaDesde: desde.toISOString(), fechaHasta: hasta.toISOString() };
}

function buildConsultaMovimientosPayload() {
    const base = rangeUltimos30DiasISO();
    let idV;
    try {
        idV = getIdVolunteer();
    } catch {
        idV = null;
    }
    const n = idV != null && idV !== "" ? Number(idV) : Number.NaN;
    if (Number.isInteger(n) && n > 0) {
        return { ...base, idVoluntaria: n };
    }
    return base;
}

function safeIdVolunteer() {
    try {
        return getIdVolunteer();
    } catch {
        return null;
    }
}

export const SupplyPage = () => {
    const dispatch = useDispatch();
    const dataSupply = useSelector(state => state.supplyReducer)
    const loading = useSelector(state => state.supplyReducer?.loading)
    const [valueTask, setValueTask] = useState(1);
    const [stateForm, setStateForm] = useState(null);
    const [createSupplyCloseSignal, setCreateSupplyCloseSignal] = useState(0);
    const [movementCloseSignal, setMovementCloseSignal] = useState(0);

    const changeTask = (number) => e => {
        setValueTask(number)
    }

    useLayoutEffect(() => {
        dispatch(clearSupply());
        dispatch(hideToast());
    }, [dispatch]);

    useEffect(() => {
        return () => {
            dispatch(clearSupply());
        };
    }, [dispatch])

    useEffect(() => {
        if (valueTask === 1) {
            dispatch(showLoading(true))
            dispatch(getSupplies())

        }
        else {
            dispatch(showLoading(true))
            dispatch(getSupplies())
            dispatch(postSupplyConsultMovements(buildConsultaMovimientosPayload()))
            dispatch(getSupplyProviders())
        }
    }, [valueTask, dispatch])

    useEffect(() => {
        if (valueTask !== 1) return;
        if (dataSupply?.getSupplies !== null) {
            dispatch(showLoading(false))
        }
    }, [valueTask, dataSupply?.getSupplies, dispatch])

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
        setMovementCloseSignal((s) => s + 1)
        dispatch(postSupplyConsultMovements(buildConsultaMovimientosPayload()))
        dispatch(getSupplies())
        setTimeout(() => setStateForm(null), 2200)
    }, [dataSupply?.postSupplyRegisterMovement, dispatch])

    useEffect(() => {
        if (dataSupply?.postSupplyCreate == null) return
        dispatch(showLoading(false))
        setStateForm('INSUMO_OK')
        setCreateSupplyCloseSignal((s) => s + 1)
        dispatch(getSupplies())
        setTimeout(() => setStateForm(null), 2200)
    }, [dataSupply?.postSupplyCreate, dispatch])

    const registerMovement = (body) => {
        dispatch(showLoading(true))
        dispatch(postSupplyRegisterMovement(body))
    }

    const registerCreateSupply = (body) => {
        dispatch(showLoading(true))
        dispatch(postSupplyCreate(body))
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, width: '100%' }}>
            {loading &&
                <Loading position={'absolute'} height={'100%'} zIndex={9999} />
            }
            <SupplyTemplate
                valueTask={valueTask}
                changeTask={changeTask}
                supplies={dataSupply?.getSupplies?.data ?? null}
                movementsData={dataSupply?.postSupplyConsultMovements}
                providersData={dataSupply?.getSupplyProviders}
                onRegisterSupplyMovement={registerMovement}
                onCreateSupply={registerCreateSupply}
                createSupplyCloseSignal={createSupplyCloseSignal}
                movementCloseSignal={movementCloseSignal}
                idVoluntariaDefault={safeIdVolunteer()}
            />
            {stateForm === 'MOVIMIENTO_OK' && (
                <DialogSuccess
                    open={stateForm === 'MOVIMIENTO_OK'}
                    setOpen={setStateForm}
                    message="Movimiento registrado."
                />
            )}
            {stateForm === 'INSUMO_OK' && (
                <DialogSuccess
                    open={stateForm === 'INSUMO_OK'}
                    setOpen={setStateForm}
                    message="Insumo registrado."
                />
            )}
            <Footer />
        </div>
    )
}