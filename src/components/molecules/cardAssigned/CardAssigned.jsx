import styled from '@emotion/styled';
import React from 'react'
import ShareLocationIcon from '@mui/icons-material/ShareLocation';

const CardAssigned = (props) => {
    const { name, hall, volunteer } = props;

    return (
        <ContainerCard>
            <FirstElement>
                <Title>
                    {name}
                </Title>
                <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '10px' }}>
                    <ShareLocationIcon style={{ color: '#FFF', fontSize: '20px', marginRight: '5px' }} />
                    <Subtitle>
                        {"Sala " + hall}
                    </Subtitle>
                </div>
            </FirstElement>
            <SecondElement>
                <TitleSecond>
                    {volunteer}
                </TitleSecond>
            </SecondElement>
        </ContainerCard>
    )
}

export default CardAssigned;

const ContainerCard = styled('div')`
    display: flex;
    flex-direction:column;
    align-items:center;
    width:250px;
    margin:10px 0;
    justify-content: space-between;
    align-items: center;

    border-radius: 10px;
    background: #FFF;
    box-shadow: 3px 3px 4px 0px rgba(0, 0, 0, 0.25);
`;

const FirstElement = styled('div')`
    display: flex;
    flex-direction: column;
    align-items: center;
    width:100%;

    border-radius: 10px 10px 0px 0px;
    background: linear-gradient(90deg, #7F00FF 0%, #E100FF 100%);
`;

const Title = styled('h3')`
    color: #fff;
    text-align: center;
    font-family: Roboto;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 0.7px;
`;

const Subtitle = styled('span')`
    color: #fff;
    font-family: Roboto;
    font-size: 12px;
    font-style: normal;
    font-weight: 300;
    line-height: normal;
    letter-spacing: 0.6px;
`;

const SecondElement = styled('div')`
    display: flex;
    justify-content: center;
    align-items: center;
    width:100%;

    border-radius: 0px 0px 10px 10px;
    background: #FFF;
`;

const TitleSecond = styled('h3')`
    color: #152C70;
    text-align: center;
    font-family: Roboto;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 0.7px;
`;

