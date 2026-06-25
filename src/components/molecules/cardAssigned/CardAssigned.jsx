import React from 'react';
import { Box, Chip, Paper, Typography } from '@mui/material';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import PersonIcon from '@mui/icons-material/Person';
import RoomIcon from '@mui/icons-material/Room';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const NAVY = '#152C70';

const ESTADO_CHIP = {
    Creada:     { label: 'Creada',     bgcolor: 'rgba(0,0,0,0.07)',          color: '#666' },
    Iniciado:   { label: 'En curso',   bgcolor: 'rgba(255,152,0,0.13)',       color: '#E65100' },
    Finalizado: { label: 'Finalizado', bgcolor: 'rgba(0,168,107,0.1)',        color: '#00A86B' },
};

const CardAssigned = ({ item, onClick }) => {
    const isTask = !item.nombreBebe && !!item.nombreTarea;
    const subject = item.nombreBebe ?? item.nombreTarea ?? '—';
    const sala = item.nombreSala;
    const estado = item.estadoAsignacion ?? (
        !item.fechaHoraInicio ? 'Creada'
        : !item.fechaHoraFin ? 'Iniciado'
        : 'Finalizado'
    );
    const chip = ESTADO_CHIP[estado] ?? { label: estado, bgcolor: 'rgba(0,0,0,0.07)', color: '#666' };

    return (
        <Paper
            elevation={0}
            onClick={onClick}
            sx={{
                width: '100%',
                mb: 1.25,
                borderRadius: '14px',
                border: '1.5px solid rgba(143,0,255,0.13)',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(21,44,112,0.07)',
                transition: 'box-shadow 0.15s',
                '&:active': { boxShadow: '0 1px 4px rgba(21,44,112,0.1)' },
            }}
        >
            {/* Header */}
            <Box sx={{
                background: 'linear-gradient(90deg, #7F00FF 0%, #E100FF 100%)',
                px: 2, py: 1.25,
                display: 'flex', alignItems: 'center', gap: 1,
            }}>
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
                        bgcolor: 'rgba(255,255,255,0.22)',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.62rem',
                        height: 20,
                        flexShrink: 0,
                        '& .MuiChip-label': { px: 0.75 },
                    }}
                />
                <ChevronRightIcon sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 18, flexShrink: 0 }} />
            </Box>

            {/* Body */}
            <Box sx={{ px: 2, py: 1.1, bgcolor: '#fff', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <PersonIcon sx={{ fontSize: 14, color: 'rgba(21,44,112,0.4)', flexShrink: 0 }} />
                    <Typography sx={{ fontSize: '0.72rem', color: 'rgba(21,44,112,0.45)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', mr: 0.5 }}>
                        Voluntaria
                    </Typography>
                    <Typography sx={{ fontSize: '0.82rem', color: NAVY, fontWeight: 500 }}>
                        {item.nombreVoluntaria ?? '—'}
                    </Typography>
                </Box>

                {sala && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <RoomIcon sx={{ fontSize: 14, color: 'rgba(21,44,112,0.4)', flexShrink: 0 }} />
                        <Typography sx={{ fontSize: '0.72rem', color: 'rgba(21,44,112,0.45)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', mr: 0.5 }}>
                            Sala
                        </Typography>
                        <Typography sx={{ fontSize: '0.82rem', color: NAVY, fontWeight: 500 }}>
                            {sala}
                        </Typography>
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

export default CardAssigned;
