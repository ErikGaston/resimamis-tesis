import React, { useState } from 'react';
import CardAssigned from '../../molecules/cardAssigned/CardAssigned';
import {
    Box,
    Chip,
    Dialog,
    DialogContent,
    Divider,
    IconButton,
    Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import PersonIcon from '@mui/icons-material/Person';
import RoomIcon from '@mui/icons-material/Room';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import InventoryIcon from '@mui/icons-material/Inventory';
import AssignmentIcon from '@mui/icons-material/Assignment';
import dayjs from 'dayjs';
import styled from '@emotion/styled';

const NAVY = '#152C70';
const PURPLE = '#7F00FF';

const BOTTOM_SHEET_SX = {
    maxWidth: 444,
    width: '100%',
    mx: 'auto',
    mb: 0,
    mt: 'auto',
    borderRadius: '20px 20px 0 0',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    maxHeight: '88dvh',
};

function fmt(iso) {
    if (!iso) return null;
    const d = dayjs(iso);
    return d.isValid() ? d.format('DD/MM/YYYY HH:mm') : null;
}

function DetailRow({ icon, label, value, valueColor }) {
    if (value == null) return null;
    return (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25, py: 0.75 }}>
            <Box sx={{
                width: 30, height: 30, borderRadius: '9px',
                bgcolor: 'rgba(127,0,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.1,
            }}>
                {React.cloneElement(icon, { sx: { fontSize: 15, color: PURPLE } })}
            </Box>
            <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: '0.66rem', fontWeight: 700, color: 'rgba(21,44,112,0.42)', textTransform: 'uppercase', letterSpacing: '0.07em', lineHeight: 1 }}>
                    {label}
                </Typography>
                <Typography sx={{ fontSize: '0.9rem', color: valueColor ?? NAVY, fontWeight: 500, lineHeight: 1.4, mt: 0.25 }}>
                    {value}
                </Typography>
            </Box>
        </Box>
    );
}

function AssignmentBottomSheet({ item, onClose }) {
    if (!item) return null;

    const isTask = !item.nombreBebe && !!item.nombreTarea;
    const subject = item.nombreBebe ?? item.nombreTarea ?? '—';
    const inicio = fmt(item.fechaHoraInicio);
    const fin = fmt(item.fechaHoraFin);
    const creada = fmt(item.fechaHoraAsignacion);
    const enProgreso = !!item.fechaHoraInicio && !item.fechaHoraFin;

    return (
        <Dialog
            open={Boolean(item)}
            onClose={onClose}
            sx={{ '& .MuiDialog-container': { alignItems: 'flex-end' } }}
            fullWidth
            maxWidth={false}
            PaperProps={{ sx: BOTTOM_SHEET_SX }}
        >
            {/* Handle bar */}
            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1.25, pb: 0.25, bgcolor: '#fff', flexShrink: 0 }}>
                <Box sx={{ width: 36, height: 4, borderRadius: 2, bgcolor: 'rgba(21,44,112,0.15)' }} />
            </Box>

            {/* Header */}
            <Box sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                px: 2.5, py: 1.5, bgcolor: '#fff', flexShrink: 0,
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{
                        width: 36, height: 36, borderRadius: '10px',
                        background: 'linear-gradient(135deg, #7F00FF 0%, #E100FF 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        {isTask
                            ? <AssignmentIcon sx={{ fontSize: 18, color: '#fff' }} />
                            : <ChildCareIcon sx={{ fontSize: 18, color: '#fff' }} />
                        }
                    </Box>
                    <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: NAVY, lineHeight: 1.2 }}>
                            {subject}
                        </Typography>
                        <Typography sx={{ fontSize: '0.72rem', color: 'rgba(21,44,112,0.45)', fontWeight: 500 }}>
                            ID #{item.idAsignacion}
                        </Typography>
                    </Box>
                </Box>
                <IconButton onClick={onClose} size="small" sx={{ color: NAVY, minWidth: 36, minHeight: 36 }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>

            {/* Estado chip */}
            <Box sx={{ px: 2.5, pb: 1.25, bgcolor: '#fff', flexShrink: 0, display: 'flex', gap: 1, alignItems: 'center' }}>
                {enProgreso && (
                    <Chip
                        label="En progreso"
                        size="small"
                        sx={{ bgcolor: 'rgba(0,168,107,0.12)', color: '#00A86B', fontWeight: 700, fontSize: '0.7rem', height: 22 }}
                    />
                )}
                {item.estadoAsignacion && (
                    <Chip
                        label={item.estadoAsignacion}
                        size="small"
                        sx={{ bgcolor: 'rgba(127,0,255,0.10)', color: PURPLE, fontWeight: 700, fontSize: '0.7rem', height: 22 }}
                    />
                )}
            </Box>

            <Divider sx={{ mx: 2.5, borderColor: 'rgba(143,0,255,0.1)' }} />

            {/* Contenido scrollable */}
            <DialogContent sx={{ px: 2.5, py: 1.5, overflowY: 'auto', flex: 1 }}>
                <DetailRow
                    icon={<PersonIcon />}
                    label="Voluntaria"
                    value={item.nombreVoluntaria}
                />
                {item.nombreSala && (
                    <DetailRow
                        icon={<RoomIcon />}
                        label="Sala"
                        value={item.nombreSala}
                    />
                )}
                <Divider sx={{ my: 0.75, borderColor: 'rgba(143,0,255,0.08)' }} />
                <DetailRow
                    icon={<AccessTimeIcon />}
                    label="Asignada"
                    value={creada}
                />
                <DetailRow
                    icon={<PlayArrowIcon />}
                    label="Inicio abrazo"
                    value={inicio ?? 'Pendiente'}
                    valueColor={inicio ? NAVY : 'rgba(21,44,112,0.4)'}
                />
                <DetailRow
                    icon={<StopIcon />}
                    label="Fin abrazo"
                    value={fin ?? (enProgreso ? 'En progreso' : 'Sin finalizar')}
                    valueColor={fin ? NAVY : (enProgreso ? '#00A86B' : 'rgba(21,44,112,0.4)')}
                />

                {/* Insumos */}
                {item.detalles?.length > 0 && (
                    <>
                        <Divider sx={{ my: 1, borderColor: 'rgba(143,0,255,0.08)' }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                            <InventoryIcon sx={{ fontSize: 15, color: PURPLE }} />
                            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(21,44,112,0.42)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                                Insumos usados
                            </Typography>
                        </Box>
                        {item.detalles.map((d, i) => (
                            <Box key={i} sx={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                py: 0.6, px: 1.5, mb: 0.5,
                                borderRadius: '8px', bgcolor: 'rgba(127,0,255,0.05)',
                                border: '1px solid rgba(127,0,255,0.1)',
                            }}>
                                <Typography sx={{ fontSize: '0.85rem', color: NAVY, fontWeight: 500 }}>
                                    {d.nombreInsumo}
                                </Typography>
                                <Chip
                                    label={`×${d.cantidad}`}
                                    size="small"
                                    sx={{ bgcolor: 'rgba(127,0,255,0.12)', color: PURPLE, fontWeight: 700, fontSize: '0.72rem', height: 20, '& .MuiChip-label': { px: 0.75 } }}
                                />
                            </Box>
                        ))}
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

const AssignedList = ({ listAssignedVolunteer, setChangeAssignedList }) => {
    const [selectedItem, setSelectedItem] = useState(null);

    return (
        <div style={{ padding: '30px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                <IconButton onClick={() => setChangeAssignedList(false)}>
                    <ArrowBackIcon style={{ color: '#8F00FF' }} />
                </IconButton>
                <Title>Asignaciones del día</Title>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 40 }}>
                {listAssignedVolunteer?.map((item) => (
                    <CardAssigned
                        key={item.idAsignacion}
                        item={item}
                        onClick={() => setSelectedItem(item)}
                    />
                ))}
            </div>

            <AssignmentBottomSheet
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
            />
        </div>
    );
};

export default AssignedList;

const Title = styled('h3')`
    color: #152C70;
    font-family: Roboto;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 0.8px;
    text-align: center;
    flex: 1;
`;
