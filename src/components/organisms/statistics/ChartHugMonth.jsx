import React from 'react';
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
import faker from 'faker';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export function ChartHugMonth({ title, statisticsMonthMother }) {

    const edades = statisticsMonthMother?.map((data) => data.edad);
    const cantidadMadres = statisticsMonthMother?.map((data) => data.cantidadMadres);


    const options = {
        responsive: true,
        plugins: {
            legend: {
            },
            title: {
                display: true,
                text: title,
            },
        },
    };

    const data = {
        labels: edades,
        datasets: [
            {
                label: 'Cantidad',
                data: cantidadMadres,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ],
    };
    return <Bar options={options} data={data} />;
}
