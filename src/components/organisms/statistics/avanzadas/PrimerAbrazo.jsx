import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { FilaLista, NAVY, SinDatos, TarjetasNumero } from './comunes';

const dias = (n) => (n == null ? '—' : `${n} ${n === 1 ? 'día' : 'días'}`);

export function PrimerAbrazo({ datos }) {
    if (!datos) return null;
    const bebes = datos.bebes ?? [];
    if (bebes.length === 0) return <SinDatos detalle="No hay bebés con fecha de ingreso a NEO cargada." />;

    const esperando = bebes.filter((b) => b.sinPrimerAbrazo && b.activo).sort((a, b) => (b.dias ?? 0) - (a.dias ?? 0));
    const conAbrazo = bebes.filter((b) => !b.sinPrimerAbrazo);

    return (
        <Box>
            <TarjetasNumero items={[
                { label: 'Promedio hasta el primer abrazo', valor: dias(datos.promedioDias) },
                { label: 'Mediana', valor: dias(datos.medianaDias) },
                { label: 'Activos sin primer abrazo', valor: datos.activosSinPrimerAbrazo },
            ]} />

            {esperando.length > 0 && (
                <>
                    <Typography sx={{ fontWeight: 700, color: NAVY, fontSize: '0.92rem', mb: 0.5 }}>Esperando su primer abrazo</Typography>
                    {esperando.map((b) => (
                        <FilaLista
                            key={b.idBebe}
                            titulo={b.nombre}
                            subtitulo={b.fechaIngresoNeo ? `Ingresó a NEO el ${dayjs(b.fechaIngresoNeo).format('DD/MM/YYYY')}` : null}
                            derecha={<Chip size="small" label={dias(b.dias)} sx={{ fontWeight: 700, bgcolor: 'rgba(197,56,20,0.1)', color: '#9C2B0F' }} />}
                        />
                    ))}
                </>
            )}

            {conAbrazo.length > 0 && (
                <>
                    <Typography sx={{ fontWeight: 700, color: NAVY, fontSize: '0.92rem', mt: 2, mb: 0.5 }}>Ya recibieron su primer abrazo</Typography>
                    {conAbrazo.map((b) => (
                        <FilaLista
                            key={b.idBebe}
                            titulo={b.nombre}
                            subtitulo={b.fechaPrimerAbrazo ? `Primer abrazo el ${dayjs(b.fechaPrimerAbrazo).format('DD/MM/YYYY')}` : null}
                            derecha={<Typography sx={{ fontWeight: 700, color: NAVY, fontSize: '0.9rem' }}>{dias(b.dias)}</Typography>}
                        />
                    ))}
                </>
            )}
        </Box>
    );
}

export default PrimerAbrazo;
