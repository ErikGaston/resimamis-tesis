import React, { useEffect } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Box, Button, Fab, IconButton, Typography, Paper, TextField, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import CardSupply from '../../molecules/cardSupply/CardSupply';
import { fabBottomAboveNav } from '../../../utils/listScreenAccessibility';

function listSupplyMovementsFromResponse(raw) {
  if (raw == null) return null;
  const d = raw?.resultado ?? raw?.data ?? raw;
  if (Array.isArray(d)) return d;
  const keys = ['listadoMovimientos', 'movimientos', 'items', 'resultado'];
  for (const k of keys) {
    if (Array.isArray(d?.[k])) return d[k];
  }
  return null;
}

function summarizeSupplyMovementRow(row) {
  if (row == null || typeof row !== 'object') {
    return row != null ? String(row) : '';
  }
  const nombre = row.nombreInsumo ?? row.insumoNombre ?? row.nombre;
  const bits = [
    row.idMovimiento != null && `Mov. #${row.idMovimiento}`,
    nombre && String(nombre),
    row.idInsumo != null && !nombre && `Insumo #${row.idInsumo}`,
    row.cantidad != null && `${row.cantidad} u.`,
    row.fechaMovimiento && new Date(row.fechaMovimiento).toLocaleString(),
    row.esEntrada != null && `Tipo: ${row.esEntrada}`,
    row.observacion && `Obs.: ${row.observacion}`,
  ].filter(Boolean);
  return bits.length ? bits.join(' · ') : JSON.stringify(row);
}

const SupplyTemplate = (props) => {
  const {
    valueTask,
    changeTask,
    supplies,
    movementsData,
    providersData,
    onRegisterSupplyMovement,
    idVoluntariaDefault,
  } = props;
  const navigate = useNavigate();
  const [listSupplies, setListSupplies] = React.useState(null);
  const [movIdInsumo, setMovIdInsumo] = React.useState('');
  const [movCantidad, setMovCantidad] = React.useState('');
  const [movEsEntrada, setMovEsEntrada] = React.useState('S');
  const [movIdProveedor, setMovIdProveedor] = React.useState('__none__');
  const [movObservacion, setMovObservacion] = React.useState('');
  const [movIdBebe, setMovIdBebe] = React.useState('');

  const functionBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (supplies) {
      setListSupplies(supplies);
    }
  }, [supplies]);

  const providerRows = Array.isArray(providersData?.resultado) ? providersData.resultado : [];

  const goToRegistrarMovimiento = () => {
    changeTask(2)();
    window.setTimeout(() => {
      document
        .getElementById('supply-register-movement')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  };

  const submitMovement = () => {
    if (typeof onRegisterSupplyMovement !== 'function') return;
    const idInsumo = movIdInsumo === '' ? null : Number(movIdInsumo);
    const cantidad = movCantidad === '' ? null : Number(movCantidad);
    if (idInsumo == null || Number.isNaN(idInsumo) || cantidad == null || Number.isNaN(cantidad)) {
      return;
    }
    const body = {
      idInsumo,
      cantidad,
      esEntrada: movEsEntrada || null,
      observacion: movObservacion.trim() || null,
      idProveedor:
        movIdProveedor === '' || movIdProveedor === '__none__' ? null : Number(movIdProveedor),
      idVoluntaria: idVoluntariaDefault != null ? Number(idVoluntariaDefault) : null,
      idBebe: movIdBebe === '' ? null : Number(movIdBebe),
    };
    onRegisterSupplyMovement(body);
  };

  return (
    <div style={{ height: '100%' }}>
      <HeaderBar>
        <IconButton
          onClick={functionBack}
          aria-label="Volver a la pantalla anterior"
          sx={{
            color: '#fff',
            minWidth: 48,
            minHeight: 48,
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.12)' },
          }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 22 }} />
        </IconButton>
        <Typography
          component="h1"
          id="supply-screen-title"
          sx={{
            flex: 1,
            textAlign: 'center',
            color: '#fff',
            fontWeight: 600,
            fontSize: '1.15rem',
            letterSpacing: '0.04em',
            pr: '48px',
          }}
        >
          Insumos
        </Typography>
      </HeaderBar>

      <Box
        sx={{
          display: 'flex',
          gap: 1,
          px: 1.5,
          py: 1,
          bgcolor: '#F3E5F5',
        }}
        role="tablist"
        aria-label="Tipo de vista de insumos"
      >
        <Button
          role="tab"
          aria-selected={valueTask === 1}
          id="tab-supply-list"
          aria-controls="panel-supply-list"
          onClick={changeTask(1)}
          fullWidth
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            minHeight: 44,
            borderRadius: 2,
            bgcolor: valueTask === 1 ? '#8F00FF' : '#fff',
            color: valueTask === 1 ? '#fff' : '#4A148C',
            border: '2px solid',
            borderColor: valueTask === 1 ? '#6A1B9A' : '#9575CD',
            boxShadow: valueTask === 1 ? '0 2px 8px rgba(106, 27, 154, 0.35)' : 'none',
            '&:focus-visible': { outline: '3px solid #FFEB3B', outlineOffset: 2 },
          }}
        >
          Lista de insumos
        </Button>
        <Button
          role="tab"
          aria-selected={valueTask === 2}
          id="tab-supply-movements"
          aria-controls="panel-supply-movements"
          onClick={changeTask(2)}
          fullWidth
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            minHeight: 44,
            borderRadius: 2,
            bgcolor: valueTask === 2 ? '#8F00FF' : '#fff',
            color: valueTask === 2 ? '#fff' : '#4A148C',
            border: '2px solid',
            borderColor: valueTask === 2 ? '#6A1B9A' : '#9575CD',
            boxShadow: valueTask === 2 ? '0 2px 8px rgba(106, 27, 154, 0.35)' : 'none',
            '&:focus-visible': { outline: '3px solid #FFEB3B', outlineOffset: 2 },
          }}
        >
          Movimientos
        </Button>
      </Box>

      {valueTask === 1 && (
        <Box
          id="panel-supply-list"
          role="tabpanel"
          aria-labelledby="tab-supply-list"
          sx={{ pb: 14 }}
        >
          {listSupplies &&
            listSupplies.map((item) => (
              <Box
                key={item.idInsumo}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  mt: 1.25,
                }}
              >
                <CardSupply
                  first={item.nombre}
                  second={`Stock: ${item.stockActual} U`}
                  textColor={item.stockActual <= item.stockMinimo ? '#C2185B' : '#152C70'}
                />
              </Box>
            ))}
          <Fab
            aria-label="Registrar movimiento de stock"
            onClick={goToRegistrarMovimiento}
            sx={{
              position: 'fixed',
              left: '50%',
              transform: 'translateX(-50%)',
              bottom: fabBottomAboveNav,
              zIndex: 9,
              width: 56,
              height: 56,
              background: 'linear-gradient(135deg, #A54DFF 0%, #8F00FF 100%)',
              boxShadow: '0 6px 20px rgba(143, 0, 255, 0.35)',
              '&:focus-visible': { outline: '3px solid #FFEB3B', outlineOffset: 2 },
            }}
          >
            <AddCircleIcon sx={{ fontSize: 32, color: '#fff' }} />
          </Fab>
        </Box>
      )}
           {valueTask === 2 && (
        <Box
          id="panel-supply-movements"
          role="tabpanel"
          aria-labelledby="tab-supply-movements"
          sx={{ px: 2, py: 2, pb: 14 }}
        >
          <Typography sx={{ color: '#152C70', fontWeight: 600, mb: 1, fontSize: '0.95rem' }}>
            Movimientos (últimos 30 días)
          </Typography>
          {typeof onRegisterSupplyMovement === 'function' && (
            <Paper
              id="supply-register-movement"
              elevation={0}
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 2,
                border: '1px solid rgba(143, 0, 255, 0.2)',
                bgcolor: 'rgba(243, 229, 245, 0.35)',
                scrollMarginTop: 16,
              }}
            >
              <Typography sx={{ fontWeight: 600, color: '#152C70', mb: 1.5, fontSize: '0.9rem' }}>
                Registrar movimiento de stock
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="mov-insumo-label">Insumo</InputLabel>
                  <Select
                    labelId="mov-insumo-label"
                    label="Insumo"
                    value={movIdInsumo}
                    onChange={(e) => setMovIdInsumo(e.target.value)}
                  >
                    {(listSupplies ?? supplies ?? []).map((s) => (
                      <MenuItem key={s.idInsumo} value={String(s.idInsumo)}>
                        {s.nombre ?? `Insumo #${s.idInsumo}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  size="small"
                  fullWidth
                  type="number"
                  label="Cantidad"
                  value={movCantidad}
                  onChange={(e) => setMovCantidad(e.target.value)}
                  inputProps={{ min: 1 }}
                />
                <FormControl fullWidth size="small">
                  <InputLabel id="mov-tipo-label">Entrada / salida</InputLabel>
                  <Select
                    labelId="mov-tipo-label"
                    label="Entrada / salida"
                    value={movEsEntrada}
                    onChange={(e) => setMovEsEntrada(e.target.value)}
                  >
                    <MenuItem value="S">Entrada</MenuItem>
                    <MenuItem value="N">Salida</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth size="small">
                  <InputLabel id="mov-prov-label">Proveedor (opcional)</InputLabel>
                  <Select
                    labelId="mov-prov-label"
                    label="Proveedor (opcional)"
                    value={movIdProveedor}
                    onChange={(e) => setMovIdProveedor(e.target.value)}
                  >
                    <MenuItem value="__none__">—</MenuItem>
                    {providerRows.map((p) => {
                      const pid = p.idProveedor ?? p.id;
                      if (pid == null) return null;
                      return (
                        <MenuItem key={pid} value={String(pid)}>
                          {p.nombre ?? p.razonSocial ?? `Proveedor #${pid}`}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <TextField
                  size="small"
                  fullWidth
                  type="number"
                  label="Id bebé (opcional)"
                  value={movIdBebe}
                  onChange={(e) => setMovIdBebe(e.target.value)}
                />
                <TextField
                  size="small"
                  fullWidth
                  label="Observación (opcional)"
                  value={movObservacion}
                  onChange={(e) => setMovObservacion(e.target.value)}
                  multiline
                  minRows={2}
                />
                <Button
                  variant="contained"
                  onClick={submitMovement}
                  disabled={
                    movIdInsumo === '' ||
                    movCantidad === '' ||
                    Number.isNaN(Number(movCantidad)) ||
                    Number(movCantidad) === 0
                  }
                  sx={{
                    textTransform: 'none',
                    background: 'linear-gradient(90deg, #7F00FF 0%, #E100FF 100%)',
                  }}
                >
                  Registrar movimiento
                </Button>
              </Box>
            </Paper>
          )}
          {(() => {
            const rows = listSupplyMovementsFromResponse(movementsData);
            if (!rows?.length) {
              return (
                <Typography sx={{ color: 'rgba(21, 44, 112, 0.75)', textAlign: 'center', py: 3 }}>
                  {movementsData == null
                    ? 'Cargando…'
                    : 'No hay movimientos en este período o el servidor devolvió un formato distinto.'}
                </Typography>
              );
            }
            return rows.map((row, idx) => (
              <Paper
                key={row.idMovimiento ?? row.id ?? idx}
                elevation={0}
                sx={{
                  p: 1.5,
                  mb: 1.25,
                  borderRadius: 2,
                  border: '1px solid rgba(143, 0, 255, 0.12)',
                  bgcolor: '#fff',
                }}
              >
                <Typography sx={{ fontSize: '0.9rem', color: '#152C70', fontWeight: 500 }}>
                  {summarizeSupplyMovementRow(row)}
                </Typography>
                <Typography
                  component="pre"
                  variant="caption"
                  sx={{
                    display: 'block',
                    mt: 0.75,
                    color: 'rgba(21, 44, 112, 0.55)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontSize: 11,
                  }}
                >
                  {JSON.stringify(row, null, 2)}
                </Typography>
              </Paper>
            ));
          })()}
          {providerRows.length > 0 && (
            <Typography sx={{ color: 'rgba(21, 44, 112, 0.6)', fontSize: '0.8rem', mt: 2 }}>
              Proveedores disponibles: {providerRows.length}
            </Typography>
          )}
        </Box>
      )}
    </div>
  );
};

export default SupplyTemplate;

const HeaderBar = styled(Box)`
  display: flex;
  align-items: center;
  background: linear-gradient(90deg, #8f00ff 0%, #a54dff 100%);
  padding: 8px 4px 10px;
`;
