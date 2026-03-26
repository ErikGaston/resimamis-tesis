import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export function ChartAssignmentMonth({ title, statisticsAssignment }) {

    const obtenerNombreMes = (numeroMes) => {
        const meses = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
            'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];

        // Restar 1 al número del mes ya que en JavaScript los meses comienzan desde 0 (enero = 0, febrero = 1, ...)
        const nombreMes = meses[numeroMes - 1];
        return nombreMes;
    };

    const meses = statisticsAssignment?.map((data) => obtenerNombreMes(data.mes));
    const cantidadAsignaciones = statisticsAssignment?.map((data) => data.cantidadAsignaciones);


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
        labels: meses,
        datasets: [
            {
                label: 'Cantidad',
                data: cantidadAsignaciones,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            }
        ],
    };
    return <Pie options={options} data={data} />;
}
