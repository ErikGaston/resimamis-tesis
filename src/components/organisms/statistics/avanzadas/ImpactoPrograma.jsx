import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { BarraPorcentaje, NAVY, SelectorOpciones, SinDatos, TarjetasNumero, TEXTO_SECUNDARIO, rangoUltimosDias } from './comunes';

const OPCIONES = [
    { valor: 0, label: 'Todos los egresos' },
    { valor: 365, label: 'Último año' },
    { valor: 90, label: '90 días' },
];

function BarrasPorTramo({ titulo, tramos, campo, unidad }) {
    const maximo = Math.max(...tramos.map((t) => t[campo] ?? 0), 0);
    return (
        <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontWeight: 700, color: NAVY, fontSize: '0.92rem', mb: 1 }}>{titulo}</Typography>
            {tramos.map((t) => {
                const valor = t[campo];
                return (
                    <Box key={t.tramo} sx={{ mb: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.4 }}>
                            <Typography sx={{ fontSize: '0.85rem', color: NAVY }}>{t.tramo}</Typography>
                            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: NAVY }}>
                                {valor == null ? '—' : `${valor} ${unidad}`}
                            </Typography>
                        </Box>
                        <BarraPorcentaje porcentaje={maximo > 0 && valor != null ? (valor / maximo) * 100 : 0} />
                    </Box>
                );
            })}
        </Box>
    );
}

export function ImpactoPrograma({ datos, onConsultar }) {
    const [periodo, setPeriodo] = useState(0);
    const cambiar = (dias) => { setPeriodo(dias); onConsultar(dias ? rangoUltimosDias(dias) : {}); };
    const tramos = (datos?.tramos ?? []).filter((t) => t.cantidadBebes > 0);

    return (
        <Box>
            <SelectorOpciones opciones={OPCIONES} valor={periodo} onCambiar={cambiar} etiqueta="Bebés egresados en" />
            {datos?.aclaracion && (
                <Typography sx={{ fontSize: '0.8rem', color: TEXTO_SECUNDARIO, mb: 1.5 }}>{datos.aclaracion}</Typography>
            )}
            {!datos ? null : datos.bebesEgresados === 0 ? (
                <SinDatos detalle="Todavía no hay bebés egresados en el período: el impacto se calcula cuando tienen fecha de salida y pesos cargados." />
            ) : (
                <>
                    <TarjetasNumero items={[{ label: 'Bebés egresados analizados', valor: datos.bebesEgresados }]} />
                    {tramos.map((t) => (
                        <Typography key={t.tramo} sx={{ fontSize: '0.8rem', color: TEXTO_SECUNDARIO }}>
                            {t.tramo}: {t.cantidadBebes} {t.cantidadBebes === 1 ? 'bebé' : 'bebés'} (promedio {t.promedioAbrazos} abrazos)
                        </Typography>
                    ))}
                    <Box sx={{ mt: 2 }}>
                        <BarrasPorTramo titulo="Ganancia de peso por día" tramos={tramos} campo="promedioGananciaGramosPorDia" unidad="g/día" />
                        <BarrasPorTramo titulo="Días de internación" tramos={tramos} campo="promedioDiasInternacion" unidad="días" />
                    </Box>
                </>
            )}
        </Box>
    );
}

export default ImpactoPrograma;
