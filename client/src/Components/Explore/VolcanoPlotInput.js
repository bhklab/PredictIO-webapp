import React from 'react';
import styled from 'styled-components';
import ActionButton from '../UtilComponents/ActionButton';
import CustomSelect from '../UtilComponents/CustomSelect';

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

const outcomeOptions = [
    { value: 'OS', label: 'OS', isDisabled: false}, 
    { value: 'PFS', label: 'PFS', isDisabled: false }, 
    { value: 'Response', label: 'Response', isDisabled: false }
];

const modelOptions = [
    { value: 'COX', label: 'COX', isDisabled: false }, 
    { value: 'DI', label: 'DI', isDisabled: false }, 
    { value: 'Log_regression', label: 'Log Regression', isDisabled: false }
];

const subgroupOptions = [
    { value: 'ALL', label: 'All', isDisabled: false },
    { value: 'Sequencing', label: 'Sequencing', isDisabled: false },
    { value: 'Tumor', label: 'Tumor', isDisabled: false }
];

// const signatureOptions = [
//     'Woundhealing', 
//     'Tcell_exclusion', 
//     'Tcell_inflamed',
//     'TGFB_Mariathasan', 
//     'TGFB_Thorsson', 
//     'TIDE', 
//     'TLS_sig',
//     'WNT_signaling', 
//     'PTEN_loss', 
//     'PDL1', 
//     'NK_sig', 
//     'LRRC15_CAF',
//     'IRG', 'IPS', 
//     'IPRES', 
//     'Inflammatory', 
//     'IMPRES', 
//     'ImmuneCells',
//     'Immune_sig', 
//     'IFNG', 
//     'Hypoxia', 
//     'Essential_IO_genes',
//     'EMT_Thompson', 
//     'EMT_Mak', 
//     'CRMA', 
//     'CYT', 
//     'CD8', 
//     'APM_Wang',
//     'APM_Thompson', 
//     'Angiogenesis', 
//     'ADO_Corvus', 
//     'ADO_Astra', 
//     'TIS'
// ];

const VolcanoPlotInput = (props) => {
    
    const {parameters, setParameters, onSubmit, onReset, resetButton} = props;

    const readyToSubmit = () => {
        return(
            parameters.model === '' || 
            parameters.outcome === '' || 
            parameters.subgroup === ''
        );
    };

    const onOutcomeSelect = (selected) => {
        let modelValue = '';

        if(selected.value !== 'Response'){
            modelOptions.find(item => item.value === 'Log_regression').isDisabled = true;
            modelOptions.filter(item => item.value !== 'Log_regression')
                .forEach(filtered => {
                    filtered.isDisabled = false;
                });
            modelValue = parameters.model === 'Log_regression' && '';
        }else{
            modelOptions.find(item => item.value === 'Log_regression').isDisabled = false;
            modelOptions.filter(item => item.value !== 'Log_regression')
                .forEach(filtered => {
                    filtered.isDisabled = true;
                });
            modelValue = parameters.model !== 'Log_regression' && '';
        }
        setParameters(prev => ({
            ...prev, 
            model: modelValue,
            outcome: selected.value
        }));
    }

    return(
        <StyledForm flexDirection={props.flexDirection}>
            <div className='formField'>
                <div className='label'>Outcome: </div>
                <CustomSelect 
                    className='select'
                    value={outcomeOptions.filter(option => option.value === parameters.outcome)}
                    options={outcomeOptions} 
                    onChange={(e) => {onOutcomeSelect(e)}} 
                />
            </div>
            <div className='formField'>
                <div className='label'>Model: </div> 
                <CustomSelect 
                    className='select'
                    value={modelOptions.filter(option => option.value === parameters.model)}
                    options={modelOptions} 
                    onChange={(e) => {setParameters({...parameters, model: e.value})}} 
                />
            </div>
            <div className='formField'>
                <div className='label'>Subgroup: </div> 
                <CustomSelect 
                    className='select'
                    value={subgroupOptions.filter(option => option.value === parameters.subgroup)}
                    options={subgroupOptions} 
                    onChange={(e) => {setParameters({...parameters, subgroup: e.value})}} 
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