import React from 'react'
import AccordionCustomized from '../../atoms/accordionCustomized/AccordionCustomized'
import styled from '@emotion/styled'
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import MotherForm from '../../molecules/motherForm/MotherForm';
import ButtonCustomized from '../../atoms/button/ButtonCustomized';
import BabyForm from '../../molecules/motherForm/BabyForm';
import { Box, Button } from '@mui/material';
import { normalizeBabyApiPayload } from '../../../utils/babyPayload';

const MotherAccordionForm = (props) => {
    const {
        listAccordion,
        model,
        setModel,
        listLocalities,
        submitMother,
        error,
        setError,
        listMothers,
        listAccordionBaby,
        submitBaby,
        expandedMother = false,
        editForm,
        typeForm,
        fieldErrors,
        setFieldErrors,
        profileBabyExtras,
    } = props;

    const madreNombreCompleto = [model?.nombre, model?.apellido].filter(Boolean).join(' ').trim();
    const tituloMadre = `Datos de la madre: ${madreNombreCompleto || 'Sin nombre'}`;

    const handleSaveBaby = (index) => {
        const row = model?.bebe?.[index];
        if (!row || !profileBabyExtras?.onPutBaby) return;
        const payload = normalizeBabyApiPayload(row, model?.idMadre);
        profileBabyExtras.onPutBaby(payload);
    };

    const handleCancelBabyEdits = () => {
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
                                        editForm={editForm}
                                        typeForm={typeForm}
                                        fieldErrors={fieldErrors}
                                        setFieldErrors={setFieldErrors}
                                    />
                                    {typeForm === "ALTA" && <div style={{ textAlign: 'right' }}>
                                        <ButtonCustomized
                                            variant={'container'}
                                            colorText={'#FFF'}
                                            sx={{
                                                fontSize: '16px',
                                                background: 'linear-gradient(90deg, #7F00FF 0%, #E100FF 100%)',
                                                boxShadow: '3px 4px 4px 0px rgba(0, 0, 0, 0.25)'
                                            }}
                                            onClick={submitMother}
                                        >
                                            GUARDAR
                                        </ButtonCustomized>
                                    </div>
                                    }
                                </>
                            }
                        </>
                    }
                />
            ))}

            {typeForm === 'ALTA' &&
                submitBaby &&
                (listAccordionBaby ?? []).map((babyTitle, babyIdx) => (
                    <AccordionCustomized
                        key={`alta-bebe-${babyTitle}-${babyIdx}`}
                        item={babyTitle}
                        expandIcon={<ExpandCircleDownIcon style={{ color: '#8F00FF' }} />}
                        summary={<TitleAccordion>{babyTitle}</TitleAccordion>}
                        details={
                            <>
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
                                    error={error}
                                    listLocalities={listLocalities}
                                    listMothers={listMothers}
                                    salaOptions={profileBabyExtras?.babySalasOptions ?? null}
                                />
                                <div style={{ textAlign: 'right', marginTop: 12 }}>
                                    <ButtonCustomized
                                        variant={'container'}
                                        colorText={'#FFF'}
                                        sx={{
                                            fontSize: '16px',
                                            background: 'linear-gradient(90deg, #7F00FF 0%, #E100FF 100%)',
                                            boxShadow: '3px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                                        }}
                                        onClick={submitBaby}
                                    >
                                        REGISTRAR BEBÉ
                                    </ButtonCustomized>
                                </div>
                            </>
                        }
                    />
                ))}

            {model?.bebe?.map((item, index) => {
                const panelId = `bebe-${item?.id ?? item?.idBebe ?? index}`;
                const tituloBebe = `Datos del bebé: ${[item?.nombre, item?.apellido].filter(Boolean).join(' ').trim() || 'Sin nombre'}`;
                const canEditBaby = typeForm === 'EDITAR' && editForm && profileBabyExtras?.onPutBaby;
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
                                {canEditBaby && (
                                    <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            onClick={() => handleSaveBaby(index)}
                                            sx={{ textTransform: 'none' }}
                                        >
                                            Guardar en servidor
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="text"
                                            onClick={handleCancelBabyEdits}
                                            sx={{ textTransform: 'none' }}
                                        >
                                            Cancelar
                                        </Button>
                                    </Box>
                                )}
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
                            </>
                        }
                    />
                );
            })}
        </div >
    )
}

export default MotherAccordionForm;

const TitleAccordion = styled('span')`
    color: #152C70;
    font-family: Roboto;
    font-size: 19px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 0.8px;
`;
