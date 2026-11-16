import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { BarraPorcentaje, FilaLista, NAVY, SelectorOpciones, SinDatos, TarjetasNumero, TEXTO_SECUNDARIO, rangoUltimosDias } from './comunes';

const PERIODOS_CUMPLIMIENTO = [
    { valor: 30, label: '30 días' },
    { valor: 60, label: '60 días' },
    { valor: 90, label: '90 días' },
];

export function CumplimientoHorario({ datos, onConsultar }) {
    const [periodo, setPeriodo] = useState(30);
    const cambiar = (dias) => { setPeriodo(dias); onConsultar(rangoUltimosDias(dias)); };
    const voluntarias = datos?.voluntarias ?? [];

    return (
        <Box>
            <SelectorOpciones opciones={PERIODOS_CUMPLIMIENTO} valor={periodo} onCambiar={cambiar} etiqueta="Período" />
            {!datos ? null : voluntarias.length === 0 ? (
                <SinDatos detalle="Ninguna voluntaria activa tiene horario cargado." />
            ) : (
                <>
                    <TarjetasNumero items={[{ label: 'Cumplimiento promedio', valor: `${datos.promedioCumplimiento}%` }]} />
                    <Typography sx={{ fontSize: '0.8rem', color: TEXTO_SECUNDARIO, mb: 1 }}>
                        Días de su horario en que cada voluntaria vino, de menor a mayor cumplimiento.
                    </Typography>
                    {voluntarias.map((v) => (
                        <FilaLista
                            key={v.idVoluntaria}
                            titulo={v.nombre}
                            subtitulo={`${v.diasDelHorario} · vino ${v.diasQueVino} de ${v.diasPrevistos}${v.diasExtra ? ` (+${v.diasExtra} fuera de horario)` : ''}`}
                            derecha={<Typography sx={{ fontWeight: 700, color: NAVY, fontSize: '0.9rem' }}>{v.porcentajeCumplimiento}%</Typography>}
                        >
                            <BarraPorcentaje porcentaje={v.porcentajeCumplimiento} />
                        </FilaLista>
                    ))}
                </>
            )}
        </Box>
    );
}

export default CumplimientoHorario;
