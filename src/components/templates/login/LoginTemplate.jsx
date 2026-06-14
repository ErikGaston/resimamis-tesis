import logoMamis from "../../../assets/login/mamis-login.svg";
import { useState } from "react";
import { Box, CircularProgress, Container, IconButton } from "@mui/material";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Button from "../../common/Button";
import TitleText from "../../atoms/titleText/TitleText";
import SubtitleText from "../../atoms/subtitleText/SubtitleText";
import LabelInput from "../../molecules/labelInput/LabelInput";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import styled from "@emotion/styled";

const LoginTemplate = ({ model, setModel, handleLogin, loading = false, error }) => {
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const onChangeText = (e) => {
        const { name, value } = e.target;
        let regexNumber = /^$|^[0-9]+$/;
        if (name === 'Dni') {
            if (regexNumber.test(value)) {
                setModel({ ...model, [name]: value })
            }
            else {
                return;
            }
        }
        else {
            setModel({ ...model, [name]: value })
        }
    }

    return (
        <StyledContainer maxWidth={false} disableGutters>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <TitleText fontsize={'28px'}>Bienvenida</TitleText>
                <StyledImage src={logoMamis} />
                <Box
                    component="form"
                    noValidate
                    onSubmit={e => { e.preventDefault(); handleLogin(); }}
                    sx={{ mt: 1, width: '80%' }}
                >
                    <LabelInput
                        name='Dni'
                        label='DNI'
                        value={model?.Dni}
                        onChange={onChangeText}
                        className={error && 'errorInput'}
                        labelColor={'#fff'}

                    />
                    <LabelInput
                        name='Contrasena'
                        label='Contraseña'
                        value={model?.Contrasena}
                        onChange={onChangeText}
                        labelColor='#fff'

                        type={showPassword ? 'text' : 'password'}
                        InputProps={{ // Pasa endAdornment dentro de InputProps
                            endAdornment: (
                                <IconButton
                                    onClick={handleClickShowPassword}
                                    edge="end"
                                    style={{ color: '#FFF' }}
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            )
                        }}
                        className={error && 'errorInput'}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        sx={{ mt: 5, height: '48px', fontWeight: 600, background: '#FFF', color: '#8F00FF', fontFamily: 'Roboto', fontSize: '17px', borderRadius: '10px' }}
                    >
                        {loading
                            ? <CircularProgress size={22} sx={{ color: '#8F00FF' }} />
                            : 'INICIAR SESIÓN'
                        }
                    </Button>
                    {error && (
                        <Box
                            role="alert"
                            sx={{
                                mt: 2,
                                px: 2,
                                py: 1.25,
                                borderRadius: '10px',
                                backgroundColor: '#C53814',
                                color: '#fff',
                                fontSize: '14px',
                                lineHeight: 1.4,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            <ErrorOutlineIcon sx={{ fontSize: 20, flexShrink: 0 }} />
                            <span>{error}</span>
                        </Box>
                    )}
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        mt: 5,
                    }}
                >
                    <SubtitleText>
                        ¡Gracias por formar parte de Voluntarias Abrazadoras!
                    </SubtitleText>
                </Box>
            </Box>
        </StyledContainer >
    )
}

export default LoginTemplate;

const StyledContainer = styled(Container)`
  flex: 1;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  background: linear-gradient(90deg, #A54DFF 0%, #F187FF 100%);
  overflow-y: auto;
  box-sizing: border-box;
`;

const StyledImage = styled('img')`
  width: 180px;
  height: auto;
  margin: 16px 0 8px;
`;