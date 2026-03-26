import React, { useEffect } from 'react'
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Button, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TitleText from '../../atoms/titleText/TitleText';
import styled from '@emotion/styled';
import AddchartIcon from '@mui/icons-material/Addchart';
import ButtonCustomized from '../../atoms/button/ButtonCustomized';
import DialogInsumo from '../../organisms/dialogInsumo/DialogInsumo';
import { ChartHugMonth } from '../../organisms/statistics/ChartHugMonth';
import { ChartLocalitiesMother } from '../../organisms/statistics/ChartLocalitiesMother';
import { ChartSupplies } from '../../organisms/statistics/ChartSupplies';
import { ChartAssignmentMonth } from '../../organisms/statistics/ChartAssignmentMonth';

const StatisticsTemplate = (props) => {
    const { stateChart, setStateChart, generateChart, valueChart, statisticsMonthMother, statisticsLocalities, statisticsSupplies, statisticsAssignment } = props;
    const navigate = useNavigate();
    const [listBabysFree, setListBabysFree] = React.useState(null)


    const functionBack = () => {
        navigate(-1)
    }

    return (
        <div style={{ height: '100%' }}>
            <div style={{ display: 'flex', backgroundColor: '#8F00FF' }}>
                <IconButton onClick={functionBack}>
                    <HighlightOffIcon style={{ color: 'white' }} />
                </IconButton>
                <TitleText fontsize={'20px'} style={{ width: '85%' }}>ESTADISTICAS</TitleText>
            </div>
            <ContainerButtons>
                <Button
                    style={{ textTransform: 'inherit', border: '1px solid #8F00FF', margin: '10px 0' }}
                    onClick={() => generateChart(1)}
                >
                    <AddchartIcon style={{ color: '#8F00FF', marginRight: '10px' }} />
                    <Title>
                        Grafico de edades de las madres
                    </Title>
                </Button>

                <Button
                    style={{ textTransform: 'inherit', border: '1px solid #8F00FF', margin: '10px 0' }}
                    onClick={() => generateChart(2)}
                >
                    <AddchartIcon style={{ color: '#8F00FF', marginRight: '10px' }} />
                    <Title>
                        Grafico de localidades de las madres
                    </Title>
                </Button>

                <Button
                    style={{ textTransform: 'inherit', border: '1px solid #8F00FF', margin: '10px 0' }}
                    onClick={() => generateChart(3)}
                >
                    <AddchartIcon style={{ color: '#8F00FF', marginRight: '10px' }} />
                    <Title>
                        Grafico de insumos mas utilizados
                    </Title>
                </Button>

                <Button
                    style={{ textTransform: 'inherit', border: '1px solid #8F00FF', margin: '10px 0' }}
                    onClick={() => generateChart(4)}
                >
                    <AddchartIcon style={{ color: '#8F00FF', marginRight: '10px' }} />
                    <Title>
                        Grafico de abrazos por mes
                    </Title>
                </Button>
            </ContainerButtons>
            {stateChart === 'OPEN' &&
                <DialogInsumo
                    open={stateChart === 'OPEN'}
                    setOpen={setStateChart}
                    title={
                        <div style={{ display: 'flex', backgroundColor: '#8F00FF' }}>
                            <IconButton onClick={() => setStateChart('')}>
                                <HighlightOffIcon style={{ color: 'white' }} />
                            </IconButton>
                            <TitleText fontsize={'20px'} style={{ width: '85%' }}>ESTADISTICAS</TitleText>
                        </div>
                    }
                    content={
                        <>
                            {valueChart === 1
                                &&
                                <ChartHugMonth
                                    title={'Estadistica de edades de madres'}
                                    statisticsMonthMother={statisticsMonthMother}
                                />
                            }
                            {
                                valueChart === 2
                                &&
                                <ChartLocalitiesMother
                                    title={'Estadistica de localidades de madres'}
                                    statisticsLocalities={statisticsLocalities}
                                />
                            }
                            {valueChart === 3 &&
                                <ChartSupplies
                                    title={'Estadistica de cantidad de insumos'}
                                    statisticsSupplies={statisticsSupplies}
                                />
                            }
                            {valueChart === 4 &&
                                <ChartAssignmentMonth
                                    title={'Estadistica de cantidad de asignaciones'}
                                    statisticsAssignment={statisticsAssignment}
                                />
                            }
                        </>
                    }
                />
            }
        </div >
    )
}


export default StatisticsTemplate;

const Title = styled('h3')`
    color: #152C70;
    font-family: Roboto;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 0.8px;
    text-align:left;
    width:80%;
`;

const ContainerButtons = styled('div')`
   padding:30px;
   display:flex;
   flex-direction:column;
   align-content:center;
`;