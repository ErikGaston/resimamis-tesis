import React from 'react';
import { Box, Button, Chip, Paper, Typography } from '@mui/material';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import AssignmentIcon from '@mui/icons-material/Assignment';
import RoomIcon from '@mui/icons-material/Room';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EditIcon from '@mui/icons-material/Edit';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import dayjs from 'dayjs';

const NAVY = '#152C70';
const GRADIENT = 'linear-gradient(90deg, #7F00FF 0%, #E100FF 100%)';
const GRADIENT_GREEN = 'linear-gradient(90deg, #00875A 0%, #00A86B 100%)';

const HEADER_CFG = {
    Creada:     { gradient: GRADIENT },
    Iniciado:   { gradient: 'linear-gradient(90deg, #E65100 0%, #FF6D00 100%)' },
    Finalizado: { gradient: GRADIENT_GREEN },
};

const ESTADO_CHIP = {
    Creada:     { label: 'Creada',     bg: 'rgba(255,255,255,0.22)', color: '#fff' },
    Iniciado:   { label: 'En curso',   bg: 'rgba(255,255,255,0.22)', color: '#fff' },
    Finalizado: { label: 'Finalizado', bg: 'rgba(255,255,255,0.22)', color: '#fff' },
};

function fmt(iso) {
    if (!iso) return null;
    const d = dayjs(iso);
    return d.isValid() ? d.format('HH:mm') : null;
}

const CardBabyHug = ({ item, editHug, submitStartHug, onAssignmentDetail, hayAbrazoEnCurso = false }) => {
    const isTask = !item.nombreBebe && !!item.nombreTarea;
    const subject = item.nombreBebe ?? item.nombreTarea ?? '—';
    const sala = item.nombreSala;
    const estado = item.estadoAsignacion ?? (
        !item.fechaHoraInicio ? 'Creada' : !item.fechaHoraFin ? 'Iniciado' : 'Finalizado'
    );
    const hdrCfg = HEADER_CFG[estado] ?? HEADER_CFG.Creada;
    const chip = ESTADO_CHIP[estado] ?? ESTADO_CHIP.Creada;

    const inicio = fmt(item.fechaHoraInicio);
    const fin = fmt(item.fechaHoraFin);

    const canStart = estado === 'Creada' && typeof submitStartHug === 'function';
    const startBlocked = canStart && hayAbrazoEnCurso;
    const canEdit = estado === 'Iniciado' && typeof editHug === 'function';
    const isDone = estado === 'Finalizado';

    const handleHeaderClick = typeof onAssignmentDetail === 'function'
        ? () => onAssignmentDetail(item.idAsignacion)
        : undefined;

    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                mb: 1.5,
                borderRadius: '14px',
                border: '1.5px solid rgba(143,0,255,0.12)',
                overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(21,44,112,0.07)',
                opacity: isDone ? 0.85 : 1,
            }}
        >
            {/* Header gradient */}
            <Box
                sx={{
                    background: hdrCfg.gradient,
                    px: 2, py: 1.25,
                    display: 'flex', alignItems: 'center', gap: 1,
                    cursor: handleHeaderClick ? 'pointer' : 'default',
                    userSelect: 'none',
                }}
                onClick={handleHeaderClick}
            >
                {isTask
                    ? <AssignmentIcon sx={{ color: '#fff', fontSize: 16, flexShrink: 0 }} />
                    : <ChildCareIcon sx={{ color: '#fff', fontSize: 16, flexShrink: 0 }} />
                }
                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.3, flex: 1 }}>
                    {subject}
                </Typography>
                <Chip
                    label={chip.label}
                    size="small"
                    sx={{
                        bgcolor: chip.bg,
                        color: chip.color,
                        fontWeight: 700,
                        fontSize: '0.62rem',
                        height: 20,
                        flexShrink: 0,
                        '& .MuiChip-label': { px: 0.75 },
                    }}
                />
                {handleHeaderClick && (
                    <ChevronRightIcon sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 18, flexShrink: 0 }} />
                )}
            </Box>

            {/* Body */}
            <Box sx={{ px: 2, py: 1.25, bgcolor: '#fff', display: 'flex', flexDirection: 'column', gap: 0.6 }}>
                {sala && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <RoomIcon sx={{ fontSize: 14, color: 'rgba(21,44,112,0.72)', flexShrink: 0 }} />
                        <Typography sx={{ fontSize: '0.82rem', color: NAVY, fontWeight: 500 }}>
                            Sala {sala}
                        </Typography>
                    </Box>
                )}

                {(inicio || fin) && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <AccessTimeIcon sx={{ fontSize: 14, color: 'rgba(21,44,112,0.72)', flexShrink: 0 }} />
                        <Typography sx={{ fontSize: '0.82rem', color: NAVY, fontWeight: 500 }}>
                            {inicio ? `Inicio ${inicio}` : ''}
                            {inicio && fin ? ' · ' : ''}
                            {fin ? `Fin ${fin}` : ''}
                        </Typography>
                    </Box>
                )}

                {isDone && item.comentario && (
                    <Typography sx={{ fontSize: '0.78rem', color: 'rgba(21,44,112,0.75)', fontStyle: 'italic', mt: 0.25, lineHeight: 1.4 }}>
                        "{item.comentario}"
                    </Typography>
                )}

                {/* Actions */}
                {canStart && (
                    <Box sx={{ mt: 0.75 }}>
                        <Button
                            variant="contained"
                            fullWidth
                            startIcon={<PlayArrowIcon />}
                            onClick={() => submitStartHug(item.idAsignacion)}
                            disabled={startBlocked}
                            sx={{
                                background: startBlocked ? 'rgba(21,44,112,0.12)' : GRADIENT,
                                minHeight: 40,
                                borderRadius: '10px',
                                fontWeight: 700,
                                fontSize: '0.88rem',
                                textTransform: 'none',
                                boxShadow: startBlocked ? 'none' : '0 3px 10px rgba(127,0,255,0.22)',
                                '&:hover': { opacity: 0.88 },
                            }}
                        >
                            Iniciar abrazo
                        </Button>
                        {startBlocked && (
                            <Typography sx={{ fontSize: '0.72rem', color: 'rgba(21,44,112,0.75)', mt: 0.5, textAlign: 'center' }}>
                                Finalizá el abrazo en curso para iniciar otro.
                            </Typography>
                        )}
                    </Box>
                )}

                {canEdit && (
                    <Box sx={{ mt: 0.75 }}>
                        <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<EditIcon />}
                            onClick={() => editHug(item)}
                            sx={{
                                borderColor: 'rgba(230,81,0,0.35)',
                                color: '#E65100',
                                minHeight: 40,
                                borderRadius: '10px',
                                fontWeight: 600,
                                fontSize: '0.88rem',
                                textTransform: 'none',
                                '&:hover': { bgcolor: 'rgba(230,81,0,0.04)', borderColor: 'rgba(230,81,0,0.55)' },
                            }}
                        >
                            Finalizar / Registrar insumos
                        </Button>
                    </Box>
                )}

                {isDone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.5 }}>
                        <CheckCircleIcon sx={{ fontSize: 14, color: '#00A86B' }} />
                        <Typography sx={{ fontSize: '0.78rem', color: '#00A86B', fontWeight: 600 }}>
                            Abrazo completado
                        </Typography>
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

export default CardBabyHug;
