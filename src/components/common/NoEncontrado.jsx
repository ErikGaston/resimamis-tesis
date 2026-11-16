import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from './PageHeader';

/**
 * Pantalla para un recurso que no existe (id inválido o borrado) o una ruta desconocida.
 * Reemplaza al esqueleto de carga, que antes quedaba girando para siempre.
 */
export const NoEncontrado = ({ titulo = 'No encontrado', mensaje = 'Lo que buscás no existe o ya no está disponible.' }) => {
  const navigate = useNavigate();
  return (
    <>
      <PageHeader title={titulo} />
      <Box sx={{ px: 3, pt: 5, pb: 4, textAlign: 'center' }}>
        <Typography sx={{ color: '#152C70', fontSize: '1rem', mb: 3 }}>{mensaje}</Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/overview', { replace: true })}
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: '10px',
            background: 'linear-gradient(90deg, #7F00FF 0%, #E100FF 100%)',
          }}
        >
          Volver al inicio
        </Button>
      </Box>
    </>
  );
};

/** `true` si el parámetro de la URL es un id entero positivo. */
export const esIdValido = (id) => /^\d+$/.test(String(id ?? '')) && Number(id) > 0;

export default NoEncontrado;
