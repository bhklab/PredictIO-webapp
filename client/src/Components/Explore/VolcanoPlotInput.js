import React, {useState, useEffect} from 'react';
import axios from 'axios';
import styled from 'styled-components';
import ActionButton from '../UtilComponents/ActionButton';
import CustomSelect from '../UtilComponents/CustomSelect';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import colors from '../../styles/colors';

const StyledForm = styled.div`
    width: ${props => props.flexDirection === 'column' ? '100%' : '80%'};
    margin-top: 30px;
    display: flex;
    flex-direction: ${props => props.flexDirection};
    align-items: center;
    justify-content: space-between;
    font-size: 12px;

    .formField {
        width: ${props => props.flexDirection === 'column' ? '100%' : '30%'};
        display: flex;
        align-items: center;
        justify-content: ${props => props.flexDirection === 'column' ? 'space-between' : 'center'};
        margin-bottom: 10px;
        margin-right: ${props => props.flexDirection === 'column' ? '0px' : '20px'};
        .label {
            margin-right: 10px;
            font-size: 14px;
        }
        .select {
            width: 70%;
        }
    }

    .buttonField {
        display: flex;
        justify-content: ${props => props.flexDirection === 'column' ? 'flex-end' : 'flex-start'};
    }
`;

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
`;

const StyledMultiSelect = styled(MultiSelect)`
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

const VolcanoPlotInput = (props) => {
    
    const {parameters, setParameters, onSubmit, onReset, resetButton} = props;

    const [signatureOptions, setSignatureOptions] = useState([]);
    const [outcomeOptions, setOutcomeOptions] = useState([]);
    const [modelOptions, setModelOptions] = useState([]);

    const readyToSubmit = () => {
        return(
            parameters.model === '' || 
            parameters.outcome === '' || 
            parameters.subgroup === ''
        );
    };

    const onOutcomeSelect = (selected) => {
        console.log(selected);
        let modelValue = '';
        let modelOptionsCopy = JSON.parse(JSON.stringify(modelOptions));

        if(selected.value !== 'Response'){
            modelOptionsCopy.find(item => item.value === 'Log_regression').isDisabled = true;
            modelOptionsCopy.filter(item => item.value !== 'Log_regression')
                .forEach(filtered => {
                    filtered.isDisabled = false;
                });
            modelValue = parameters.model === 'Log_regression' && '';
        }else{
            modelOptionsCopy.find(item => item.value === 'Log_regression').isDisabled = false;
            modelOptionsCopy.filter(item => item.value !== 'Log_regression')
                .forEach(filtered => {
                    filtered.isDisabled = true;
                });
            modelValue = parameters.model !== 'Log_regression' && '';
        }

        setModelOptions(modelOptionsCopy);

        setParameters(prev => ({
            ...prev, 
            model: modelValue,
            outcome: selected.value
        }));
    }

    const onSignatureSelect = (selections) => {
        console.log(selections.value);
        let signatureOptionsCopy = JSON.parse(JSON.stringify(signatureOptions));

        if(selections.value.includes('ALL')){
            signatureOptionsCopy.forEach(item => {
                if(item.value === 'ALL'){
                    item.disabled = false;
                }else{
                    item.disabled = true;
                }
            });
            selections.value = selections.value.filter(item => item === 'ALL');
        }else{
            signatureOptionsCopy.forEach(item => {
                item.disabled = false;
            });
        }

        setSignatureOptions(signatureOptionsCopy);
        setParameters({
            ...parameters, 
            signatures: selections.value});
    }

    const selectedTemplate = (option) => {
        if (option) {
            return (<span className='selected-item'>{option}</span>);
        }
        return "Select...";
    }

    useEffect(() => {
        const setSelectOptions = async () => {
            const res = await axios.get('/api/signatures_list');
            console.log(res.data);
            let signatures = res.data.signatures.map(item => ({value: item, label: item, disabled: true}));
            signatures.unshift({value: 'ALL', label: 'ALL', disabled: false});
            setSignatureOptions(signatures);
            setOutcomeOptions(res.data.outcome.map(item => ({value: item, label: item, disabled: false})));
            setModelOptions(res.data.model.map(item => ({value: item, label: item, disabled: false})));
        }
        setSelectOptions();
    }, []);

    return(
        <StyledForm flexDirection={props.flexDirection}>
            <div className='formField'>
                <div className='label'>Outcome: </div>
                <StyledDropdown 
                    className='select'
                    value={parameters.outcome}
                    options={outcomeOptions} 
                    onChange={(e) => {onOutcomeSelect(e)}} 
                    placeholder="Select..."
                />
            </div>
            <div className='formField'>
                <div className='label'>Model: </div> 
                <StyledDropdown 
                    className='select'
                    value={parameters.model}
                    options={modelOptions} 
                    onChange={(e) => {setParameters({...parameters, model: e.value})}} 
                    placeholder="Select..."
                />
            </div>
            <div className='formField'>
                <div className='label'>Signatures: </div> 
                <StyledMultiSelect 
                    className='select'
                    value={parameters.signatures}
                    options={signatureOptions} 
                    onChange={(selections) => {onSignatureSelect(selections)}} 
                    selectedItemTemplate={selectedTemplate}
                    filter={true}
                    placeholder='Select...'
                />
            </div>
            <div className='formField buttonField'>
                <ActionButton 
                    onClick={(e) => {onSubmit()}} text='Submit' disabled={readyToSubmit()} 
                    style={{width: '90px', height: '34px', fontSize: '14px'}} />
                {
                    resetButton &&
                    <ActionButton 
                        onClick={(e) => {onReset()}} 
                        text='Reset'
                        type='reset' 
                        style={{width: '90px', height: '34px', fontSize: '14px', marginLeft: '10px'}} />
                }
            </div>
        </StyledForm>
    );
}

export default VolcanoPlotInput;