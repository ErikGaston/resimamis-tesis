import React from 'react';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const NAVY = '#152C70';
const VIOLET = '#8F00FF';
const MINUTOS_EN_UN_DIA = 1440;

/** Minutos → "1 h 12 min" o "45 min", que se lee mejor que un decimal suelto. */
export function formatMinutos(min) {
    const n = Number(min);
    if (!Number.isFinite(n) || n <= 0) return '—';
    const horas = Math.floor(n / 60);
    const resto = Math.round(n % 60);
    if (horas === 0) return `${Math.round(n)} min`;
    return resto === 0 ? `${horas} h` : `${horas} h ${resto} min`;
}

function Kpi({ icon: Icon, label, value, color }) {
    return (
        <Paper
            elevation={0}
            sx={{
                minWidth: 0,
                px: 1.5,
                py: 1.25,
                borderRadius: '12px',
                bgcolor: '#faf8fc',
                border: '1px solid rgba(143,0,255,0.12)',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                <Icon sx={{ fontSize: 16, color }} />
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(21,44,112,0.72)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {label}
                </Typography>
            </Box>
            <Typography sx={{ fontSize: '1.05rem', fontWeight: 800, color, lineHeight: 1.15 }}>
                {value}
            </Typography>
        </Paper>
    );
}

export function ChartDuracionAbrazos({ duracion }) {
    const general = duracion?.general;
    const porMes = Array.isArray(duracion?.porMes) ? duracion.porMes : [];

    if (!general || (general.cantidadAbrazosFinalizados ?? 0) === 0) {
        return (
            <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography sx={{ color: '#5A6478', fontSize: 14 }}>Sin datos disponibles</Typography>
                <Typography sx={{ color: 'rgba(21,44,112,0.72)', fontSize: 12, mt: 0.75, px: 2 }}>
                    Todavía no hay abrazos finalizados registrados.
                </Typography>
            </Box>
        );
    }

    const hayAlgoEnElGrafico = porMes.some((m) => m.promedio > 0);
    // Un "abrazo" de más de 24 h es una asignación que quedó abierta y se cerró
    // días después. El backend no los filtra, así que distorsionan el promedio.
    const hayColgados = Number(general.maximoMinutos ?? 0) > MINUTOS_EN_UN_DIA;

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx) => {
                        const m = porMes[ctx.dataIndex];
                        const abrazos = m?.cantidad ?? 0;
                        return ` ${formatMinutos(ctx.parsed.y)} · ${abrazos} ${abrazos === 1 ? 'abrazo' : 'abrazos'}`;
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { precision: 0, color: '#555', callback: (v) => (v >= 120 ? `${Math.round(v / 60)} h` : `${v}′`) },
                grid: { color: 'rgba(0,0,0,0.06)' },
            },
            x: { ticks: { color: '#555' }, grid: { display: false } },
        },
    };

    const data = {
        labels: porMes.map((m) => m.label),
        datasets: [{
            label: 'Promedio',
            data: porMes.map((m) => m.promedio),
            backgroundColor: 'rgba(143, 0, 255, 0.68)',
            borderColor: 'rgba(143, 0, 255, 1)',
            borderWidth: 1,
            borderRadius: 4,
            borderSkipped: false,
        }],
    };

    return (
        <Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, mb: 2 }}>
                <Kpi icon={TimerOutlinedIcon} label="Promedio" value={formatMinutos(general.promedioMinutos)} color={VIOLET} />
                <Kpi icon={TrendingDownIcon} label="Mínima" value={formatMinutos(general.minimoMinutos)} color="#0E9B2F" />
                <Kpi icon={TrendingUpIcon} label="Máxima" value={formatMinutos(general.maximoMinutos)} color="#C53814" />
            </Box>

            <Typography sx={{ fontSize: '0.875rem', color: 'rgba(21,44,112,0.75)', mb: 1.5 }}>
                Sobre <strong style={{ color: NAVY }}>{general.cantidadAbrazosFinalizados}</strong>{' '}
                {general.cantidadAbrazosFinalizados === 1 ? 'abrazo finalizado' : 'abrazos finalizados'}
            </Typography>

            {hayColgados && (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', p: 1.25, mb: 2, borderRadius: '10px', bgcolor: 'rgba(197,56,20,0.06)', border: '1px solid rgba(197,56,20,0.2)' }}>
                    <WarningAmberIcon sx={{ fontSize: 18, color: '#C53814', flexShrink: 0, mt: 0.15 }} />
                    <Typography sx={{ fontSize: '0.8125rem', color: 'rgba(21,44,112,0.85)', lineHeight: 1.45 }}>
                        Hay abrazos de más de 24 h: son asignaciones que quedaron abiertas y se
                        cerraron días después. Estiran el promedio y el máximo.
                    </Typography>
                </Box>
            )}

            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(21,44,112,0.72)', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.75 }}>
                Promedio por mes
            </Typography>

            {hayAlgoEnElGrafico ? (
                <Box sx={{ position: 'relative', height: 260 }}>
                    <Bar options={options} data={data} />
                </Box>
            ) : (
                <Typography sx={{ color: 'rgba(21,44,112,0.75)', textAlign: 'center', py: 3, fontSize: '0.9rem' }}>
                    No hubo abrazos finalizados en los últimos meses.
                </Typography>
            )}
        </Box>
    );
}

export default ChartDuracionAbrazos;
