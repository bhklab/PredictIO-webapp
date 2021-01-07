import React, {useState} from 'react';
import Layout from '../UtilComponents/Layout';
import ActionButton from '../UtilComponents/ActionButton';
import ForestPlot from '../Diagram/ForestPlot2';
import Select from 'react-select';
import styled from 'styled-components';
import axios from 'axios';

const StyledForm = styled.div`
    width: 500px;
    .formField {
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
            {
                data.ready ?
                <div>
                    <ActionButton onClick={(e) => {setData({data: {}, ready: false})}} text='Reset' style={{with: '50%', height: '50px'}} />
                    <ForestPlot individuals={data.data.individuals} meta={data.data.meta} />
                </div>
                :
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
                        <ActionButton onClick={(e) => {getData()}} text='Submit' style={{with: '50%', height: '50px'}} />
                    </div>
                </StyledForm>
            }
        </Layout>
    );
}

export default Explore;