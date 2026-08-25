import React, { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearSupply, getSupplies, postSupplyConsultMovements, getSupplyProviders, postSupplyRegisterMovement, postSupplyCreate, putSupplyById, postSupplyDelete, clearSupplyWrites } from "../../redux/actions/supplyActions";
import { getBabys } from "../../redux/actions/babyActions";
import { showLoading } from "../../redux/actions/loadingActions";
import { hideToast, showToast } from "../../redux/actions/toastActions";
import Loading from "../../components/atoms/loading/Loading";
import Footer from "../../components/molecules/Footer";
import SupplyTemplate from "../../components/templates/supply/SupplyTemplate";
import { getIdVolunteer } from "../../utils/localStorage";
import { isCoordinadoraSession } from "../../utils/coordinadoraRole";

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
    const dataBaby = useSelector(state => state.babyReducer)
    const loading = useSelector(state => state.supplyReducer?.loading)
    const isCoord = isCoordinadoraSession();
    const [valueTask, setValueTask] = useState(1);
    const [createSupplyCloseSignal, setCreateSupplyCloseSignal] = useState(0);
    const [movementCloseSignal, setMovementCloseSignal] = useState(0);
    const [editCloseSignal, setEditCloseSignal] = useState(0);
    const [deleteCloseSignal, setDeleteCloseSignal] = useState(0);

    const changeTask = (number) => e => {
        setValueTask(number)
    }

    useLayoutEffect(() => {
        dispatch(clearSupply());
        dispatch(hideToast());
        dispatch(getBabys());
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
        setMovementCloseSignal((s) => s + 1)
        dispatch(postSupplyConsultMovements(buildConsultaMovimientosPayload()))
        dispatch(getSupplies())
        dispatch(showToast({ message: 'Movimiento registrado.', severity: 'success' }))
    }, [dataSupply?.postSupplyRegisterMovement, dispatch])

    useEffect(() => {
        if (dataSupply?.postSupplyCreate == null) return
        dispatch(showLoading(false))
        setCreateSupplyCloseSignal((s) => s + 1)
        dispatch(getSupplies())
        dispatch(showToast({ message: 'Insumo registrado.', severity: 'success' }))
    }, [dataSupply?.postSupplyCreate, dispatch])

    useEffect(() => {
        if (dataSupply?.putSupplyById == null) return
        dispatch(showLoading(false))
        setEditCloseSignal((s) => s + 1)
        dispatch(getSupplies())
        dispatch(clearSupplyWrites())
        dispatch(showToast({ message: 'Insumo actualizado.', severity: 'success' }))
    }, [dataSupply?.putSupplyById, dispatch])

    useEffect(() => {
        if (dataSupply?.postSupplyDelete == null) return
        dispatch(showLoading(false))
        setDeleteCloseSignal((s) => s + 1)
        dispatch(getSupplies())
        dispatch(clearSupplyWrites())
        dispatch(showToast({ message: 'Insumo eliminado.', severity: 'success' }))
    }, [dataSupply?.postSupplyDelete, dispatch])

    const registerMovement = (body) => {
        dispatch(showLoading(true))
        dispatch(postSupplyRegisterMovement(body))
    }

    const registerCreateSupply = (body) => {
        dispatch(showLoading(true))
        dispatch(postSupplyCreate(body))
    }

    const editSupply = (id, body) => {
        dispatch(showLoading(true))
        dispatch(putSupplyById(id, body))
    }

    const deleteSupply = (id) => {
        dispatch(showLoading(true))
        dispatch(postSupplyDelete(id))
    }

    const suppliesLoaded = dataSupply?.getSupplies != null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, width: '100%' }}>
            {loading && suppliesLoaded &&
                <Loading />
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
                babies={dataBaby?.getBabys?.data ?? null}
                isCoord={isCoord}
                onEditSupply={editSupply}
                onDeleteSupply={deleteSupply}
                editCloseSignal={editCloseSignal}
                deleteCloseSignal={deleteCloseSignal}
            />
            <Footer />
        </div>
    )
}