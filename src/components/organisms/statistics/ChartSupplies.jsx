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

export function ChartSupplies({ title, statisticsSupplies }) {
    const labels = statisticsSupplies?.map((d) => d.nombreInsumo) ?? [];
    const values = statisticsSupplies?.map((d) => d.cantidad) ?? [];

    if (!labels.length) {
        return (
            <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography sx={{ color: '#5A6478', fontSize: 14 }}>Sin datos disponibles</Typography>
            </Box>
        );
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: labels.length > 4 ? 'y' : 'x',
        plugins: {
            legend: { display: false },
            title: { display: false },
            tooltip: { callbacks: { label: (ctx) => ` ${ctx.parsed[labels.length > 4 ? 'x' : 'y']} unidades` } },
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
            label: 'Cantidad',
            data: values,
            backgroundColor: 'rgba(143, 0, 255, 0.68)',
            borderColor: 'rgba(143, 0, 255, 1)',
            borderWidth: 1,
            borderRadius: 4,
            borderSkipped: false,
        }],
    };

    return (
        <Box sx={{ position: 'relative', height: labels.length > 4 ? 300 : 240 }}>
            <Bar options={options} data={data} />
        </Box>
    );
}
