import React from 'react';
import styled from 'styled-components';
import colors from '../../styles/colors';

const StyledButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    border: none;
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

const ActionButton = (props) => {
    const {onClick, text, style} = props;

    return (
        <StyledButton onClick={onClick} style={style}>
            {text}
        </StyledButton>
    );
}

export default ActionButton;