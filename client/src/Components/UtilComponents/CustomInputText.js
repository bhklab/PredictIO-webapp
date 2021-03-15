import React from 'react';
import styled from 'styled-components';
import { InputText } from 'primereact/inputtext';
import colors from '../../styles/colors';

const StyledInputText = styled(InputText)`
    font-size: 12px;
    color: ${colors.gray_text};
`;

const CustomInputText = (props) => {
    const {className, value, onChange, placeholder, disabled} = props;

    return(
        <StyledInputText 
            className={className}
            value={value}
            onChange={onChange} 
            placeholder={placeholder}
            disabled={disabled}
        />
    );
}

export default CustomInputText;