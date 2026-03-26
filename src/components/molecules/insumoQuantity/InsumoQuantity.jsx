import styled from '@emotion/styled';
import React from 'react'
import { Divider, Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const InsumoQuantity = (props) => {
    const { item, listSupplies, setListSupplies } = props;

    const addSupplies = (supply) => {
        let newList = [...listSupplies];
        let index = newList.findIndex(item => item?.idInsumo === supply?.idInsumo);
        if (index !== -1) {
            // Si el suministro ya existe, clonar el elemento y aumentar la cantidad
            newList[index] = {
                ...newList[index],
                cantidad: newList[index].cantidad + 1,
            };
        }
        setListSupplies(newList);
    }

    const removeSupplies = (supply) => {
        let newList = [...listSupplies];
        let index = newList.findIndex(item => item?.idInsumo === supply?.idInsumo);
        if (index !== -1 && newList[index].cantidad !== 0) {
            // Si el suministro ya existe, clonar el elemento y aumentar la cantidad
            newList[index] = {
                ...newList[index],
                cantidad: newList[index].cantidad - 1,
            };
        }
        setListSupplies(newList);
    }

    return (
        <div style={{ padding: '10px 0' }}>
            <Title>
                {item?.nombre}
            </Title>
            <ContainerText>
                <Subtitle>
                    {item?.cantidad + " unidades"}
                </Subtitle>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Button style={{ textTransform: 'inherit' }}
                        onClick={() => removeSupplies(item)}
                    >
                        <RemoveCircleOutlineIcon style={{ color: '#8F00FF' }} />
                    </Button>
                    <TitleButton style={{ fontWeight: 600, margin: '0px' }}>
                        {item?.cantidad}
                    </TitleButton>
                    <Button style={{ textTransform: 'inherit' }}
                        onClick={() => addSupplies(item)}
                    >
                        <AddCircleOutlineIcon style={{ color: '#8F00FF' }} />
                    </Button>
                </div>

            </ContainerText>
            <Divider />
        </div>
    )
}

export default InsumoQuantity;


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
            align-items:center;
            `;

const Subtitle = styled('span')`
            color: #152C70;
            font-family: Roboto;
            font-size: 14px;
            font-style: normal;
            line-height: normal;
            letter-spacing: 0.8px;
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