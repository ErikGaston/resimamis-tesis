import styled from '@emotion/styled';
import React from 'react'
import {
    Button, Typography, FormControl, InputLabel, MenuItem, Select, Box,
    Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Divider,
} from '@mui/material'
import ButtonTextCheck from '../../molecules/buttonTextCheck/ButtonTextCheck';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ButtonCustomized from '../../atoms/button/ButtonCustomized';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import CloseIcon from '@mui/icons-material/Close';
import { resolveIdTareaForGenerarTareas, babyRowKey } from '../../../utils/assignmentSelection';

const AssignmentTask = ({
    listVolunteersFree,
    selectedVolunteerIds = [],
    toggleVolunteerSelection,
    selectVolunteersFree,
    listBabysFree = [],
    selectedBabyTareaIds = [],
    toggleBabyTareaSelection,
    selectAllBabysFree,
    submitAssignmentTask,
    existAssigned,
    setChangeAssignedList,
    submitAssignmentQuick,
}) => {
    const [quickVolId, setQuickVolId] = React.useState('');
    const [quickTareaId, setQuickTareaId] = React.useState('');
    const [quickOpen, setQuickOpen] = React.useState(false);

    const openQuick = () => setQuickOpen(true);
    const closeQuick = () => {
        setQuickOpen(false);
        setQuickVolId('');
        setQuickTareaId('');
    };

    const runQuickAssign = () => {
        if (typeof submitAssignmentQuick !== 'function') return;
        if (quickVolId === '' || quickTareaId === '') return;
        submitAssignmentQuick({ idVoluntaria: Number(quickVolId), idTarea: Number(quickTareaId) });
        closeQuick();
    };

    const volIds = listVolunteersFree?.map((v) => v.idVoluntaria).filter((id) => id != null) ?? [];
    const allVolSelected = volIds.length > 0 && volIds.every((id) => selectedVolunteerIds.includes(id));

    const babyTareaIds = listBabysFree
        .map((b) => resolveIdTareaForGenerarTareas(b))
        .filter((id) => id != null);
    const allBabysSelected =
        babyTareaIds.length > 0 && babyTareaIds.every((id) => selectedBabyTareaIds.includes(id));

    const hasVolunteerSelection = selectedVolunteerIds.length > 0;
    const hasBabySelection = selectedBabyTareaIds.length > 0;
    const canSubmit = hasVolunteerSelection && hasBabySelection;

    const hasVolunteers = listVolunteersFree && listVolunteersFree.length > 0;
    const hasBabys = listBabysFree && listBabysFree.length > 0;

    const submitLabel = canSubmit
        ? `GENERAR ASIGNACIONES · ${selectedVolunteerIds.length}V – ${selectedBabyTareaIds.length}B`
        : 'GENERAR ASIGNACIONES';

    return (
        <Box sx={{ p: '20px 16px 12px' }}>

            {/* ── Voluntarias presentes ── */}
            <SectionTitle>Voluntarias presentes</SectionTitle>
            {hasVolunteers ? (
                <>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        {listVolunteersFree?.map((item) => {
                            const id = item.idVoluntaria;
                            const checked = id != null && selectedVolunteerIds.includes(id);
                            return (
                                <ButtonTextCheck
                                    key={id ?? `${item.nombre}-${item.apellido}`}
                                    check={checked}
                                    onClick={() => toggleVolunteerSelection(id)}
                                >
                                    {item.nombre + ' ' + item.apellido}
                                </ButtonTextCheck>
                            );
                        })}
                    </Box>
                    <SelectAllRow>
                        <Button sx={{ textTransform: 'inherit', py: '3px' }} onClick={selectVolunteersFree}>
                            <TitleButton>Seleccionar todas</TitleButton>
                            <CheckCircleIcon sx={{ color: allVolSelected ? '#8F00FF' : '#CECECE', ml: '8px', fontSize: 18 }} />
                        </Button>
                    </SelectAllRow>
                </>
            ) : (
                <EmptyText>No se encontraron voluntarias con asistencia registrada en este momento.</EmptyText>
            )}

            <Divider sx={{ my: 2 }} />

            {/* ── Bebés disponibles ── */}
            <SectionTitle>Bebés disponibles para abrazar</SectionTitle>
            {hasBabys ? (
                <>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        {listBabysFree.map((item, index) => {
                            const tareaId = resolveIdTareaForGenerarTareas(item);
                            if (tareaId == null) return null;
                            const checked = selectedBabyTareaIds.includes(tareaId);
                            const label = [item.nombre, item.apellido].filter(Boolean).join(' ').trim() || 'Bebé';
                            return (
                                <ButtonTextCheck
                                    key={babyRowKey(item, index)}
                                    check={checked}
                                    onClick={() => toggleBabyTareaSelection(tareaId)}
                                >
                                    {label}
                                </ButtonTextCheck>
                            );
                        })}
                    </Box>
                    <SelectAllRow>
                        <Button sx={{ textTransform: 'inherit', py: '3px' }} onClick={selectAllBabysFree}>
                            <TitleButton>Seleccionar todos</TitleButton>
                            <CheckCircleIcon sx={{ color: allBabysSelected ? '#8F00FF' : '#CECECE', ml: '8px', fontSize: 18 }} />
                        </Button>
                    </SelectAllRow>
                </>
            ) : (
                <EmptyText>No hay bebés disponibles para abrazar en este momento.</EmptyText>
            )}

            <Divider sx={{ mt: 2, mb: 1.5 }} />

            {/* ── Botones secundarios ── */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
                {existAssigned ? (
                    <Button sx={{ textTransform: 'inherit', py: '4px' }} onClick={() => setChangeAssignedList(true)}>
                        <TitleButton>Ver última asignación</TitleButton>
                        <RemoveRedEyeIcon sx={{ color: '#8F00FF', ml: '8px', fontSize: 18 }} />
                    </Button>
                ) : <Box />}

                {typeof submitAssignmentQuick === 'function' && (
                    <Button sx={{ textTransform: 'inherit', py: '4px' }} onClick={openQuick}>
                        <TitleButton>Asignación rápida</TitleButton>
                        <FlashOnIcon sx={{ color: '#8F00FF', ml: '8px', fontSize: 18 }} />
                    </Button>
                )}
            </Box>

            {/* ── Botón principal ── */}
            <Box sx={{ mt: 2.5, mb: 1 }}>
                <ButtonCustomized
                    variant={'container'}
                    colorText={'#FFF'}
                    sx={{
                        fontSize: '15px',
                        width: '100%',
                        background: canSubmit
                            ? 'linear-gradient(90deg, #7F00FF 0%, #E100FF 100%)'
                            : undefined,
                        boxShadow: canSubmit ? '3px 4px 4px 0px rgba(0,0,0,0.25)' : undefined,
                        letterSpacing: '0.5px',
                    }}
                    onClick={submitAssignmentTask}
                    disabled={!canSubmit}
                >
                    {submitLabel}
                </ButtonCustomized>
            </Box>

            {/* ── Dialog asignación rápida ── */}
            <Dialog open={quickOpen} onClose={closeQuick} fullWidth maxWidth="xs">
                <DialogTitle sx={{
                    color: '#152C70',
                    fontWeight: 600,
                    fontSize: '1rem',
                    pb: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    Asignación rápida
                    <IconButton onClick={closeQuick} aria-label="Cerrar" sx={{ width: 44, height: 44 }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '20px !important' }}>
                    <Typography sx={{ fontSize: '0.82rem', color: 'rgba(21,44,112,0.7)', mt: 0.5 }}>
                        Asigná una sola voluntaria a un bebé sin pasar por la selección múltiple.
                    </Typography>

                    <FormControl fullWidth size="small">
                        <InputLabel id="quick-vol-label">Voluntaria</InputLabel>
                        <Select
                            labelId="quick-vol-label"
                            label="Voluntaria"
                            value={quickVolId}
                            onChange={(e) => setQuickVolId(e.target.value)}
                        >
                            {(listVolunteersFree ?? []).map((v) => {
                                const id = v.idVoluntaria;
                                if (id == null) return null;
                                return (
                                    <MenuItem key={id} value={String(id)}>
                                        {[v.nombre, v.apellido].filter(Boolean).join(' ') || `Voluntaria #${id}`}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth size="small">
                        <InputLabel id="quick-baby-label">Bebé / tarea</InputLabel>
                        <Select
                            labelId="quick-baby-label"
                            label="Bebé / tarea"
                            value={quickTareaId}
                            onChange={(e) => setQuickTareaId(e.target.value)}
                        >
                            {listBabysFree.map((item, index) => {
                                const tid = resolveIdTareaForGenerarTareas(item);
                                if (tid == null) return null;
                                const label = [item.nombre, item.apellido].filter(Boolean).join(' ').trim() || `Tarea #${tid}`;
                                return (
                                    <MenuItem key={babyRowKey(item, index)} value={String(tid)}>
                                        {label}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2.5, pt: 0.5, gap: 1 }}>
                    <Button
                        onClick={closeQuick}
                        sx={{ textTransform: 'none', color: '#666', fontWeight: 400 }}
                    >
                        Cancelar
                    </Button>
                    <ButtonCustomized
                        variant={'container'}
                        colorText={'#FFF'}
                        sx={{
                            fontSize: '14px',
                            background: 'linear-gradient(90deg, #7F00FF 0%, #E100FF 100%)',
                            boxShadow: '2px 3px 4px 0px rgba(0,0,0,0.2)',
                        }}
                        onClick={runQuickAssign}
                        disabled={quickVolId === '' || quickTareaId === ''}
                    >
                        Generar
                    </ButtonCustomized>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AssignmentTask;

const SectionTitle = styled('h3')`
    color: #152C70;
    font-family: Roboto;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.5px;
    margin: 0 0 10px 0;
`;

const TitleButton = styled('h3')`
    color: #8F00FF;
    font-family: Roboto;
    font-size: 13px;
    font-weight: 400;
    letter-spacing: 0.6px;
    margin: 0;
`;

const SelectAllRow = styled('div')`
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 4px;
`;

const EmptyText = styled(Typography)`
    color: rgba(21, 44, 112, 0.6);
    font-family: Roboto;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 0 4px;
`;
