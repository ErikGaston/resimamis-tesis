import styled from '@emotion/styled';
import React from 'react'

const CardSupply = (props) => {
    const { first, second, textColor } = props;

    return (
        <ContainerCard>
            <Title style={{ color: textColor }}>
                {first}
            </Title>
            <TitleSecond style={{ color: textColor }}>
                {second}
            </TitleSecond>
        </ContainerCard>
    )
}

export default CardSupply;

const ContainerCard = styled('div')`
    display: flex;
    flex-direction:row;
    align-items:center;
    width:250px;
    margin:10px 0;
    justify-content: space-evenly;
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

