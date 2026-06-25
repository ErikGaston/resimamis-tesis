import React from 'react';
import {
    Box, Button, Chip, Dialog, DialogContent,
    IconButton, TextField, Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import RoomIcon from '@mui/icons-material/Room';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import InventoryIcon from '@mui/icons-material/Inventory';
import StopIcon from '@mui/icons-material/Stop';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import TitleText from '../../atoms/titleText/TitleText';
import ButtonCustomized from '../../atoms/button/ButtonCustomized';
import DialogInsumo from '../dialogInsumo/DialogInsumo';
import InsumoQuantity from '../../molecules/insumoQuantity/InsumoQuantity';

const NAVY = '#152C70';
const PURPLE = '#7F00FF';
const GRADIENT = 'linear-gradient(135deg, #7F00FF 0%, #E100FF 100%)';

const FULL_DIALOG_SX = {
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

const InformationHug = (props) => {
    const {
        open, onClose,
        model, setModel, submitEndHug, hug,
        changeStateInsumo, stateInsumo, setStateInsumo,
        listSupplies, setListSupplies, submitChangeSupplies,
    } = props;

    const onChangeText = (e) => {
        const { name, value } = e.target;
        setModel({ ...model, [name]: value });
    };

    const hasInsumos = Array.isArray(listSupplies) && listSupplies.some((i) => Number(i?.cantidad) > 0);

    return (
        <>
            <Dialog
                open={Boolean(open)}
                onClose={onClose}
                fullWidth
                maxWidth={false}
                PaperProps={{ sx: FULL_DIALOG_SX }}
            >
                {/* Gradient header */}
                <Box sx={{
                    background: GRADIENT,
                    flexShrink: 0,
                    px: 2.5, pt: 2, pb: 2,
                    display: 'flex', alignItems: 'center', gap: 1.25,
                }}>
                    <Box sx={{
                        width: 40, height: 40, borderRadius: '12px',
                        bgcolor: 'rgba(255,255,255,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                        <ChildCareIcon sx={{ color: '#fff', fontSize: 20 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#fff', lineHeight: 1.2 }}>
                            {hug?.nombreBebe ?? 'Abrazo'}
                        </Typography>
                        <Typography sx={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.75)', mt: 0.2 }}>
                            Finalizar abrazo
                        </Typography>
                    </Box>
                    <IconButton onClick={onClose} sx={{ color: '#fff', minWidth: 44, minHeight: 44 }}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Scrollable content */}
                <DialogContent sx={{ flex: 1, overflowY: 'auto', px: 2.5, pt: 2.5, pb: 2, bgcolor: '#faf8fc' }}>

                    {/* Sala */}
                    {(hug?.nombreSala ?? hug?.sala) && (
                        <Box sx={{
                            display: 'flex', alignItems: 'center', gap: 1,
                            mb: 2, px: 1.5, py: 1,
                            bgcolor: '#fff', borderRadius: '10px',
                            border: '1px solid rgba(127,0,255,0.1)',
                        }}>
                            <RoomIcon sx={{ fontSize: 16, color: PURPLE }} />
                            <Typography sx={{ fontSize: '0.88rem', color: NAVY, fontWeight: 500 }}>
                                Sala {hug.nombreSala ?? hug.sala}
                            </Typography>
                        </Box>
                    )}

                    {/* Comentario */}
                    <TextField
                        name="comentario"
                        label="Comentario (opcional)"
                        value={model?.comentario || ''}
                        onChange={onChangeText}
                        fullWidth
                        multiline
                        rows={3}
                        sx={{ mb: 2.5, bgcolor: '#fff', borderRadius: '10px' }}
                    />

                    {/* Insumos ya registrados */}
                    {hasInsumos && (
                        <>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <InventoryIcon sx={{ fontSize: 15, color: PURPLE }} />
                                <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(21,44,112,0.42)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                                    Insumos registrados
                                </Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                {listSupplies
                                    .filter((i) => Number(i?.cantidad) > 0)
                                    .map((i) => (
                                        <Box key={i.idInsumo} sx={{
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            py: 0.6, px: 1.5, mb: 0.5,
                                            borderRadius: '8px', bgcolor: 'rgba(127,0,255,0.05)',
                                            border: '1px solid rgba(127,0,255,0.1)',
                                        }}>
                                            <Typography sx={{ fontSize: '0.85rem', color: NAVY, fontWeight: 500 }}>
                                                {i.nombre}
                                            </Typography>
                                            <Chip
                                                label={`×${Number(i.cantidad)}`}
                                                size="small"
                                                sx={{ bgcolor: 'rgba(127,0,255,0.12)', color: PURPLE, fontWeight: 700, fontSize: '0.72rem', height: 20, '& .MuiChip-label': { px: 0.75 } }}
                                            />
                                        </Box>
                                    ))}
                            </Box>
                        </>
                    )}

                    {/* Agregar insumo */}
                    <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={changeStateInsumo}
                        sx={{
                            borderColor: 'rgba(127,0,255,0.3)',
                            color: PURPLE,
                            minHeight: 44,
                            borderRadius: '10px',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            textTransform: 'none',
                            '&:hover': { bgcolor: 'rgba(127,0,255,0.04)', borderColor: 'rgba(127,0,255,0.55)' },
                        }}
                    >
                        Agregar insumo
                    </Button>
                </DialogContent>

                {/* Fixed footer */}
                <Box sx={{ px: 2.5, pb: 2.5, pt: 1.5, bgcolor: '#fff', flexShrink: 0 }}>
                    <Button
                        variant="contained"
                        fullWidth
                        startIcon={<StopIcon />}
                        onClick={() => submitEndHug(hug?.idAsignacion)}
                        sx={{
                            background: GRADIENT,
                            minHeight: 50,
                            borderRadius: '12px',
                            fontWeight: 700,
                            fontSize: '1rem',
                            textTransform: 'none',
                            boxShadow: '0 4px 14px rgba(127,0,255,0.28)',
                            '&:hover': { opacity: 0.88 },
                        }}
                    >
                        Finalizar abrazo
                    </Button>
                </Box>
            </Dialog>

            {/* Nested: agregar insumo */}
            {stateInsumo === 'OPEN' && (
                <DialogInsumo
                    open={stateInsumo === 'OPEN'}
                    setOpen={setStateInsumo}
                    title={
                        <div style={{ display: 'flex' }}>
                            <IconButton onClick={() => setStateInsumo('')}>
                                <HighlightOffIcon style={{ color: '#8F00FF' }} />
                            </IconButton>
                            <TitleText fontsize={'20px'} style={{ width: '85%', color: '#8F00FF' }}>Agregar insumo</TitleText>
                        </div>
                    }
                    content={
                        <>
                            {listSupplies?.map((item) => (
                                <InsumoQuantity
                                    key={item.idInsumo ?? item.nombre}
                                    item={item}
                                    listSupplies={listSupplies}
                                    setListSupplies={setListSupplies}
                                    submitChangeSupplies={submitChangeSupplies}
                                />
                            ))}
                            <div style={{ textAlign: 'center', marginTop: '40px' }}>
                                <ButtonCustomized
                                    variant={'container'}
                                    colorText={'#FFF'}
                                    sx={{
                                        width: '70%',
                                        fontSize: '16px',
                                        background: 'linear-gradient(90deg, #7F00FF 0%, #E100FF 100%)',
                                        boxShadow: '3px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                                    }}
                                    onClick={() => submitChangeSupplies(listSupplies, hug?.idAsignacion)}
                                >
                                    REGISTRAR INSUMOS
                                </ButtonCustomized>
                            </div>
                        </>
                    }
                />
            )}
        </>
    );
};

export default InformationHug;
