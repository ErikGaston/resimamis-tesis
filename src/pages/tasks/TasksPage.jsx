import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearVolunteer, getAssistance, getVolunteersFree, postAssistance } from "../../redux/actions/volunteerActions";
import { clearAssignment, getAssignmentTodayById, postAssignmentGenerate, postDetailAssignment, postEndHug, postStartHug } from "../../redux/actions/assignmentActions";
import { clearSupply, getSupplies } from "../../redux/actions/supplyActions";
import { showLoading } from "../../redux/actions/loadingActions";
import Loading from "../../components/atoms/loading/Loading";
import Footer from "../../components/molecules/Footer";
import DialogSuccess from "../../components/atoms/dialogSuccess/DialogSuccess";
import TasksTemplate from "../../components/templates/tasks/TasksTemplate";
import { getIdVolunteer } from '../../utils/localStorage';

export const TasksPage = () => {
    const dispatch = useDispatch();
    const dataVolunteer = useSelector(state => state.volunteerReducer)
    const dataAssignment = useSelector(state => state.assignmentReducer)
    const dataSupply = useSelector(state => state.supplyReducer)
    const loadingVolunteer = useSelector(state => state.volunteerReducer?.loading)
    const loadingAssignment = useSelector(state => state.assignmentReducer?.loading)
    const loadingSupply = useSelector(state => state.supplyReducer?.loading)
    const loading = loadingVolunteer || loadingAssignment || loadingSupply
    const [valueTask, setValueTask] = useState(1);
    const [model, setModel] = useState(null);
    const [error, setError] = useState(null);
    const [stateForm, setStateForm] = useState(null);
    const [checkAssistance, setCheckAssistance] = useState(false);
    let idVolunteer = getIdVolunteer();
    const [selectedListVolunteer, setSelectedListVolunteer] = useState(false);
    const [stateInsumo, setStateInsumo] = useState('');
    const [ultimoElementoRegistrarInsumo, setUltimoElementoRegistrarInsumo] = useState(false);
    const [changeInformationHug, setChangeInformationHug] = React.useState(null)
    const [changeAssignedList, setChangeAssignedList] = React.useState(true)

    const changeTask = (number) => e => {
        setValueTask(number)
    }

    const submitAssistence = () => {
        dispatch(showLoading(true))
        dispatch(postAssistance(idVolunteer))

    }

    const selectVolunteersFree = () => {
        setSelectedListVolunteer(state => !state)
    }

    const submitAssignmentTask = () => {
        dispatch(showLoading(true))
        dispatch(postAssignmentGenerate())
    }

    const submitStartHug = (idAsignacion) => {
        dispatch(showLoading(true))
        dispatch(postStartHug(idAsignacion))
    }

    const submitEndHug = (idAsignacion) => {
        dispatch(showLoading(true))
        let param = {
            id: idAsignacion,
            comentario: model?.comentario ?? 'No hay comentario'
        }
        dispatch(postEndHug(param))
    }

    const changeStateInsumo = () => {
        dispatch(showLoading(true))
        dispatch(getSupplies())
    }

    const submitChangeSupplies = (list, idAsignacion) => {
        dispatch(showLoading(true));
        list.forEach((item, index, array) => {
            let param = {
                idAsignacion: idAsignacion,
                idInsumo: item.idInsumo,
                cantidadInsumo: item.cantidad
            }
            dispatch(postDetailAssignment(param))
            if (index === array.length - 1) {
                // Lógica específica para el último elemento
                setUltimoElementoRegistrarInsumo(true);
            }
        })
    }

    useEffect(() => {
        dispatch(clearAssignment());
        dispatch(clearVolunteer());
        dispatch(clearSupply());
        return () => {
            dispatch(clearAssignment());
            dispatch(clearVolunteer());
            dispatch(clearSupply());
        }
    }, [])

    useEffect(() => {
        if (valueTask === 1) {
            dispatch(showLoading(true))
            dispatch(getAssistance(idVolunteer))

        }
        else {
            dispatch(showLoading(true))
            dispatch(getVolunteersFree())
        }
    }, [valueTask, dispatch, idVolunteer])

    useEffect(() => {
        if (dataVolunteer?.error != null) {
            dispatch(showLoading(false))
            setStateForm('ERROR')
            setTimeout(() => {
                setStateForm('');
            }, 2500)
        }
        if (dataVolunteer?.postAssistance !== null) {
            dispatch(showLoading(false))
            if (dataVolunteer?.postAssistance?.respuesta) {
                setModel(null)
                setStateForm('ASSISTENCE')
                setCheckAssistance(true);
                // dispatch(getBabysFree())
                dispatch(getAssignmentTodayById(idVolunteer))
                setTimeout(() => {
                    setStateForm(null);
                }, 2500)
            }
        }
    }, [dataVolunteer?.error, dataVolunteer?.postAssistance, dispatch])

    useEffect(() => {
        if (dataVolunteer?.getAssistance !== null) {
            dispatch(showLoading(false))
            if (dataVolunteer?.getAssistance?.resultado) {
                setCheckAssistance(true);
                // dispatch(getBabysFree())
                dispatch(getAssignmentTodayById(idVolunteer))
            }
        }
    }, [dataVolunteer?.getAssistance, dispatch])

    useEffect(() => {
        if (dataAssignment?.error != null) {
            dispatch(showLoading(false))
            const msg =
                dataAssignment?.error?.mensaje ??
                dataAssignment?.error?.message ??
                dataAssignment?.error?.detail
            if (msg) {
                setStateForm('ERROR_ASIGNACION')
                setError(typeof msg === 'string' ? msg : JSON.stringify(msg))
            } else {
                setStateForm('ERROR')
            }
            setTimeout(() => {
                setStateForm('');
            }, 2500)
        }
        if (dataAssignment?.getAssignmentTodayById !== null) {
            dispatch(showLoading(false))
        }
    }, [dataAssignment?.error, dataAssignment?.getAssignmentTodayById, dispatch])

    useEffect(() => {
        if (dataAssignment?.postStartHug !== null) {
            if (dataAssignment?.postStartHug?.respuesta) {
                dispatch(showLoading(false))
                dispatch(getAssignmentTodayById(idVolunteer))
                setStateForm('INICIO_ABRAZO');
                setTimeout(() => {
                    setStateForm('');
                }, 2500)
            }
        }
    }, [dataAssignment?.postStartHug, dispatch, idVolunteer])

    useEffect(() => {
        if (dataAssignment?.postEndHug !== null) {
            if (dataAssignment?.postEndHug?.respuesta) {
                dispatch(showLoading(false))
                setModel(null)
                setChangeInformationHug(false)
                dispatch(getAssignmentTodayById(idVolunteer))
                setStateForm('FINALIZA_ABRAZO');
                setTimeout(() => {
                    setStateForm('');
                }, 2500)
            }
        }
    }, [dataAssignment?.postEndHug, dispatch, idVolunteer])

    useEffect(() => {
        if (dataVolunteer?.error != null) {
            dispatch(showLoading(false))
            setStateForm('ERROR')
            setTimeout(() => {
                setStateForm('');
            }, 2500)
        }
        if (dataVolunteer?.getVolunteersFree !== null) {
            dispatch(showLoading(false))
            setTimeout(() => {
                setStateForm(null);
            }, 2500)
        }
    }, [dataVolunteer?.error, dataVolunteer?.getVolunteersFree, dispatch])

    useEffect(() => {
        if (dataAssignment?.postAssignmentGenerate !== null) {
            setSelectedListVolunteer(false);
            setChangeAssignedList(state => !state)
            dispatch(showLoading(false))
        }
    }, [dataAssignment?.postAssignmentGenerate, dispatch])

    useEffect(() => {
        if (dataSupply?.getSupplies !== null) {
            dispatch(showLoading(false))
            setStateInsumo('OPEN')
        }
    }, [dataSupply?.getSupplies, dispatch])

    useEffect(() => {
        if (dataAssignment?.postDetailAssignment !== null) {
            if (ultimoElementoRegistrarInsumo) {
                dispatch(showLoading(false))
                setStateForm('REGISTER_SUPPLY')

                setTimeout(() => {
                    setStateForm('')
                    setStateInsumo('');
                }, [2500])
            }
        }
    }, [dataAssignment?.postDetailAssignment, dispatch, ultimoElementoRegistrarInsumo])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {loading &&
                <Loading position={'absolute'} height={'100%'} zIndex={9999} />
            }
            <TasksTemplate
                model={model}
                setModel={setModel}

                error={error}
                setError={setError}

                submitAssistence={submitAssistence}

                changeTask={changeTask}
                valueTask={valueTask}

                checkAssistance={checkAssistance}
                assignmentVolunteer={dataAssignment?.getAssignmentTodayById?.listadoAsignaciones ?? null}

                volunteersFree={dataVolunteer?.getVolunteersFree?.listadoVoluntariasLibres ?? null}
                selectVolunteersFree={selectVolunteersFree}
                selectedListVolunteer={selectedListVolunteer}
                submitAssignmentTask={submitAssignmentTask}

                listAssignment={dataAssignment?.postAssignmentGenerate?.listadoAsignaciones ?? null}

                submitStartHug={submitStartHug}
                submitEndHug={submitEndHug}

                changeStateInsumo={changeStateInsumo}
                stateInsumo={stateInsumo}
                setStateInsumo={setStateInsumo}
                supplies={dataSupply?.getSupplies?.resultado ?? null}
                submitChangeSupplies={submitChangeSupplies}

                changeInformationHug={changeInformationHug}
                setChangeInformationHug={setChangeInformationHug}

                changeAssignedList={changeAssignedList}
                setChangeAssignedList={setChangeAssignedList}

            />
            {
                stateForm === 'ASSISTENCE' &&
                <DialogSuccess
                    open={stateForm === 'ASSISTENCE'}
                    setOpen={setStateForm}
                    message={'¡La asistencia se ha registrado con éxito!'}
                />
            }
            {/* {
                stateForm === 'ERROR' &&
                <DialogSuccess
                    open={stateForm === 'ERROR'}
                    setOpen={setStateForm}
                    error={true}
                    message={'Ups, ha ocurrido un error'}
                />
            } */}
            {
                stateForm === 'REGISTER_SUPPLY' &&
                <DialogSuccess
                    open={stateForm === 'REGISTER_SUPPLY'}
                    setOpen={setStateForm}
                    message={'¡Los insumos se registraron con éxito!'}
                />
            }
            {
                stateForm === 'INICIO_ABRAZO' &&
                <DialogSuccess
                    open={stateForm === 'INICIO_ABRAZO'}
                    setOpen={setStateForm}
                    message={'¡El abrazo se inició correctamente!'}
                />
            }
            {
                stateForm === 'FINALIZA_ABRAZO' &&
                <DialogSuccess
                    open={stateForm === 'FINALIZA_ABRAZO'}
                    setOpen={setStateForm}
                    message={'¡El abrazo se finalizó correctamente!'}
                />
            }
            {
                stateForm === 'ERROR_ASIGNACION' &&
                <DialogSuccess
                    open={stateForm === 'ERROR_ASIGNACION'}
                    setOpen={setStateForm}
                    error={true}
                    message={error}
                />
            }
            <Footer />
        </div>
    )
}