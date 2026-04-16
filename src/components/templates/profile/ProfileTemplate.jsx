import { Box, IconButton } from '@mui/material'
import React from 'react'
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ProfileForm from '../../molecules/profileForm/ProfileForm';
import MotherTemplate from '../../templates/mother/MotherTemplate';
import ButtonCustomized from '../../atoms/button/ButtonCustomized';
import TitleText from '../../atoms/titleText/TitleText';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import styled from '@emotion/styled';

export const ProfileTemplate = ({
  model = {},
  setModel,
  error = false,
  submit = () => { },
  editForm,
  setEditForm,
  type,
  localities,
  typeForm,
  fieldErrors,
  setFieldErrors,
  profileBabyExtras,
}) => {
  const navigate = useNavigate();

  const changeEditForm = () => {
    setEditForm(state => !state)
  }

  const functionBack = () => {
    navigate(-1)
  }

  return (
    <>
      <div style={{ display: 'flex', backgroundColor: '#8F00FF' }}>
        <IconButton onClick={functionBack}>
          <HighlightOffIcon style={{ color: '#FFF' }} />
        </IconButton>
        <TitleText fontsize={'20px'} style={{ width: '85%' }}>PERFIL</TitleText>
      </div >
      <div style={{ textAlign: 'right' }}>
        <div style={{ padding: '10px 10px 0px 10px' }}>
          {editForm ?
            <ButtonCustomized
              variant={'container'}
              // colorButton={'#18A974'}
              colorText={'#FFF'}
              sx={{
                fontSize: '16px',
                borderRadius: '50%',
                minWidth: '30px',
                height: '52px',
                background: 'linear-gradient(90deg, #7F00FF 0%, #E100FF 100%)',
                boxShadow: '3px 4px 4px 0px rgba(0, 0, 0, 0.25)'
              }}
              onClick={() => submit(setEditForm)}
            >
              <CheckIcon style={{ fontSize: '30px' }} />
            </ButtonCustomized>
            :
            <ButtonCustomized
              variant={'container'}
              // colorButton={'#18A974'}
              colorText={'#FFF'}
              sx={{
                fontSize: '16px',
                borderRadius: '50%',
                minWidth: '30px',
                height: '52px',
                background: 'linear-gradient(90deg, #7F00FF 0%, #E100FF 100%)',
                boxShadow: '3px 4px 4px 0px rgba(0, 0, 0, 0.25)'
              }}
              onClick={changeEditForm}
            >
              <EditIcon style={{ fontSize: '30px' }} />
            </ButtonCustomized>
          }

        </div>
      </div>
      {type === "MOTHER" && (
        <Box sx={{ px: 2.5, pt: 1, pb: 1 }}>
          <MotherTemplate
            model={model}
            setModel={setModel}
            error={error}
            localities={localities}
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