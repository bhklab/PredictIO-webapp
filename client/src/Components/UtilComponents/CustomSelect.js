import React from 'react';
import Select from 'react-select';

const customSelectStyles = {
    control: base => ({
        ...base,
        minHeight: '34px',
        height: '34px',
    }),
    valueContainer: (provided, state) => ({
        ...provided,
        height: '34px',
        padding: '0 5px'
      }),
      input: (provided, state) => ({
        ...provided,
        margin: '0px',
      }),
      indicatorsContainer: (provided, state) => ({
        ...provided,
        height: '34px',
      }),
};

const CustomSelect = (props) => {
    const {className, value, options, onChange, isDisabled} = props;
    return(
        <Select 
            className={className}
            value={value}
            options={options} 
            onChange={onChange} 
            styles={customSelectStyles}
            isDisabled={isDisabled}
        />
    );
}

export default CustomSelect;