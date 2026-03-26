import React, { useEffect } from 'react'
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TitlePurple from '../../atoms/titlePurple/TitlePurple';
import MotherAccordionForm from '../../organisms/motherAccordionForm/MotherAccordionForm';

const listAccordion = [
    'Datos de la madre',
];

const MotherTemplate = ({ model, setModel, localities, submitMother, submitConset, error, setError, mothers, submitBaby, typeForm, edit }) => {
    const navigate = useNavigate();
    const [listLocalities, setListLocalities] = React.useState(null)
    const [listMothers, setListMothers] = React.useState(null)
    const [listAccordionBaby, setListAccordionBaby] = React.useState(['Datos del bebé']);

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

    useEffect(() => {
        if (mothers) {
            mothers?.forEach(item => {
                item.label = item.nombre + " " + item.apellido;
                item.value = item.idMadre;
            })
            setListMothers(mothers);
        }
    }, [mothers]);

    return (
        <>
            {typeForm === "ALTA" &&
                <div style={{ display: 'flex' }}>
                    <IconButton onClick={functionBack}>
                        <HighlightOffIcon style={{ color: '#8F00FF' }} />
                    </IconButton>
                    <TitlePurple>Formulario madre</TitlePurple>
                </div>
            }

            <div style={{ paddingTop: '20px' }}>
                <MotherAccordionForm
                    listAccordion={listAccordion}
                    model={model}
                    setModel={setModel}
                    error={error}
                    setError={setError}

                    submitMother={submitMother}
                    submitConset={submitConset}

                    listLocalities={listLocalities}

                    listMothers={listMothers}

                    submitBaby={submitBaby}

                    listAccordionBaby={listAccordionBaby}
                    expandedMother={true}
                    editForm={edit}
                    typeForm={typeForm}
                />
            </div>
        </>
    )
}


export default MotherTemplate