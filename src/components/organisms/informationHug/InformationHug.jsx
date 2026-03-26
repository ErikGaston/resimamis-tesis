import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { IconButton, Button, Divider } from '@mui/material';
import styled from '@emotion/styled';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TitleText from '../../atoms/titleText/TitleText';
import ButtonCustomized from '../../atoms/button/ButtonCustomized';
import LabelInput from '../../molecules/labelInput/LabelInput';
import DialogInsumo from '../../organisms/dialogInsumo/DialogInsumo';
import InsumoQuantity from '../../molecules/insumoQuantity/InsumoQuantity';

const InformationHug = (props) => {
    const { model, setModel, submitEndHug, hug, changeStateInsumo, stateInsumo, setStateInsumo, listSupplies, setListSupplies, submitChangeSupplies, setChangeInformationHug } = props;

    const functionBack = () => {
        setChangeInformationHug(false)
    }

    const onChangeText = (e) => {
        const { name, value } = e.target;
        setModel({ ...model, [name]: value })
    }

    return (
        <div style={{ height: '100%' }}>
            <div style={{ display: 'flex' }}>
                <IconButton onClick={functionBack}>
                    <ArrowBackIcon style={{ color: '#8F00FF' }} />
                </IconButton>
                <TitleText fontsize={'20px'} style={{ width: '85%', color: '#8F00FF' }}>ABRAZO</TitleText>
            </div>
            <div style={{ padding: '10px' }}>
                <div style={{ padding: '10px 0' }}>
                    <Title>
                        Bebé
                    </Title>
                    <ContainerText>
                        <Subtitle>
                            {hug?.nombreBebe}
                        </Subtitle>
                        {/* <Button style={{ textTransform: 'inherit' }}
                    // onClick={selectVolunteersFree}
                    >
                        <TitleButton style={{ fontWeight: 600, margin: '0px' }}>
                            Ver perfil
                        </TitleButton>
                    </Button> */}
                    </ContainerText>
                    <Divider />
                </div>

                <div style={{ padding: '10px 0' }}>
                    <Title>
                        Sala de internación
                    </Title>
                    <ContainerText>
                        <Subtitle>
                            {hug?.sala}
                        </Subtitle>
                    </ContainerText>
                    <Divider />
                </div>

                {/* <div style={{ padding: '10px 0' }}>
                    <Title>
                        Mamá
                    </Title>
                    <ContainerText>
                        <Subtitle>
                            {hug?.idMadre}
                        </Subtitle>
                        <Button style={{ textTransform: 'inherit' }}
                        // onClick={selectVolunteersFree}
                        >
                            <TitleButton style={{ fontWeight: 600, margin: '0px' }}>
                                Ver perfil
                            </TitleButton>
                        </Button>
                    </ContainerText>
                    <Divider />
                </div> */}

            </div>
            <div style={{ padding: '10px' }}>
                <LabelInput
                    name='comentario'
                    label='Comentario'
                    value={model?.comentario || ''}
                    onChange={onChangeText}
                    labelColor={'#152C70'}
                    inputColor={'#152C70'}
                    styleLabel={{ fontSize: '16px' }}
                    multiline
                    rows={3}
                />
            </div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                <Button style={{ textTransform: 'inherit' }}
                    onClick={changeStateInsumo}
                >
                    <TitleButton>
                        Agregar insumo
                    </TitleButton>
                    <AddCircleOutlineIcon style={{ color: true ? '#8F00FF' : '#CECECE', marginLeft: '10px' }} />
                </Button>
            </div>
            <div style={{ textAlign: 'center' }}>
                <ButtonCustomized
                    variant={'container'}
                    // colorButton={'#18A974'}
                    colorText={'#FFF'}
                    sx={{
                        width: '70%',
                        fontSize: '16px',
                        background: 'linear-gradient(90deg, #7F00FF 0%, #E100FF 100%)',
                        boxShadow: '3px 4px 4px 0px rgba(0, 0, 0, 0.25)'
                    }}
                    onClick={() => submitEndHug(hug?.idAsignacion)}
                >
                    FINALIZAR ABRAZO
                </ButtonCustomized>
            </div>
            {stateInsumo === 'OPEN' &&
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
                                    item={item}
                                    listSupplies={listSupplies}
                                    setListSupplies={setListSupplies}
                                    submitChangeSupplies={submitChangeSupplies}
                                />
                            ))}
                            <div style={{ textAlign: 'center', marginTop: '40px' }}>
                                <ButtonCustomized
                                    variant={'container'}
                                    // colorButton={'#18A974'}
                                    colorText={'#FFF'}
                                    sx={{
                                        width: '70%',
                                        fontSize: '16px',
                                        background: 'linear-gradient(90deg, #7F00FF 0%, #E100FF 100%)',
                                        boxShadow: '3px 4px 4px 0px rgba(0, 0, 0, 0.25)'
                                    }}
                                    onClick={() => submitChangeSupplies(listSupplies, hug?.idAsignacion)}
                                >
                                    REGISTRAR INSUMOS
                                </ButtonCustomized>
                            </div>
                        </>
                    }
                />
            }
        </div>
    )
}

export default InformationHug;

const Title = styled('h3')`
            color: #152C70;
            font-family: Roboto;
            font-size: 16px;
            font-style: normal;
            font-weight: bold;
            line-height: normal;
            letter-spacing: 0.8px;
            margin-top:10px;
            `;

const ContainerText = styled('div')`
            display:flex;
            justify-content:space-between;
            `;

const Subtitle = styled('span')`
            color: #152C70;
            font-family: Roboto;
            font-size: 14px;
            font-style: normal;
            line-height: normal;
            letter-spacing: 0.8px;
            padding-bottom: 5px;
            `;

const TitleButton = styled('h3')`
            color: #8F00FF;
            font-family: Roboto;
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            letter-spacing: 0.8px;
            `;