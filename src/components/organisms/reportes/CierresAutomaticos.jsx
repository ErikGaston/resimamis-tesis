import React, { useState } from 'react';
import { Box, Button, Chip, Paper, Typography } from '@mui/material';
import ScheduleIcon from '@mui/icons-material/Schedule';
import dayjs from 'dayjs';

const VIOLET = '#7A659B';
const NAVY = '#152C70';
const SECUNDARIO = 'rgba(21,44,112,0.75)';

const PERIODOS = [
    { dias: 7, label: '7 días' },
    { dias: 30, label: '30 días' },
    { dias: 90, label: '90 días' },
];

// El back devuelve las corridas ya en hora Argentina como "yyyy-MM-dd HH:mm:ss".
const fechaAr = (texto) => (texto ? dayjs(texto.replace(' ', 'T')).format('DD/MM/YYYY HH:mm') : '—');

const CierresAutomaticos = ({ estado, resultado, onConsultar }) => {
    const [dias, setDias] = useState(7);
    const ultima = estado?.ultimasEjecuciones?.[0];
    const cierres = resultado?.cierres;

    const cambiarPeriodo = (valor) => {
        setDias(valor);
        onConsultar({
            fechaDesde: dayjs().subtract(valor - 1, 'day').format('YYYY-MM-DD'),
            fechaHasta: dayjs().format('YYYY-MM-DD'),
        });
    };

    return (
        <Box>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5, color: NAVY }}>
                Cierres automáticos
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: SECUNDARIO }}>
                Abrazos que se finalizaron sin que la voluntaria los cerrara: los del cierre diario de
                medianoche y los del botón "Cerrar abrazos sin finalizar".
            </Typography>

            <Paper elevation={0} sx={{ p: 1.5, mb: 2, borderRadius: '12px', border: '1px solid rgba(122,101,155,0.25)', bgcolor: '#faf8fc' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                    <ScheduleIcon sx={{ fontSize: 18, color: VIOLET }} />
                    <Typography sx={{ fontWeight: 700, color: NAVY, fontSize: '0.92rem' }}>Cierre diario</Typography>
                </Box>
                {!estado ? (
                    <Typography sx={{ fontSize: '0.85rem', color: SECUNDARIO }}>Cargando…</Typography>
                ) : (
                    <>
                        <Typography sx={{ fontSize: '0.85rem', color: NAVY }}>
                            {ultima
                                ? `Última corrida: ${fechaAr(ultima.fecha)} · ${ultima.cantidadCerrada} ${ultima.cantidadCerrada === 1 ? 'abrazo cerrado' : 'abrazos cerrados'}`
                                : 'Todavía no hay corridas registradas.'}
                        </Typography>
                        {estado.proximaEjecucion && (
                            <Typography sx={{ fontSize: '0.8rem', color: SECUNDARIO }}>
                                Próxima: {fechaAr(estado.proximaEjecucion)}
                            </Typography>
                        )}
                    </>
                )}
            </Paper>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0.75, mb: 2 }}>
                {PERIODOS.map((p) => (
                    <Button
                        key={p.dias}
                        size="small"
                        variant={dias === p.dias ? 'contained' : 'outlined'}
                        onClick={() => cambiarPeriodo(p.dias)}
                        sx={dias === p.dias
                            ? { bgcolor: VIOLET, '&:hover': { bgcolor: '#6A549A' } }
                            : { borderColor: VIOLET, color: VIOLET }}
                    >
                        {p.label}
                    </Button>
                ))}
            </Box>

            {!Array.isArray(cierres) ? (
                <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', textAlign: 'center', py: 3 }}>Cargando cierres…</Typography>
            ) : cierres.length === 0 ? (
                <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', textAlign: 'center', py: 3 }}>
                    No hubo cierres automáticos en los últimos {dias} días.
                </Typography>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="caption" sx={{ color: SECUNDARIO }}>
                        {cierres.length} {cierres.length === 1 ? 'abrazo cerrado' : 'abrazos cerrados'}
                    </Typography>
                    {cierres.map((c) => {
                        const desdeBoton = c.origen?.startsWith('Botón');
                        return (
                            <Box
                                key={`${c.idAsignacion}-${c.fechaHora}`}
                                sx={{ p: 1.5, bgcolor: '#fff', borderRadius: 2, border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: VIOLET, flex: 1 }}>
                                        {dayjs(c.fechaHora).format('DD/MM/YYYY HH:mm')}
                                    </Typography>
                                    <Chip
                                        size="small"
                                        label={desdeBoton ? 'Desde coordinación' : 'Cierre diario'}
                                        sx={{
                                            fontWeight: 600, fontSize: '0.7rem', height: 22,
                                            bgcolor: desdeBoton ? 'rgba(122,101,155,0.12)' : 'rgba(255,193,7,0.16)',
                                            color: desdeBoton ? '#5F1FA8' : '#7A5A00',
                                        }}
                                    />
                                </Box>
                                <Typography sx={{ fontSize: '0.88rem', color: NAVY }}>{c.descripcion}</Typography>
                                {desdeBoton && (
                                    <Typography sx={{ fontSize: '0.78rem', color: SECUNDARIO }}>
                                        {c.origen.replace(/^Botón de coordinación \((.*)\)$/, 'Por $1')}
                                    </Typography>
                                )}
                            </Box>
                        );
                    })}
                </Box>
            )}
        </Box>
    );
};

export default CierresAutomaticos;
