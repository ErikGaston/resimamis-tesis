import React from 'react';
import MonitorWeightOutlinedIcon from '@mui/icons-material/MonitorWeightOutlined';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Box, Paper, Typography } from '@mui/material';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { buildMonthlyAverageGain, formatGramos, normalizeWeightEvolution } from '../../../utils/weightEvolution';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const COLOR_GANANCIA = 'rgba(143, 0, 255, 0.68)';
const COLOR_GANANCIA_BORDE = 'rgba(143, 0, 255, 1)';
const COLOR_PERDIDA = 'rgba(197, 56, 20, 0.68)';
const COLOR_PERDIDA_BORDE = 'rgba(197, 56, 20, 1)';

function StatTile({ icon: Icon, label, value, color }) {
    return (
        <Box
            sx={{
                flex: 1,
                px: 1.5,
                py: 1.25,
                borderRadius: '12px',
                bgcolor: '#faf8fc',
                border: '1px solid rgba(143,0,255,0.1)',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                <Icon sx={{ fontSize: 16, color }} />
                <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(21,44,112,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {label}
                </Typography>
            </Box>
            <Typography sx={{ fontSize: '1.05rem', fontWeight: 800, color, lineHeight: 1.2 }}>
                {value}
            </Typography>
        </Box>
    );
}

export function ChartWeightEvolution({ statisticsWeightEvolution }) {
    const resumen = React.useMemo(
        () => normalizeWeightEvolution(statisticsWeightEvolution),
        [statisticsWeightEvolution],
    );
    const serieMensual = React.useMemo(
        () => buildMonthlyAverageGain(resumen?.bebes),
        [resumen],
    );

    if (!resumen || resumen.bebesConComparacionCompleta === 0) {
        return (
            <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography sx={{ color: '#888', fontSize: 14 }}>
                    Sin datos disponibles
                </Typography>
                <Typography sx={{ color: 'rgba(21,44,112,0.4)', fontSize: 12, mt: 0.75, px: 2 }}>
                    Se necesitan bebés con peso de ingreso a NEO y peso de egreso cargados.
                </Typography>
            </Box>
        );
    }

    const labels = serieMensual.map((m) => m.label);
    const values = serieMensual.map((m) => m.promedio);
    const hayPerdidas = values.some((v) => v < 0);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx) => ` ${formatGramos(ctx.parsed.y, { signed: true })} promedio`,
                    afterLabel: (ctx) => {
                        const cantidad = serieMensual[ctx.dataIndex]?.cantidad ?? 0;
                        return cantidad === 1 ? ' 1 bebé' : ` ${cantidad} bebés`;
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Gramos', color: 'rgba(21,44,112,0.5)', font: { size: 11 } },
                ticks: { precision: 0, color: '#555' },
                grid: { color: 'rgba(0,0,0,0.06)' },
            },
            x: {
                ticks: { color: '#555', maxRotation: labels.length > 6 ? 60 : 0 },
                grid: { display: false },
            },
        },
    };

    const data = {
        labels,
        datasets: [{
            label: 'Ganancia promedio',
            data: values,
            backgroundColor: values.map((v) => (v < 0 ? COLOR_PERDIDA : COLOR_GANANCIA)),
            borderColor: values.map((v) => (v < 0 ? COLOR_PERDIDA_BORDE : COLOR_GANANCIA_BORDE)),
            borderWidth: 1,
            borderRadius: 4,
            borderSkipped: false,
        }],
    };

    return (
        <Box sx={{ pt: 0.5 }}>
            <Paper
                elevation={0}
                sx={{
                    mb: 1.5,
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
                    <MonitorWeightOutlinedIcon sx={{ fontSize: 24, color: '#fff' }} />
                </Box>
                <Box>
                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.09em', mb: 0.25 }}>
                        Ganancia de peso promedio
                    </Typography>
                    <Typography sx={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>
                        {formatGramos(resumen.promedioGanancia, { signed: true })}
                    </Typography>
                </Box>
            </Paper>

            <Box sx={{ display: 'flex', gap: 1.25, mb: 2 }}>
                <StatTile
                    icon={TrendingDownIcon}
                    label="Ganancia mínima"
                    value={formatGramos(resumen.gananciaMinima, { signed: true })}
                    color={resumen.gananciaMinima < 0 ? '#C53814' : '#7A659B'}
                />
                <StatTile
                    icon={TrendingUpIcon}
                    label="Ganancia máxima"
                    value={formatGramos(resumen.gananciaMaxima, { signed: true })}
                    color="#0E9B2F"
                />
            </Box>

            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(21,44,112,0.4)', textTransform: 'uppercase', letterSpacing: '0.09em', mb: 1 }}>
                Ganancia promedio por mes
            </Typography>

            {labels.length === 0 ? (
                <Typography sx={{ color: 'rgba(21,44,112,0.5)', textAlign: 'center', py: 3, fontSize: '0.9rem' }}>
                    Los bebés comparables no tienen fecha de ingreso ni de egreso cargada.
                </Typography>
            ) : (
                <Box sx={{ position: 'relative', height: 260 }}>
                    <Bar options={options} data={data} />
                </Box>
            )}

            <Typography sx={{ mt: 1.5, fontSize: '0.72rem', color: 'rgba(21,44,112,0.45)', lineHeight: 1.5 }}>
                Calculado sobre {resumen.bebesConComparacionCompleta} de {resumen.totalBebes} bebés con
                peso de ingreso a NEO y peso de egreso cargados.
                {hayPerdidas ? ' Las barras rojas indican meses con pérdida de peso promedio.' : ''}
            </Typography>
        </Box>
    );
}
