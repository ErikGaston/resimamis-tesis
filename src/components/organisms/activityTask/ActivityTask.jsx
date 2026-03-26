import { Button } from '@mui/material'
import React from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import styled from '@emotion/styled';
import img from '../../../assets/tasks/asistencia-abrazo.png'
import CardBabyHug from '../../molecules/cardBabyHug/CardBabyHug';
import { getIdVolunteer } from '../../../utils/localStorage';

const ActivityTask = ({ check, submitAssistence, listAssignmentVolunteer, editHug, submitStartHug }) => {
    let idVolunteer = getIdVolunteer();
    let existAssigned = listAssignmentVolunteer?.find(item => ((item.idVoluntaria === idVolunteer) && (item.fechaHoraFin === null)))

    return (
        <div style={{ padding: '30px 20px' }}>
            <Button
                style={{ textTransform: 'inherit' }}
                onClick={submitAssistence}
                disabled={check}
            >
                <Title>
                    Registrar mi asistencia
                </Title>
                <CheckCircleIcon style={{ color: check ? '#8F00FF' : '#CECECE', marginLeft: '10px' }} />
            </Button>
            <div style={{ padding: '20px 10px' }}>
                <Title>
                    Abrazos del dia
                </Title>
                {
                    check ?
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                            {listAssignmentVolunteer?.map((item) => (
                                (item.idVoluntaria === idVolunteer && item.fechaHoraFin === null) &&
                                <CardBabyHug
                                    item={item}
                                    name={item.nombreBebe}
                                    hall={item.sala}
                                    editHug={editHug}
                                    submitStartHug={submitStartHug}
                                />
                            ))}
                            {!existAssigned &&
                                <TextImage>
                                    No existen asignaciones para el dia de hoy
                                </TextImage>}
                        </div>
                        :
                        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                            <StyledImage src={img} />
                            <TextImage>
                                Marca tu asistencia para que la
                                coordinadora pueda asignarte tareas
                            </TextImage>
                        </div>
                }
            </div>
        </div>
    )
}

export default ActivityTask;

const Title = styled('h3')`
    color: #152C70;
    font-family: Roboto;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 0.8px;
`;

const StyledImage = styled('img')`
    width: 144.079px;
    height: 100px;
    flex-shrink: 0;
`;

const TextImage = styled('span')`
    color: rgba(21, 44, 112, 0.80);

    text-align: center;
    font-family: Roboto;
    font-size: 14px;
    font-style: normal;
    font-weight: 300;
    line-height: normal;
    letter-spacing: 0.7px;
    margin-top:20px;
`;