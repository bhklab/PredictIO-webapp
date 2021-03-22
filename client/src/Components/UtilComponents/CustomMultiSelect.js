import React from 'react';
import { MultiSelect } from 'primereact/multiselect';
import styled from 'styled-components';
import colors from '../../styles/colors';

const StyledMultiSelect = styled(MultiSelect)`
    .p-multiselect-header .p-checkbox {
        display: ${props => props.checkbox ? 'block' : 'none'};
    }
    .p-multiselect-trigger .pi {
        color: ${colors.gray_text};
        font-size: 0.7rem;
    }
    .p-multiselect-items .p-multiselect-item {
        color: ${colors.gray_text};
        font-family: 'Noto Sans', sans-serif;
        font-size: 12px;
    }
    .p-multiselect-label-container {
        font-family: 'Noto Sans', sans-serif;
        font-size: 12px;
    }
    .p-multiselect-filter-container input {
        font-size: 12px;
    }
    .selected-item {
        margin-right: 5px;
    }
`;

const selectedTemplate = (option) => {
    if (option) {
        return (<span className='selected-item'>{option}</span>);
    }
    return "Select...";
}

const CustomMultiSelect = (props) => {
    const {className, value, options, onChange, placeholder, disabled, checkbox} = props;

    return(
        <StyledMultiSelect 
            className={className}
            value={value}
            options={options} 
            onChange={onChange} 
            selectedItemTemplate={selectedTemplate}
            filter={true}
            placeholder={placeholder}
            disabled={disabled}
            checkbox={checkbox}
        />
    );
}

export default CustomMultiSelect;