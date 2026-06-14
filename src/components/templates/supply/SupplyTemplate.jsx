import React, { useEffect } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { PageHeader } from '../../common/PageHeader';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import CardSupply from '../../molecules/cardSupply/CardSupply';
import { fabBottomAboveNav } from '../../../utils/listScreenAccessibility';

const BTN_GRADIENT = 'linear-gradient(135deg, #7F00FF 0%, #8F00FF 100%)';
const BTN_GRADIENT_HOVER = 'linear-gradient(135deg, #6A00D6 0%, #7800D6 100%)';
const BTN_SX = {
  textTransform: 'none',
  fontWeight: 700,
  minHeight: 44,
  borderRadius: 2,
  color: '#fff',
  background: BTN_GRADIENT,
  boxShadow: '0 4px 14px rgba(127,0,255,0.28)',
  '&:hover': { background: BTN_GRADIENT_HOVER, boxShadow: '0 6px 18px rgba(127,0,255,0.38)' },
  '&.Mui-disabled': { opacity: 0.45, boxShadow: 'none', color: '#fff' },
};
const BTN_CANCEL_SX = {
  textTransform: 'none',
  fontWeight: 600,
  minHeight: 44,
  borderRadius: 2,
  color: '#4A148C',
  '&:hover': { bgcolor: 'rgba(74,20,140,0.06)' },
};

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

const SupplyTemplate = (props) => {
  const {
    valueTask,
    changeTask,
    supplies,
    movementsData,
    providersData,
    onRegisterSupplyMovement,
    onCreateSupply,
    createSupplyCloseSignal,
    movementCloseSignal,
    idVoluntariaDefault,
  } = props;

  const [listSupplies, setListSupplies] = React.useState(null);

  // Estado dialog nuevo insumo
  const [registerDialogOpen, setRegisterDialogOpen] = React.useState(false);
  const [newNombre, setNewNombre] = React.useState('');
  const [newDescripcion, setNewDescripcion] = React.useState('');
  const [newStockMin, setNewStockMin] = React.useState('0');
  const [newStockMax, setNewStockMax] = React.useState('1000');
  const [newStockActual, setNewStockActual] = React.useState('0');

  // Estado dialog nuevo movimiento
  const [movDialogOpen, setMovDialogOpen] = React.useState(false);
  const [movIdInsumo, setMovIdInsumo] = React.useState('');
  const [movCantidad, setMovCantidad] = React.useState('');
  const [movEsEntrada, setMovEsEntrada] = React.useState('S');
  const [movIdProveedor, setMovIdProveedor] = React.useState('__none__');
  const [movObservacion, setMovObservacion] = React.useState('');
  const [movIdBebe, setMovIdBebe] = React.useState('');

  useEffect(() => {
    if (supplies) setListSupplies(supplies);
  }, [supplies]);

  const providerRows = Array.isArray(providersData?.data?.listadoDeProveedores)
    ? providersData.data.listadoDeProveedores
    : [];

  // Cerrar dialog de insumo al éxito
  useEffect(() => {
    if (createSupplyCloseSignal > 0) {
      setRegisterDialogOpen(false);
      setNewNombre('');
      setNewDescripcion('');
      setNewStockMin('0');
      setNewStockMax('1000');
      setNewStockActual('0');
    }
  }, [createSupplyCloseSignal]);

  // Cerrar dialog de movimiento al éxito
  useEffect(() => {
    if (movementCloseSignal > 0) {
      closeMovDialog();
    }
  }, [movementCloseSignal]);

  const closeMovDialog = () => {
    setMovDialogOpen(false);
    setMovIdInsumo('');
    setMovCantidad('');
    setMovEsEntrada('S');
    setMovIdProveedor('__none__');
    setMovObservacion('');
    setMovIdBebe('');
  };

  const submitNewSupply = () => {
    if (typeof onCreateSupply !== 'function') return;
    const nombre = newNombre.trim();
    const smin = Number(newStockMin);
    const smax = Number(newStockMax);
    const sact = Number(newStockActual);
    if (!nombre || [smin, smax, sact].some((n) => Number.isNaN(n) || n < 0)) return;
    if (smax < smin) return;
    onCreateSupply({
      nombre,
      descripcion: newDescripcion.trim() || null,
      stockMinimo: Math.floor(smin),
      stockMaximo: Math.floor(smax),
      stockActual: Math.floor(sact),
    });
  };

  const submitMovement = () => {
    if (typeof onRegisterSupplyMovement !== 'function') return;
    const idInsumo = movIdInsumo === '' ? null : Number(movIdInsumo);
    const cantidad = movCantidad === '' ? null : Number(movCantidad);
    if (idInsumo == null || Number.isNaN(idInsumo) || cantidad == null || Number.isNaN(cantidad)) return;
    onRegisterSupplyMovement({
      idInsumo,
      cantidad,
      esEntrada: movEsEntrada || null,
      observacion: movObservacion.trim() || null,
      idProveedor:
        movIdProveedor === '' || movIdProveedor === '__none__' ? null : Number(movIdProveedor),
      idVoluntaria: idVoluntariaDefault != null ? Number(idVoluntariaDefault) : null,
      idBebe: movIdBebe === '' ? null : Number(movIdBebe),
    });
  };

  const movFormValid =
    movIdInsumo !== '' &&
    movCantidad !== '' &&
    !Number.isNaN(Number(movCantidad)) &&
    Number(movCantidad) > 0;

  return (
    <div style={{ height: '100%' }}>
      <PageHeader title="Insumos" />

      {/* Tab bar */}
      <Box
        sx={{ display: 'flex', gap: 1, px: 1.5, py: 1, bgcolor: '#F3E5F5' }}
        role="tablist"
        aria-label="Tipo de vista de insumos"
      >
        {[
          { value: 1, label: 'Lista de insumos', id: 'tab-supply-list', controls: 'panel-supply-list' },
          { value: 2, label: 'Movimientos', id: 'tab-supply-movements', controls: 'panel-supply-movements' },
        ].map((tab) => (
          <Button
            key={tab.value}
            role="tab"
            aria-selected={valueTask === tab.value}
            id={tab.id}
            aria-controls={tab.controls}
            onClick={changeTask(tab.value)}
            fullWidth
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              minHeight: 44,
              borderRadius: 2,
              bgcolor: valueTask === tab.value ? '#8F00FF' : '#fff',
              color: valueTask === tab.value ? '#fff' : '#4A148C',
              border: '2px solid',
              borderColor: valueTask === tab.value ? '#6A1B9A' : '#9575CD',
              boxShadow: valueTask === tab.value ? '0 2px 8px rgba(106,27,154,0.35)' : 'none',
              '&:focus-visible': { outline: '3px solid #FFEB3B', outlineOffset: 2 },
            }}
          >
            {tab.label}
          </Button>
        ))}
      </Box>

      {/* ── Tab 1: Lista de insumos ── */}
      {valueTask === 1 && (
        <Box
          id="panel-supply-list"
          role="tabpanel"
          aria-labelledby="tab-supply-list"
          sx={{ pb: 14, px: 2 }}
        >
          {listSupplies &&
            listSupplies.map((item) => (
              <Box
                key={item.idInsumo}
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1.25 }}
              >
                <CardSupply
                  first={item.nombre}
                  second={`Stock: ${item.stockActual} U`}
                  textColor={item.stockActual <= item.stockMinimo ? '#C2185B' : '#152C70'}
                  stockActual={item.stockActual}
                  stockMinimo={item.stockMinimo}
                  stockMaximo={item.stockMaximo}
                />
              </Box>
            ))}

          <Fab
            aria-label="Agregar insumo al catálogo"
            onClick={() => setRegisterDialogOpen(true)}
            sx={{
              position: 'fixed',
              left: '50%',
              transform: 'translateX(-50%)',
              bottom: fabBottomAboveNav,
              zIndex: 9,
              width: 56,
              height: 56,
              background: BTN_GRADIENT,
              boxShadow: '0 6px 20px rgba(143,0,255,0.35)',
              '&:focus-visible': { outline: '3px solid #FFEB3B', outlineOffset: 2 },
            }}
          >
            <AddCircleIcon sx={{ fontSize: 32, color: '#fff' }} />
          </Fab>

          {/* Dialog: Nuevo insumo */}
          <Dialog
            open={registerDialogOpen}
            onClose={() => setRegisterDialogOpen(false)}
            fullWidth
            maxWidth="sm"
            aria-labelledby="register-supply-dialog-title"
          >
            <DialogTitle id="register-supply-dialog-title" sx={{ color: '#4A148C', fontWeight: 700 }}>
              Nuevo insumo
            </DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <Typography variant="body2" sx={{ color: 'rgba(21,44,112,0.7)' }}>
                Registrá un ítem en el catálogo. Para entradas/salidas de stock usá la pestaña Movimientos.
              </Typography>
              <TextField
                autoFocus
                required
                label="Nombre"
                value={newNombre}
                onChange={(e) => setNewNombre(e.target.value)}
                fullWidth
                size="small"
              />
              <TextField
                label="Descripción (opcional)"
                value={newDescripcion}
                onChange={(e) => setNewDescripcion(e.target.value)}
                fullWidth
                size="small"
                multiline
                minRows={2}
              />
              <TextField
                label="Stock inicial"
                type="number"
                value={newStockActual}
                onChange={(e) => setNewStockActual(e.target.value)}
                fullWidth
                size="small"
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Stock mínimo (alerta)"
                type="number"
                value={newStockMin}
                onChange={(e) => setNewStockMin(e.target.value)}
                fullWidth
                size="small"
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Stock máximo"
                type="number"
                value={newStockMax}
                onChange={(e) => setNewStockMax(e.target.value)}
                fullWidth
                size="small"
                inputProps={{ min: 0 }}
              />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
              <Button onClick={() => setRegisterDialogOpen(false)} sx={BTN_CANCEL_SX}>
                Cancelar
              </Button>
              <Button
                variant="contained"
                onClick={submitNewSupply}
                disabled={
                  !newNombre.trim() ||
                  Number.isNaN(Number(newStockMin)) ||
                  Number.isNaN(Number(newStockMax)) ||
                  Number.isNaN(Number(newStockActual)) ||
                  Number(newStockMin) < 0 ||
                  Number(newStockMax) < 0 ||
                  Number(newStockActual) < 0 ||
                  Number(newStockMax) < Number(newStockMin)
                }
                sx={BTN_SX}
              >
                Guardar insumo
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}

      {/* ── Tab 2: Movimientos ── */}
      {valueTask === 2 && (
        <Box
          id="panel-supply-movements"
          role="tabpanel"
          aria-labelledby="tab-supply-movements"
          sx={{ px: 2, pt: 2, pb: 14 }}
        >
          <Typography
            sx={{
              color: 'rgba(21,44,112,0.45)',
              fontWeight: 700,
              fontSize: '0.68rem',
              textTransform: 'uppercase',
              letterSpacing: '0.09em',
              mb: 1.5,
            }}
          >
            Últimos movimientos
          </Typography>

          {(() => {
            const rows = listSupplyMovementsFromResponse(movementsData);
            if (!rows?.length) {
              return (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6, gap: 1.5 }}>
                  <SwapVertIcon sx={{ fontSize: 48, color: 'rgba(143,0,255,0.18)' }} />
                  <Typography sx={{ color: 'rgba(21,44,112,0.5)', fontSize: '0.9rem', textAlign: 'center' }}>
                    {movementsData == null ? 'Cargando movimientos…' : 'Sin movimientos en este período'}
                  </Typography>
                </Box>
              );
            }
            return rows.map((row, idx) => {
              const isEntrada = row.esEntrada === true || row.esEntrada === 'S';
              const nombre =
                row.nombreInsumo ?? row.insumoNombre ?? row.nombre ?? `Insumo #${row.idInsumo ?? idx}`;
              const fecha = row.fechaMovimiento
                ? new Date(row.fechaMovimiento).toLocaleString('es-AR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : null;
              return (
                <Paper
                  key={row.idMovimiento ?? row.id ?? idx}
                  elevation={0}
                  sx={{
                    display: 'flex',
                    gap: 1.5,
                    p: 1.75,
                    mb: 1.25,
                    borderRadius: '16px',
                    border: '1px solid rgba(143,0,255,0.08)',
                    boxShadow: '0 2px 12px rgba(21,44,112,0.07)',
                    bgcolor: '#fff',
                  }}
                >
                  <Box
                    sx={{
                      flexShrink: 0,
                      width: 40,
                      height: 40,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: isEntrada ? 'rgba(0,168,107,0.1)' : 'rgba(197,56,20,0.09)',
                    }}
                  >
                    {isEntrada ? (
                      <ArrowDownwardIcon sx={{ fontSize: 22, color: '#00A86B' }} />
                    ) : (
                      <ArrowUpwardIcon sx={{ fontSize: 22, color: '#C53814' }} />
                    )}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 1,
                        mb: 0.4,
                      }}
                    >
                      <Typography
                        sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#152C70', lineHeight: 1.3 }}
                        noWrap
                      >
                        {nombre}
                      </Typography>
                      <Chip
                        label={isEntrada ? 'Entrada' : 'Salida'}
                        size="small"
                        sx={{
                          bgcolor: isEntrada ? 'rgba(0,168,107,0.12)' : 'rgba(197,56,20,0.1)',
                          color: isEntrada ? '#007A4D' : '#C53814',
                          fontWeight: 700,
                          fontSize: '0.68rem',
                          height: 20,
                          flexShrink: 0,
                          '& .MuiChip-label': { px: 1 },
                        }}
                      />
                    </Box>
                    <Typography
                      sx={{ fontSize: '0.82rem', color: 'rgba(21,44,112,0.7)', fontWeight: 500, lineHeight: 1.4 }}
                    >
                      {row.cantidad != null ? `${row.cantidad} u.` : '—'}
                      {fecha ? ` · ${fecha}` : ''}
                    </Typography>
                    {row.observacion && (
                      <Typography
                        sx={{
                          fontSize: '0.78rem',
                          color: 'rgba(21,44,112,0.48)',
                          mt: 0.3,
                          fontStyle: 'italic',
                          lineHeight: 1.35,
                        }}
                      >
                        {row.observacion}
                      </Typography>
                    )}
                  </Box>
                </Paper>
              );
            });
          })()}

          {/* FAB: Registrar movimiento */}
          {typeof onRegisterSupplyMovement === 'function' && (
            <Fab
              aria-label="Registrar movimiento de stock"
              onClick={() => setMovDialogOpen(true)}
              sx={{
                position: 'fixed',
                left: '50%',
                transform: 'translateX(-50%)',
                bottom: fabBottomAboveNav,
                zIndex: 9,
                width: 56,
                height: 56,
                background: BTN_GRADIENT,
                boxShadow: '0 6px 20px rgba(143,0,255,0.35)',
                '&:focus-visible': { outline: '3px solid #FFEB3B', outlineOffset: 2 },
              }}
            >
              <SwapVertIcon sx={{ fontSize: 28, color: '#fff' }} />
            </Fab>
          )}

          {/* Dialog: Registrar movimiento */}
          <Dialog
            open={movDialogOpen}
            onClose={closeMovDialog}
            fullWidth
            maxWidth="sm"
            aria-labelledby="mov-dialog-title"
          >
            <DialogTitle id="mov-dialog-title" sx={{ color: '#4A148C', fontWeight: 700 }}>
              Registrar movimiento
            </DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
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

              <Box sx={{ display: 'flex', gap: 1.5 }}>
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
                  <InputLabel id="mov-tipo-label">Tipo</InputLabel>
                  <Select
                    labelId="mov-tipo-label"
                    label="Tipo"
                    value={movEsEntrada}
                    onChange={(e) => setMovEsEntrada(e.target.value)}
                  >
                    <MenuItem value="S">Entrada</MenuItem>
                    <MenuItem value="N">Salida</MenuItem>
                  </Select>
                </FormControl>
              </Box>

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
                label="Observación (opcional)"
                value={movObservacion}
                onChange={(e) => setMovObservacion(e.target.value)}
                multiline
                minRows={2}
              />

              <TextField
                size="small"
                fullWidth
                type="number"
                label="Id bebé (opcional)"
                value={movIdBebe}
                onChange={(e) => setMovIdBebe(e.target.value)}
              />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
              <Button onClick={closeMovDialog} sx={BTN_CANCEL_SX}>
                Cancelar
              </Button>
              <Button
                variant="contained"
                onClick={submitMovement}
                disabled={!movFormValid}
                sx={BTN_SX}
              >
                Registrar
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </div>
  );
};

export default SupplyTemplate;
