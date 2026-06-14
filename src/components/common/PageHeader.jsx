import React from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { useNavigate } from 'react-router-dom'

/**
 * Cabecera unificada para todas las pantallas.
 * Props:
 *   title       — texto del h1 (requerido)
 *   onBack      — override del handler de volver (default: navigate(-1))
 *   showBack    — mostrar botón volver (default: true)
 *   rightAction — elemento React opcional en el slot derecho (ej: IconButton editar)
 */
export const PageHeader = ({ title, onBack, showBack = true, rightAction }) => {
  const navigate = useNavigate()
  const handleBack = onBack ?? (() => navigate(-1))

  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(90deg, #6a00cc 0%, #8F00FF 55%, #a54dff 100%)',
        minHeight: 52,
        flexShrink: 0,
        boxShadow: '0 2px 8px rgba(143,0,255,0.22)',
      }}
    >
      {showBack ? (
        <IconButton
          onClick={handleBack}
          aria-label="Volver"
          sx={{
            color: '#fff',
            width: 48,
            height: 48,
            flexShrink: 0,
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.12)' },
          }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 20 }} />
        </IconButton>
      ) : (
        <Box sx={{ width: 48, flexShrink: 0 }} />
      )}

      <Typography
        component="h1"
        sx={{
          flex: 1,
          textAlign: 'center',
          color: '#fff',
          fontWeight: 600,
          fontSize: '1.1rem',
          letterSpacing: '0.04em',
        }}
      >
        {title}
      </Typography>

      {rightAction != null ? (
        <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', width: 48, justifyContent: 'center' }}>
          {rightAction}
        </Box>
      ) : (
        <Box sx={{ width: 48, flexShrink: 0 }} />
      )}
    </Box>
  )
}
