import React from 'react'
import CardAssigned from '../../molecules/cardAssigned/CardAssigned';
import styled from '@emotion/styled';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AssignedList = (props) => {
    const { listAssignedVolunteer,setChangeAssignedList } = props;

    const functionBack = () => {
        setChangeAssignedList(false);
    }

    return (
        <div style={{ padding: '30px 20px' }}>
            <div style={{ display: 'flex' }}>
                <IconButton onClick={functionBack}>
                    <ArrowBackIcon style={{ color: '#8F00FF' }} />
                </IconButton>
                <Title style={{ width: '85%' }}>
                    Asignación del dia
                </Title>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px' }}>
                {listAssignedVolunteer?.map((item) => (
                    <CardAssigned
                        name={item.nombreBebe}
                        hall={item.sala}
                        volunteer={item.nombreVoluntaria}
                    />
                ))}
            </div>
        </div>

    )
}

export default AssignedList;

const Title = styled('h3')`
    color: #152C70;
    font-family: Roboto;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 0.8px;
    text-align:center;
`;