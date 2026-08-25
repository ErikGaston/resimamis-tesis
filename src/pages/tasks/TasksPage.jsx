import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearVolunteer, clearVolunteerWrites, getAssistance, getAssistanceHistoricas, getAssistanceToday, getVolunteersFree, postAssistance, postAssistanceSalida } from "../../redux/actions/volunteerActions";
import { clearBaby, getBabysFree } from "../../redux/actions/babyActions";
import { clearAssignment, getAssignmentById, getAssignmentToday, getAssignmentTodayById, postAssignmentGenerate, postAssignmentGenerateTarea, postDetailAssignment, postEndHug, postStartHug } from "../../redux/actions/assignmentActions";
import { clearSupply, getSupplies } from "../../redux/actions/supplyActions";
import { showLoading } from "../../redux/actions/loadingActions";
import { hideToast, showToast } from "../../redux/actions/toastActions";
import Loading from "../../components/atoms/loading/Loading";
import Footer from "../../components/molecules/Footer";
import TasksTemplate from "../../components/templates/tasks/TasksTemplate";
import AssistanceDataDialog from "../../components/organisms/assistanceDialogs/AssistanceDataDialog";
import { getIdVolunteer } from '../../utils/localStorage';
import { listBabysFromAbrazarResponse, resolveIdTareaForGenerarTareas } from "../../utils/assignmentSelection";
import { isCoordinadoraSession } from "../../utils/coordinadoraRole";

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

    const canAccessAssignment = isCoordinadoraSession();
    const [valueTask, setValueTask] = useState(1);
    const [model, setModel] = useState(null);
    const [error, setError] = useState(null);
    const [checkAssistance, setCheckAssistance] = useState(false);
    const [salidaRegistrada, setSalidaRegistrada] = useState(false);
    let idVolunteer = getIdVolunteer();
    const [selectedVolunteerIds, setSelectedVolunteerIds] = useState([]);
    const [selectedBabyTareaIds, setSelectedBabyTareaIds] = useState([]);
    const [stateInsumo, setStateInsumo] = useState('');
    const [changeInformationHug, setChangeInformationHug] = React.useState(null)
    const [changeAssignedList, setChangeAssignedList] = React.useState(false)
    const pendingAssistanceRef = useRef(null);
    const pendingAssignmentDetailRef = useRef(null);
    const [rawDataDialog, setRawDataDialog] = useState({
        open: false,
        title: '',
        data: null,
        presentation: 'auto',
    });

    const changeTask = (number) => e => {
        setValueTask(number)
    }

    const submitAssistence = () => {
        if (loading) return;
        dispatch(showLoading(true))
        dispatch(postAssistance(idVolunteer))
    }

    const submitAssistanceSalida = () => {
        if (loading) return;
        dispatch(showLoading(true))
        dispatch(postAssistanceSalida(idVolunteer))
    }

    const selectVolunteersFree = () => {
        const list = dataVolunteer?.getVolunteersFree?.data ?? [];
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
        if (loading) return;
        dispatch(showLoading(true))
        dispatch(postStartHug(idAsignacion))
    }

    const submitEndHug = (idAsignacion) => {
        if (loading) return;
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
        if (!idAsignacion) {
            dispatch(showToast({ message: 'Error: no se pudo identificar la asignación.', severity: 'error' }));
            return;
        }
        const activeItems = (list ?? []).filter((item) => Number(item?.cantidad) > 0);
        if (!activeItems.length) {
            dispatch(showToast({ message: 'Seleccioná al menos un insumo antes de registrar.', severity: 'info' }));
            return;
        }
        dispatch(showLoading(true));
        const payload = activeItems.map((item) => ({
            idAsignacion: Number(idAsignacion),
            idInsumo: item.idInsumo,
            cantidadInsumo: Number(item.cantidad),
        }));
        dispatch(postDetailAssignment(payload));
    }

    useLayoutEffect(() => {
        dispatch(clearAssignment());
        dispatch(clearVolunteer());
        dispatch(clearSupply());
        dispatch(clearBaby());
        dispatch(hideToast());
    }, [dispatch]);

    useEffect(() => {
        if (!canAccessAssignment && valueTask === 2) {
            setValueTask(1);
        }
    }, [canAccessAssignment, valueTask]);

    useEffect(() => {
        return () => {
            dispatch(clearAssignment());
            dispatch(clearVolunteer());
            dispatch(clearSupply());
            dispatch(clearBaby());
            dispatch(hideToast());
        };
    }, [dispatch]);

    useEffect(() => {
        if (valueTask === 1) {
            dispatch(showLoading(true))
            dispatch(getAssistance(idVolunteer))
        }
        else if (canAccessAssignment) {
            dispatch(showLoading(true))
            dispatch(getVolunteersFree())
            dispatch(getBabysFree())
            dispatch(getAssignmentToday())
        }
    }, [valueTask, dispatch, idVolunteer, canAccessAssignment])

    useEffect(() => {
        if (dataVolunteer?.error != null) {
            dispatch(showLoading(false))
            if (pendingAssistanceRef.current) {
                pendingAssistanceRef.current = null;
            }
        }
        if (dataVolunteer?.postAssistance !== null) {
            dispatch(showLoading(false))
            if (dataVolunteer?.postAssistance?.data) {
                setModel(null)
                setCheckAssistance(true);
                setSalidaRegistrada(false);
                dispatch(getAssignmentTodayById(idVolunteer))
                dispatch(showToast({ message: '¡Asistencia registrada con éxito!', severity: 'success' }))
            }
            // Sin esto el flag queda en el slice y el efecto lo vuelve a leer
            // cuando cambia cualquier otra dependencia: repetía el toast de
            // entrada al registrar la salida.
            dispatch(clearVolunteerWrites())
        }
        if (dataVolunteer?.postAssistanceSalida !== null) {
            dispatch(showLoading(false))
            setCheckAssistance(false)
            setSalidaRegistrada(true);
            dispatch(getAssistance(idVolunteer))
            dispatch(showToast({ message: '¡Salida registrada con éxito!', severity: 'success' }))
            dispatch(clearVolunteerWrites())
        }
        if (dataVolunteer?.getVolunteersFree !== null) {
            dispatch(showLoading(false))
        }
    }, [dataVolunteer?.error, dataVolunteer?.postAssistance, dataVolunteer?.postAssistanceSalida, dataVolunteer?.getVolunteersFree, dispatch, idVolunteer])

    useEffect(() => {
        if (pendingAssistanceRef.current === 'today' && dataVolunteer?.getAssistanceToday != null) {
            pendingAssistanceRef.current = null;
            dispatch(showLoading(false));
            setRawDataDialog({
                open: true,
                title: 'Asistencias de hoy',
                data: dataVolunteer.getAssistanceToday,
                presentation: 'assistance',
            });
        }
        if (pendingAssistanceRef.current === 'historicas' && dataVolunteer?.getAssistanceHistoricas != null) {
            pendingAssistanceRef.current = null;
            dispatch(showLoading(false));
            setRawDataDialog({
                open: true,
                title: 'Mi histórico de asistencias',
                data: dataVolunteer.getAssistanceHistoricas,
                presentation: 'assistance',
            });
        }
    }, [dataVolunteer?.getAssistanceToday, dataVolunteer?.getAssistanceHistoricas, dispatch]);

    // `getAssistance` devuelve el registro de hoy exista o no la salida. Tomarlo
    // como "está adentro" sin mirar `fechaHoraSalida` rehabilitaba el botón de
    // salida después de haberla registrado, y el backend respondía 400.
    useEffect(() => {
        if (dataVolunteer?.getAssistance === null) return;
        dispatch(showLoading(false))

        const asistenciaHoy = dataVolunteer?.getAssistance?.data;
        if (!asistenciaHoy) {
            setCheckAssistance(false);
            setSalidaRegistrada(false);
            return;
        }

        const yaSalio = Boolean(asistenciaHoy.fechaHoraSalida ?? asistenciaHoy.FechaHoraSalida);
        setCheckAssistance(!yaSalio);
        setSalidaRegistrada(yaSalio);
        dispatch(getAssignmentTodayById(idVolunteer))
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
        }
        if (dataAssignment?.getAssignmentTodayById !== null) {
            dispatch(showLoading(false))
        }
        if (dataAssignment?.getAssignmentToday != null) {
            dispatch(showLoading(false))
        }
    }, [dataAssignment?.error, dataAssignment?.getAssignmentTodayById, dataAssignment?.getAssignmentToday, dispatch])

    useEffect(() => {
        const expectedId = pendingAssignmentDetailRef.current;
        if (expectedId != null && dataAssignment?.getAssignmentById != null) {
            pendingAssignmentDetailRef.current = null;
            dispatch(showLoading(false));
            setRawDataDialog({
                open: true,
                title: `Detalle asignación #${expectedId}`,
                data: dataAssignment.getAssignmentById,
                presentation: 'assignment',
            });
        }
    }, [dataAssignment?.getAssignmentById, dispatch]);

    useEffect(() => {
        if (dataAssignment?.postStartHug !== null) {
            dispatch(showLoading(false))
            if (dataAssignment?.postStartHug?.data) {
                dispatch(getAssignmentTodayById(idVolunteer))
                dispatch(showToast({ message: '¡Abrazo iniciado con éxito!', severity: 'success' }))
            }
        }
    }, [dataAssignment?.postStartHug, dispatch, idVolunteer])

    useEffect(() => {
        if (dataAssignment?.postEndHug !== null) {
            dispatch(showLoading(false))
            if (dataAssignment?.postEndHug?.data) {
                setModel(null)
                setChangeInformationHug(false)
                dispatch(getAssignmentTodayById(idVolunteer))
                dispatch(showToast({ message: '¡Abrazo finalizado con éxito!', severity: 'success' }))
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
            dispatch(getAssignmentToday())
            dispatch(showToast({ message: 'Asignaciones generadas con éxito.', severity: 'success' }))
        }
    }, [dataAssignment?.postAssignmentGenerate, dispatch])

    useEffect(() => {
        if (dataAssignment?.postAssignmentGenerateTarea != null) {
            dispatch(showLoading(false));
            dispatch(getVolunteersFree());
            dispatch(getBabysFree());
            dispatch(getAssignmentTodayById(idVolunteer));
            setChangeAssignedList((s) => !s);
            dispatch(showToast({ message: 'Asignación generada con éxito.', severity: 'success' }))
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
            setStateInsumo('');
            dispatch(showToast({ message: '¡Insumos registrados con éxito!', severity: 'success' }))
        }
    }, [dataAssignment?.postDetailAssignment, dispatch])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, width: '100%' }}>
            {loading &&
                <Loading />
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
                salidaRegistrada={salidaRegistrada}
                assignmentVolunteer={dataAssignment?.getAssignmentTodayById?.data ?? null}
                volunteersFree={dataVolunteer?.getVolunteersFree?.data ?? null}
                listBabysFree={babiesFreeList}
                selectVolunteersFree={selectVolunteersFree}
                selectedVolunteerIds={selectedVolunteerIds}
                toggleVolunteerSelection={toggleVolunteerSelection}
                selectAllBabysFree={selectAllBabysFree}
                selectedBabyTareaIds={selectedBabyTareaIds}
                toggleBabyTareaSelection={toggleBabyTareaSelection}
                submitAssignmentTask={submitAssignmentTask}
                listAssignment={dataAssignment?.postAssignmentGenerate?.data ?? dataAssignment?.getAssignmentToday?.data ?? null}
                submitStartHug={submitStartHug}
                submitEndHug={submitEndHug}
                changeStateInsumo={changeStateInsumo}
                stateInsumo={stateInsumo}
                setStateInsumo={setStateInsumo}
                supplies={dataSupply?.getSupplies?.data ?? null}
                submitChangeSupplies={submitChangeSupplies}
                changeInformationHug={changeInformationHug}
                setChangeInformationHug={setChangeInformationHug}
                changeAssignedList={changeAssignedList}
                setChangeAssignedList={setChangeAssignedList}
                onShowAssistanceToday={openAssistanceTodayDialog}
                onShowAssistanceHistoricas={openAssistanceHistoricasDialog}
                onAssignmentDetail={openAssignmentDetailDialog}
                submitAssignmentQuick={submitAssignmentQuick}
                canAccessAssignment={canAccessAssignment}
            />
            <AssistanceDataDialog
                open={rawDataDialog.open}
                title={rawDataDialog.title}
                data={rawDataDialog.data}
                presentation={rawDataDialog.presentation ?? 'auto'}
                volunteerFallback={assistanceVolunteerFallback}
                onClose={() => setRawDataDialog((d) => ({ ...d, open: false }))}
            />
            <Footer />
        </div>
    )
}
