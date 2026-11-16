import React, { useState } from 'react';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import BabyForm from '../../molecules/motherForm/BabyForm';
import { validateBabyForm, INITIAL_BABY_FIELD_ERRORS } from '../../../utils/babyFormValidation';
import { normalizeBabyForAlta } from '../../../utils/babyPayload';
import { erroresVisibles } from '../../../utils/erroresVisibles';
import { coincideBusqueda, ordenarPorNombre } from '../../../utils/textSearch';

const GRADIENT = 'linear-gradient(90deg, #7F00FF 0%, #E100FF 100%)';
const NAVY = '#152C70';
const MAX_RESULTADOS = 8;

const btnPrincipal = {
    textTransform: 'none', fontWeight: 700, fontSize: '1rem', minHeight: 44, borderRadius: '10px',
    background: GRADIENT, boxShadow: '0 4px 14px rgba(127,0,255,0.28)', color: '#fff',
    '&.Mui-disabled': { opacity: 0.45, boxShadow: 'none', color: '#fff' },
};

const nombreCompleto = (m) => [m?.nombre, m?.apellido].filter(Boolean).join(' ');

/**
 * Alta de un bebé para una madre que ya está registrada (hermanos): se busca la madre por nombre,
 * apellido o DNI y se registra solo el bebé, sin volver a cargar ni duplicar a la madre.
 */
const AltaBebeMadreExistente = ({ madres, listLocalities, salaOptions, onRegistrar }) => {
    const [busqueda, setBusqueda] = useState('');
    const [madre, setMadre] = useState(null);
    const [bebe, setBebe] = useState({});
    const [errores, setErrores] = useState({ ...INITIAL_BABY_FIELD_ERRORS });

    const consulta = busqueda.trim();
    const buscando = consulta.length >= 2;
    const coincidencias = buscando
        ? ordenarPorNombre((madres ?? []).filter((m) => coincideBusqueda(consulta, [nombreCompleto(m)], m.dni)), nombreCompleto)
        : [];

    const validacion = validateBabyForm(bebe);
    const errorDeCampos = erroresVisibles(bebe, errores, validacion.errors);

    const registrar = () => {
        const { ok, errors } = validateBabyForm(bebe);
        setErrores(errors);
        if (!ok || !madre) return;
        onRegistrar({ ...normalizeBabyForAlta(bebe), idMadre: madre.idMadre });
    };

    if (madre) {
        return (
            <Box sx={{ px: 2.5 }}>
                <Paper elevation={0} sx={{ p: 1.5, mb: 2, borderRadius: 2, border: '1px solid rgba(122,101,155,0.3)', bgcolor: '#F3EEFF', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ color: NAVY, fontWeight: 700 }}>{nombreCompleto(madre)}</Typography>
                        <Typography sx={{ color: 'rgba(21,44,112,0.75)', fontSize: '0.85rem' }}>DNI {madre.dni}</Typography>
                    </Box>
                    <Button onClick={() => setMadre(null)} sx={{ textTransform: 'none', minHeight: 44, color: '#7A659B', fontWeight: 600 }}>
                        Cambiar
                    </Button>
                </Paper>
                <BabyForm
                    model={bebe}
                    setModel={setBebe}
                    listLocalities={listLocalities}
                    listMothers={null}
                    madreFija
                    madreDisplayName={nombreCompleto(madre)}
                    fieldErrors={errorDeCampos}
                    salaOptions={salaOptions}
                />
                <Button variant="contained" fullWidth disabled={!validacion.ok} onClick={registrar} sx={{ ...btnPrincipal, mt: 2, mb: 4 }}>
                    Registrar bebé
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ px: 2.5 }}>
            <Typography sx={{ color: NAVY, fontWeight: 600, mb: 1 }}>Buscar madre</Typography>
            <TextField
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Nombre, apellido o DNI"
                size="small"
                fullWidth
                autoFocus
                helperText={buscando ? '' : 'Escribí al menos 2 letras o números.'}
                sx={{ mb: 1.5 }}
            />

            {buscando && coincidencias.length === 0 && (
                <Typography sx={{ color: 'rgba(21,44,112,0.75)', fontSize: '0.9rem', mb: 2 }}>
                    No hay una madre activa que coincida. Registrala como madre nueva.
                </Typography>
            )}

            {coincidencias.length > 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                    {coincidencias.slice(0, MAX_RESULTADOS).map((m) => (
                        <Paper
                            key={m.idMadre}
                            component="button"
                            type="button"
                            elevation={0}
                            onClick={() => setMadre(m)}
                            sx={{
                                p: 1.5, minHeight: 56, textAlign: 'left', cursor: 'pointer', font: 'inherit',
                                borderRadius: 2, border: '1px solid rgba(0,0,0,0.1)', bgcolor: '#fff',
                                '&:hover, &:focus-visible': { borderColor: '#7A659B', bgcolor: '#F3EEFF' },
                            }}
                        >
                            <Typography sx={{ color: NAVY, fontWeight: 600 }}>{nombreCompleto(m)}</Typography>
                            <Typography sx={{ color: 'rgba(21,44,112,0.75)', fontSize: '0.85rem' }}>DNI {m.dni}</Typography>
                        </Paper>
                    ))}
                    {coincidencias.length > MAX_RESULTADOS && (
                        <Typography sx={{ color: 'rgba(21,44,112,0.75)', fontSize: '0.8rem' }}>
                            Hay {coincidencias.length - MAX_RESULTADOS} más: escribí el apellido completo o el DNI para acotar.
                        </Typography>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default AltaBebeMadreExistente;
