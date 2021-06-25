import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import styled from 'styled-components';
import { colors } from '../../styles/colors';

const StyledDropdown = styled(Dropdown)`
    .pi {
        color: ${colors.gray_text};
        font-size: 0.7rem;
    }
    .p-dropdown-items .p-dropdown-item {
        color: ${colors.gray_text};
    }
    .p-dropdown-label, .p-dropdown-item {
        font-family: 'Noto Sans', sans-serif;
        font-size: 12px;
    }
    .p-inputtext{
        padding: 0.3rem 0.5rem;
    }
`;

const CustomDropdown = (props) => {
    const {className, value, options, onChange, placeholder, disabled} = props;

    return(
      <StyledDropdown 
        className={className}
        value={value}
        options={options} 
        onChange={onChange} 
        placeholder={placeholder}
        disabled={disabled}
      />
    );
}

export default CustomDropdown;