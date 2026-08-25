import React from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddchartIcon from '@mui/icons-material/Addchart';
import CloseIcon from '@mui/icons-material/Close';
import MonitorWeightOutlinedIcon from '@mui/icons-material/MonitorWeightOutlined';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Typography,
} from '@mui/material';
import styled from '@emotion/styled';
import { PageHeader } from '../../common/PageHeader';
import { ChartHugMonth } from '../../organisms/statistics/ChartHugMonth';
import { ChartLocalitiesMother } from '../../organisms/statistics/ChartLocalitiesMother';
import { ChartSupplies } from '../../organisms/statistics/ChartSupplies';
import { ChartAssignmentMonth } from '../../organisms/statistics/ChartAssignmentMonth';
import { ChartWeightEvolution } from '../../organisms/statistics/ChartWeightEvolution';

const CHART_OPTIONS = [
    { id: 1, label: 'Edades de las madres', icon: AddchartIcon },
    { id: 2, label: 'Localidades de las madres', icon: AddchartIcon },
    { id: 3, label: 'Insumos más utilizados', icon: AddchartIcon },
    { id: 4, label: 'Abrazos por mes', icon: AddchartIcon },
    { id: 5, label: 'Duración de abrazos', icon: AccessTimeIcon },
    { id: 6, label: 'Evolución de peso de los bebés', icon: MonitorWeightOutlinedIcon, soloCoordinadora: true },
];

// Paper del dialog mobile: centrado en columna 444px
const DIALOG_PAPER_SX = {
    maxWidth: 444,
    width: '100%',
    mx: 'auto',
    borderRadius: '16px',
    m: 2,
};

/** Formatea minutos + segundos del listado en texto legible */
function formatDuracion(minutos, segundos) {
    const m = Math.round(Number(minutos ?? 0));
    const s = Math.round(Number(segundos ?? 0));
    if (m >= 60) {
        const h = Math.floor(m / 60);
        const rem = m % 60;
        if (rem === 0 && s === 0) return `${h} h`;
        if (rem === 0) return `${h} h ${s} seg`;
        return `${h} h ${rem} min`;
    }
    if (m > 0 && s > 0) return `${m} min ${s} seg`;
    if (m > 0) return `${m} min`;
    if (s > 0) return `${s} seg`;
    return '< 1 seg';
}

/** Formatea el promedio (en segundos) en texto legible */
function formatPromedioSegundos(totalSegundos) {
    if (totalSegundos == null || Number.isNaN(Number(totalSegundos))) return '—';
    const total = Math.round(Number(totalSegundos));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    if (h > 0 && m > 0) return `${h} h ${m} min`;
    if (h > 0) return `${h} h`;
    if (m > 0 && s > 0) return `${m} min ${s} seg`;
    if (m > 0) return `${m} min`;
    return `${s} seg`;
}

/** Determina si una duración es un dato outlier obvio (abrazo sin cerrar) */
function esOutlier(minutos) {
    return Number(minutos ?? 0) > 1440; // más de 24h → muy probable error de datos
}

const StatisticsTemplate = (props) => {
    const {
        stateChart,
        setStateChart,
        generateChart,
        valueChart,
        statisticsMonthMother,
        statisticsLocalities,
        statisticsSupplies,
        statisticsAssignment,
        statisticsDurationHug,
        statisticsWeightEvolution,
        isCoordinadora,
    } = props;

    const chartOptions = CHART_OPTIONS.filter((o) => !o.soloCoordinadora || isCoordinadora);

    const durationData = React.useMemo(() => {
        if (statisticsDurationHug == null) return null;
        const raw = statisticsDurationHug?.data ?? statisticsDurationHug;
        const promedio = raw?.promedioDuracionAbrazos ?? null;
        const lista = Array.isArray(raw?.listadoDuracionesAbrazos)
            ? raw.listadoDuracionesAbrazos
            : [];
        return { promedio, lista };
    }, [statisticsDurationHug]);

    return (
        <div style={{ height: '100%' }}>
            <PageHeader title="Estadísticas" />
            <ContainerButtons>
                {chartOptions.map(({ id, label, icon: Icon }) => (
                    <Button
                        key={id}
                        fullWidth
                        onClick={() => generateChart(id)}
                        sx={{
                            textTransform: 'none',
                            border: '1.5px solid rgba(143,0,255,0.25)',
                            borderRadius: '12px',
                            py: 1.5,
                            px: 2,
                            mb: 1.25,
                            justifyContent: 'flex-start',
                            gap: 1.5,
                            bgcolor: '#fff',
                            boxShadow: '0 2px 8px rgba(21,44,112,0.06)',
                            '&:hover': { bgcolor: 'rgba(143,0,255,0.04)', borderColor: '#8F00FF' },
                        }}
                    >
                        <Icon sx={{ color: '#8F00FF', fontSize: 22, flexShrink: 0 }} />
                        <Typography sx={{ color: '#152C70', fontSize: '0.95rem', fontWeight: 500, textAlign: 'left' }}>
                            {label}
                        </Typography>
                    </Button>
                ))}
            </ContainerButtons>

            <Dialog
                open={stateChart === 'OPEN'}
                onClose={() => setStateChart('')}
                fullWidth
                maxWidth={false}
                PaperProps={{ sx: DIALOG_PAPER_SX }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5, px: 2 }}>
                    <Typography sx={{ fontWeight: 700, color: '#152C70', fontSize: '1rem' }}>
                        {CHART_OPTIONS.find((o) => o.id === valueChart)?.label ?? 'Estadística'}
                    </Typography>
                    <IconButton onClick={() => setStateChart('')} aria-label="Cerrar" size="small">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ px: 2, pt: 0.5, pb: 3 }}>
                    {valueChart === 1 && <ChartHugMonth statisticsMonthMother={statisticsMonthMother} />}
                    {valueChart === 2 && <ChartLocalitiesMother statisticsLocalities={statisticsLocalities} />}
                    {valueChart === 3 && <ChartSupplies statisticsSupplies={statisticsSupplies} />}
                    {valueChart === 4 && <ChartAssignmentMonth statisticsAssignment={statisticsAssignment} />}
                    {valueChart === 6 && <ChartWeightEvolution statisticsWeightEvolution={statisticsWeightEvolution} />}

                    {/* ── Duración de abrazos ── */}
                    {valueChart === 5 && (
                        <Box sx={{ pt: 0.5 }}>
                            {durationData === null ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                                    <CircularProgress sx={{ color: '#8F00FF' }} />
                                </Box>
                            ) : (
                                <>
                                    {/* Card promedio */}
                                    {durationData.promedio != null && (
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                mb: 2.5,
                                                p: '16px 20px',
                                                borderRadius: '14px',
                                                background: 'linear-gradient(135deg, #7F00FF 0%, #9B30FF 100%)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 2,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 44,
                                                    height: 44,
                                                    borderRadius: '12px',
                                                    bgcolor: 'rgba(255,255,255,0.18)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <TimerOutlinedIcon sx={{ fontSize: 24, color: '#fff' }} />
                                            </Box>
                                            <Box>
                                                <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.09em', mb: 0.25 }}>
                                                    Duración promedio
                                                </Typography>
                                                <Typography sx={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>
                                                    {formatPromedioSegundos(durationData.promedio)}
                                                </Typography>
                                            </Box>
                                        </Paper>
                                    )}

                                    {/* Lista de duraciones */}
                                    {durationData.lista.length === 0 ? (
                                        <Typography sx={{ color: 'rgba(21,44,112,0.5)', textAlign: 'center', py: 3, fontSize: '0.9rem' }}>
                                            Sin registros de duración disponibles.
                                        </Typography>
                                    ) : (
                                        <>
                                            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(21,44,112,0.4)', textTransform: 'uppercase', letterSpacing: '0.09em', mb: 1.25 }}>
                                                Detalle por abrazo ({durationData.lista.length})
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                                                {durationData.lista.map((row, i) => {
                                                    const outlier = esOutlier(row.minutos);
                                                    return (
                                                        <Box
                                                            key={i}
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between',
                                                                px: 1.5,
                                                                py: 1,
                                                                borderRadius: '10px',
                                                                bgcolor: outlier
                                                                    ? 'rgba(194,56,20,0.05)'
                                                                    : i % 2 === 0 ? '#faf8fc' : '#fff',
                                                                border: outlier
                                                                    ? '1px solid rgba(194,56,20,0.15)'
                                                                    : '1px solid rgba(143,0,255,0.06)',
                                                            }}
                                                        >
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                                                                <Box
                                                                    sx={{
                                                                        width: 26,
                                                                        height: 26,
                                                                        borderRadius: '8px',
                                                                        bgcolor: outlier ? 'rgba(194,56,20,0.1)' : 'rgba(143,0,255,0.1)',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        flexShrink: 0,
                                                                    }}
                                                                >
                                                                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, color: outlier ? '#C23814' : '#7F00FF' }}>
                                                                        {i + 1}
                                                                    </Typography>
                                                                </Box>
                                                                <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#152C70' }}>
                                                                    Abrazo #{i + 1}
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                                <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: outlier ? '#C23814' : '#7A659B' }}>
                                                                    {formatDuracion(row.minutos, row.segundos)}
                                                                </Typography>
                                                                {outlier && (
                                                                    <Typography sx={{ fontSize: '0.65rem', color: 'rgba(194,56,20,0.7)', fontWeight: 500 }}>
                                                                        dato atípico
                                                                    </Typography>
                                                                )}
                                                            </Box>
                                                        </Box>
                                                    );
                                                })}
                                            </Box>
                                        </>
                                    )}
                                </>
                            )}
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default StatisticsTemplate;

const ContainerButtons = styled('div')`
    padding: 20px 16px;
    display: flex;
    flex-direction: column;
`;
