import React from 'react';
import styled from 'styled-components';
import { colors } from '../../styles/colors';

const StyledButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    font-weight: normal;
    letter-spacing: 0.5px;
    padding: 0.2rem 0.4rem;
    background-color: #ffffff;
    border: 1px solid ${colors.blue};
    font-size: 11px;
    color: ${colors.blue};
    cursor: pointer;

    i {
        margin-left: 2px;
        font-size: 11px;
    }

    :hover {
        outline: ${colors.hover_blue};
        border: 1px solid ${colors.hover_blue};
        color: ${colors.hover_blue};
        i {
            color: ${colors.hover_blue};
        }
    }
`;

const DownloadButton = (props) => {
    const { className, onClick, text } = props;

    return (
        <StyledButton className={className} onClick={onClick} disabled={props.disabled} >
            {text}<i className="pi pi-download"></i>
        </StyledButton>
    );
}

export default DownloadButton;