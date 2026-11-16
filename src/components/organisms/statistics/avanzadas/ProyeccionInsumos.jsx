import React, { useState } from 'react';
import { Box, Chip, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { FilaLista, SelectorOpciones, SinDatos, TEXTO_SECUNDARIO } from './comunes';

// El estado va siempre con ícono y texto: el color solo no alcanza para distinguirlo.
const ESTADOS = {
    'Bajo mínimo': { icono: ErrorOutlineIcon, bgcolor: 'rgba(197,56,20,0.12)', color: '#9C2B0F' },
    'Crítico': { icono: ReportProblemOutlinedIcon, bgcolor: 'rgba(230,81,0,0.12)', color: '#A33D00' },
    'Atención': { icono: WarningAmberIcon, bgcolor: 'rgba(255,193,7,0.18)', color: '#7A5A00' },
    'OK': { icono: CheckCircleOutlineIcon, bgcolor: 'rgba(0,168,107,0.12)', color: '#00664A' },
    'Sin consumo': { icono: RemoveCircleOutlineIcon, bgcolor: 'rgba(0,0,0,0.06)', color: '#4A5263' },
};

const PERIODOS_CONSUMO = [
    { valor: 15, label: '15 días' },
    { valor: 30, label: '30 días' },
    { valor: 90, label: '90 días' },
];

const textoDias = (n) => (n == null ? null : `${n} ${n === 1 ? 'día' : 'días'}`);

export function ProyeccionInsumos({ datos, onConsultar }) {
    const [dias, setDias] = useState(30);
    const cambiar = (valor) => { setDias(valor); onConsultar({ dias: valor }); };
    const insumos = datos?.insumos ?? [];

    return (
        <Box>
            <SelectorOpciones opciones={PERIODOS_CONSUMO} valor={dias} onCambiar={cambiar} etiqueta="Consumo promedio de los últimos" />
            {!datos ? null : insumos.length === 0 ? <SinDatos detalle="No hay insumos activos." /> : insumos.map((i) => {
                const estado = ESTADOS[i.estado] ?? ESTADOS['Sin consumo'];
                const Icono = estado.icono;
                const hastaMinimo = textoDias(i.diasHastaMinimo);
                const hastaAgotarse = textoDias(i.diasHastaAgotarse);
                return (
                    <FilaLista
                        key={i.idInsumo}
                        titulo={i.nombre}
                        subtitulo={`Stock ${i.stockActual} (mínimo ${i.stockMinimo}) · ${i.consumoDiarioPromedio}/día`}
                        derecha={(
                            <Chip
                                size="small"
                                icon={<Icono sx={{ fontSize: 16 }} />}
                                label={i.estado}
                                sx={{ fontWeight: 600, bgcolor: estado.bgcolor, color: estado.color, '& .MuiChip-icon': { color: estado.color } }}
                            />
                        )}
                    >
                        {(hastaMinimo || hastaAgotarse) && (
                            <Typography sx={{ fontSize: '0.78rem', color: TEXTO_SECUNDARIO }}>
                                {[hastaMinimo && `Llega al mínimo en ${hastaMinimo}`, hastaAgotarse && `se agota en ${hastaAgotarse}`].filter(Boolean).join(' · ')}
                            </Typography>
                        )}
                    </FilaLista>
                );
            })}
        </Box>
    );
}

export default ProyeccionInsumos;
