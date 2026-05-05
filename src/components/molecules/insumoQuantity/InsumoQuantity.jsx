import styled from '@emotion/styled';
import React from 'react'
import { Divider, Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const InsumoQuantity = (props) => {
    const { item, listSupplies, setListSupplies } = props;

    const stockDisponible = Number(item?.stockActual ?? 0);
    const cantidad = Number(item?.cantidad ?? 0);
    const puedeSumar = stockDisponible > 0 && cantidad < stockDisponible;

    const addSupplies = (supply) => {
        let newList = [...listSupplies];
        let index = newList.findIndex((row) => row?.idInsumo === supply?.idInsumo);
        if (index === -1) return;
        const max = Number(newList[index]?.stockActual ?? 0);
        if (newList[index].cantidad >= max) return;
        newList[index] = {
            ...newList[index],
            cantidad: newList[index].cantidad + 1,
        };
        setListSupplies(newList);
    };

    const removeSupplies = (supply) => {
        let newList = [...listSupplies];
        let index = newList.findIndex((row) => row?.idInsumo === supply?.idInsumo);
        if (index !== -1 && newList[index].cantidad !== 0) {
            newList[index] = {
                ...newList[index],
                cantidad: newList[index].cantidad - 1,
            };
        }
        setListSupplies(newList);
    };

    return (
        <div style={{ padding: '10px 0' }}>
            <Title>
                {item?.nombre}
            </Title>
            <ContainerText>
                <Subtitle style={{ flexDirection: 'column', alignItems: 'flex-start', display: 'flex', gap: 4 }}>
                    <span>
                        Entrega: {cantidad} {cantidad === 1 ? 'unidad' : 'unidades'}
                    </span>
                    <span style={{ color: stockDisponible <= 0 ? '#C2185B' : '#152C70', fontSize: 13 }}>
                        Stock disponible: {stockDisponible}
                    </span>
                </Subtitle>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Button style={{ textTransform: 'inherit' }}
                        onClick={() => removeSupplies(item)}
                        disabled={cantidad <= 0}
                    >
                        <RemoveCircleOutlineIcon style={{ color: cantidad <= 0 ? '#CECECE' : '#8F00FF' }} />
                    </Button>
                    <TitleButton style={{ fontWeight: 600, margin: '0px' }}>
                        {cantidad}
                    </TitleButton>
                    <Button style={{ textTransform: 'inherit' }}
                        onClick={() => addSupplies(item)}
                        disabled={!puedeSumar}
                    >
                        <AddCircleOutlineIcon style={{ color: puedeSumar ? '#8F00FF' : '#CECECE' }} />
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