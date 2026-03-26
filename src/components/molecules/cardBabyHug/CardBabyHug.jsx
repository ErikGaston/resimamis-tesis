import styled from '@emotion/styled';
import React from 'react'
import { IconButton } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ShareLocationIcon from '@mui/icons-material/ShareLocation';
import ButtonCustomized from '../../atoms/button/ButtonCustomized';

const CardBabyHug = (props) => {
    const { item, name, hall, editHug, informationHug, submitStartHug } = props;

    return (
        <ContainerCard>
            <div>
                <Title>
                    {name}
                </Title>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ShareLocationIcon style={{ color: '#8F00FF', fontSize: '20px', marginRight: '5px' }} />
                    <Subtitle>
                        {"Sala " + hall}
                    </Subtitle>
                </div>
            </div>
            <div>
                {item.fechaHoraInicio === null ?
                    <div style={{ textAlign: 'right' }}>
                        <ButtonCustomized
                            variant={'container'}
                            // colorButton={'#18A974'}
                            colorText={'#FFF'}
                            sx={{
                                fontSize: '16px',
                                background: 'linear-gradient(90deg, #7F00FF 0%, #E100FF 100%)',
                                boxShadow: '3px 4px 4px 0px rgba(0, 0, 0, 0.25)'
                            }}
                            onClick={() => submitStartHug(item?.idAsignacion)}
                        >
                            INICIAR
                        </ButtonCustomized>
                    </div>
                    :
                    <>
                        <IconButton onClick={() => editHug(item)} >
                            <EditIcon style={{ color: '#8F00FF', fontSize: '30px' }} />
                        </IconButton>
                        {/* <IconButton onClick={informationHug}>
                            <InsertDriveFileIcon style={{ color: '#8F00FF', fontSize: '30px' }} />
                        </IconButton> */}
                    </>
                }
            </div>
        </ContainerCard>
    )
}

export default CardBabyHug;

const ContainerCard = styled('div')`
    display: flex;
    justify-content:center;
    margin:10px 0 ;
    width: 250px;
    height: 60px;
    padding: 10px 25px;
    justify-content: space-between;
    align-items: center;

    border-radius: 10px;
    background: #FFF;
    box-shadow: 3px 3px 4px 0px rgba(0, 0, 0, 0.25);
`;

const Title = styled('h3')`
    color: #152C70;

    text-align: center;
    font-family: Roboto;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 0.7px;
`;

const Subtitle = styled('span')`
    color: #152C70;
    font-family: Roboto;
    font-size: 12px;
    font-style: normal;
    font-weight: 300;
    line-height: normal;
    letter-spacing: 0.6px;
`;