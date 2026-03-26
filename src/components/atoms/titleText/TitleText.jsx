import styled from '@emotion/styled';
import React from 'react';

const TitleText = ({ children, fontsize, style }) => {
    return (
        <Title fontsize={fontsize} style={style}>{children}</Title>
    )
}

export default TitleText;

const Title = styled('h1')`
    /* font-size: 28px; */
    font-size: ${props => props.fontsize};

    color: #FFF;
    text-align: center;
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    letter-spacing: 2.8px;
    text-shadow: 0px 4px 6px rgba(0,0,0,0.41);
`;