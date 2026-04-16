import React, { useEffect } from 'react'
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Button, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TitleText from '../../atoms/titleText/TitleText';
import styled from '@emotion/styled';
import ActivityTask from '../../organisms/activityTask/ActivityTask';
import AssignmentTask from '../../organisms/assignmentTask/AssignmentTask';
import AssignedList from '../../organisms/assignedList/AssignedList';
import InformationHug from '../../organisms/informationHug/InformationHug';

const TasksTemplate = (props) => {
    const { model, setModel, assignmentVolunteer, valueTask,
        changeTask, submitAssistence, submitAssistanceSalida, checkAssistance, volunteersFree, listBabysFree, selectVolunteersFree, selectedVolunteerIds, toggleVolunteerSelection,
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
    } = props;
    const navigate = useNavigate();
    const [listAssignmentVolunteer, setListAssignmentVolunteer] = React.useState(null)
    const [listVolunteersFree, setListVolunteersFree] = React.useState(null)
    const [listAssignedVolunteer, setListAssignedVolunteer] = React.useState(null)
    const [listSupplies, setListSupplies] = React.useState(null)
    const [selectedHug, setSelectedHug] = React.useState(null)

    const functionBack = () => {
        navigate(-1)
    }

    const editHug = (hug) => {
        setSelectedHug(hug)
        setChangeInformationHug(true)
    }

    useEffect(() => {
        if (assignmentVolunteer) {
            setListAssignmentVolunteer(assignmentVolunteer);
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
            supplies?.forEach(item => {
                item.cantidad = 0;
            })
            setListSupplies(supplies);
        }
    }, [supplies]);

    return (
        <div style={{ height: '100%' }}>
            <div style={{ display: 'flex', backgroundColor: '#8F00FF' }}>
                <IconButton onClick={functionBack}>
                    <HighlightOffIcon style={{ color: 'white' }} />
                </IconButton>
                <TitleText fontsize={'20px'} style={{ width: '85%' }}>TAREAS</TitleText>
            </div>
            <div style={{ display: 'flex', marginTop: '3px' }}>
                <Button
                    onClick={changeTask(1)}
                    style={{ backgroundColor: valueTask === 1 ? '#8F00FF' : '#D094FF', width: '50%', height: '30px', textTransform: 'capitalize', borderRadius: '5px' }}
                >
                    <SubTitle>Actividades</SubTitle>
                </Button>
                <Button
                    onClick={changeTask(2)}
                    style={{ backgroundColor: valueTask === 2 ? '#8F00FF' : '#D094FF', width: '50%', height: '30px', textTransform: 'capitalize', borderRadius: '5px' }}
                >
                    <SubTitle>Asignación</SubTitle>
                </Button>
            </div>
            {valueTask === 1 &&
                (changeInformationHug ?
                    <InformationHug
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

                        setChangeInformationHug={setChangeInformationHug}
                    />
                    :
                    <ActivityTask
                        submitAssistence={submitAssistence}
                        submitAssistanceSalida={submitAssistanceSalida}
                        check={checkAssistance}
                        listAssignmentVolunteer={listAssignmentVolunteer}
                        editHug={editHug}

                        submitStartHug={submitStartHug}
                        onShowAssistanceToday={onShowAssistanceToday}
                        onShowAssistanceHistoricas={onShowAssistanceHistoricas}
                        onAssignmentDetail={onAssignmentDetail}
                    />)
            }
            {valueTask === 2 &&
                ((listAssignedVolunteer && changeAssignedList) ?
                    <AssignedList
                        listAssignedVolunteer={listAssignedVolunteer}
                        setChangeAssignedList={setChangeAssignedList}
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
        </div>
    )
}


export default TasksTemplate;

const SubTitle = styled('h3')`
    color: #FFF;
    text-align: center;
    font-family: Roboto;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 0.9px;
`;