import React, { useEffect } from 'react'
import MotherAccordionForm from '../../organisms/motherAccordionForm/MotherAccordionForm';
import { PageHeader } from '../../common/PageHeader';
import { Box, Button } from '@mui/material';
import AltaBebeMadreExistente from '../../organisms/motherAccordionForm/AltaBebeMadreExistente';

const listAccordion = [
    'Datos de la madre',
];

const VIOLET = '#7A659B';

const MotherTemplate = ({ model, setModel, localities, estadosCiviles, submitMother, submitConset, error, setError, mothers, submitAlta, typeForm, edit, fieldErrors, setFieldErrors, babyFieldErrors, motherStepDone, openSection, setOpenSection, profileBabyExtras, setEditForm, onRegistrarBebeMadreExistente, iniciarConMadreExistente = false }) => {
    const [listLocalities, setListLocalities] = React.useState(null)
    const [madreExistente, setMadreExistente] = React.useState(iniciarConMadreExistente)
    const [listMothers, setListMothers] = React.useState(null);

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
            {typeForm === "ALTA" && <PageHeader title={madreExistente ? 'Nuevo bebé' : 'Nueva madre'} />}

            {typeForm === "ALTA" && onRegistrarBebeMadreExistente && (
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, px: 2.5, pt: 2 }}>
                    {[[false, 'Madre nueva'], [true, 'Madre ya registrada']].map(([valor, label]) => (
                        <Button
                            key={label}
                            variant={madreExistente === valor ? 'contained' : 'outlined'}
                            onClick={() => setMadreExistente(valor)}
                            sx={{
                                textTransform: 'none', minHeight: 44, borderRadius: '10px', fontWeight: 600,
                                ...(madreExistente === valor
                                    ? { bgcolor: VIOLET, '&:hover': { bgcolor: '#6A549A' } }
                                    : { borderColor: VIOLET, color: VIOLET }),
                            }}
                        >
                            {label}
                        </Button>
                    ))}
                </Box>
            )}

            {typeForm === "ALTA" && madreExistente ? (
                <div style={{ paddingTop: '20px' }}>
                    <AltaBebeMadreExistente
                        madres={mothers}
                        listLocalities={listLocalities}
                        salaOptions={profileBabyExtras?.babySalasOptions ?? null}
                        onRegistrar={onRegistrarBebeMadreExistente}
                    />
                </div>
            ) : (
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
                    listEstadosCiviles={estadosCiviles ?? null}

                    listMothers={listMothers}

                    submitAlta={submitAlta}
                    babyFieldErrors={babyFieldErrors}
                    motherStepDone={motherStepDone}
                    openSection={openSection}
                    setOpenSection={setOpenSection}

                    expandedMother={typeForm === 'ALTA'}
                    editForm={edit}
                    typeForm={typeForm}
                    fieldErrors={fieldErrors}
                    setFieldErrors={setFieldErrors}
                    profileBabyExtras={profileBabyExtras}
                    setEditForm={setEditForm}
                />
            </div>
            )}
        </>
    )
}


export default MotherTemplate