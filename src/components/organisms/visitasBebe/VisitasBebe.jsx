import React, { useState } from 'react';
import styled from '@emotion/styled';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LabelInput from '../../molecules/labelInput/LabelInput';

const FORM_INIT = {
  nombreVisitante: '',
  familiar: '',
  fechaHoraVisita: '',
  documentoVisitante: '',
  telefonoVisitante: '',
  observacion: '',
};

const BTN_PRIMARY = {
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '1rem',
  minHeight: 44,
  borderRadius: '10px',
  background: 'linear-gradient(90deg, #7F00FF 0%, #E100FF 100%)',
  boxShadow: '0 4px 14px rgba(127,0,255,0.28)',
  color: '#fff',
};

const BTN_CANCEL = {
  textTransform: 'none',
  fontWeight: 600,
  minHeight: 44,
  borderRadius: '10px',
  borderColor: 'rgba(21,44,112,0.25)',
  color: '#152C70',
};

const LABEL_COLOR = '#152C70';
const INPUT_COLOR = '#152C70';
const LABEL_STYLE = { fontSize: '16px' };

function buildPayload(form, idBebe) {
  return {
    idBebe: Number(idBebe),
    nombreVisitante: form.nombreVisitante.trim(),
    familiar: form.familiar.trim(),
    fechaHoraVisita: new Date(form.fechaHoraVisita).toISOString(),
    observacion: form.observacion?.trim() || null,
    documentoVisitante: form.documentoVisitante ? Number(form.documentoVisitante) : null,
    telefonoVisitante: form.telefonoVisitante ? Number(form.telefonoVisitante) : null,
  };
}

function formatFecha(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

const VisitasBebe = ({ visitasList = [], idBebe, onCrear, onEditar, onEliminar }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(FORM_INIT);

  const [editDialog, setEditDialog] = useState({ open: false, idVisita: null, form: FORM_INIT });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleCrear = () => {
    onCrear(buildPayload(form, idBebe));
    setForm(FORM_INIT);
    setShowForm(false);
  };

  const handleOpenEdit = (v) => {
    setEditDialog({
      open: true,
      idVisita: v.idVisita,
      form: {
        nombreVisitante: v.nombreVisitante ?? '',
        familiar: v.familiar ?? '',
        fechaHoraVisita: v.fechaHoraVisita
          ? new Date(v.fechaHoraVisita).toISOString().slice(0, 16)
          : '',
        documentoVisitante: v.documentoVisitante != null ? String(v.documentoVisitante) : '',
        telefonoVisitante: v.telefonoVisitante != null ? String(v.telefonoVisitante) : '',
        observacion: v.observacion ?? '',
      },
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditDialog((d) => ({ ...d, form: { ...d.form, [name]: value } }));
  };

  const handleGuardarEdit = () => {
    const payload = buildPayload(editDialog.form, idBebe);
    onEditar(editDialog.idVisita, payload);
    setEditDialog({ open: false, idVisita: null, form: FORM_INIT });
  };

  const canSubmit =
    form.nombreVisitante.trim() && form.familiar.trim() && form.fechaHoraVisita;

  const canSubmitEdit =
    editDialog.form.nombreVisitante.trim() &&
    editDialog.form.familiar.trim() &&
    editDialog.form.fechaHoraVisita;

  return (
    <Wrapper>
      {/* Lista de visitas */}
      {visitasList.length === 0 ? (
        <EmptyState>
          <EventNoteIcon sx={{ fontSize: 44, color: 'rgba(122, 101, 155, 0.4)', mb: 1 }} />
          <Typography sx={{ color: 'rgba(21,44,112,0.75)', fontSize: '0.9rem', textAlign: 'center' }}>
            Sin visitas registradas para este bebé.
          </Typography>
        </EmptyState>
      ) : (
        <CardList>
          {visitasList.map((v) => (
            <VisitaCard key={v.idVisita}>
              <AvatarWrap>
                <PersonOutlineIcon sx={{ fontSize: 24, color: '#7A659B' }} />
              </AvatarWrap>
              <CardBody>
                <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', color: '#152C70', lineHeight: 1.3 }}>
                  {v.nombreVisitante}
                </Typography>
                <Typography sx={{ fontSize: '0.8125rem', color: 'rgba(21,44,112,0.7)', mt: 0.25 }}>
                  {v.familiar} · {formatFecha(v.fechaHoraVisita)}
                </Typography>
                {v.observacion && (
                  <Typography sx={{ fontSize: '0.8rem', color: 'rgba(21,44,112,0.75)', mt: 0.25, fontStyle: 'italic' }}>
                    {v.observacion}
                  </Typography>
                )}
                {(v.documentoVisitante || v.telefonoVisitante) && (
                  <Typography sx={{ fontSize: '0.78rem', color: 'rgba(21,44,112,0.75)', mt: 0.25 }}>
                    {v.documentoVisitante ? `DNI: ${v.documentoVisitante}` : ''}
                    {v.documentoVisitante && v.telefonoVisitante ? ' · ' : ''}
                    {v.telefonoVisitante ? `Tel: ${v.telefonoVisitante}` : ''}
                  </Typography>
                )}
              </CardBody>
              <Actions>
                <IconButton
                  size="small"
                  aria-label={`Editar visita de ${v.nombreVisitante}`}
                  onClick={() => handleOpenEdit(v)}
                  sx={{ color: '#7A659B', minWidth: 44, minHeight: 44 }}
                >
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  aria-label={`Eliminar visita de ${v.nombreVisitante}`}
                  onClick={() => onEliminar(v.idVisita)}
                  sx={{ color: '#b71c1c', minWidth: 44, minHeight: 44 }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Actions>
            </VisitaCard>
          ))}
        </CardList>
      )}

      {/* Botón / Formulario nueva visita */}
      {!showForm ? (
        <Button
          fullWidth
          variant="outlined"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => setShowForm(true)}
          sx={{
            mt: 2,
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '10px',
            borderColor: 'rgba(122,101,155,0.5)',
            color: '#7A659B',
            minHeight: 44,
            '&:hover': { borderColor: '#7A659B', bgcolor: 'rgba(122,101,155,0.06)' },
          }}
        >
          Nueva visita
        </Button>
      ) : (
        <FormSection>
          <FormTitle>Nueva visita</FormTitle>
          <LabelInput
            name="nombreVisitante"
            label="Nombre del visitante"
            value={form.nombreVisitante}
            onChange={handleChange}
            labelColor={LABEL_COLOR}
            inputColor={INPUT_COLOR}
            styleLabel={LABEL_STYLE}
          />
          <LabelInput
            name="familiar"
            label="Vínculo familiar"
            value={form.familiar}
            onChange={handleChange}
            placeholder="Ej: Madre, Padre, Abuelos"
            labelColor={LABEL_COLOR}
            inputColor={INPUT_COLOR}
            styleLabel={LABEL_STYLE}
          />
          <LabelInput
            name="fechaHoraVisita"
            label="Fecha y hora de la visita"
            type="datetime-local"
            value={form.fechaHoraVisita}
            onChange={handleChange}
            labelColor={LABEL_COLOR}
            inputColor={INPUT_COLOR}
            styleLabel={LABEL_STYLE}
          />
          <LabelInput
            name="documentoVisitante"
            label="Documento del visitante (opcional)"
            value={form.documentoVisitante}
            onChange={handleChange}
            inputProps={{ inputMode: 'numeric' }}
            labelColor={LABEL_COLOR}
            inputColor={INPUT_COLOR}
            styleLabel={LABEL_STYLE}
          />
          <LabelInput
            name="telefonoVisitante"
            label="Teléfono del visitante (opcional)"
            value={form.telefonoVisitante}
            onChange={handleChange}
            inputProps={{ inputMode: 'numeric' }}
            labelColor={LABEL_COLOR}
            inputColor={INPUT_COLOR}
            styleLabel={LABEL_STYLE}
          />
          <LabelInput
            name="observacion"
            label="Observación (opcional)"
            value={form.observacion}
            onChange={handleChange}
            multiline
            rows={3}
            labelColor={LABEL_COLOR}
            inputColor={INPUT_COLOR}
            styleLabel={LABEL_STYLE}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
            <Button
              variant="contained"
              fullWidth
              disabled={!canSubmit}
              onClick={handleCrear}
              sx={BTN_PRIMARY}
            >
              Registrar visita
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => { setShowForm(false); setForm(FORM_INIT); }}
              sx={BTN_CANCEL}
            >
              Cancelar
            </Button>
          </Box>
        </FormSection>
      )}

      {/* Dialog edición */}
      <Dialog open={editDialog.open} onClose={() => setEditDialog((d) => ({ ...d, open: false }))} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, color: '#152C70', pb: 0 }}>Editar visita</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <LabelInput
            name="nombreVisitante"
            label="Nombre del visitante"
            value={editDialog.form.nombreVisitante}
            onChange={handleEditChange}
            labelColor={LABEL_COLOR}
            inputColor={INPUT_COLOR}
            styleLabel={LABEL_STYLE}
          />
          <LabelInput
            name="familiar"
            label="Vínculo familiar"
            value={editDialog.form.familiar}
            onChange={handleEditChange}
            placeholder="Ej: Madre, Padre, Abuelos"
            labelColor={LABEL_COLOR}
            inputColor={INPUT_COLOR}
            styleLabel={LABEL_STYLE}
          />
          <LabelInput
            name="fechaHoraVisita"
            label="Fecha y hora"
            type="datetime-local"
            value={editDialog.form.fechaHoraVisita}
            onChange={handleEditChange}
            labelColor={LABEL_COLOR}
            inputColor={INPUT_COLOR}
            styleLabel={LABEL_STYLE}
          />
          <LabelInput
            name="documentoVisitante"
            label="Documento (opcional)"
            value={editDialog.form.documentoVisitante}
            onChange={handleEditChange}
            inputProps={{ inputMode: 'numeric' }}
            labelColor={LABEL_COLOR}
            inputColor={INPUT_COLOR}
            styleLabel={LABEL_STYLE}
          />
          <LabelInput
            name="telefonoVisitante"
            label="Teléfono (opcional)"
            value={editDialog.form.telefonoVisitante}
            onChange={handleEditChange}
            inputProps={{ inputMode: 'numeric' }}
            labelColor={LABEL_COLOR}
            inputColor={INPUT_COLOR}
            styleLabel={LABEL_STYLE}
          />
          <LabelInput
            name="observacion"
            label="Observación (opcional)"
            value={editDialog.form.observacion}
            onChange={handleEditChange}
            multiline
            rows={3}
            labelColor={LABEL_COLOR}
            inputColor={INPUT_COLOR}
            styleLabel={LABEL_STYLE}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, flexDirection: 'column', gap: 1 }}>
          <Button
            variant="contained"
            fullWidth
            disabled={!canSubmitEdit}
            onClick={handleGuardarEdit}
            sx={BTN_PRIMARY}
          >
            Guardar cambios
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setEditDialog((d) => ({ ...d, open: false }))}
            sx={BTN_CANCEL}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Wrapper>
  );
};

export default VisitasBebe;

const Wrapper = styled(Box)`
  padding-bottom: 8px;
`;

const CardList = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const VisitaCard = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 2px 12px rgba(21, 44, 112, 0.08);
  border: 1px solid rgba(143, 0, 255, 0.08);
`;

const AvatarWrap = styled('div')`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(145deg, rgba(216, 190, 255, 0.45) 0%, rgba(143, 0, 255, 0.12) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
`;

const CardBody = styled(Box)`
  flex: 1;
  min-width: 0;
`;

const Actions = styled(Box)`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 0;
`;

const EmptyState = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
`;

const FormSection = styled(Box)`
  margin-top: 16px;
  padding: 16px;
  border-radius: 14px;
  border: 1px solid rgba(143, 0, 255, 0.12);
  background: rgba(243, 240, 255, 0.4);
`;

const FormTitle = styled(Typography)`
  font-family: Roboto, sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #152C70;
  margin-bottom: 4px;
`;
