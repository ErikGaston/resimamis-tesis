import React, { useState } from 'react';
import { Box, Chip } from '@mui/material';
import dayjs from 'dayjs';
import { FilaLista, SelectorOpciones, SinDatos, TarjetasNumero } from './comunes';

const UMBRALES = [
    { valor: 3, label: '3 días' },
    { valor: 7, label: '7 días' },
    { valor: 15, label: '15 días' },
    { valor: 30, label: '30 días' },
];

export function BebesSinVisitas({ datos, onConsultar }) {
    const [umbral, setUmbral] = useState(7);
    const cambiar = (dias) => { setUmbral(dias); onConsultar({ dias }); };
    const bebes = datos?.bebes ?? [];

    return (
        <Box>
            <SelectorOpciones opciones={UMBRALES} valor={umbral} onCambiar={cambiar} etiqueta="Sin visita familiar hace al menos" />
            {!datos ? null : bebes.length === 0 ? (
                <SinDatos titulo="Todos los bebés activos tuvieron visitas" detalle={`Ninguno lleva ${umbral} días o más sin visita.`} />
            ) : (
                <>
                    <TarjetasNumero items={[{ label: `Bebés sin visita hace ${umbral}+ días`, valor: datos.bebesSuperanUmbral }]} />
                    {bebes.map((b) => (
                        <FilaLista
                            key={b.idBebe}
                            titulo={b.nombre}
                            subtitulo={[b.sala, b.ultimaVisita ? `Última visita el ${dayjs(b.ultimaVisita).format('DD/MM/YYYY')}` : 'Nunca recibió visitas'].filter(Boolean).join(' · ')}
                            derecha={(
                                <Chip
                                    size="small"
                                    label={b.nuncaVisitado ? 'Nunca' : `${b.diasSinVisita} días`}
                                    sx={{ fontWeight: 700, bgcolor: b.nuncaVisitado ? 'rgba(197,56,20,0.1)' : 'rgba(122,101,155,0.12)', color: b.nuncaVisitado ? '#9C2B0F' : '#5F1FA8' }}
                                />
                            )}
                        />
                    ))}
                </>
            )}
        </Box>
    );
}

export default BebesSinVisitas;
