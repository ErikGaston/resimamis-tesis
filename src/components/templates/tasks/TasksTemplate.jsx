import React, { useEffect } from 'react'
import { Box, IconButton, Tab, Tabs, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TuneIcon from '@mui/icons-material/Tune';
import { PageHeader } from '../../common/PageHeader';
import ActivityTask from '../../organisms/activityTask/ActivityTask';
import AssignmentTask from '../../organisms/assignmentTask/AssignmentTask';
import AssignedList from '../../organisms/assignedList/AssignedList';
import InformationHug from '../../organisms/informationHug/InformationHug';
import { APP_SCROLL_BOTTOM_PADDING } from '../../../helpers/const/appLayout';

const TasksTemplate = (props) => {
    const { model, setModel, assignmentVolunteer, valueTask,
        changeTask, submitAssistence, submitAssistanceSalida, checkAssistance, salidaRegistrada, volunteersFree, listBabysFree, selectVolunteersFree, selectedVolunteerIds, toggleVolunteerSelection,
        selectAllBabysFree, selectedBabyTareaIds, toggleBabyTareaSelection, submitAssignmentTask,
        listAssignment,
        submitStartHug, submitEndHug,
        changeStateInsumo, stateInsumo, setStateInsumo,
        supplies, submitChangeSupplies,
        changeInformationHug, setChangeInformationHug,
        changeAssignedList, setChangeAssignedList,
        onShowAssistanceToday,
        onShowAssistanceHistoricas,
        onAssignmentDetail,
        submitAssignmentQuick,
        canAccessAssignment = false,
    } = props;
    const navigate = useNavigate();
    const [listAssignmentVolunteer, setListAssignmentVolunteer] = React.useState(null)
    const [listVolunteersFree, setListVolunteersFree] = React.useState(null)
    const [listAssignedVolunteer, setListAssignedVolunteer] = React.useState(null)
    const [listSupplies, setListSupplies] = React.useState(null)
    const [selectedHug, setSelectedHug] = React.useState(null)

    const editHug = (hug) => {
        setSelectedHug(hug)
        setChangeInformationHug(true)
    }

    useEffect(() => {
        if (assignmentVolunteer) {
            setListAssignmentVolunteer(assignmentVolunteer);
        } else {
            setListAssignmentVolunteer(null);
        }
    }, [assignmentVolunteer]);

    useEffect(() => {
        if (volunteersFree) {
            setListVolunteersFree(volunteersFree);
        }
    }, [volunteersFree]);

    useEffect(() => {
        if (listAssignment) {
            setListAssignedVolunteer(listAssignment);
        }
    }, [listAssignment]);

    useEffect(() => {
        if (supplies) {
            setListSupplies(supplies.map((item) => ({ ...item, cantidad: 0 })));
        }
    }, [supplies]);

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <PageHeader
                title="Tareas"
                rightAction={
                    canAccessAssignment ? (
                        <Tooltip title="Administración">
                            <IconButton
                                onClick={() => navigate('/coordinacion')}
                                aria-label="Ir a administración"
                                sx={{ color: '#fff', width: 48, height: 48 }}
                            >
                                <TuneIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    ) : null
                }
            />
            <Box sx={{ bgcolor: '#F3E5F5', flexShrink: 0 }}>
                <Tabs
                    value={valueTask - 1}
                    onChange={(_, v) => changeTask(v + 1)()}
                    variant="fullWidth"
                    sx={{
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 600,
                            color: '#6A1B9A',
                            minHeight: 44,
                            fontSize: '0.95rem',
                        },
                        '& .Mui-selected': { color: '#8F00FF' },
                        '& .MuiTabs-indicator': { backgroundColor: '#8F00FF', height: 3 },
                    }}
                >
                    <Tab label="Actividades" />
                    {canAccessAssignment && <Tab label="Asignaciones" />}
                </Tabs>
            </Box>

            <Box sx={{ flex: 1, overflowY: 'auto', pb: APP_SCROLL_BOTTOM_PADDING }}>
                {valueTask === 1 &&
                    <ActivityTask
                        submitAssistence={submitAssistence}
                        submitAssistanceSalida={submitAssistanceSalida}
                        check={checkAssistance}
                        salidaRegistrada={salidaRegistrada}
                        listAssignmentVolunteer={listAssignmentVolunteer}
                        editHug={editHug}

                        submitStartHug={submitStartHug}
                        onShowAssistanceToday={onShowAssistanceToday}
                        onShowAssistanceHistoricas={onShowAssistanceHistoricas}
                        onAssignmentDetail={onAssignmentDetail}
                    />
                }
                {canAccessAssignment && valueTask === 2 &&
                    ((listAssignedVolunteer && changeAssignedList) ?
                        <AssignedList
                            listAssignedVolunteer={listAssignedVolunteer}
                            setChangeAssignedList={setChangeAssignedList}
                            submitStartHug={submitStartHug}
                        />
                        :
                        <AssignmentTask
                            listVolunteersFree={listVolunteersFree}
                            selectedVolunteerIds={selectedVolunteerIds}
                            toggleVolunteerSelection={toggleVolunteerSelection}
                            selectVolunteersFree={selectVolunteersFree}
                            listBabysFree={listBabysFree}
                            selectedBabyTareaIds={selectedBabyTareaIds}
                            toggleBabyTareaSelection={toggleBabyTareaSelection}
                            selectAllBabysFree={selectAllBabysFree}
                            submitAssignmentTask={submitAssignmentTask}
                            submitAssignmentQuick={submitAssignmentQuick}

                            existAssigned={listAssignedVolunteer}
                            setChangeAssignedList={setChangeAssignedList}
                        />
                    )
                }
            </Box>

            <InformationHug
                open={changeInformationHug}
                onClose={() => setChangeInformationHug(false)}
                model={model}
                setModel={setModel}
                submitEndHug={submitEndHug}
                hug={selectedHug}
                stateInsumo={stateInsumo}
                setStateInsumo={setStateInsumo}
                changeStateInsumo={changeStateInsumo}
                listSupplies={listSupplies}
                setListSupplies={setListSupplies}
                submitChangeSupplies={submitChangeSupplies}
            />
        </Box>
    )
}

export default TasksTemplate;
