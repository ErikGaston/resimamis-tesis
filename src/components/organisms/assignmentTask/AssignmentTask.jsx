import styled from '@emotion/styled';
import React from 'react'
import { Button, Typography, FormControl, InputLabel, MenuItem, Select, Box } from '@mui/material'
import ButtonTextCheck from '../../molecules/buttonTextCheck/ButtonTextCheck';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ButtonCustomized from '../../atoms/button/ButtonCustomized';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
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

    const seeAssignedList = () => {
        setChangeAssignedList(true);
    }

    const runQuickAssign = () => {
        if (typeof submitAssignmentQuick !== 'function') return;
        if (quickVolId === '' || quickTareaId === '') return;
        submitAssignmentQuick({ idVoluntaria: Number(quickVolId), idTarea: Number(quickTareaId) });
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

    return (
        <div style={{ padding: '30px 20px' }}>
            <Title>Voluntarias presentes</Title>
            {hasVolunteers ? (
                <>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {listVolunteersFree?.map((item) => {
                            const id = item.idVoluntaria;
                            const checked = id != null && selectedVolunteerIds.includes(id);
                            return (
                                <ButtonTextCheck
                                    key={id ?? `${item.nombre}-${item.apellido}`}
                                    check={checked}
                                    onClick={() => toggleVolunteerSelection(id)}
                                >
                                    {item.nombre + " " + item.apellido}
                                </ButtonTextCheck>
                            );
                        })}
                    </div>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                        <Button style={{ textTransform: 'inherit' }} onClick={selectVolunteersFree}>
                            <TitleButton>Seleccionar todas las voluntarias</TitleButton>
                            <CheckCircleIcon style={{ color: allVolSelected ? '#8F00FF' : '#CECECE', marginLeft: '10px' }} />
                        </Button>
                    </div>
                </>
            ) : (
                <StyledSectionEmpty style={{ marginBottom: '24px' }}>
                    No se encontraron voluntarias con asistencia registrada en este momento.
                </StyledSectionEmpty>
            )}

            <Title>Bebés disponibles para abrazar</Title>
            {hasBabys ? (
                <>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
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
                    </div>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                        <Button style={{ textTransform: 'inherit' }} onClick={selectAllBabysFree}>
                            <TitleButton>Seleccionar todos los bebés</TitleButton>
                            <CheckCircleIcon style={{ color: allBabysSelected ? '#8F00FF' : '#CECECE', marginLeft: '10px' }} />
                        </Button>
                    </div>
                </>
            ) : (
                <StyledSectionEmpty style={{ marginBottom: '24px' }}>
                    No hay bebés disponibles para abrazar en este momento.
                </StyledSectionEmpty>
            )}

            {existAssigned && (
                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button style={{ textTransform: 'inherit' }} onClick={seeAssignedList}>
                        <TitleButton>Ver última asignación</TitleButton>
                        <RemoveRedEyeIcon style={{ color: '#8F00FF', marginLeft: '10px' }} />
                    </Button>
                </div>
            )}

            {typeof submitAssignmentQuick === 'function' && (
                <Box sx={{ mt: 3, p: 2, borderRadius: 2, border: '1px solid rgba(143, 0, 255, 0.25)', bgcolor: 'rgba(243, 229, 245, 0.5)' }}>
                    <Title style={{ marginBottom: 16 }}>Asignación rápida (una voluntaria y un bebé)</Title>
                    <Typography sx={{ fontSize: 14, color: 'rgba(21, 44, 112, 0.8)', mb: 2 }}>
                        Usa el endpoint <strong>generarTarea</strong> sin pasar por la selección múltiple de abajo.
                    </Typography>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
                        <ButtonCustomized
                            variant={'container'}
                            colorText={'#FFF'}
                            sx={{
                                fontSize: '15px',
                                background: 'linear-gradient(90deg, #7F00FF 0%, #E100FF 100%)',
                                boxShadow: '2px 3px 4px 0px rgba(0, 0, 0, 0.2)',
                            }}
                            onClick={runQuickAssign}
                            disabled={quickVolId === '' || quickTareaId === ''}
                        >
                            Generar esta asignación
                        </ButtonCustomized>
                    </div>
                </Box>
            )}

            <div style={{ textAlign: 'center', marginTop: '32px' }}>
                <ButtonCustomized
                    variant={'container'}
                    colorText={'#FFF'}
                    sx={{
                        fontSize: '16px',
                        background: 'linear-gradient(90deg, #7F00FF 0%, #E100FF 100%)',
                        boxShadow: '3px 4px 4px 0px rgba(0, 0, 0, 0.25)'
                    }}
                    onClick={submitAssignmentTask}
                    disabled={!canSubmit}
                >
                    GENERAR ASIGNACIONES
                </ButtonCustomized>
            </div>
        </div>
    )
}

export default AssignmentTask;

const Title = styled('h3')`
    color: #152C70;
    font-family: Roboto;
    font-size: 16px;
    font-weight: 600;
    line-height: normal;
    letter-spacing: 0.8px;
    margin: 0 0 12px 0;
`;

const TitleButton = styled('h3')`
    color: #8F00FF;
    font-family: Roboto;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 0.8px;
    margin: 0;
`;

const StyledSectionEmpty = styled(Typography)`
    color: #152c70;
    font-family: Roboto;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 1.4;
    letter-spacing: 0.5px;
    padding: 12px 0;
`;
