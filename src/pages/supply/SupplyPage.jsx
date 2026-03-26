import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearSupply, getSupplies } from "../../redux/actions/supplyActions";
import { showLoading } from "../../redux/actions/loadingActions";
import Loading from "../../components/atoms/loading/Loading";
import Footer from "../../components/molecules/Footer";
import SupplyTemplate from "../../components/templates/supply/SupplyTemplate";

export const SupplyPage = () => {
    const dispatch = useDispatch();
    const dataSupply = useSelector(state => state.supplyReducer)
    const loading = useSelector(state => state.motherReducer?.loading)
    const [valueTask, setValueTask] = useState(1);

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
            //valueTask === 2
            dispatch(showLoading(true))
        }
    }, [valueTask])

    useEffect(() => {
        if (dataSupply?.getSupplies !== null) {
            dispatch(showLoading(false))
        }
    }, [dataSupply?.getSupplies])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {loading &&
                <Loading position={'absolute'} height={'100%'} zIndex={9999} />
            }
            <SupplyTemplate
                valueTask={valueTask}
                changeTask={changeTask}
                supplies={dataSupply?.getSupplies?.resultado ?? null}

            />
            <Footer />
        </div>
    )
}