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

export function ChartSupplies({ title, statisticsSupplies }) {

    const nombreInsumo = statisticsSupplies?.map((data) => data.nombreInsumo);
    const cantidad = statisticsSupplies?.map((data) => data.cantidad);


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
        labels: nombreInsumo,
        datasets: [
            {
                label: 'Insumo',
                data: cantidad,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ],
    };
    return <Bar options={options} data={data} />;
}
