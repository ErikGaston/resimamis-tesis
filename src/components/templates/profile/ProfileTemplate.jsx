import { Box, Button } from '@mui/material'
import React from 'react'
import ProfileForm from '../../molecules/profileForm/ProfileForm';
import MotherTemplate from '../../templates/mother/MotherTemplate';
import styled from '@emotion/styled';
import { PageHeader } from '../../common/PageHeader';
import AccordionCustomized from '../../atoms/accordionCustomized/AccordionCustomized';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';

const GRADIENT = 'linear-gradient(90deg, #7F00FF 0%, #E100FF 100%)';

const btnSave = {
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '1rem',
  minHeight: 44,
  borderRadius: '10px',
  background: GRADIENT,
  boxShadow: '0 4px 14px rgba(127,0,255,0.28)',
  color: '#fff',
};

const btnCancel = {
  textTransform: 'none',
  fontWeight: 600,
  minHeight: 44,
  borderRadius: '10px',
  borderColor: 'rgba(21,44,112,0.25)',
  color: '#152C70',
};

const btnEdit = {
  textTransform: 'none',
  fontWeight: 600,
  minHeight: 44,
  borderRadius: '10px',
  background: GRADIENT,
  boxShadow: '0 4px 14px rgba(127,0,255,0.18)',
  color: '#fff',
};

export const ProfileTemplate = ({
  model = {},
  setModel,
  error = false,
  submit = () => { },
  editForm,
  setEditForm,
  type,
  localities,
  estadosCiviles,
  mothers,
  typeForm,
  fieldErrors,
  setFieldErrors,
  profileBabyExtras,
  disableAccordion = false,
  myProfile = false,
  hideHeader = false,
}) => {
  const headerTitle = [model?.nombre, model?.apellido].filter(Boolean).join(' ').trim() || 'Perfil'

  const volunteerFormContent = (
    <>
      <ProfileForm
        model={model}
        setModel={setModel}
        error={error}
        edit={editForm}
        fieldErrors={fieldErrors}
        setFieldErrors={setFieldErrors}
        myProfile={myProfile}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
        {!editForm ? (
          <Button
            variant="contained"
            fullWidth
            onClick={() => setEditForm(true)}
            sx={btnEdit}
          >
            Editar voluntaria
          </Button>
        ) : (
          <>
            <Button
              variant="contained"
              fullWidth
              onClick={submit}
              sx={btnSave}
            >
              Guardar cambios
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => setEditForm(false)}
              sx={btnCancel}
            >
              Cancelar
            </Button>
          </>
        )}
      </Box>
    </>
  )

  return (
    <>
      {!hideHeader && <PageHeader title={headerTitle} />}

      {type === "MOTHER" && (
        <Box sx={{ px: 2.5, pt: 1, pb: 1 }}>
          <MotherTemplate
            model={model}
            setModel={setModel}
            error={error}
            localities={localities}
            estadosCiviles={estadosCiviles}
            mothers={mothers}
            withTitle={false}
            edit={editForm}
            typeForm={typeForm}
            fieldErrors={fieldErrors}
            setFieldErrors={setFieldErrors}
            profileBabyExtras={profileBabyExtras}
            submitMother={submit}
            setEditForm={setEditForm}
          />
        </Box>
      )}

      {type === "VOLUNTEER" && (
        <Box sx={{ px: 2.5, pt: 1, pb: 1 }}>
          {disableAccordion ? (
            volunteerFormContent
          ) : (
            <AccordionCustomized
              item="datos-voluntaria"
              defaultExpanded={false}
              expandIcon={<ExpandCircleDownIcon style={{ color: '#8F00FF' }} />}
              summary={
                <TitleAccordion>
                  {`Datos de la voluntaria: ${headerTitle}`}
                </TitleAccordion>
              }
              details={volunteerFormContent}
            />
          )}
        </Box>
      )}
    </>
  )
}

const TitleAccordion = styled('span')`
  color: #152C70;
  font-family: Roboto;
  font-size: 19px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: 0.8px;
`;