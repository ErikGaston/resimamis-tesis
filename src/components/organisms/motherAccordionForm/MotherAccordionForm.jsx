import React, { useState } from 'react'
import AccordionCustomized from '../../atoms/accordionCustomized/AccordionCustomized'
import styled from '@emotion/styled'
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import MotherForm from '../../molecules/motherForm/MotherForm';
import ButtonCustomized from '../../atoms/button/ButtonCustomized';
import BabyForm from '../../molecules/motherForm/BabyForm';
import { Box, TextField, Typography, Button } from '@mui/material';
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
        editForm,
        typeForm,
        fieldErrors,
        setFieldErrors,
        profileBabyExtras,
    } = props;

    const [babyEditIdx, setBabyEditIdx] = useState(null);

    const madreNombreCompleto = [model?.nombre, model?.apellido].filter(Boolean).join(' ').trim();

    const handleSaveBaby = (index) => {
        const row = model?.bebe?.[index];
        if (!row || !profileBabyExtras?.onPutBaby) return;
        const payload = normalizeBabyApiPayload(row, model?.idMadre);
        profileBabyExtras.onPutBaby(payload);
        setBabyEditIdx(null);
    };

    return (
        <div style={{ paddingBottom: '60px' }}>
            {profileBabyExtras?.dniLookup && typeForm === 'EDITAR' && (
                <Box sx={{ px: 1, pb: 2 }}>
                    <Typography sx={{ color: '#152C70', fontWeight: 600, mb: 1, fontSize: '0.95rem' }}>
                        Consultar bebé por DNI
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                        <TextField
                            size="small"
                            label="DNI"
                            value={profileBabyExtras.dniLookup.value}
                            onChange={(e) => profileBabyExtras.dniLookup.setValue(e.target.value.replace(/\D/g, ''))}
                            sx={{ minWidth: 160 }}
                        />
                        <Button variant="contained" onClick={profileBabyExtras.dniLookup.onSearch} sx={{ textTransform: 'none' }}>
                            Buscar
                        </Button>
                        {profileBabyExtras.dniLookup.result != null && (
                            <Button variant="text" onClick={profileBabyExtras.dniLookup.onClear} sx={{ textTransform: 'none' }}>
                                Limpiar
                            </Button>
                        )}
                    </Box>
                    {profileBabyExtras.dniLookup.result != null && (
                        <Box
                            component="pre"
                            sx={{
                                mt: 1,
                                p: 1,
                                bgcolor: 'rgba(143,0,255,0.06)',
                                borderRadius: 1,
                                fontSize: 12,
                                overflow: 'auto',
                                maxHeight: 200,
                            }}
                        >
                            {JSON.stringify(profileBabyExtras.dniLookup.result, null, 2)}
                        </Box>
                    )}
                </Box>
            )}

            {listAccordion?.map((item, index) => (
                <AccordionCustomized
                    key={item}
                    item={item}
                    expandIcon={<ExpandCircleDownIcon style={{ color: '#8F00FF' }} />}
                    summary={
                        <TitleAccordion>
                            {item}
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

            {model?.bebe?.map((item, index) => {
                const panelId = `bebe-${item?.id ?? item?.idBebe ?? index}`;
                const tituloBebe = `Datos del bebé: ${[item?.nombre, item?.apellido].filter(Boolean).join(' ').trim() || 'Sin nombre'}`;
                const isEditingBaby = babyEditIdx === index;
                const canEditBaby = typeForm === 'EDITAR' && editForm && profileBabyExtras?.onPutBaby;
                const readOnlyBaby = !canEditBaby || !isEditingBaby;

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
                                        {!isEditingBaby ? (
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => setBabyEditIdx(index)}
                                                sx={{ textTransform: 'none' }}
                                            >
                                                Editar datos del bebé
                                            </Button>
                                        ) : (
                                            <>
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
                                                    onClick={() => setBabyEditIdx(null)}
                                                    sx={{ textTransform: 'none' }}
                                                >
                                                    Cancelar
                                                </Button>
                                            </>
                                        )}
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
                                    listMothers={null}
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
