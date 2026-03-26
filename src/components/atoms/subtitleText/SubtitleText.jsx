import styled from '@emotion/styled';
import React from 'react'

const SubtitleText = ({ children }) => {
    return (
        <Title>{children}</Title>
    )
}

export default SubtitleText;

const Title = styled('h4')`
    color: #FFF;
    text-align: center;
    font-family: Roboto;
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 2.8px;
    text-shadow: 0px 4px 6px rgba(0,0,0,0.41);
`;