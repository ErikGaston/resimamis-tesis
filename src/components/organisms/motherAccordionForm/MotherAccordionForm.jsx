import React, { useState } from 'react'
import AccordionCustomized from '../../atoms/accordionCustomized/AccordionCustomized'
import styled from '@emotion/styled'
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import AddIcon from '@mui/icons-material/Add';
import MotherForm from '../../molecules/motherForm/MotherForm';
import BabyForm from '../../molecules/motherForm/BabyForm';
import { Box, Button } from '@mui/material';
import { normalizeBabyApiPayload } from '../../../utils/babyPayload';

const GRADIENT = 'linear-gradient(90deg, #7F00FF 0%, #E100FF 100%)';

const btnSave = {
    textTransform: 'none',
    fontWeight: 700,
    fontSize: '1rem',
    minHeight: 44,
    borderRadius: '10px',
    background: GRADIENT,
    boxShadow: '0 4px 14px rgba(127,0,255,0.28)',
    color: '#fff',
};

const btnCancel = {
    textTransform: 'none',
    fontWeight: 600,
    minHeight: 44,
    borderRadius: '10px',
    borderColor: 'rgba(21,44,112,0.25)',
    color: '#152C70',
};

const btnEdit = {
    textTransform: 'none',
    fontWeight: 600,
    minHeight: 44,
    borderRadius: '10px',
    background: GRADIENT,
    boxShadow: '0 4px 14px rgba(127,0,255,0.18)',
    color: '#fff',
};

const listAccordion = [
    'Datos de la madre',
];

const MotherAccordionForm = (props) => {
    const {
        model,
        setModel,
        listLocalities,
        listEstadosCiviles,
        submitMother,
        error,
        setError,
        listMothers,
        submitAlta,
        expandedMother = false,
        editForm,
        setEditForm,
        typeForm,
        fieldErrors,
        setFieldErrors,
        babyFieldErrors = [],
        motherStepDone = false,
        openSection,
        setOpenSection,
        profileBabyExtras,
    } = props;

    const isAlta = typeForm === 'ALTA';
    const sectionProps = (key) => (isAlta && setOpenSection
        ? {
            expanded: openSection === key,
            onExpandedChange: (isOpen) => setOpenSection(isOpen ? key : null),
        }
        : {});

    const [editingBabyIndex, setEditingBabyIndex] = useState(null);

    const madreNombreCompleto = [model?.nombre, model?.apellido].filter(Boolean).join(' ').trim();
    // En un alta vacía "Sin nombre" se lee como un error; hasta que haya nombre
    // el título va solo.
    const tituloMadre = madreNombreCompleto
        ? `Datos de la madre: ${madreNombreCompleto}`
        : 'Datos de la madre';

    const handleSaveBaby = (index) => {
        const row = model?.bebe?.[index];
        if (!row || !profileBabyExtras?.onPutBaby) return;
        const payload = normalizeBabyApiPayload(row, model?.idMadre);
        profileBabyExtras.onPutBaby(payload);
        setEditingBabyIndex(null);
    };

    const handleCancelBabyEdits = () => {
        setEditingBabyIndex(null);
        if (typeof profileBabyExtras?.onReloadMother === 'function') {
            profileBabyExtras.onReloadMother();
        }
    };

    return (
        <div style={{ paddingBottom: '60px' }}>
            {listAccordion?.map((item, index) => (
                <AccordionCustomized
                    key={item}
                    item={item}
                    defaultExpanded={index === 0 && expandedMother}
                    {...sectionProps('madre')}
                    expandIcon={<ExpandCircleDownIcon style={{ color: '#8F00FF' }} />}
                    summary={
                        <TitleAccordion>
                            {index === 0 ? tituloMadre : item}
                        </TitleAccordion>}
                    details={
                        <>
                            {index === 0 &&
                                <>
                                    <MotherForm
                                        model={model}
                                        setModel={setModel}
                                        listLocalities={listLocalities}
                                        listEstadosCiviles={listEstadosCiviles}
                                        editForm={editForm}
                                        typeForm={typeForm}
                                        fieldErrors={fieldErrors}
                                        setFieldErrors={setFieldErrors}
                                    />

                                    {typeForm === "ALTA" && (
                                        <Box sx={{ mt: 2 }}>
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                onClick={submitMother}
                                                sx={btnSave}
                                            >
                                                Guardar madre y continuar
                                            </Button>
                                            <HelperText>
                                                {motherStepDone
                                                    ? 'Datos guardados en este dispositivo. El alta se registra cuando completes el bebé.'
                                                    : 'Guarda lo cargado y sigue con la ficha del bebé. La madre y el bebé se registran juntos al final.'}
                                            </HelperText>
                                        </Box>
                                    )}

                                    {typeForm === "EDITAR" && setEditForm && (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                                            {!editForm ? (
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    onClick={() => setEditForm(true)}
                                                    sx={btnEdit}
                                                >
                                                    Editar madre
                                                </Button>
                                            ) : (
                                                <>
                                                    <Button
                                                        variant="contained"
                                                        fullWidth
                                                        onClick={submitMother}
                                                        sx={btnSave}
                                                    >
                                                        Guardar cambios
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        fullWidth
                                                        onClick={() => setEditForm(false)}
                                                        sx={btnCancel}
                                                    >
                                                        Cancelar
                                                    </Button>
                                                </>
                                            )}
                                        </Box>
                                    )}
                                </>
                            }
                        </>
                    }
                />
            ))}

            {isAlta && submitAlta &&
                (model?.bebe ?? [{}]).map((_, babyIdx) => {
                    const totalBebes = (model?.bebe ?? [{}]).length;
                    const babyTitle = totalBebes > 1 ? `Bebé ${babyIdx + 1}` : 'Datos del bebé';
                    return (
                        <div key={`alta-bebe-${babyIdx}`} id={`alta-bebe-${babyIdx}`}>
                            <AccordionCustomized
                                item={`alta-bebe-${babyIdx}`}
                                {...sectionProps(`bebe-${babyIdx}`)}
                                expandIcon={<ExpandCircleDownIcon style={{ color: '#8F00FF' }} />}
                                summary={<TitleAccordion>{babyTitle}</TitleAccordion>}
                                details={
                                    <BabyForm
                                        model={model?.bebe?.[babyIdx] ?? {}}
                                        setModel={(nextBaby) => {
                                            setModel((m) => {
                                                const prev = m?.bebe ?? [];
                                                const next = [...prev];
                                                while (next.length <= babyIdx) next.push({});
                                                next[babyIdx] = { ...(next[babyIdx] ?? {}), ...nextBaby };
                                                return { ...m, bebe: next };
                                            });
                                        }}
                                        listLocalities={listLocalities}
                                        listMothers={null}
                                        madreFija
                                        madreDisplayName={madreNombreCompleto}
                                        fieldErrors={babyFieldErrors[babyIdx] ?? {}}
                                        salaOptions={profileBabyExtras?.babySalasOptions ?? null}
                                    />
                                }
                            />
                        </div>
                    );
                })}

            {isAlta && submitAlta && (
                <>
                    <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<AddIcon />}
                        onClick={() => setModel((m) => ({ ...m, bebe: [...(m?.bebe ?? [{}]), {}] }))}
                        sx={{
                            mt: 1,
                            textTransform: 'none',
                            borderRadius: '10px',
                            borderColor: 'rgba(127,0,255,0.35)',
                            color: '#7A659B',
                            fontWeight: 600,
                            minHeight: 44,
                        }}
                    >
                        + Agregar otro bebé
                    </Button>

                    <Box sx={{ mt: 2.5 }}>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={submitAlta}
                            sx={btnSave}
                        >
                            Finalizar alta
                        </Button>
                        <HelperText>
                            Registra la madre y su bebé en una sola operación. No se guarda uno sin el otro.
                        </HelperText>
                    </Box>
                </>
            )}

            {typeForm !== 'ALTA' && model?.bebe?.map((item, index) => {
                const panelId = `bebe-${item?.id ?? item?.idBebe ?? index}`;
                const bebeNombreCompleto = [item?.nombre, item?.apellido].filter(Boolean).join(' ').trim();
                const tituloBebe = bebeNombreCompleto ? `Datos del bebé: ${bebeNombreCompleto}` : 'Datos del bebé';
                const isEditingThisBaby = editingBabyIndex === index;
                const canEditBaby = typeForm === 'EDITAR' && isEditingThisBaby && profileBabyExtras?.onPutBaby;
                const readOnlyBaby = !canEditBaby;

                return (
                    <AccordionCustomized
                        key={panelId}
                        item={panelId}
                        expandIcon={<ExpandCircleDownIcon style={{ color: '#8F00FF' }} />}
                        summary={
                            <TitleAccordion>
                                {tituloBebe}
                            </TitleAccordion>}
                        details={
                            <>
                                <BabyForm
                                    model={item}
                                    setModel={(nextBaby) => {
                                        if (readOnlyBaby) return;
                                        setModel((m) => ({
                                            ...m,
                                            bebe: (m?.bebe ?? []).map((b, i) =>
                                                i === index ? { ...b, ...nextBaby } : b,
                                            ),
                                        }));
                                    }}
                                    listLocalities={listLocalities}
                                    listMothers={readOnlyBaby ? null : listMothers}
                                    readOnly={readOnlyBaby}
                                    madreDisplayName={madreNombreCompleto}
                                    salaOptions={profileBabyExtras?.babySalasOptions ?? null}
                                />

                                {typeForm === 'EDITAR' && profileBabyExtras?.onPutBaby && (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                                        {!isEditingThisBaby ? (
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                onClick={() => setEditingBabyIndex(index)}
                                                sx={btnEdit}
                                            >
                                                Editar bebé
                                            </Button>
                                        ) : (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    onClick={() => handleSaveBaby(index)}
                                                    sx={btnSave}
                                                >
                                                    Guardar bebé
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    fullWidth
                                                    onClick={handleCancelBabyEdits}
                                                    sx={btnCancel}
                                                >
                                                    Descartar cambios
                                                </Button>
                                            </>
                                        )}
                                    </Box>
                                )}
                            </>
                        }
                    />
                );
            })}
        </div >
    )
}

export default MotherAccordionForm;

const HelperText = styled('p')`
    margin: 8px 2px 0;
    color: rgba(21, 44, 112, 0.55);
    font-family: Roboto;
    font-size: 12px;
    line-height: 1.45;
`;

const TitleAccordion = styled('span')`
    color: #152C70;
    font-family: Roboto;
    font-size: 19px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 0.8px;
`;
