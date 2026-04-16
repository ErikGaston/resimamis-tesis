import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearMother, getMother, postMother } from "../../redux/actions/motherActions";
import { clearBaby, postBaby } from "../../redux/actions/babyActions";
import { showLoading } from "../../redux/actions/loadingActions";
import Loading from "../../components/atoms/loading/Loading";
import MotherTemplate from "../../components/templates/mother/MotherTemplate";
import Footer from "../../components/molecules/Footer";
import { getLocalities } from "../../redux/actions/genericsActions";
import DialogSuccess from "../../components/atoms/dialogSuccess/DialogSuccess";
import { useNavigate } from "react-router-dom";
import {
    validateMotherForm,
    normalizeMotherPayload,
    INITIAL_MOTHER_FIELD_ERRORS,
} from "../../utils/motherFormValidation";

export const MotherPage = () => {
    const dispatch = useDispatch();
    const localities = useSelector(state => state.genericsReducer?.getLocalities)
    const dataMother = useSelector(state => state.motherReducer)
    const dataBaby = useSelector(state => state.babyReducer)
    const loading = useSelector(state => state.motherReducer?.loading)
    const [model, setModel] = useState({});
    const [error, setError] = useState(null);
    const [stateForm, setStateForm] = useState(null);
    const [type, setType] = useState('');
    const [fieldErrors, setFieldErrors] = useState({ ...INITIAL_MOTHER_FIELD_ERRORS });
    const navigate = useNavigate();

    const submitMother = () => {
        const mothers = dataMother?.getMother?.listadoMadres ?? [];
        const { ok, errors } = validateMotherForm(model, {
            mothers,
            excludeMadreId: null,
        });
        setFieldErrors(errors);
        if (!ok) return;
        dispatch(showLoading(true));
        dispatch(postMother(normalizeMotherPayload(model)));
    }

    const submitConset = () => {
        dispatch(showLoading(true))
        setTimeout(() => {
            setType('El consentimiento')
            setModel(null)
            dispatch(showLoading(false))
            setStateForm('SUCCESS')
            setTimeout(() => {
                setStateForm(null);
            }, [2500])
        }, [2500])
    }

    const submitBaby = () => {
        dispatch(showLoading(true))
        delete model.nombre_localidad;
        dispatch(postBaby(model))
    }

    useEffect(() => {
        dispatch(getLocalities())
        dispatch(getMother())

        dispatch(clearMother())
        dispatch(clearBaby())
        return () => {
            dispatch(clearMother())
            dispatch(clearBaby())
        }
    }, [])

    useEffect(() => {
        if (dataMother?.error !== null) {
            // dispatch(showLoading(false))
            // setError(dataMother?.error)
        }
        if (dataMother?.postMother !== null) {
            setType('La madre')
            setModel({})
            setFieldErrors({ ...INITIAL_MOTHER_FIELD_ERRORS });
            dispatch(showLoading(false))
            setStateForm('SUCCESS')
            setTimeout(() => {
                navigate('/madres')
                setStateForm(null);
            }, [2500])
        }
    }, [dataMother?.error, dataMother?.postMother])


    useEffect(() => {
        if (dataBaby?.error !== null) {
            setStateForm('ERROR')
            dispatch(showLoading(false))
            setError(dataBaby?.error)
        }
        if (dataBaby?.postBaby !== null) {
            setType('El bebe')
            setModel(null)
            dispatch(showLoading(false))
            setStateForm('SUCCESS')
            setTimeout(() => {
                setStateForm(null);
            }, [2500])
        }
    }, [dataBaby?.error, dataBaby?.postBaby])

    return (
        <>
            {loading &&
                <Loading position={'absolute'} height={'100%'} zIndex={9999} />
            }
            <MotherTemplate
                model={model}
                setModel={setModel}

                error={error}
                setError={setError}

                localities={localities?.localidades ?? null}
                mothers={dataMother?.getMother?.listadoMadres ?? null}

                submitMother={submitMother}
                submitConset={submitConset}
                submitBaby={submitBaby}
                typeForm={"ALTA"}
                fieldErrors={fieldErrors}
                setFieldErrors={setFieldErrors}
            />
            {
                stateForm === 'SUCCESS' &&
                <DialogSuccess
                    open={stateForm === 'SUCCESS'}
                    setOpen={setStateForm}
                    message={'¡' + type + ' se ha registrado con éxito'}
                />
            }
            {
                stateForm === 'ERROR' &&
                <DialogSuccess
                    open={stateForm === 'ERROR'}
                    setOpen={setStateForm}
                    message={error}
                />
            }
            <Footer />
        </>
    )
}