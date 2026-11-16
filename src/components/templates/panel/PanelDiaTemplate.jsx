import React from 'react';
import ChildCareOutlinedIcon from '@mui/icons-material/ChildCareOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import RoomIcon from '@mui/icons-material/Room';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ScheduleIcon from '@mui/icons-material/Schedule';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { Box, Chip, LinearProgress, Paper, Skeleton, Typography } from '@mui/material';
import { PageHeader } from '../../common/PageHeader';
import PageScrollMain from '../../common/PageScrollMain';
import AvisoStockBajo from '../../organisms/alertas/AvisoStockBajo';

const NAVY = '#152C70';
const VIOLET = '#8F00FF';

function Kpi({ icon: Icon, label, value, color = VIOLET, destacado = false }) {
    return (
        <Paper
            elevation={0}
            sx={{
                minWidth: 0,
                px: 1.5,
                py: 1.5,
                borderRadius: '14px',
                bgcolor: destacado ? 'rgba(197,56,20,0.06)' : '#faf8fc',
                border: `1px solid ${destacado ? 'rgba(197,56,20,0.25)' : 'rgba(143,0,255,0.12)'}`,
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                <Icon sx={{ fontSize: 16, color }} />
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(21,44,112,0.72)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {label}
                </Typography>
            </Box>
            <Typography sx={{ fontSize: '1.35rem', fontWeight: 800, color, lineHeight: 1.1 }}>
                {value}
            </Typography>
        </Paper>
    );
}

function KpisSkeleton() {
    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} variant="rounded" height={78} sx={{ borderRadius: '14px' }} />
            ))}
        </Box>
    );
}

const ORDEN_TURNOS = ['Mañana', 'Tarde', 'Noche'];
const ESTADOS_AUSENCIA = ['Licencia', 'Carpeta médica'];

/** Voluntarias que, según su disponibilidad horaria, vienen hoy; agrupadas por turno y con si ya llegaron. */
function EsperadasHoy({ esperadas, fecha }) {
    const nombreDia = fecha ? dayjs(fecha).locale('es').format('dddd') : 'hoy';
    // Una voluntaria con mañana y tarde cuenta una sola vez.
    const totalPersonas = new Set(esperadas.map((v) => v.idVoluntaria)).size;
    const llegaron = new Set(esperadas.filter((v) => v.presente).map((v) => v.idVoluntaria)).size;

    const porTurno = esperadas.reduce((acc, v) => {
        const turno = v.turno || 'Sin turno';
        (acc[turno] = acc[turno] || []).push(v);
        return acc;
    }, {});
    const turnos = Object.keys(porTurno).sort((a, b) => {
        const ia = ORDEN_TURNOS.indexOf(a);
        const ib = ORDEN_TURNOS.indexOf(b);
        return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });

    return (
        <Box sx={{ mb: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(21,44,112,0.72)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Se esperan {nombreDia === 'hoy' ? 'hoy' : `este ${nombreDia}`}
                </Typography>
                {esperadas.length > 0 && (
                    <Chip
                        label={`${llegaron} de ${totalPersonas} llegaron`}
                        size="small"
                        sx={{ height: 22, fontWeight: 700, fontSize: '0.72rem', bgcolor: 'rgba(21,44,112,0.07)', color: NAVY }}
                    />
                )}
            </Box>

            <Paper elevation={0} sx={{ borderRadius: '14px', border: '1px solid rgba(143,0,255,0.12)', overflow: 'hidden' }}>
                {esperadas.length === 0 ? (
                    <Typography sx={{ p: 2, fontSize: '0.875rem', color: 'rgba(21,44,112,0.75)', textAlign: 'center' }}>
                        Ninguna voluntaria tiene disponibilidad cargada para {nombreDia === 'hoy' ? 'hoy' : `los ${nombreDia}`}.
                    </Typography>
                ) : turnos.map((turno, i) => (
                    <Box key={turno} sx={{ borderTop: i ? '1px solid rgba(21,44,112,0.08)' : 'none' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, px: 1.75, py: 1, bgcolor: '#faf8fc' }}>
                            <ScheduleIcon sx={{ fontSize: 16, color: VIOLET }} />
                            <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: NAVY, flex: 1 }}>
                                {turno}
                            </Typography>
                            {porTurno[turno][0]?.horaIngreso && (
                                <Typography sx={{ fontSize: '0.78rem', color: 'rgba(21,44,112,0.72)' }}>
                                    {porTurno[turno][0].horaIngreso} a {porTurno[turno][0].horaSalida}
                                </Typography>
                            )}
                        </Box>
                        {porTurno[turno].map((v) => {
                            const ausente = ESTADOS_AUSENCIA.includes(v.estadoVoluntaria);
                            const chip = v.presente
                                ? { label: 'Llegó', bg: 'rgba(14,155,47,0.12)', color: '#0E7A28' }
                                : ausente
                                    ? { label: v.estadoVoluntaria, bg: 'rgba(197,56,20,0.1)', color: '#C53814' }
                                    : { label: 'Por llegar', bg: 'rgba(21,44,112,0.07)', color: 'rgba(21,44,112,0.8)' };
                            return (
                                <Box key={`${turno}-${v.idVoluntaria}`} sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.75, py: 1, borderTop: '1px solid rgba(21,44,112,0.06)' }}>
                                    <Typography sx={{ flex: 1, minWidth: 0, fontWeight: 600, color: NAVY, fontSize: '0.9rem', overflowWrap: 'anywhere' }}>
                                        {v.nombre}
                                    </Typography>
                                    <Chip label={chip.label} size="small" sx={{ height: 22, fontSize: '0.72rem', fontWeight: 700, bgcolor: chip.bg, color: chip.color }} />
                                </Box>
                            );
                        })}
                    </Box>
                ))}
            </Paper>
        </Box>
    );
}

const PanelDiaTemplate = ({ coordinacion, cobertura, cargando, insumosBajoMinimo, onVerInsumos }) => {
    const abrazos = coordinacion?.abrazosHoy ?? {};
    const sinAbrazo = cobertura?.bebesSinAbrazoHoy ?? [];
    const porcentaje = Number(cobertura?.porcentajeCobertura ?? 0);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, width: '100%' }}>
            <PageHeader title="Panel del día" />
            <PageScrollMain>
                <Box sx={{ px: 2, pt: 2 }}>

                    <AvisoStockBajo insumos={insumosBajoMinimo} onVerInsumos={onVerInsumos} sx={{ mb: 2 }} />

                    {cargando && !coordinacion ? <KpisSkeleton /> : (
                        <>
                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(21,44,112,0.72)', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 1 }}>
                                Situación de hoy
                            </Typography>
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 2.5 }}>
                                <Kpi icon={ChildCareOutlinedIcon} label="Bebés activos" value={coordinacion?.bebesActivos ?? 0} color={NAVY} />
                                <Kpi icon={GroupsOutlinedIcon} label="Voluntarias hoy" value={coordinacion?.voluntariasConAsistenciaHoy ?? 0} color={NAVY} />
                                <Kpi icon={PendingActionsIcon} label="Asignados" value={coordinacion?.bebesAsignados ?? 0} color="#1495C5" />
                                <Kpi icon={FavoriteBorderIcon} label="Abrazos finalizados" value={abrazos.finalizados ?? 0} color="#0E9B2F" />
                                <Kpi icon={HourglassEmptyIcon} label="En curso" value={abrazos.enCurso ?? 0} color="#E65100" />
                                <Kpi
                                    icon={WarningAmberIcon}
                                    label="Abrazos colgados"
                                    value={coordinacion?.abrazosColgados ?? 0}
                                    color="#C53814"
                                    destacado={(coordinacion?.abrazosColgados ?? 0) > 0}
                                />
                            </Box>
                            <EsperadasHoy esperadas={coordinacion?.voluntariasEsperadasHoy ?? []} fecha={coordinacion?.fecha} />
                        </>
                    )}

                    {/* Cobertura */}
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(21,44,112,0.72)', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 1 }}>
                        Cobertura de abrazos
                    </Typography>

                    {cargando && !cobertura ? (
                        <Skeleton variant="rounded" height={120} sx={{ borderRadius: '14px', mb: 2.5 }} />
                    ) : (
                        <Paper elevation={0} sx={{ p: 2, mb: 2.5, borderRadius: '14px', border: '1px solid rgba(143,0,255,0.12)' }}>
                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
                                <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: VIOLET, lineHeight: 1 }}>
                                    {porcentaje}%
                                </Typography>
                                <Typography sx={{ fontSize: '0.875rem', color: 'rgba(21,44,112,0.75)' }}>
                                    {cobertura?.bebesConAbrazoFinalizadoHoy ?? 0} de {cobertura?.totalBebesActivos ?? 0} bebés
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={Math.min(100, Math.max(0, porcentaje))}
                                sx={{
                                    height: 10,
                                    borderRadius: 5,
                                    bgcolor: 'rgba(143,0,255,0.1)',
                                    '& .MuiLinearProgress-bar': { borderRadius: 5, background: 'linear-gradient(90deg, #7F00FF 0%, #E100FF 100%)' },
                                }}
                            />
                        </Paper>
                    )}

                    {/* Bebés sin abrazo */}
                    {!cargando && (
                        <>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(21,44,112,0.72)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                    Todavía sin abrazo
                                </Typography>
                                <Chip
                                    label={sinAbrazo.length}
                                    size="small"
                                    sx={{
                                        height: 22,
                                        fontWeight: 700,
                                        fontSize: '0.75rem',
                                        bgcolor: sinAbrazo.length ? 'rgba(197,56,20,0.1)' : 'rgba(14,155,47,0.12)',
                                        color: sinAbrazo.length ? '#C53814' : '#0E7A28',
                                    }}
                                />
                            </Box>

                            {sinAbrazo.length === 0 ? (
                                <Paper elevation={0} sx={{ p: 2.5, borderRadius: '14px', textAlign: 'center', border: '1px solid rgba(14,155,47,0.2)', bgcolor: 'rgba(14,155,47,0.04)' }}>
                                    <Typography sx={{ color: '#0E7A28', fontWeight: 700, fontSize: '0.95rem' }}>
                                        Todos los bebés recibieron su abrazo
                                    </Typography>
                                </Paper>
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {sinAbrazo.map((b) => (
                                        <Paper
                                            key={b.idBebe}
                                            elevation={0}
                                            sx={{ px: 1.75, py: 1.25, borderRadius: '12px', border: '1px solid rgba(21,44,112,0.1)', display: 'flex', alignItems: 'center', gap: 1 }}
                                        >
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Typography sx={{ fontWeight: 600, color: NAVY, fontSize: '0.95rem', overflowWrap: 'anywhere' }}>
                                                    {[b.nombre, b.apellido].filter(Boolean).join(' ').trim() || 'Sin nombre'}
                                                </Typography>
                                                {b.nombreSala && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                                                        <RoomIcon sx={{ fontSize: 14, color: 'rgba(21,44,112,0.65)' }} />
                                                        <Typography sx={{ fontSize: '0.8125rem', color: 'rgba(21,44,112,0.75)' }}>
                                                            {b.nombreSala}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                            {b.estadoBebe && (
                                                <Chip
                                                    label={b.estadoBebe}
                                                    size="small"
                                                    sx={{ height: 22, fontSize: '0.72rem', fontWeight: 600, bgcolor: 'rgba(143,0,255,0.08)', color: '#5F1FA8' }}
                                                />
                                            )}
                                        </Paper>
                                    ))}
                                </Box>
                            )}
                        </>
                    )}
                </Box>
            </PageScrollMain>
        </Box>
    );
};

export default PanelDiaTemplate;
