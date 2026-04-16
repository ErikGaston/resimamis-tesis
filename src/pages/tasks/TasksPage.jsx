import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearVolunteer, getAssistance, getAssistanceHistoricas, getAssistanceToday, getVolunteersFree, postAssistance, postAssistanceSalida } from "../../redux/actions/volunteerActions";
import { clearBaby, getBabysFree } from "../../redux/actions/babyActions";
import { clearAssignment, getAssignmentById, getAssignmentTodayById, postAssignmentGenerate, postAssignmentGenerateTarea, postDetailAssignment, postEndHug, postStartHug } from "../../redux/actions/assignmentActions";
import { clearSupply, getSupplies } from "../../redux/actions/supplyActions";
import { showLoading } from "../../redux/actions/loadingActions";
import Loading from "../../components/atoms/loading/Loading";
import Footer from "../../components/molecules/Footer";
import DialogSuccess from "../../components/atoms/dialogSuccess/DialogSuccess";
import TasksTemplate from "../../components/templates/tasks/TasksTemplate";
import AssistanceDataDialog from "../../components/organisms/assistanceDialogs/AssistanceDataDialog";
import { getIdVolunteer } from '../../utils/localStorage';
import { listBabysFromAbrazarResponse, resolveIdTareaForGenerarTareas } from "../../utils/assignmentSelection";

export const TasksPage = () => {
    const dispatch = useDispatch();
    const dataVolunteer = useSelector(state => state.volunteerReducer)
    const dataAssignment = useSelector(state => state.assignmentReducer)
    const dataSupply = useSelector(state => state.supplyReducer)
    const dataBaby = useSelector(state => state.babyReducer)
    const loadingVolunteer = useSelector(state => state.volunteerReducer?.loading)
    const loadingAssignment = useSelector(state => state.assignmentReducer?.loading)
    const loadingSupply = useSelector(state => state.supplyReducer?.loading)
    const loadingBaby = useSelector(state => state.babyReducer?.loading)
    const loading = loadingVolunteer || loadingAssignment || loadingSupply || loadingBaby

    const babiesFreeList = useMemo(
        () => listBabysFromAbrazarResponse(dataBaby?.getBabysFree),
        [dataBaby?.getBabysFree],
    );

    /** Para diálogos de asistencia cuando el API no anida `voluntaria` (p. ej. histórico). */
    const assistanceVolunteerFallback = useMemo(() => {
        try {
            const raw = localStorage.getItem('voluntaria');
            if (!raw) return null;
            const v = JSON.parse(raw);
            if (v == null || v.id == null) return null;
            return {
                idVoluntaria: Number(v.id),
                nombre: v.nombre ?? '',
                apellido: v.apellido ?? '',
                dni: v.dni,
            };
        } catch {
            return null;
        }
    }, []);

    const [valueTask, setValueTask] = useState(1);
    const [model, setModel] = useState(null);
    const [error, setError] = useState(null);
    const [stateForm, setStateForm] = useState(null);
    const [checkAssistance, setCheckAssistance] = useState(false);
    let idVolunteer = getIdVolunteer();
    const [selectedVolunteerIds, setSelectedVolunteerIds] = useState([]);
    const [selectedBabyTareaIds, setSelectedBabyTareaIds] = useState([]);
    const [stateInsumo, setStateInsumo] = useState('');
    const [changeInformationHug, setChangeInformationHug] = React.useState(null)
    const [changeAssignedList, setChangeAssignedList] = React.useState(true)
    const pendingAssistanceRef = useRef(null);
    const pendingAssignmentDetailRef = useRef(null);
    const [rawDataDialog, setRawDataDialog] = useState({ open: false, title: '', data: null });

    const changeTask = (number) => e => {
        setValueTask(number)
    }

    const submitAssistence = () => {
        dispatch(showLoading(true))
        dispatch(postAssistance(idVolunteer))
    }

    const submitAssistanceSalida = () => {
        dispatch(showLoading(true))
        dispatch(postAssistanceSalida(idVolunteer))
    }

    const selectVolunteersFree = () => {
        const list = dataVolunteer?.getVolunteersFree?.listadoVoluntariasLibres ?? [];
        const ids = list
            .map((v) => v.idVoluntaria)
            .filter((id) => id != null);
        setSelectedVolunteerIds((prev) => {
            const allSelected = ids.length > 0 && ids.every((id) => prev.includes(id));
            return allSelected ? [] : ids;
        });
    };

    const toggleVolunteerSelection = (idVoluntaria) => {
        if (idVoluntaria == null) return;
        setSelectedVolunteerIds((prev) =>
            prev.includes(idVoluntaria)
                ? prev.filter((id) => id !== idVoluntaria)
                : [...prev, idVoluntaria],
        );
    };

    const selectAllBabysFree = () => {
        const ids = babiesFreeList
            .map((b) => resolveIdTareaForGenerarTareas(b))
            .filter((id) => id != null);
        setSelectedBabyTareaIds((prev) => {
            const allSelected = ids.length > 0 && ids.every((id) => prev.includes(id));
            return allSelected ? [] : ids;
        });
    };

    const toggleBabyTareaSelection = (tareaId) => {
        if (tareaId == null) return;
        setSelectedBabyTareaIds((prev) =>
            prev.includes(tareaId)
                ? prev.filter((id) => id !== tareaId)
                : [...prev, tareaId],
        );
    };

    const submitAssignmentTask = () => {
        if (!selectedVolunteerIds.length || !selectedBabyTareaIds.length) return;
        dispatch(showLoading(true));
        dispatch(
            postAssignmentGenerate({
                idVoluntarias: selectedVolunteerIds,
                idTareas: selectedBabyTareaIds,
            }),
        );
    };

    const submitAssignmentQuick = ({ idVoluntaria, idTarea }) => {
        if (idVoluntaria == null || idTarea == null) return;
        dispatch(showLoading(true));
        dispatch(postAssignmentGenerateTarea({ idVoluntaria, idTarea }));
    };

    const openAssistanceTodayDialog = () => {
        pendingAssistanceRef.current = 'today';
        dispatch(showLoading(true));
        dispatch(getAssistanceToday());
    };

    const openAssistanceHistoricasDialog = () => {
        pendingAssistanceRef.current = 'historicas';
        dispatch(showLoading(true));
        dispatch(getAssistanceHistoricas(idVolunteer));
    };

    const openAssignmentDetailDialog = (idAsignacion) => {
        if (idAsignacion == null) return;
        pendingAssignmentDetailRef.current = idAsignacion;
        dispatch(showLoading(true));
        dispatch(getAssignmentById(idAsignacion));
    };

    const submitStartHug = (idAsignacion) => {
        dispatch(showLoading(true))
        dispatch(postStartHug(idAsignacion))
    }

    const submitEndHug = (idAsignacion) => {
        dispatch(showLoading(true))
        const raw = model?.comentario;
        const comentario =
            raw != null && String(raw).trim() !== '' ? String(raw).trim() : null;
        dispatch(postEndHug({ idAsignacion, comentario }))
    }

    const changeStateInsumo = () => {
        dispatch(showLoading(true))
        dispatch(getSupplies())
    }

    const submitChangeSupplies = (list, idAsignacion) => {
        if (!list?.length) {
            return;
        }
        dispatch(showLoading(true));
        const payload = list.map((item) => ({
            idAsignacion,
            idInsumo: item.idInsumo,
            cantidadInsumo: item.cantidad,
        }));
        dispatch(postDetailAssignment(payload));
    }

    useEffect(() => {
        dispatch(clearAssignment());
        dispatch(clearVolunteer());
        dispatch(clearSupply());
        dispatch(clearBaby());
        return () => {
            dispatch(clearAssignment());
            dispatch(clearVolunteer());
            dispatch(clearSupply());
            dispatch(clearBaby());
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
            dispatch(getBabysFree())
        }
    }, [valueTask, dispatch, idVolunteer])

    useEffect(() => {
        if (dataVolunteer?.error != null) {
            dispatch(showLoading(false))
            if (pendingAssistanceRef.current) {
                pendingAssistanceRef.current = null;
            }
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
                dispatch(getAssignmentTodayById(idVolunteer))
                setTimeout(() => {
                    setStateForm(null);
                }, 2500)
            }
        }
        if (dataVolunteer?.postAssistanceSalida !== null) {
            dispatch(showLoading(false))
            setStateForm('ASSISTENCE_SALIDA')
            setCheckAssistance(false)
            dispatch(getAssistance(idVolunteer))
            setTimeout(() => {
                setStateForm(null)
            }, 2500)
        }
        if (dataVolunteer?.getVolunteersFree !== null) {
            dispatch(showLoading(false))
            setTimeout(() => {
                setStateForm(null);
            }, 2500)
        }
    }, [dataVolunteer?.error, dataVolunteer?.postAssistance, dataVolunteer?.postAssistanceSalida, dataVolunteer?.getVolunteersFree, dispatch, idVolunteer])

    useEffect(() => {
        if (pendingAssistanceRef.current === 'today' && dataVolunteer?.getAssistanceToday != null) {
            pendingAssistanceRef.current = null;
            dispatch(showLoading(false));
            setRawDataDialog({ open: true, title: 'Asistencias de hoy', data: dataVolunteer.getAssistanceToday });
        }
        if (pendingAssistanceRef.current === 'historicas' && dataVolunteer?.getAssistanceHistoricas != null) {
            pendingAssistanceRef.current = null;
            dispatch(showLoading(false));
            setRawDataDialog({ open: true, title: 'Mi histórico de asistencias', data: dataVolunteer.getAssistanceHistoricas });
        }
    }, [dataVolunteer?.getAssistanceToday, dataVolunteer?.getAssistanceHistoricas, dispatch]);

    useEffect(() => {
        if (dataVolunteer?.getAssistance !== null) {
            dispatch(showLoading(false))
            if (dataVolunteer?.getAssistance?.resultado) {
                setCheckAssistance(true);
                dispatch(getAssignmentTodayById(idVolunteer))
            }
        }
    }, [dataVolunteer?.getAssistance, dispatch, idVolunteer])

    useEffect(() => {
        if (dataBaby?.error != null) {
            dispatch(showLoading(false))
        }
        if (dataBaby?.getBabysFree !== null) {
            dispatch(showLoading(false))
        }
    }, [dataBaby?.error, dataBaby?.getBabysFree, dispatch])

    useEffect(() => {
        if (dataAssignment?.error != null) {
            dispatch(showLoading(false))
            if (pendingAssignmentDetailRef.current != null) {
                pendingAssignmentDetailRef.current = null;
            }
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
        const expectedId = pendingAssignmentDetailRef.current;
        if (expectedId != null && dataAssignment?.getAssignmentById != null) {
            pendingAssignmentDetailRef.current = null;
            dispatch(showLoading(false));
            setRawDataDialog({
                open: true,
                title: `Detalle asignación #${expectedId}`,
                data: dataAssignment.getAssignmentById,
            });
        }
    }, [dataAssignment?.getAssignmentById, dispatch]);

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
        if (dataAssignment?.postAssignmentGenerate !== null) {
            setSelectedVolunteerIds([]);
            setSelectedBabyTareaIds([]);
            setChangeAssignedList(state => !state)
            dispatch(showLoading(false))
            dispatch(getVolunteersFree())
            dispatch(getBabysFree())
        }
    }, [dataAssignment?.postAssignmentGenerate, dispatch])

    useEffect(() => {
        if (dataAssignment?.postAssignmentGenerateTarea != null) {
            dispatch(showLoading(false));
            dispatch(getVolunteersFree());
            dispatch(getBabysFree());
            dispatch(getAssignmentTodayById(idVolunteer));
            setChangeAssignedList((s) => !s);
            setStateForm('ASIGNACION_UNA');
            setTimeout(() => {
                setStateForm(null);
            }, 2500);
        }
    }, [dataAssignment?.postAssignmentGenerateTarea, dispatch, idVolunteer]);

    useEffect(() => {
        if (dataSupply?.getSupplies !== null) {
            dispatch(showLoading(false))
            setStateInsumo('OPEN')
        }
    }, [dataSupply?.getSupplies, dispatch])

    useEffect(() => {
        if (dataAssignment?.postDetailAssignment !== null) {
            dispatch(showLoading(false))
            setStateForm('REGISTER_SUPPLY')
            setTimeout(() => {
                setStateForm('')
                setStateInsumo('');
            }, 2500)
        }
    }, [dataAssignment?.postDetailAssignment, dispatch])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, width: '100%' }}>
            {loading &&
                <Loading position={'absolute'} height={'100%'} zIndex={9999} />
            }
            <TasksTemplate
                model={model}
                setModel={setModel}
                error={error}
                setError={setError}
                submitAssistence={submitAssistence}
                submitAssistanceSalida={submitAssistanceSalida}
                changeTask={changeTask}
                valueTask={valueTask}
                checkAssistance={checkAssistance}
                assignmentVolunteer={dataAssignment?.getAssignmentTodayById?.listadoAsignaciones ?? null}
                volunteersFree={dataVolunteer?.getVolunteersFree?.listadoVoluntariasLibres ?? null}
                listBabysFree={babiesFreeList}
                selectVolunteersFree={selectVolunteersFree}
                selectedVolunteerIds={selectedVolunteerIds}
                toggleVolunteerSelection={toggleVolunteerSelection}
                selectAllBabysFree={selectAllBabysFree}
                selectedBabyTareaIds={selectedBabyTareaIds}
                toggleBabyTareaSelection={toggleBabyTareaSelection}
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
                onShowAssistanceToday={openAssistanceTodayDialog}
                onShowAssistanceHistoricas={openAssistanceHistoricasDialog}
                onAssignmentDetail={openAssignmentDetailDialog}
                submitAssignmentQuick={submitAssignmentQuick}
            />
            <AssistanceDataDialog
                open={rawDataDialog.open}
                title={rawDataDialog.title}
                data={rawDataDialog.data}
                volunteerFallback={assistanceVolunteerFallback}
                onClose={() => setRawDataDialog((d) => ({ ...d, open: false }))}
            />
            {
                stateForm === 'ASSISTENCE' &&
                <DialogSuccess
                    open={stateForm === 'ASSISTENCE'}
                    setOpen={setStateForm}
                    message={'¡La asistencia se ha registrado con éxito!'}
                />
            }
            {
                stateForm === 'ASSISTENCE_SALIDA' &&
                <DialogSuccess
                    open={stateForm === 'ASSISTENCE_SALIDA'}
                    setOpen={setStateForm}
                    message={'¡Salida de asistencia registrada con éxito!'}
                />
            }
            {
                stateForm === 'INICIO_ABRAZO' &&
                <DialogSuccess
                    open={stateForm === 'INICIO_ABRAZO'}
                    setOpen={setStateForm}
                    message={'¡Abrazo iniciado con éxito!'}
                />
            }
            {
                stateForm === 'FINALIZA_ABRAZO' &&
                <DialogSuccess
                    open={stateForm === 'FINALIZA_ABRAZO'}
                    setOpen={setStateForm}
                    message={'¡Abrazo finalizado con éxito!'}
                />
            }
            {
                stateForm === 'REGISTER_SUPPLY' &&
                <DialogSuccess
                    open={stateForm === 'REGISTER_SUPPLY'}
                    setOpen={setStateForm}
                    message={'¡Insumos registrados con éxito!'}
                />
            }
            {
                stateForm === 'ERROR_ASIGNACION' &&
                <DialogSuccess
                    open={stateForm === 'ERROR_ASIGNACION'}
                    setOpen={setStateForm}
                    message={error}
                />
            }
            {
                stateForm === 'ASIGNACION_UNA' &&
                <DialogSuccess
                    open={stateForm === 'ASIGNACION_UNA'}
                    setOpen={setStateForm}
                    message={'Asignación generada (una tarea).'}
                />
            }
            <Footer />
        </div>
    )
}
