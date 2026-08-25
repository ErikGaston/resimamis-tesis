import React, { useEffect } from 'react'
import MotherAccordionForm from '../../organisms/motherAccordionForm/MotherAccordionForm';
import { PageHeader } from '../../common/PageHeader';

const listAccordion = [
    'Datos de la madre',
];

const MotherTemplate = ({ model, setModel, localities, estadosCiviles, submitMother, submitConset, error, setError, mothers, submitAlta, typeForm, edit, fieldErrors, setFieldErrors, babyFieldErrors, motherStepDone, openSection, setOpenSection, profileBabyExtras, setEditForm }) => {
    const [listLocalities, setListLocalities] = React.useState(null)
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
            {typeForm === "ALTA" && <PageHeader title="Nueva madre" />}

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
        </>
    )
}


export default MotherTemplate