import styled from '@emotion/styled';
import React from 'react'
import { Button, Typography } from '@mui/material'
import ButtonTextCheck from '../../molecules/buttonTextCheck/ButtonTextCheck';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ButtonCustomized from '../../atoms/button/ButtonCustomized';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

const AssignmentTask = ({ listVolunteersFree, selectedListVolunteer, selectVolunteersFree, submitAssignmentTask, existAssigned, setChangeAssignedList }) => {

    const seeAssignedList = () => {
        setChangeAssignedList(true);
    }

    return (
        <div style={{ padding: '30px 20px' }}>
            {
                (listVolunteersFree && listVolunteersFree.length !== 0) ?
                    <>
                        <Title>
                            Elige las voluntarias
                        </Title>
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {listVolunteersFree?.map((item) => (
                                <ButtonTextCheck
                                    check={selectedListVolunteer}
                                >
                                    {item.nombre + " " + item.apellido}
                                </ButtonTextCheck>
                            ))}
                        </div>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                            <Button style={{ textTransform: 'inherit' }} onClick={selectVolunteersFree}>
                                <TitleButton>
                                    Seleccionar todas
                                </TitleButton>
                                <CheckCircleIcon style={{ color: selectedListVolunteer ? '#8F00FF' : '#CECECE', marginLeft: '10px' }} />
                            </Button>
                        </div>
                        {
                            existAssigned &&
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                                <Button style={{ textTransform: 'inherit' }} onClick={seeAssignedList}>
                                    <TitleButton>
                                        Ver última asignación
                                    </TitleButton>
                                    <RemoveRedEyeIcon style={{ color: '#8F00FF', marginLeft: '10px' }} />
                                </Button>
                            </div>
                        }

                        <div style={{ textAlign: 'center', marginTop: '40px' }}>
                            <ButtonCustomized
                                variant={'container'}
                                // colorButton={'#18A974'}
                                colorText={'#FFF'}
                                sx={{
                                    fontSize: '16px',
                                    background: 'linear-gradient(90deg, #7F00FF 0%, #E100FF 100%)',
                                    boxShadow: '3px 4px 4px 0px rgba(0, 0, 0, 0.25)'
                                }}
                                onClick={submitAssignmentTask}
                                disabled={!selectedListVolunteer}
                            >
                                ASIGNAR VOLUNTARIAS
                            </ButtonCustomized>
                        </div>
                    </>
                    :
                    <StyledVolunteerFreeEmpty>No se encontraron voluntarias con asistencia registrada en este momento.</StyledVolunteerFreeEmpty>
            }
        </div>
    )
}

export default AssignmentTask;

const Title = styled('h3')`
    color: #152C70;
    font-family: Roboto;
    font-size: 16px;
    font-weight: 600;
    line-height: normal;
    letter-spacing: 0.8px;
`;


const TitleButton = styled('h3')`
    color: #8F00FF;
    font-family: Roboto;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 0.8px;
`;

const StyledVolunteerFreeEmpty = styled(Typography)`
    color: #152c70;
    font-family: Roboto;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    letter-spacing: 1px;
    padding:25px; 
    text-align:center;
`;
