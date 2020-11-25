import React from 'react';
import styled from 'styled-components';
import colors from '../../styles/colors';

const StyledLinkButton = styled.a`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    font-weight: bold;
    letter-spacing: 2px;
    width: ${props => props.style.width ? props.style.width : '45%'};
    height: ${props => props.style.height ? props.style.height : '80px'};
    background-color: ${props => props.style.backgroundColor ? props.style.backgroundColor : colors.blue};
    font-size: ${props => props.style.fontSize ? props.style.fontSize : '20px'};
    color: ${props => props.style.fontColor ? props.style.fontColor : '#ffffff'};

    :hover {
        background-color: ${
            props => props.style.backgroundColorHover ? props.style.backgroundColorHover : colors.hover_blue
        };
    }
`;

const LinkButton = (props) => {
    const {href, text, style} = props;

    return (
        <StyledLinkButton href={href} style={style}>
            {text}
        </StyledLinkButton>
    );
}

export default LinkButton;