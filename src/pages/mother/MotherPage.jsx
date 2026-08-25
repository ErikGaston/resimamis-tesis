import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearMother, clearMotherApiError, getMother, postMother } from "../../redux/actions/motherActions";
import { clearBaby, getBabySalas } from "../../redux/actions/babyActions";
import { showLoading } from "../../redux/actions/loadingActions";
import { showToast } from "../../redux/actions/toastActions";
import Loading from "../../components/atoms/loading/Loading";
import MotherTemplate from "../../components/templates/mother/MotherTemplate";
import Footer from "../../components/molecules/Footer";
import { getLocalities, getEstadosCiviles } from "../../redux/actions/genericsActions";
import DialogSuccess from "../../components/atoms/dialogSuccess/DialogSuccess";
import { useNavigate } from "react-router-dom";
import {
    validateMotherForm,
    normalizeMotherPayload,
    INITIAL_MOTHER_FIELD_ERRORS,
} from "../../utils/motherFormValidation";
import {
    validateBabyForm,
    isBabyRowEmpty,
    firstBabyErrorMessage,
} from "../../utils/babyFormValidation";
import { normalizeBabyForAlta } from "../../utils/babyPayload";
import {
    readMotherAltaDraft,
    saveMotherAltaDraft,
    clearMotherAltaDraft,
} from "../../utils/motherAltaDraft";
import {
    mapAspNetErrorsToMotherFieldErrors,
    resolveApiErrorMessage,
} from "../../utils/apiErrorMessage";

const EMPTY_MODEL = { bebe: [{}] };

export const MotherPage = () => {
    const dispatch = useDispatch();
    const localities = useSelector(state => state.genericsReducer?.getLocalities)
    const estadosCiviles = useSelector(state => state.genericsReducer?.getEstadosCiviles)
    const dataMother = useSelector(state => state.motherReducer)
    const dataBaby = useSelector(state => state.babyReducer)
    const loading = useSelector(state => state.motherReducer?.loading)
    const salasRes = dataBaby?.getBabySalas
    const babySalasOptions = useMemo(() => {
        const raw = salasRes?.resultado ?? salasRes?.listadoSalas ?? salasRes?.data;
        if (!Array.isArray(raw)) return null;
        return raw
            .map((s) => ({ label: s.nombre ?? `Sala ${s.idSala ?? ''}`, value: s.idSala ?? s.id }))
            .filter((o) => o.value != null);
    }, [salasRes])
    const [model, setModel] = useState(EMPTY_MODEL);
    const [error, setError] = useState(null);
    const [stateForm, setStateForm] = useState(null);
    const [type, setType] = useState('');
    const [fieldErrors, setFieldErrors] = useState({ ...INITIAL_MOTHER_FIELD_ERRORS });
    const [babyFieldErrors, setBabyFieldErrors] = useState([]);
    const [motherStepDone, setMotherStepDone] = useState(false);
    const [openSection, setOpenSection] = useState('madre');
    const [draftLoaded, setDraftLoaded] = useState(false);
    const navigate = useNavigate();

    /** Filas realmente cargadas: una fila agregada y dejada vacía no bloquea el alta. */
    const babiesToSubmit = () => (model?.bebe ?? []).filter((b) => !isBabyRowEmpty(b));

    const validateMother = () => {
        const mothers = dataMother?.getMother?.data ?? [];
        const { ok, errors } = validateMotherForm(model, { mothers, excludeMadreId: null });
        setFieldErrors(errors);
        return ok;
    };

    /**
     * No persiste en el backend: la madre sola no es un alta válida. Guarda el borrador en el
     * dispositivo y abre la ficha del bebé, que es lo que completa el alta.
     */
    const submitMother = () => {
        dispatch(clearMotherApiError());
        if (!validateMother()) {
            setOpenSection('madre');
            return;
        }
        saveMotherAltaDraft(model);
        setMotherStepDone(true);
        setOpenSection('bebe-0');
        dispatch(showToast({
            message: 'Datos de la madre guardados. Completá el bebé para registrar el alta.',
            severity: 'info',
        }));
        setTimeout(() => {
            document.getElementById('alta-bebe-0')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 0);
    };

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

    /** Alta completa: madre + bebés en un único POST, para que no quede una sin el otro. */
    const submitAlta = () => {
        dispatch(clearMotherApiError());
        setError(null);

        if (!validateMother()) {
            setOpenSection('madre');
            setError('Revisá los datos de la madre: hay campos incompletos o inválidos.');
            setStateForm('ERROR');
            return;
        }

        const bebes = babiesToSubmit();
        if (bebes.length === 0) {
            setOpenSection('bebe-0');
            setError('Cargá los datos del bebé: no se puede registrar una madre sin bebé.');
            setStateForm('ERROR');
            return;
        }

        const resultados = bebes.map((b) => validateBabyForm(b));
        setBabyFieldErrors(resultados.map((r) => r.errors));
        if (resultados.some((r) => !r.ok)) {
            const idx = resultados.findIndex((r) => !r.ok);
            setOpenSection(`bebe-${idx}`);
            setError(firstBabyErrorMessage(resultados.map((r) => r.errors)));
            setStateForm('ERROR');
            return;
        }

        saveMotherAltaDraft(model);
        dispatch(showLoading(true));
        dispatch(postMother({
            ...normalizeMotherPayload(model),
            bebe: bebes.map(normalizeBabyForAlta),
        }));
    };

    useEffect(() => {
        dispatch(clearMother())
        dispatch(clearBaby())
        dispatch(getLocalities())
        dispatch(getEstadosCiviles())
        dispatch(getMother())
        dispatch(getBabySalas())

        const draft = readMotherAltaDraft();
        if (draft?.model) {
            setModel({ ...EMPTY_MODEL, ...draft.model });
            setMotherStepDone(true);
            dispatch(showToast({
                message: 'Recuperamos el alta que habías dejado sin terminar.',
                severity: 'info',
            }));
        }
        setDraftLoaded(true);

        return () => {
            dispatch(clearMother())
            dispatch(clearBaby())
        }
    }, [])

    // El borrador se mantiene al día mientras se completa la ficha, que es la parte larga.
    useEffect(() => {
        if (!draftLoaded || !motherStepDone) return;
        saveMotherAltaDraft(model);
    }, [model, motherStepDone, draftLoaded])

    useEffect(() => {
        if (dataMother?.error != null) {
            dispatch(showLoading(false));
            const mapped = mapAspNetErrorsToMotherFieldErrors(dataMother.error);
            if (Object.keys(mapped).length > 0) {
                setFieldErrors({ ...INITIAL_MOTHER_FIELD_ERRORS, ...mapped });
                setOpenSection('madre');
                dispatch(clearMotherApiError());
            }
        }
        if (dataMother?.postMother !== null) {
            setType('La madre y su bebé')
            clearMotherAltaDraft()
            setModel(EMPTY_MODEL)
            setFieldErrors({ ...INITIAL_MOTHER_FIELD_ERRORS });
            setBabyFieldErrors([]);
            setMotherStepDone(false);
            setOpenSection('madre');
            dispatch(showLoading(false))
            setStateForm('SUCCESS')
            setTimeout(() => {
                navigate('/madres')
                setStateForm(null);
            }, [2500])
        }
    }, [dataMother?.error, dataMother?.postMother])

    return (
        <>
            {loading &&
                <Loading />
            }
            <MotherTemplate
                model={model}
                setModel={setModel}

                error={error}
                setError={setError}

                localities={localities?.data ?? null}
                estadosCiviles={estadosCiviles?.data ?? null}
                mothers={dataMother?.getMother?.data ?? null}

                submitMother={submitMother}
                submitConset={submitConset}
                submitAlta={submitAlta}
                typeForm={"ALTA"}
                fieldErrors={fieldErrors}
                setFieldErrors={setFieldErrors}
                babyFieldErrors={babyFieldErrors}
                motherStepDone={motherStepDone}
                openSection={openSection}
                setOpenSection={setOpenSection}
                profileBabyExtras={{ babySalasOptions }}
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
                    message={error != null ? resolveApiErrorMessage(typeof error === 'string' ? error : { data: error }) : ''}
                    error
                />
            }
            <Footer />
        </>
    )
}
