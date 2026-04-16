import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearVolunteer, postVolunteer, getVolunteers } from "../../redux/actions/volunteerActions";
import { showLoading } from "../../redux/actions/loadingActions";
import Loading from "../../components/atoms/loading/Loading";
import Footer from "../../components/molecules/Footer";
import DialogSuccess from "../../components/atoms/dialogSuccess/DialogSuccess";
import VolunteerTemplate from "../../components/templates/volunteer/VolunteerTemplate";
import { useNavigate } from "react-router-dom";
import {
    validateVolunteerAlta,
    normalizeVolunteerPayload,
    INITIAL_VOLUNTEER_FIELD_ERRORS,
} from "../../utils/volunteerFormValidation";

export const VolunteerPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const localities = useSelector(state => state.genericsReducer?.getLocalities)
    const dataVolunteer = useSelector(state => state.volunteerReducer)
    const loading = useSelector(state => state.volunteerReducer?.loading)
    const [model, setModel] = useState({});
    const [error, setError] = useState(null);
    const [stateForm, setStateForm] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({ ...INITIAL_VOLUNTEER_FIELD_ERRORS });

    const submitVolunteer = () => {
        const mdl = model || {};
        const volunteers = dataVolunteer?.getVolunteers?.listadoVoluntaria ?? [];
        const { ok, errors } = validateVolunteerAlta(mdl, { volunteers });
        setFieldErrors(errors);
        if (!ok) return;
        dispatch(showLoading(true))
        dispatch(postVolunteer(normalizeVolunteerPayload(mdl)))
    }

    useEffect(() => {
        dispatch(clearVolunteer())
        dispatch(getVolunteers())
        return () => {
            dispatch(clearVolunteer())
        }
    }, [])

    useEffect(() => {
        if (dataVolunteer?.error !== null) {
            // dispatch(showLoading(false))
            // setError(dataVolunteer?.error)
        }
        if (dataVolunteer?.postVolunteer !== null) {
            setModel({})
            setFieldErrors({ ...INITIAL_VOLUNTEER_FIELD_ERRORS });
            dispatch(showLoading(false))
            setStateForm('SUCCESS')
            setTimeout(() => {
                navigate('/voluntarias')
                setStateForm(null);
            }, [2500])
        }
    }, [dataVolunteer?.error, dataVolunteer?.postVolunteer])


    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {loading &&
                <Loading position={'absolute'} height={'100%'} zIndex={9999} />
            }
            <VolunteerTemplate
                model={model}
                setModel={setModel}
                error={error}
                setError={setError}
                localities={localities?.localidades ?? null}
                submitVolunteer={submitVolunteer}
                fieldErrors={fieldErrors}
                setFieldErrors={setFieldErrors}
            />
            {
                stateForm === 'SUCCESS' &&
                <DialogSuccess
                    open={stateForm === 'SUCCESS'}
                    setOpen={setStateForm}
                    message={'¡La voluntaria se ha registrado con éxito!'}
                />
            }
            <Footer />
        </div>
    )
}
