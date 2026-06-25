import React, { useState } from 'react';
import CardAssigned from '../../molecules/cardAssigned/CardAssigned';
import {
    Box,
    Button,
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
import CommentIcon from '@mui/icons-material/Comment';
import dayjs from 'dayjs';
import styled from '@emotion/styled';

const NAVY = '#152C70';
const PURPLE = '#7F00FF';
const GRADIENT = 'linear-gradient(135deg, #7F00FF 0%, #E100FF 100%)';

const FULL_DIALOG_SX = {
    maxWidth: 444,
    width: '100%',
    mx: 'auto',
    height: '100dvh',
    maxHeight: '100dvh',
    m: 0,
    borderRadius: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
};

const ESTADO_CONFIG = {
    Creada:     { label: 'Creada',     bg: 'rgba(0,0,0,0.07)',          color: '#666' },
    Iniciado:   { label: 'En curso',   bg: 'rgba(255,152,0,0.13)',       color: '#E65100' },
    Finalizado: { label: 'Finalizado', bg: 'rgba(0,168,107,0.1)',        color: '#00A86B' },
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

function AssignmentFullDialog({ item, onClose, onStartHug }) {
    if (!item) return null;

    const isTask = !item.nombreBebe && !!item.nombreTarea;
    const subject = item.nombreBebe ?? item.nombreTarea ?? '—';
    const estado = item.estadoAsignacion ?? (
        !item.fechaHoraInicio ? 'Creada' : !item.fechaHoraFin ? 'Iniciado' : 'Finalizado'
    );
    const estadoCfg = ESTADO_CONFIG[estado] ?? { label: estado, bg: 'rgba(0,0,0,0.07)', color: '#666' };

    const inicio = fmt(item.fechaHoraInicio);
    const fin = fmt(item.fechaHoraFin);
    const creada = fmt(item.fechaHoraAsignacion);
    const canStart = estado === 'Creada' && typeof onStartHug === 'function';

    return (
        <Dialog
            open={Boolean(item)}
            onClose={onClose}
            fullWidth
            maxWidth={false}
            PaperProps={{ sx: FULL_DIALOG_SX }}
        >
            {/* Header gradient */}
            <Box sx={{
                background: GRADIENT,
                flexShrink: 0,
                pt: 2, pb: 2, px: 2.5,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <Box sx={{
                        width: 40, height: 40, borderRadius: '12px',
                        bgcolor: 'rgba(255,255,255,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                        {isTask
                            ? <AssignmentIcon sx={{ color: '#fff', fontSize: 20 }} />
                            : <ChildCareIcon sx={{ color: '#fff', fontSize: 20 }} />
                        }
                    </Box>
                    <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#fff', lineHeight: 1.2 }}>
                            {subject}
                        </Typography>
                        <Typography sx={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.75)', mt: 0.2 }}>
                            Asignación #{item.idAsignacion}
                        </Typography>
                    </Box>
                </Box>
                <IconButton onClick={onClose} sx={{ color: '#fff', minWidth: 44, minHeight: 44 }}>
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* Estado */}
            <Box sx={{ px: 2.5, py: 1.25, bgcolor: '#fff', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                    label={estadoCfg.label}
                    size="small"
                    sx={{ bgcolor: estadoCfg.bg, color: estadoCfg.color, fontWeight: 700, fontSize: '0.75rem', height: 24 }}
                />
            </Box>

            <Divider sx={{ borderColor: 'rgba(143,0,255,0.1)' }} />

            {/* Contenido */}
            <DialogContent sx={{ flex: 1, overflowY: 'auto', px: 2.5, py: 1.5, bgcolor: '#faf8fc' }}>
                <DetailRow icon={<PersonIcon />} label="Voluntaria" value={item.nombreVoluntaria} />
                {item.nombreSala && (
                    <DetailRow icon={<RoomIcon />} label="Sala" value={item.nombreSala} />
                )}

                <Divider sx={{ my: 0.75, borderColor: 'rgba(143,0,255,0.08)' }} />

                <DetailRow icon={<AccessTimeIcon />} label="Asignada" value={creada} />
                <DetailRow
                    icon={<PlayArrowIcon />}
                    label="Inicio abrazo"
                    value={inicio ?? '—'}
                    valueColor={inicio ? NAVY : 'rgba(21,44,112,0.4)'}
                />
                <DetailRow
                    icon={<StopIcon />}
                    label="Fin abrazo"
                    value={fin ?? '—'}
                    valueColor={fin ? NAVY : 'rgba(21,44,112,0.4)'}
                />

                {item.comentario && (
                    <>
                        <Divider sx={{ my: 0.75, borderColor: 'rgba(143,0,255,0.08)' }} />
                        <DetailRow icon={<CommentIcon />} label="Comentario" value={item.comentario} />
                    </>
                )}

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

            {/* Acción iniciar abrazo */}
            {canStart && (
                <Box sx={{ px: 2.5, pb: 2.5, pt: 1.5, bgcolor: '#fff', flexShrink: 0 }}>
                    <Button
                        variant="contained"
                        fullWidth
                        startIcon={<PlayArrowIcon />}
                        sx={{
                            background: GRADIENT,
                            minHeight: 50,
                            borderRadius: '12px',
                            fontWeight: 700,
                            fontSize: '1rem',
                            textTransform: 'none',
                            boxShadow: '0 4px 14px rgba(127,0,255,0.28)',
                            '&:hover': { background: 'linear-gradient(135deg, #6A00D6 0%, #C200CC 100%)' },
                        }}
                        onClick={() => {
                            onStartHug(item.idAsignacion);
                            onClose();
                        }}
                    >
                        Iniciar abrazo
                    </Button>
                </Box>
            )}
        </Dialog>
    );
}

const AssignedList = ({ listAssignedVolunteer, setChangeAssignedList, submitStartHug }) => {
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

            <AssignmentFullDialog
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
                onStartHug={submitStartHug}
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
