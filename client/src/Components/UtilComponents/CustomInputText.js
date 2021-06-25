import React from 'react';
import styled from 'styled-components';
import { InputText } from 'primereact/inputtext';
import { colors } from '../../styles/colors';

const StyledInputText = styled(InputText)`
    font-size: 12px;
    color: ${colors.gray_text};
    width: 100%;
`;

const InputTextWithLabel = styled.span`
    label {
        font-size: 12px;
        line-height: 1.3;
    }
`;

const CustomInputText = (props) => {
    const {id, className, value, onChange, placeholder, disabled, withLabel, label} = props;

    return(
        <React.Fragment>
            {
                withLabel ?
                <InputTextWithLabel className="p-float-label">
                    <StyledInputText
                        id={id} 
                        className={className}
                        value={value}
                        onChange={onChange} 
                        placeholder={placeholder}
                        disabled={disabled}
                    />
                    <label htmlFor={id}>{label}</label>
                </InputTextWithLabel>
                :
                <StyledInputText
                    id={id} 
                    className={className}
                    value={value}
                    onChange={onChange} 
                    placeholder={placeholder}
                    disabled={disabled}
                />
            }
            
        </React.Fragment>
    );
}

export default CustomInputText;