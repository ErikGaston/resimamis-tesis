import React, { useEffect } from 'react'
import VolunteerForm from '../../molecules/volunteerForm/VolunteerForm';
import { PageHeader } from '../../common/PageHeader';

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

const VolunteerTemplate = ({ model, setModel, localities, submitVolunteer, error, setError, fieldErrors, setFieldErrors }) => {
    const [listLocalities, setListLocalities] = React.useState(null)
    const [listMothers, setListMothers] = React.useState(null)

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
            <PageHeader title="Nueva voluntaria" />
            <div style={{ padding: '20px 20px 75px 20px', }}>
                <VolunteerForm
                    model={model}
                    setModel={setModel}
                    error={error}
                    setError={setError}
                    fieldErrors={fieldErrors}
                    setFieldErrors={setFieldErrors}
                    listTurnos={listTurnos}
                    submitVolunteer={submitVolunteer}
                />
            </div>
        </div>
    )
}


export default VolunteerTemplate