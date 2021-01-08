import React, {useState} from 'react';
import Layout from '../UtilComponents/Layout';
import ActionButton from '../UtilComponents/ActionButton';
import ForestPlot from '../Diagram/ForestPlot2';
import Select from 'react-select';
import styled from 'styled-components';
import axios from 'axios';

const StyledForm = styled.div`
    width: 100%;
    .formField {
        margin-top: 10px;
        margin-bottom: 10px;
    }
`

const StyledResult = styled.div`
    margin-top: 50px;
    .resultElement {
        margin-top: 10px;
        margin-bottom: 10px;
    }
`

const signatureOptions = [
    'Woundhealing', 
    'Tcell_exclusion', 
    'Tcell_inflamed',
    'TGFB_Mariathasan', 
    'TGFB_Thorsson', 
    'TIDE', 
    'TLS_sig',
    'WNT_signaling', 
    'PTEN_loss', 
    'PDL1', 
    'NK_sig', 
    'LRRC15_CAF',
    'IRG', 'IPS', 
    'IPRES', 
    'Inflammatory', 
    'IMPRES', 
    'ImmuneCells',
    'Immune_sig', 
    'IFNG', 
    'Hypoxia', 
    'Essential_IO_genes',
    'EMT_Thompson', 
    'EMT_Mak', 
    'CRMA', 
    'CYT', 
    'CD8', 
    'APM_Wang',
    'APM_Thompson', 
    'Angiogenesis', 
    'ADO_Corvus', 
    'ADO_Astra', 
    'TIS'
];

const outcomeOptions = ['OS', 'PFS', 'Response'];

const modelOptions = ['COX', 'DI', 'Log_regression'];

const Explore = () => {

    const [data, setData] = useState({data: {}, ready: false});
    const [parameters, setParameters] = useState({
        signature: '',
        outcome: '',
        model: ''
    })

    const getData = async () => {
        const res = await axios.post('/api/explore', parameters);
        console.log(res.data.individuals);
        setData({data: res.data, ready: true});
    }

    return(
        <Layout>
            <StyledForm>
                <div className='formField'>
                    <Select 
                        options={signatureOptions.map(option => ({value: option, label: option}))} 
                        onChange={(e) => {setParameters({...parameters, signature: e.value})}} />
                </div>
                <div className='formField'>
                    <Select 
                        options={outcomeOptions.map(option => ({value: option, label: option}))} 
                        onChange={(e) => {setParameters({...parameters, outcome: e.value})}} />
                </div>
                <div className='formField'>
                    <Select 
                        options={modelOptions.map(option => ({value: option, label: option}))} 
                        onChange={(e) => {setParameters({...parameters, model: e.value})}} />
                </div>
                <div className='formField'>
                    <ActionButton onClick={(e) => {getData()}} text='Submit' style={{width: '100px', height: '25px', fontSize: '14px'}} />
                </div>
            </StyledForm>
            {
                data.ready &&
                <StyledResult>
                    <div className='resultElement'>
                        <ActionButton onClick={(e) => {setData({data: {}, ready: false})}} text='Reset' style={{width: '100px', height: '25px', fontSize: '14px'}} />
                    </div>
                    <div className='resultElement'>
                        <ForestPlot individuals={data.data.individuals} meta={data.data.meta} />
                    </div>
                </StyledResult>
            }
        </Layout>
    );
}

export default Explore;
