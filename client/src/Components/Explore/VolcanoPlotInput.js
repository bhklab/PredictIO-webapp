import React from 'react';
import Select from 'react-select';
import styled from 'styled-components';
import ActionButton from '../UtilComponents/ActionButton';

const StyledForm = styled.div`
    width: 100%;
    margin-top: 30px;
    .formField {
        width: 50%;
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
`

const outcomeOptions = ['OS', 'PFS', 'Response'];

const modelOptions = ['COX', 'DI', 'Log_regression'];

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
    
    const {parameters, setParameters, getVolcanoPlotData} = props;

    return(
        <StyledForm>
            <div className='formField'>
                <div className='label'>Outcome: </div>
                <Select 
                    className='select'
                    options={outcomeOptions.map(option => ({value: option, label: option}))} 
                    onChange={(e) => {setParameters({...parameters, outcome: e.value})}} />
            </div>
            <div className='formField'>
                <div className='label'>Model: </div> 
                <Select 
                    className='select'
                    options={modelOptions.map(option => ({value: option, label: option}))} 
                    onChange={(e) => {setParameters({...parameters, model: e.value})}} />
            </div>
            <div className='formField'>
                <ActionButton onClick={(e) => {getVolcanoPlotData()}} text='Submit' style={{width: '100px', height: '40px', fontSize: '14px'}} />
            </div>
        </StyledForm>
    );
}

export default VolcanoPlotInput;