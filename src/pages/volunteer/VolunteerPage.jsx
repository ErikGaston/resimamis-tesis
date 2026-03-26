import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearVolunteer, postAssistance, postVolunteer } from "../../redux/actions/volunteerActions";
import { showLoading } from "../../redux/actions/loadingActions";
import Loading from "../../components/atoms/loading/Loading";
import Footer from "../../components/molecules/Footer";
import DialogSuccess from "../../components/atoms/dialogSuccess/DialogSuccess";
import VolunteerTemplate from "../../components/templates/volunteer/VolunteerTemplate";
import { useNavigate } from "react-router-dom";

export const VolunteerPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const localities = useSelector(state => state.genericsReducer?.getLocalities)
    const dataVolunteer = useSelector(state => state.volunteerReducer)
    const loading = useSelector(state => state.motherReducer?.loading)
    const [model, setModel] = useState(null);
    const [error, setError] = useState(null);
    const [stateForm, setStateForm] = useState(null);

    const submitVolunteer = () => {
        dispatch(showLoading(true))
        delete model.nombre_localidad;
        // model.fechaFin = null;
        dispatch(postVolunteer(model))
    }

    useEffect(() => {
        dispatch(clearVolunteer())
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
            setModel(null)
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
                // mothers={dataMother?.getMother?.listadoMadres ?? null}

                submitVolunteer={submitVolunteer}
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