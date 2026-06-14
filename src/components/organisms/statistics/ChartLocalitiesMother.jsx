import React from 'react';
import { Box, Typography } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const SLICE_COLORS = [
    'rgba(143, 0, 255, 0.82)',
    'rgba(21, 44, 112, 0.82)',
    'rgba(20, 149, 197, 0.82)',
    'rgba(14, 155, 47, 0.82)',
    'rgba(255, 193, 7, 0.82)',
    'rgba(197, 56, 20, 0.82)',
    'rgba(165, 77, 255, 0.82)',
    'rgba(20, 184, 166, 0.82)',
    'rgba(249, 115, 22, 0.82)',
    'rgba(236, 72, 153, 0.82)',
];

export function ChartLocalitiesMother({ title, statisticsLocalities }) {
    const labels = statisticsLocalities?.map((d) => d.nombreLocalidad) ?? [];
    const values = statisticsLocalities?.map((d) => d.cantidadMadres) ?? [];

    if (!labels.length) {
        return (
            <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography sx={{ color: '#888', fontSize: 14 }}>Sin datos disponibles</Typography>
            </Box>
        );
    }

    const colors = labels.map((_, i) => SLICE_COLORS[i % SLICE_COLORS.length]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: { padding: 12, font: { size: 12 }, color: '#333' },
            },
            title: { display: false },
            tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed} madres` } },
        },
    };

    const data = {
        labels,
        datasets: [{
            label: 'Madres',
            data: values,
            backgroundColor: colors,
            borderColor: colors.map((c) => c.replace(', 0.82)', ', 1)')),
            borderWidth: 1,
        }],
    };

    return (
        <Box sx={{ position: 'relative', height: 300 }}>
            <Pie options={options} data={data} />
        </Box>
    );
}
