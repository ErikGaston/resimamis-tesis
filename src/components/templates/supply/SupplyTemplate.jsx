import React, { useEffect } from 'react'
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Button, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import TitleText from '../../atoms/titleText/TitleText';
import styled from '@emotion/styled';
import CardSupply from '../../molecules/cardSupply/CardSupply';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const SupplyTemplate = (props) => {
    const {
        valueTask,
        changeTask,
        supplies
    } = props;
    const navigate = useNavigate();
    const [listSupplies, setListSupplies] = React.useState(null)

    const functionBack = () => {
        navigate(-1)
    }

    useEffect(() => {
        if (supplies) {
            setListSupplies(supplies);
        }
    }, [supplies]);

    return (
        <div style={{ height: '100%' }}>
            <div style={{ display: 'flex', backgroundColor: '#8F00FF' }}>
                <IconButton onClick={functionBack}>
                    <HighlightOffIcon style={{ color: 'white' }} />
                </IconButton>
                <TitleText fontsize={'20px'} style={{ width: '85%' }}>INSUMOS</TitleText>
            </div>
            <div style={{ display: 'flex', marginTop: '3px' }}>
                <Button
                    onClick={changeTask(1)}
                    style={{ backgroundColor: valueTask === 1 ? '#8F00FF' : '#D094FF', width: '50%', height: '30px', textTransform: 'capitalize', borderRadius: '5px' }}
                >
                    <SubTitle>Lista de insumos</SubTitle>
                </Button>
                <Button
                    onClick={changeTask(2)}
                    style={{ backgroundColor: valueTask === 2 ? '#8F00FF' : '#D094FF', width: '50%', height: '30px', textTransform: 'capitalize', borderRadius: '5px' }}
                >
                    <SubTitle>Movimientos</SubTitle>
                </Button>
            </div>
            {valueTask === 1 &&
                <div>
                    {listSupplies && listSupplies.map((item, index) => (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                marginTop: '10px'
                            }}
                            key={item.idInsumo}>
                            <CardSupply
                                first={item.nombre}
                                second={'Stock: ' + item.stockActual + ' U '}
                                textColor={item.stockActual <= item.stockMinimo ? '#DD2476' : '#152C70'}
                            />
                        </div>

                    ))}
                    <StyledIconButton to={'/insumo'}>
                        <AddCircleIcon style={{ color: '8F00FF', fontSize: '50px', filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.25))' }} />
                    </StyledIconButton>
                </div>
            }
            {valueTask === 2 &&
                <div>

                </div>
            }
        </div>
    )
}


export default SupplyTemplate;

const SubTitle = styled('h3')`
    color: #FFF;
    text-align: center;
    font-family: Roboto;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 0.9px;
`;

const StyledIconButton = styled(Link)`
    position: fixed;
    bottom: 14%; /* Espacio desde la parte inferior */
    left: 44%; /* Centrar horizontalmente */
    transform: translateX(-50%); /* Centrar horizontalmente */
    width: 1px;
    height: 1px;
`;