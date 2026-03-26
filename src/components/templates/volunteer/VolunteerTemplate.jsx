import React, { useEffect } from 'react'
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TitlePurple from '../../atoms/titlePurple/TitlePurple';
import VolunteerForm from '../../molecules/volunteerForm/VolunteerForm';

const listTurnos = [
    {
        label: 'Mañana',
        value: 1
    },
    {
        label: 'Tarde',
        value: 2
    },
    {
        label: 'Noche',
        value: 3
    },
]

const VolunteerTemplate = ({ model, setModel, localities, submitVolunteer, error, setError, mothers }) => {
    const navigate = useNavigate();
    const [listLocalities, setListLocalities] = React.useState(null)
    const [listMothers, setListMothers] = React.useState(null)

    const functionBack = () => {
        navigate(-1)
    }

    useEffect(() => {
        if (localities) {
            localities?.forEach(item => {
                item.label = item.nombre;
                item.value = item.idLocalidad;
            })
            setListLocalities(localities);
        }
    }, [localities]);

    return (
        <div style={{ height: '100%' }}>
            <div style={{ display: 'flex' }}>
                <IconButton onClick={functionBack}>
                    <HighlightOffIcon style={{ color: '#8F00FF' }} />
                </IconButton>
                <TitlePurple>Formulario voluntaria</TitlePurple>
            </div>
            <div style={{ padding: '20px 20px 75px 20px', }}>
                <VolunteerForm
                    model={model}
                    setModel={setModel}
                    error={error}
                    setError={setError}

                    listTurnos={listTurnos}

                    submitVolunteer={submitVolunteer}
                />
            </div>
        </div>
    )
}


export default VolunteerTemplate