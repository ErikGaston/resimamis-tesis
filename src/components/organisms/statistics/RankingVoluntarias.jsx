import React from 'react';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import { Box, Paper, Typography } from '@mui/material';

const NAVY = '#152C70';
const VIOLET = '#8F00FF';

/** Oro, plata y bronce para el podio; el resto va en violeta suave. */
const COLOR_POSICION = { 1: '#B8860B', 2: '#6E7787', 3: '#A15C2B' };
const FONDO_POSICION = { 1: 'rgba(184,134,11,0.12)', 2: 'rgba(110,119,135,0.12)', 3: 'rgba(161,92,43,0.12)' };

export function RankingVoluntarias({ ranking }) {
    const items = Array.isArray(ranking?.ranking) ? ranking.ranking : [];

    if (!items.length) {
        return (
            <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography sx={{ color: '#5A6478', fontSize: 14 }}>Sin datos disponibles</Typography>
                <Typography sx={{ color: 'rgba(21,44,112,0.72)', fontSize: 12, mt: 0.75, px: 2 }}>
                    No hay abrazos finalizados en el período consultado.
                </Typography>
            </Box>
        );
    }

    const maximo = Math.max(...items.map((i) => i.cantidadAbrazosFinalizados || 0), 1);

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}>
                <EmojiEventsOutlinedIcon sx={{ fontSize: 18, color: VIOLET }} />
                <Typography sx={{ fontSize: '0.875rem', color: 'rgba(21,44,112,0.75)' }}>
                    Abrazos finalizados en los últimos 365 días
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {items.map((v) => {
                    const cantidad = v.cantidadAbrazosFinalizados || 0;
                    const color = COLOR_POSICION[v.posicion] ?? VIOLET;
                    return (
                        <Paper
                            key={v.idVoluntaria}
                            elevation={0}
                            sx={{ px: 1.5, py: 1.25, borderRadius: '12px', border: '1px solid rgba(21,44,112,0.1)' }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                                <Box sx={{
                                    width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    bgcolor: FONDO_POSICION[v.posicion] ?? 'rgba(143,0,255,0.1)',
                                    color, fontWeight: 800, fontSize: '0.875rem',
                                }}>
                                    {v.posicion}
                                </Box>
                                <Typography sx={{ flex: 1, minWidth: 0, fontWeight: 600, color: NAVY, fontSize: '0.95rem', overflowWrap: 'anywhere' }}>
                                    {v.nombreVoluntaria || 'Sin nombre'}
                                </Typography>
                                <Typography sx={{ fontWeight: 800, color, fontSize: '1.05rem', flexShrink: 0 }}>
                                    {cantidad}
                                </Typography>
                            </Box>
                            <Box sx={{ mt: 0.75, height: 6, borderRadius: 3, bgcolor: 'rgba(143,0,255,0.08)', overflow: 'hidden' }}>
                                <Box sx={{ height: '100%', width: `${(cantidad / maximo) * 100}%`, bgcolor: color, borderRadius: 3 }} />
                            </Box>
                        </Paper>
                    );
                })}
            </Box>
        </Box>
    );
}

export default RankingVoluntarias;
