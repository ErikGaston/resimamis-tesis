import React from 'react';
import { Box, Typography } from '@mui/material';
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

const COLOR = 'rgba(143, 0, 255, 0.68)';
const COLOR_BORDE = 'rgba(143, 0, 255, 1)';

/**
 * Barras para las distribuciones de bebés del backend (por sala, por estado,
 * por rango de edad). Todas tienen la misma forma categoría → cantidad, así
 * que comparten componente en vez de repetirse tres veces.
 */
export function ChartDistribucionBebes({ datos, total, unidad = 'bebés', notaAlPie }) {
    const items = Array.isArray(datos) ? datos.filter((d) => d && d.label) : [];

    if (!items.length) {
        return (
            <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography sx={{ color: '#5A6478', fontSize: 14 }}>Sin datos disponibles</Typography>
            </Box>
        );
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx) => ` ${ctx.parsed.y} ${ctx.parsed.y === 1 ? unidad.replace(/s$/, '') : unidad}`,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { precision: 0, color: '#555' },
                grid: { color: 'rgba(0,0,0,0.06)' },
            },
            x: { ticks: { color: '#555', font: { size: 11 } }, grid: { display: false } },
        },
    };

    const data = {
        labels: items.map((d) => d.label),
        datasets: [{
            label: unidad,
            data: items.map((d) => d.cantidad),
            backgroundColor: COLOR,
            borderColor: COLOR_BORDE,
            borderWidth: 1,
            borderRadius: 4,
            borderSkipped: false,
        }],
    };

    return (
        <Box>
            {total != null && (
                <Typography sx={{ fontSize: '0.875rem', color: 'rgba(21,44,112,0.75)', mb: 1 }}>
                    Total: <strong style={{ color: '#152C70' }}>{total}</strong> {unidad}
                </Typography>
            )}
            <Box sx={{ position: 'relative', height: 280 }}>
                <Bar options={options} data={data} />
            </Box>
            {notaAlPie && (
                <Typography sx={{ color: 'rgba(21,44,112,0.75)', fontSize: '0.8125rem', mt: 1.5, lineHeight: 1.5 }}>
                    {notaAlPie}
                </Typography>
            )}
        </Box>
    );
}

export default ChartDistribucionBebes;
