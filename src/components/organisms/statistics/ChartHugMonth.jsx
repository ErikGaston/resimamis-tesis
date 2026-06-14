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

export function ChartHugMonth({ title, statisticsMonthMother }) {
    const labels = statisticsMonthMother?.map((d) => d.edad) ?? [];
    const values = statisticsMonthMother?.map((d) => d.cantidadMadres) ?? [];

    if (!labels.length) {
        return (
            <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography sx={{ color: '#888', fontSize: 14 }}>Sin datos disponibles</Typography>
            </Box>
        );
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: false },
            tooltip: { callbacks: { label: (ctx) => ` ${ctx.parsed.y} madres` } },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { precision: 0, color: '#555' },
                grid: { color: 'rgba(0,0,0,0.06)' },
            },
            x: { ticks: { color: '#555' }, grid: { display: false } },
        },
    };

    const data = {
        labels,
        datasets: [{
            label: 'Madres',
            data: values,
            backgroundColor: 'rgba(122, 101, 155, 0.72)',
            borderColor: 'rgba(122, 101, 155, 1)',
            borderWidth: 1,
            borderRadius: 4,
            borderSkipped: false,
        }],
    };

    return (
        <Box sx={{ position: 'relative', height: 260 }}>
            <Bar options={options} data={data} />
        </Box>
    );
}
