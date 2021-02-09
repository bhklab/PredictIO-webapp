import React from 'react';
import Select from 'react-select';
import SelectMulti from 'react-multiselect-checkboxes';

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
    const {className, value, options, onChange, isDisabled, isMulti} = props;

    const selectDropdown = isMulti ? 
    <SelectMulti 
      className={className}
      value={value}
      options={options}
      styles={customSelectStyles} 
      isDisabled={isDisabled}
    />
    :
    <Select 
        className={className}
        value={value}
        options={options} 
        onChange={onChange} 
        styles={customSelectStyles}
        isDisabled={isDisabled}
    />

    return(selectDropdown);
}

export default CustomSelect;