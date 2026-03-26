import styled from '@emotion/styled';
import React from 'react'

const TitlePurple = ({ children }) => {
    return (
        <Title>{children}</Title>
    )
}

export default TitlePurple;

const Title = styled('h1')`
    color: #8F00FF;
    font-family: Roboto;
    font-size: 22px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`;