import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { BarraPorcentaje, FilaLista, SinDatos, TarjetasNumero, TEXTO_SECUNDARIO } from './comunes';

export function EquidadBebes({ datos }) {
    if (!datos) return null;
    const bebes = datos.bebes ?? [];
    if (bebes.length === 0) return <SinDatos detalle="No hay bebés activos." />;
    const maximo = Math.max(...bebes.map((b) => b.abrazosPorSemana ?? 0), 0);

    return (
        <Box>
            <TarjetasNumero items={[
                { label: 'Abrazos por semana (promedio)', valor: datos.promedioAbrazosPorSemana },
                { label: 'Reciben menos de la mitad', valor: datos.bebesPorDebajo },
            ]} />
            <Typography sx={{ fontSize: '0.8rem', color: TEXTO_SECUNDARIO, mb: 1 }}>
                Abrazos por semana de internación de cada bebé activo, de menos a más. Se marcan los que reciben menos de la mitad del promedio.
            </Typography>
            {bebes.map((b) => (
                <FilaLista
                    key={b.idBebe}
                    titulo={b.nombre}
                    subtitulo={[b.sala, `${b.abrazos} abrazos en ${b.diasInternado} días`].filter(Boolean).join(' · ')}
                    derecha={b.porDebajoDelPromedio ? (
                        <Chip size="small" icon={<WarningAmberIcon sx={{ fontSize: 16 }} />} label="Por debajo" sx={{ fontWeight: 600, bgcolor: 'rgba(255,152,0,0.14)', color: '#8A4B00', '& .MuiChip-icon': { color: '#B26A00' } }} />
                    ) : (
                        <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>{b.abrazosPorSemana}/sem</Typography>
                    )}
                >
                    <BarraPorcentaje porcentaje={maximo > 0 ? (b.abrazosPorSemana / maximo) * 100 : 0} />
                </FilaLista>
            ))}
        </Box>
    );
}

export default EquidadBebes;
