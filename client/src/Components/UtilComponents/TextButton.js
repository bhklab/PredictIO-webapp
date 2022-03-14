import React from 'react';
import styled from 'styled-components';
import { colors } from '../../styles/colors';

const StyledTextButton = styled.button`
    background: none;
    border: none;
    outline: none;
    cursor: pointer;
    color: ${colors.blue};
`;

const TextButton = (props) => {
    const { onClick, label } = props;
    return(
        <StyledTextButton onClick={onClick}>
            {label}
        </StyledTextButton>
    )
}

export default TextButton;