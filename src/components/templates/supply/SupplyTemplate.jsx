import React, { useEffect } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import BabyChangingStationIcon from '@mui/icons-material/BabyChangingStation';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { PageHeader } from '../../common/PageHeader';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fab,
  IconButton,
  InputAdornment,
  LinearProgress,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import LabelSelect from '../../molecules/labelSelect/LabelSelect';
import LabelInput from '../../molecules/labelInput/LabelInput';
import { fabBottomAboveNav } from '../../../utils/listScreenAccessibility';

// Constantes de estilos compartidos
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
  border: '1.5px solid rgba(21,44,112,0.22)',
  '&:hover': { bgcolor: 'rgba(21,44,112,0.04)', borderColor: 'rgba(21,44,112,0.35)' },
};

// Paper del bottom-sheet (Dialog configurado como drawer desde abajo)
const BOTTOM_SHEET_PAPER_SX = {
  maxWidth: 444,
  width: '100%',
  mx: 'auto',
  mb: 0,
  mt: 'auto',
  borderRadius: '20px 20px 0 0',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  maxHeight: '100dvh',
};

// sx del Dialog container para alinear hacia abajo
const BOTTOM_SHEET_DIALOG_SX = {
  '& .MuiDialog-container': {
    alignItems: 'flex-end',
  },
};

// Paper de Dialog full-height: columna 444px
const DIALOG_FULL_SX = {
  maxWidth: 444,
  width: '100%',
  mx: 'auto',
  height: '100dvh',
  maxHeight: '100dvh',
  m: 0,
  borderRadius: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

// Paper de Dialog pequeño (confirmación)
const DIALOG_SMALL_SX = {
  maxWidth: 444,
  width: '100%',
  mx: 'auto',
  borderRadius: 3,
};

const LABEL_COLOR = '#152C70';
const INPUT_COLOR = '#152C70';
const LABEL_STYLE = { fontSize: '16px' };

function isMovimientoFromAbrazo(row) {
  const obs = row?.observacion ?? '';
  return /asignaci[oó]n\s*#?\d+/i.test(obs);
}

function formatFechaMovimiento(fechaStr) {
  if (!fechaStr) return null;
  return new Date(fechaStr).toLocaleString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

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
    babies,
    isCoord,
    onEditSupply,
    onDeleteSupply,
    editCloseSignal,
    deleteCloseSignal,
  } = props;

  const [listSupplies, setListSupplies] = React.useState(null);

  // Estado drawer nuevo insumo
  const [registerDrawerOpen, setRegisterDrawerOpen] = React.useState(false);
  const [newNombre, setNewNombre] = React.useState('');
  const [newDescripcion, setNewDescripcion] = React.useState('');
  const [newStockMin, setNewStockMin] = React.useState('0');
  const [newStockMax, setNewStockMax] = React.useState('1000');
  const [newStockActual, setNewStockActual] = React.useState('0');

  // Estado dialog editar insumo (solo coordinadora)
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editingSupply, setEditingSupply] = React.useState(null);
  const [editNombre, setEditNombre] = React.useState('');
  const [editDescripcion, setEditDescripcion] = React.useState('');
  const [editStockMin, setEditStockMin] = React.useState('0');
  const [editStockMax, setEditStockMax] = React.useState('1000');
  const [editStockActual, setEditStockActual] = React.useState('0');

  // Estado dialog confirmar eliminación
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState(null);
  // Estado dialog bloqueo eliminación por stock
  const [deleteBlockOpen, setDeleteBlockOpen] = React.useState(false);

  // Estado drawer detalle de movimiento
  const [detailMovement, setDetailMovement] = React.useState(null);

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

  // ── Helpers formulario nuevo insumo ──
  const resetSupplyForm = () => {
    setNewNombre('');
    setNewDescripcion('');
    setNewStockMin('0');
    setNewStockMax('1000');
    setNewStockActual('0');
  };

  const closeSupplyDrawer = () => {
    setRegisterDrawerOpen(false);
    resetSupplyForm();
  };

  const onChangeStockNumber = (setter) => (e) => {
    const v = e.target.value;
    if (/^$|^[0-9]+$/.test(v)) setter(v);
  };

  const canSubmitNewSupply =
    newNombre.trim() !== '' &&
    !Number.isNaN(Number(newStockMin)) &&
    !Number.isNaN(Number(newStockMax)) &&
    !Number.isNaN(Number(newStockActual)) &&
    Number(newStockMin) >= 0 &&
    Number(newStockMax) >= 0 &&
    Number(newStockActual) >= 0 &&
    Number(newStockMax) >= Number(newStockMin);

  useEffect(() => {
    if (createSupplyCloseSignal > 0) closeSupplyDrawer();
  }, [createSupplyCloseSignal]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (editCloseSignal > 0) {
      setEditDialogOpen(false);
      setEditingSupply(null);
    }
  }, [editCloseSignal]);

  useEffect(() => {
    if (deleteCloseSignal > 0) setDeleteTarget(null);
  }, [deleteCloseSignal]);

  useEffect(() => {
    if (movementCloseSignal > 0) closeMovDialog();
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

  const handleOpenEdit = (item) => {
    setEditingSupply(item);
    setEditNombre(item.nombre ?? '');
    setEditDescripcion(item.descripcion ?? '');
    setEditStockMin(String(item.stockMinimo ?? 0));
    setEditStockMax(String(item.stockMaximo ?? 1000));
    setEditStockActual(String(item.stockActual ?? 0));
    setEditDialogOpen(true);
  };

  const handleOpenDelete = (item) => {
    if (Number(item.stockActual) !== 0) {
      setDeleteTarget(item);
      setDeleteBlockOpen(true);
      return;
    }
    setDeleteTarget(item);
    setDeleteConfirmOpen(true);
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

  const submitEditSupply = () => {
    if (!editingSupply || typeof onEditSupply !== 'function') return;
    const nombre = editNombre.trim();
    const smin = Number(editStockMin);
    const smax = Number(editStockMax);
    const sact = Number(editStockActual);
    if (!nombre || [smin, smax, sact].some((n) => Number.isNaN(n) || n < 0)) return;
    if (smax < smin) return;
    onEditSupply(editingSupply.idInsumo, {
      nombre,
      descripcion: editDescripcion.trim() || null,
      stockMinimo: Math.floor(smin),
      stockMaximo: Math.floor(smax),
      stockActual: Math.floor(sact),
    });
  };

  const confirmDelete = () => {
    if (typeof onDeleteSupply === 'function' && deleteTarget != null) {
      onDeleteSupply(deleteTarget.idInsumo);
    }
    setDeleteConfirmOpen(false);
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

  const editFormValid =
    editNombre.trim() !== '' &&
    !Number.isNaN(Number(editStockMin)) &&
    !Number.isNaN(Number(editStockMax)) &&
    !Number.isNaN(Number(editStockActual)) &&
    Number(editStockMin) >= 0 &&
    Number(editStockMax) >= 0 &&
    Number(editStockActual) >= 0 &&
    Number(editStockMax) >= Number(editStockMin);

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
              fontWeight: valueTask === tab.value ? 700 : 600,
              minHeight: 44,
              borderRadius: 2,
              backgroundColor: valueTask === tab.value ? 'rgba(143,0,255,0.10)' : '#fff',
              color: valueTask === tab.value ? '#6A1B9A' : '#9575CD',
              border: '2px solid',
              borderColor: valueTask === tab.value ? '#8F00FF' : '#D1C4E9',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: valueTask === tab.value ? 'rgba(143,0,255,0.15)' : '#F3E5F5',
              },
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
          sx={{ pb: 14, px: 2, pt: 1.5, overflow: 'hidden' }}
        >
          {listSupplies &&
            listSupplies.map((item) => {
              const isLow =
                item.stockActual != null &&
                item.stockMinimo != null &&
                Number(item.stockActual) <= Number(item.stockMinimo);
              const progress =
                item.stockActual != null &&
                item.stockMaximo != null &&
                Number(item.stockMaximo) > 0
                  ? Math.min(100, Math.round((Number(item.stockActual) / Number(item.stockMaximo)) * 100))
                  : null;
              return (
                <Paper
                  key={item.idInsumo}
                  elevation={0}
                  sx={{
                    mt: 1.25,
                    p: '12px 14px 12px 16px',
                    borderRadius: '14px',
                    border: isLow
                      ? '1.5px solid rgba(194,24,91,0.35)'
                      : '1.5px solid rgba(143,0,255,0.10)',
                    bgcolor: isLow ? 'rgba(194,24,91,0.03)' : '#fff',
                    boxShadow: '0 2px 10px rgba(21,44,112,0.06)',
                    overflow: 'hidden',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                  {/* Fila: nombre + stock + (acciones si coord) */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: progress != null ? 0.75 : 0 }}>
                    <Typography
                      sx={{ fontWeight: 600, fontSize: '0.88rem', color: '#152C70', flex: 1, minWidth: 0 }}
                      noWrap
                    >
                      {item.nombre}
                    </Typography>
                    {isLow && (
                      <WarningAmberIcon sx={{ fontSize: 15, color: '#C2185B', flexShrink: 0 }} />
                    )}
                    <Typography
                      sx={{
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: isLow ? '#C2185B' : '#152C70',
                        flexShrink: 0,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.stockActual} U
                    </Typography>
                    {isCoord && (
                      <>
                        <IconButton
                          size="small"
                          aria-label={`Editar ${item.nombre}`}
                          onClick={() => handleOpenEdit(item)}
                          sx={{
                            color: '#7F00FF',
                            p: 0.75,
                            flexShrink: 0,
                            '&:hover': { bgcolor: 'rgba(127,0,255,0.08)' },
                          }}
                        >
                          <EditIcon sx={{ fontSize: 17 }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          aria-label={`Eliminar ${item.nombre}`}
                          onClick={() => handleOpenDelete(item)}
                          sx={{
                            color: '#C23814',
                            p: 0.75,
                            flexShrink: 0,
                            '&:hover': { bgcolor: 'rgba(194,56,20,0.08)' },
                          }}
                        >
                          <DeleteOutlineIcon sx={{ fontSize: 17 }} />
                        </IconButton>
                      </>
                    )}
                  </Box>
                  {/* Barra de stock */}
                  {progress != null && (
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{
                        height: 5,
                        borderRadius: 3,
                        bgcolor: 'rgba(21,44,112,0.08)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: isLow ? '#C2185B' : '#8F00FF',
                          borderRadius: 3,
                        },
                      }}
                    />
                  )}
                </Paper>
              );
            })}

          <Fab
            aria-label="Agregar insumo al catálogo"
            onClick={() => setRegisterDrawerOpen(true)}
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

          {/* ── Bottom sheet: Nuevo insumo ── */}
          <Dialog
            open={registerDrawerOpen}
            onClose={closeSupplyDrawer}
            fullWidth
            maxWidth={false}
            PaperProps={{ sx: BOTTOM_SHEET_PAPER_SX }}
            sx={BOTTOM_SHEET_DIALOG_SX}
            aria-labelledby="new-supply-drawer-title"
          >
            {/* Header */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2.5,
                py: 2,
                background: 'linear-gradient(90deg, #7F00FF 0%, #8F00FF 100%)',
                color: '#fff',
                flexShrink: 0,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <AddCircleIcon sx={{ fontSize: 22 }} />
                <Typography
                  id="new-supply-drawer-title"
                  component="span"
                  sx={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.02em' }}
                >
                  Nuevo insumo
                </Typography>
              </Box>
              <IconButton
                aria-label="Cerrar"
                onClick={closeSupplyDrawer}
                sx={{ color: '#fff', minWidth: 44, minHeight: 44 }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Contenido scrollable */}
            <Box sx={{ flex: 1, overflowY: 'auto', px: 2.5, pt: 2, pb: 1 }}>
              <Typography
                variant="body2"
                sx={{ color: 'rgba(21,44,112,0.55)', fontSize: '0.85rem', lineHeight: 1.6, mb: 1 }}
              >
                Registrá un ítem en el catálogo. Para entradas/salidas de stock usá la pestaña Movimientos.
              </Typography>

              <LabelInput
                name="nombre"
                label="Nombre del insumo"
                value={newNombre}
                onChange={(e) => setNewNombre(e.target.value)}
                labelColor={LABEL_COLOR}
                inputColor={INPUT_COLOR}
                styleLabel={LABEL_STYLE}
                required
              />
              <LabelInput
                name="descripcion"
                label="Descripción (opcional)"
                value={newDescripcion}
                onChange={(e) => setNewDescripcion(e.target.value)}
                labelColor={LABEL_COLOR}
                inputColor={INPUT_COLOR}
                styleLabel={LABEL_STYLE}
                multiline
                rows={3}
              />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, mb: 0.5 }}>
                <Divider sx={{ flex: 1, borderColor: 'rgba(143,0,255,0.2)' }} />
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(21,44,112,0.4)', textTransform: 'uppercase', letterSpacing: '0.09em', px: 1 }}>
                  Niveles de stock
                </Typography>
                <Divider sx={{ flex: 1, borderColor: 'rgba(143,0,255,0.2)' }} />
              </Box>

              <LabelInput
                name="stockActual"
                label="Stock inicial"
                value={newStockActual}
                onChange={onChangeStockNumber(setNewStockActual)}
                labelColor={LABEL_COLOR}
                inputColor={INPUT_COLOR}
                styleLabel={LABEL_STYLE}
                inputProps={{ inputMode: 'numeric', min: 0 }}
              />
              <LabelInput
                name="stockMin"
                label="Stock mínimo (alerta)"
                value={newStockMin}
                onChange={onChangeStockNumber(setNewStockMin)}
                labelColor={LABEL_COLOR}
                inputColor={INPUT_COLOR}
                styleLabel={LABEL_STYLE}
                inputProps={{ inputMode: 'numeric', min: 0 }}
              />
              <LabelInput
                name="stockMax"
                label="Stock máximo"
                value={newStockMax}
                onChange={onChangeStockNumber(setNewStockMax)}
                labelColor={LABEL_COLOR}
                inputColor={INPUT_COLOR}
                styleLabel={LABEL_STYLE}
                inputProps={{ inputMode: 'numeric', min: 0 }}
              />
            </Box>

            {/* Footer fijo */}
            <Box
              sx={{
                px: 2.5,
                py: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.25,
                borderTop: '1px solid rgba(143,0,255,0.1)',
                bgcolor: '#faf8fc',
                flexShrink: 0,
              }}
            >
              <Button
                variant="contained"
                fullWidth
                onClick={submitNewSupply}
                disabled={!canSubmitNewSupply}
                sx={BTN_SX}
              >
                Guardar insumo
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={closeSupplyDrawer}
                sx={BTN_CANCEL_SX}
              >
                Cancelar
              </Button>
            </Box>
          </Dialog>

          {/* ── Dialog: Editar insumo (solo coordinadora) ── */}
          {isCoord && (
            <Dialog
              open={editDialogOpen}
              onClose={() => setEditDialogOpen(false)}
              fullWidth
              maxWidth={false}
              PaperProps={{ sx: DIALOG_FULL_SX }}
              aria-labelledby="edit-supply-dialog-title"
            >
              {/* Header */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 2.5,
                  py: 2,
                  background: 'linear-gradient(90deg, #7F00FF 0%, #8F00FF 100%)',
                  color: '#fff',
                  flexShrink: 0,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <EditIcon sx={{ fontSize: 22 }} />
                  <Typography
                    id="edit-supply-dialog-title"
                    component="span"
                    sx={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.02em' }}
                  >
                    Editar insumo
                  </Typography>
                </Box>
                <IconButton
                  aria-label="Cerrar"
                  onClick={() => setEditDialogOpen(false)}
                  sx={{ color: '#fff', minWidth: 44, minHeight: 44 }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              {/* Contenido scrollable */}
              <Box sx={{ flex: 1, overflowY: 'auto', px: 2.5, pt: 2, pb: 1 }}>
                <LabelInput
                  name="editNombre"
                  label="Nombre del insumo"
                  value={editNombre}
                  onChange={(e) => setEditNombre(e.target.value)}
                  labelColor={LABEL_COLOR}
                  inputColor={INPUT_COLOR}
                  styleLabel={LABEL_STYLE}
                  required
                />
                <LabelInput
                  name="editDescripcion"
                  label="Descripción (opcional)"
                  value={editDescripcion}
                  onChange={(e) => setEditDescripcion(e.target.value)}
                  labelColor={LABEL_COLOR}
                  inputColor={INPUT_COLOR}
                  styleLabel={LABEL_STYLE}
                  multiline
                  rows={3}
                />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, mb: 0.5 }}>
                  <Divider sx={{ flex: 1, borderColor: 'rgba(143,0,255,0.2)' }} />
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(21,44,112,0.4)', textTransform: 'uppercase', letterSpacing: '0.09em', px: 1 }}>
                    Niveles de stock
                  </Typography>
                  <Divider sx={{ flex: 1, borderColor: 'rgba(143,0,255,0.2)' }} />
                </Box>

                <LabelInput
                  name="editStockActual"
                  label="Stock actual"
                  value={editStockActual}
                  onChange={onChangeStockNumber(setEditStockActual)}
                  labelColor={LABEL_COLOR}
                  inputColor={INPUT_COLOR}
                  styleLabel={LABEL_STYLE}
                  inputProps={{ inputMode: 'numeric', min: 0 }}
                />
                <LabelInput
                  name="editStockMin"
                  label="Stock mínimo (alerta)"
                  value={editStockMin}
                  onChange={onChangeStockNumber(setEditStockMin)}
                  labelColor={LABEL_COLOR}
                  inputColor={INPUT_COLOR}
                  styleLabel={LABEL_STYLE}
                  inputProps={{ inputMode: 'numeric', min: 0 }}
                />
                <LabelInput
                  name="editStockMax"
                  label="Stock máximo"
                  value={editStockMax}
                  onChange={onChangeStockNumber(setEditStockMax)}
                  labelColor={LABEL_COLOR}
                  inputColor={INPUT_COLOR}
                  styleLabel={LABEL_STYLE}
                  inputProps={{ inputMode: 'numeric', min: 0 }}
                />
              </Box>

              {/* Footer fijo */}
              <Box
                sx={{
                  px: 2.5,
                  py: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.25,
                  borderTop: '1px solid rgba(143,0,255,0.1)',
                  bgcolor: '#faf8fc',
                  flexShrink: 0,
                }}
              >
                <Button
                  variant="contained"
                  fullWidth
                  onClick={submitEditSupply}
                  disabled={!editFormValid}
                  sx={BTN_SX}
                >
                  Guardar cambios
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => setEditDialogOpen(false)}
                  sx={BTN_CANCEL_SX}
                >
                  Cancelar
                </Button>
              </Box>
            </Dialog>
          )}

          {/* ── Dialog: Confirmar eliminación ── */}
          {isCoord && (
            <Dialog
              open={deleteConfirmOpen}
              onClose={() => setDeleteConfirmOpen(false)}
              maxWidth={false}
              fullWidth
              PaperProps={{ sx: DIALOG_SMALL_SX }}
            >
              <DialogTitle sx={{ fontWeight: 700, color: '#C23814', pb: 1 }}>
                ¿Eliminar insumo?
              </DialogTitle>
              <DialogContent>
                <Typography sx={{ color: '#152C70', fontSize: '0.95rem' }}>
                  Se dará de baja{' '}
                  <strong>{deleteTarget?.nombre ?? `Insumo #${deleteTarget?.idInsumo}`}</strong>.
                  Esta acción no se puede deshacer.
                </Typography>
              </DialogContent>
              <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                <Button onClick={() => setDeleteConfirmOpen(false)} sx={BTN_CANCEL_SX}>
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  onClick={confirmDelete}
                  sx={{
                    ...BTN_SX,
                    background: 'linear-gradient(135deg, #C23814 0%, #E53935 100%)',
                    boxShadow: '0 4px 14px rgba(194,56,20,0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #A52E10 0%, #C62828 100%)',
                      boxShadow: '0 6px 18px rgba(194,56,20,0.4)',
                    },
                    flex: 1,
                  }}
                >
                  Eliminar
                </Button>
              </DialogActions>
            </Dialog>
          )}

          {/* ── Dialog: Bloqueo eliminación por stock ── */}
          {isCoord && (
            <Dialog
              open={deleteBlockOpen}
              onClose={() => { setDeleteBlockOpen(false); setDeleteTarget(null); }}
              maxWidth={false}
              fullWidth
              PaperProps={{ sx: DIALOG_SMALL_SX }}
            >
              <DialogTitle sx={{ fontWeight: 700, color: '#C23814', pb: 1 }}>
                No se puede eliminar el insumo
              </DialogTitle>
              <DialogContent>
                <Typography sx={{ color: '#152C70', fontSize: '0.95rem' }}>
                  <strong>{deleteTarget?.nombre ?? `Insumo #${deleteTarget?.idInsumo}`}</strong> posee stock disponible ({deleteTarget?.stockActual} U). Para eliminarlo, primero registre los movimientos correspondientes hasta agotar el stock.
                </Typography>
              </DialogContent>
              <DialogActions sx={{ px: 3, py: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => { setDeleteBlockOpen(false); setDeleteTarget(null); }}
                  sx={BTN_SX}
                >
                  Entendido
                </Button>
              </DialogActions>
            </Dialog>
          )}
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
              const fromAbrazo = isMovimientoFromAbrazo(row);
              const nombre =
                row.nombreInsumo ?? row.insumoNombre ?? row.nombre ?? `Insumo #${row.idInsumo ?? idx}`;
              const fecha = formatFechaMovimiento(row.fechaMovimiento);
              return (
                <Paper
                  key={row.idMovimiento ?? row.id ?? idx}
                  elevation={0}
                  onClick={() => setDetailMovement(row)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    p: 1.75,
                    mb: 1.25,
                    borderRadius: '16px',
                    border: fromAbrazo
                      ? '1px solid rgba(122,101,155,0.22)'
                      : '1px solid rgba(143,0,255,0.08)',
                    boxShadow: '0 2px 12px rgba(21,44,112,0.07)',
                    bgcolor: fromAbrazo ? 'rgba(122,101,155,0.04)' : '#fff',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.15s, transform 0.12s',
                    '&:hover': { boxShadow: '0 4px 18px rgba(143,0,255,0.15)' },
                    '&:active': { transform: 'scale(0.985)' },
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
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 0.4 }}>
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
                    <Typography sx={{ fontSize: '0.82rem', color: 'rgba(21,44,112,0.7)', fontWeight: 500, lineHeight: 1.4 }}>
                      {row.cantidad != null ? `${row.cantidad} u.` : '—'}
                      {fecha ? ` · ${fecha}` : ''}
                    </Typography>
                    {fromAbrazo && (
                      <Chip
                        icon={<BabyChangingStationIcon sx={{ fontSize: '13px !important' }} />}
                        label="Uso en abrazo"
                        size="small"
                        sx={{
                          mt: 0.5,
                          bgcolor: 'rgba(122,101,155,0.12)',
                          color: '#7A659B',
                          fontWeight: 700,
                          fontSize: '0.65rem',
                          height: 18,
                          '& .MuiChip-label': { px: 0.75 },
                          '& .MuiChip-icon': { ml: 0.5 },
                        }}
                      />
                    )}
                  </Box>
                  <ChevronRightIcon sx={{ flexShrink: 0, color: 'rgba(21,44,112,0.28)', fontSize: 20 }} />
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

          {/* ── Bottom sheet: Detalle de movimiento ── */}
          {detailMovement !== null && (() => {
            const dm = detailMovement;
            const dmEntrada = dm.esEntrada === true || dm.esEntrada === 'S';
            const dmFromAbrazo = isMovimientoFromAbrazo(dm);
            const dmNombre = dm.nombreInsumo ?? dm.insumoNombre ?? dm.nombre ?? `Insumo #${dm.idInsumo}`;
            const dmFecha = formatFechaMovimiento(dm.fechaMovimiento);
            const dmBebe = [dm.nombreBebe, dm.apellidoBebe].filter(Boolean).join(' ') || null;
            return (
              <Dialog
                open
                onClose={() => setDetailMovement(null)}
                fullWidth
                maxWidth={false}
                PaperProps={{ sx: BOTTOM_SHEET_PAPER_SX }}
                sx={BOTTOM_SHEET_DIALOG_SX}
                aria-labelledby="detail-mov-title"
              >
                {/* Header */}
                <Box sx={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  px: 2.5, py: 2,
                  background: dmEntrada
                    ? 'linear-gradient(90deg, #1B5E20 0%, #2E7D32 100%)'
                    : 'linear-gradient(90deg, #BF360C 0%, #C53814 100%)',
                  color: '#fff', flexShrink: 0,
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {dmEntrada
                      ? <ArrowDownwardIcon sx={{ fontSize: 22 }} />
                      : <ArrowUpwardIcon sx={{ fontSize: 22 }} />}
                    <Typography id="detail-mov-title" component="span" sx={{ fontWeight: 700, fontSize: '1.05rem' }}>
                      {dmNombre}
                    </Typography>
                  </Box>
                  <IconButton aria-label="Cerrar" onClick={() => setDetailMovement(null)} sx={{ color: '#fff', minWidth: 44, minHeight: 44 }}>
                    <CloseIcon />
                  </IconButton>
                </Box>

                {/* Cuerpo */}
                <Box sx={{ flex: 1, overflowY: 'auto', px: 2.5, pt: 2.5, pb: 3 }}>
                  {/* Badges de tipo y origen */}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2.5 }}>
                    <Chip
                      label={dmEntrada ? 'Entrada de stock' : 'Salida de stock'}
                      sx={{
                        bgcolor: dmEntrada ? 'rgba(0,168,107,0.12)' : 'rgba(197,56,20,0.1)',
                        color: dmEntrada ? '#007A4D' : '#C53814',
                        fontWeight: 700, fontSize: '0.78rem',
                      }}
                    />
                    {dmFromAbrazo ? (
                      <Chip
                        icon={<BabyChangingStationIcon sx={{ fontSize: '15px !important' }} />}
                        label="Uso en abrazo"
                        sx={{ bgcolor: 'rgba(122,101,155,0.12)', color: '#7A659B', fontWeight: 700, fontSize: '0.78rem' }}
                      />
                    ) : (
                      <Chip
                        icon={<LocalShippingOutlinedIcon sx={{ fontSize: '15px !important' }} />}
                        label="Registro manual"
                        sx={{ bgcolor: 'rgba(21,44,112,0.08)', color: '#152C70', fontWeight: 700, fontSize: '0.78rem' }}
                      />
                    )}
                  </Box>

                  {/* Cantidad grande */}
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, mb: 2.5 }}>
                    <Typography sx={{ fontSize: '2.4rem', fontWeight: 800, color: dmEntrada ? '#00A86B' : '#C53814', lineHeight: 1 }}>
                      {dm.cantidad ?? '—'}
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: 'rgba(21,44,112,0.55)' }}>
                      unidades
                    </Typography>
                  </Box>

                  {/* Campos */}
                  {[
                    { label: 'Fecha', value: dmFecha },
                    { label: 'Voluntaria', value: dm.nombreVoluntaria || null },
                    { label: 'Bebé', value: dmBebe },
                    { label: 'Proveedor', value: dm.nombreProveedor || null },
                    { label: 'Observación', value: dm.observacion || null },
                    { label: 'ID movimiento', value: dm.idMovimiento != null ? `#${dm.idMovimiento}` : null },
                  ].filter(f => f.value != null).map(({ label, value }) => (
                    <Box key={label} sx={{ display: 'flex', gap: 2, mb: 1.5, alignItems: 'flex-start' }}>
                      <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: 'rgba(21,44,112,0.45)', textTransform: 'uppercase', letterSpacing: '0.07em', minWidth: 88, flexShrink: 0, pt: '2px' }}>
                        {label}
                      </Typography>
                      <Typography sx={{ fontSize: '0.9rem', color: '#152C70', fontWeight: 500, lineHeight: 1.45, flex: 1, wordBreak: 'break-word' }}>
                        {value}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {/* Footer */}
                <Box sx={{ px: 2.5, py: 2, borderTop: '1px solid rgba(143,0,255,0.1)', bgcolor: '#faf8fc', flexShrink: 0 }}>
                  <Button variant="outlined" fullWidth onClick={() => setDetailMovement(null)} sx={BTN_CANCEL_SX}>
                    Cerrar
                  </Button>
                </Box>
              </Dialog>
            );
          })()}

          {/* ── Dialog: Registrar movimiento ── */}
          <Dialog
            open={movDialogOpen}
            onClose={closeMovDialog}
            fullWidth
            maxWidth={false}
            PaperProps={{ sx: DIALOG_FULL_SX }}
            aria-labelledby="mov-dialog-title"
          >
            {/* Header */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2.5,
                py: 2,
                background: 'linear-gradient(90deg, #7F00FF 0%, #8F00FF 100%)',
                color: '#fff',
                flexShrink: 0,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <SwapVertIcon sx={{ fontSize: 22 }} />
                <Typography
                  id="mov-dialog-title"
                  component="span"
                  sx={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.02em' }}
                >
                  Registrar movimiento
                </Typography>
              </Box>
              <IconButton
                aria-label="Cerrar"
                onClick={closeMovDialog}
                sx={{ color: '#fff', minWidth: 44, minHeight: 44 }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Contenido scrollable */}
            <Box sx={{ flex: 1, overflowY: 'auto', px: 2.5, pt: 2, pb: 1 }}>

              {/* Toggle Entrada / Salida */}
              <Box sx={{ mb: 0.5 }}>
                <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(21,44,112,0.5)', textTransform: 'uppercase', letterSpacing: '0.09em', mb: 1.25 }}>
                  Tipo de movimiento
                </Typography>
                <ToggleButtonGroup
                  value={movEsEntrada}
                  exclusive
                  onChange={(_, v) => { if (v != null) setMovEsEntrada(v); }}
                  fullWidth
                  sx={{ gap: 1 }}
                >
                  <ToggleButton
                    value="S"
                    aria-label="Entrada de stock"
                    sx={{
                      flex: 1,
                      py: 1.5,
                      gap: 0.75,
                      borderRadius: '10px !important',
                      border: '1.5px solid rgba(46,125,50,0.35) !important',
                      color: movEsEntrada === 'S' ? '#fff' : '#2E7D32',
                      bgcolor: movEsEntrada === 'S' ? '#2E7D32 !important' : 'rgba(46,125,50,0.04)',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      textTransform: 'none',
                      transition: 'all 0.18s',
                      minHeight: 48,
                      '&:hover': {
                        bgcolor: movEsEntrada === 'S'
                          ? '#256428 !important'
                          : 'rgba(46,125,50,0.1) !important',
                      },
                    }}
                  >
                    <ArrowUpwardIcon sx={{ fontSize: 19 }} />
                    Entrada
                  </ToggleButton>
                  <ToggleButton
                    value="N"
                    aria-label="Salida de stock"
                    sx={{
                      flex: 1,
                      py: 1.5,
                      gap: 0.75,
                      borderRadius: '10px !important',
                      border: '1.5px solid rgba(194,56,20,0.35) !important',
                      color: movEsEntrada === 'N' ? '#fff' : '#C23814',
                      bgcolor: movEsEntrada === 'N' ? '#C23814 !important' : 'rgba(194,56,20,0.04)',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      textTransform: 'none',
                      transition: 'all 0.18s',
                      minHeight: 48,
                      '&:hover': {
                        bgcolor: movEsEntrada === 'N'
                          ? '#a52e10 !important'
                          : 'rgba(194,56,20,0.1) !important',
                      },
                    }}
                  >
                    <ArrowDownwardIcon sx={{ fontSize: 19 }} />
                    Salida
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {/* Insumo y Cantidad */}
              <LabelSelect
                label="Insumo"
                labelId="mov-insumo-label"
                value={movIdInsumo}
                onChange={(e) => setMovIdInsumo(e.target.value)}
                list={(listSupplies ?? supplies ?? []).map((s) => ({
                  value: String(s.idInsumo),
                  label: s.nombre ?? `Insumo #${s.idInsumo}`,
                }))}
                labelColor={LABEL_COLOR}
                styleLabel={LABEL_STYLE}
                required
              />

              <LabelInput
                name="movCantidad"
                label="Cantidad"
                type="number"
                value={movCantidad}
                onChange={(e) => setMovCantidad(e.target.value)}
                labelColor={LABEL_COLOR}
                inputColor={INPUT_COLOR}
                styleLabel={LABEL_STYLE}
                inputProps={{ min: 1, inputMode: 'numeric' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {movEsEntrada === 'S'
                        ? <ArrowUpwardIcon sx={{ fontSize: 17, color: '#2E7D32' }} />
                        : <ArrowDownwardIcon sx={{ fontSize: 17, color: '#C23814' }} />}
                    </InputAdornment>
                  ),
                }}
                required
              />

              {/* Divisor opcional */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, mb: 0.5 }}>
                <Divider sx={{ flex: 1, borderColor: 'rgba(143,0,255,0.15)' }} />
                <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(21,44,112,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', px: 1 }}>
                  Opcional
                </Typography>
                <Divider sx={{ flex: 1, borderColor: 'rgba(143,0,255,0.15)' }} />
              </Box>

              <LabelSelect
                label="Proveedor"
                labelId="mov-prov-label"
                value={movIdProveedor}
                onChange={(e) => setMovIdProveedor(e.target.value)}
                list={[
                  { value: '__none__', label: '—' },
                  ...providerRows
                    .filter((p) => (p.idProveedor ?? p.id) != null)
                    .map((p) => ({
                      value: String(p.idProveedor ?? p.id),
                      label: p.nombre ?? p.razonSocial ?? `Proveedor #${p.idProveedor ?? p.id}`,
                    })),
                ]}
                labelColor={LABEL_COLOR}
                styleLabel={LABEL_STYLE}
              />

              <LabelInput
                name="movObservacion"
                label="Observación"
                value={movObservacion}
                onChange={(e) => setMovObservacion(e.target.value)}
                labelColor={LABEL_COLOR}
                inputColor={INPUT_COLOR}
                styleLabel={LABEL_STYLE}
                multiline
                rows={2}
              />

              <LabelSelect
                label="Bebé relacionado"
                labelId="mov-bebe-label"
                value={movIdBebe}
                onChange={(e) => setMovIdBebe(e.target.value)}
                list={[
                  { value: '', label: '—' },
                  ...(Array.isArray(babies) ? babies : []).map((b) => ({
                    value: String(b.ID ?? b.id),
                    label: `${b.nombre ?? ''} ${b.apellido ?? ''}`.trim() || `Bebé #${b.ID ?? b.id}`,
                  })),
                ]}
                labelColor={LABEL_COLOR}
                styleLabel={LABEL_STYLE}
              />
            </Box>

            {/* Footer fijo */}
            <Box
              sx={{
                px: 2.5,
                py: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.25,
                borderTop: '1px solid rgba(143,0,255,0.1)',
                bgcolor: '#faf8fc',
                flexShrink: 0,
              }}
            >
              <Button
                variant="contained"
                fullWidth
                onClick={submitMovement}
                disabled={!movFormValid}
                sx={BTN_SX}
              >
                Registrar
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={closeMovDialog}
                sx={BTN_CANCEL_SX}
              >
                Cancelar
              </Button>
            </Box>
          </Dialog>
        </Box>
      )}
    </div>
  );
};

export default SupplyTemplate;
