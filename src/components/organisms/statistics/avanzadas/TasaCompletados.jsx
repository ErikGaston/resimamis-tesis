import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { BarraPorcentaje, FilaLista, NAVY, PERIODOS, SelectorOpciones, SinDatos, TarjetasNumero, TEXTO_SECUNDARIO, rangoUltimosDias } from './comunes';

export function TasaCompletados({ datos, onConsultar }) {
    const [periodo, setPeriodo] = useState(90);
    const cambiar = (dias) => { setPeriodo(dias); onConsultar(rangoUltimosDias(dias)); };

    return (
        <Box>
            <SelectorOpciones opciones={PERIODOS} valor={periodo} onCambiar={cambiar} etiqueta="Período" />
            {!datos ? null : datos.total === 0 ? <SinDatos detalle="No hubo asignaciones de abrazo en el período." /> : (
                <>
                    <TarjetasNumero items={[
                        { label: 'Abrazos completados', valor: `${datos.porcentajeCompletados}%`, detalle: `${datos.completados} de ${datos.total}` },
                        { label: 'Cerrados automáticamente', valor: datos.cerradosAutomaticamente },
                        { label: 'Nunca iniciados', valor: datos.nuncaIniciados },
                    ]} />
                    {datos.enCurso > 0 && (
                        <Typography sx={{ fontSize: '0.8rem', color: TEXTO_SECUNDARIO, mb: 1 }}>
                            {datos.enCurso} {datos.enCurso === 1 ? 'abrazo sigue' : 'abrazos siguen'} en curso o sin iniciar hoy.
                        </Typography>
                    )}
                    <Typography sx={{ fontWeight: 700, color: NAVY, fontSize: '0.92rem', mb: 0.5 }}>Por voluntaria</Typography>
                    {(datos.porVoluntaria ?? []).map((v) => (
                        <FilaLista
                            key={v.idVoluntaria ?? v.grupo}
                            titulo={v.grupo}
                            subtitulo={`${v.completados} de ${v.total} completados${v.nuncaIniciados ? ` · ${v.nuncaIniciados} sin iniciar` : ''}`}
                            derecha={<Typography sx={{ fontWeight: 700, color: NAVY, fontSize: '0.9rem' }}>{v.porcentajeCompletados}%</Typography>}
                        >
                            <BarraPorcentaje porcentaje={v.porcentajeCompletados} />
                        </FilaLista>
                    ))}
                    {(datos.porDiaSemana ?? []).length > 0 && (
                        <>
                            <Typography sx={{ fontWeight: 700, color: NAVY, fontSize: '0.92rem', mt: 2, mb: 0.5 }}>Por día de la semana</Typography>
                            {datos.porDiaSemana.map((d) => (
                                <FilaLista
                                    key={d.grupo}
                                    titulo={d.grupo}
                                    subtitulo={`${d.completados} de ${d.total} completados`}
                                    derecha={<Typography sx={{ fontWeight: 700, color: NAVY, fontSize: '0.9rem' }}>{d.porcentajeCompletados}%</Typography>}
                                >
                                    <BarraPorcentaje porcentaje={d.porcentajeCompletados} />
                                </FilaLista>
                            ))}
                        </>
                    )}
                </>
            )}
        </Box>
    );
}

export default TasaCompletados;
