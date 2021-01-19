import React from 'react';
import Select from 'react-select';
import styled from 'styled-components';
import ActionButton from '../UtilComponents/ActionButton';

const StyledForm = styled.div`
    width: ${props => props.flexDirection === 'column' ? '100%' : '70%'};
    margin-top: 30px;
    display: flex;
    flex-direction: ${props => props.flexDirection};
    align-items: center;
    justify-content: space-between;

    .formField {
        width: ${props => props.flexDirection === 'column' ? '100%' : '30%'};
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        .label {
            margin-right: 10px;
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
    { value: 'OS', label: 'OS' }, 
    { value: 'PFS', label: 'PFS' }, 
    { value: 'Response', label: 'Response' }
];

const modelOptions = [
    { value: 'COX', label: 'COX' }, 
    { value: 'DI', label: 'DI' }, 
    { value: 'Log_regression', label: 'Log_regression' }
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
    
    const {parameters, setParameters, onSubmit} = props;

    return(
        <StyledForm flexDirection={props.flexDirection}>
            <div className='formField'>
                <div className='label'>Outcome: </div>
                <Select 
                    className='select'
                    value={outcomeOptions.filter(option => option.value === parameters.outcome)}
                    options={outcomeOptions} 
                    onChange={(e) => {setParameters({...parameters, outcome: e.value})}} />
            </div>
            <div className='formField'>
                <div className='label'>Model: </div> 
                <Select 
                    className='select'
                    value={modelOptions.filter(option => option.value === parameters.model)}
                    options={modelOptions} 
                    onChange={(e) => {setParameters({...parameters, model: e.value})}} />
            </div>
            <div className='formField buttonField'>
                <ActionButton onClick={(e) => {onSubmit()}} text='Submit' disabled={(parameters.model === '' || parameters.outcome === '')} style={{width: '100px', height: '40px', fontSize: '14px'}} />
                {
                    props.resetButton &&
                    <ActionButton 
                        onClick={(e) => {props.onReset()}} 
                        text='Reset'
                        type='reset' 
                        style={{width: '100px', height: '40px', fontSize: '14px', marginLeft: '10px'}} />
                }
            </div>
        </StyledForm>
    );
}

export default VolcanoPlotInput;