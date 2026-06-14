import { Box, IconButton } from '@mui/material'
import React from 'react'
import ProfileForm from '../../molecules/profileForm/ProfileForm';
import MotherTemplate from '../../templates/mother/MotherTemplate';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import styled from '@emotion/styled';
import { PageHeader } from '../../common/PageHeader';

export const ProfileTemplate = ({
  model = {},
  setModel,
  error = false,
  submit = () => { },
  editForm,
  setEditForm,
  type,
  localities,
  mothers,
  typeForm,
  fieldErrors,
  setFieldErrors,
  profileBabyExtras,
}) => {
  const changeEditForm = () => {
    setEditForm(state => !state)
  }

  const headerTitle = [model?.nombre, model?.apellido].filter(Boolean).join(' ').trim() || 'Perfil'

  return (
    <>
      <PageHeader
        title={headerTitle}
        rightAction={
          <IconButton
            onClick={editForm ? submit : changeEditForm}
            aria-label={editForm ? 'Guardar cambios' : 'Editar perfil'}
            sx={{ color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' } }}
          >
            {editForm ? <CheckIcon /> : <EditIcon />}
          </IconButton>
        }
      />
      {type === "MOTHER" && (
        <Box sx={{ px: 2.5, pt: 1, pb: 1 }}>
          <MotherTemplate
            model={model}
            setModel={setModel}
            error={error}
            localities={localities}
            mothers={mothers}
            withTitle={false}
            edit={editForm}
            typeForm={typeForm}
            fieldErrors={fieldErrors}
            setFieldErrors={setFieldErrors}
            profileBabyExtras={profileBabyExtras}
          />
        </Box>
      )}
      {type === "VOLUNTEER" && (
        <Box sx={{ px: 2.5, pt: 1, pb: 1 }}>
          <ProfileForm
            model={model}
            setModel={setModel}
            error={error}
            edit={editForm}
            fieldErrors={fieldErrors}
            setFieldErrors={setFieldErrors}
          />
        </Box>
      )}

    </>
  )
}

const StyledIconButton = styled(IconButton)`
    border-radius:50%;
    fill: linear-gradient(90deg, #7F00FF 0%, #E100FF 100%);
`;