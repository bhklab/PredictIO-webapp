import React, {useState} from 'react';
import Layout from '../UtilComponents/Layout';
import ActionButton from '../UtilComponents/ActionButton';
import ForestPlot from '../Diagram/ForestPlot2';
import VolcanoPlot from '../Diagram/VolcanoPlot';
import Select from 'react-select';
import styled from 'styled-components';
import axios from 'axios';

const StyledForm = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 30px;
    .formField {
        width: 250px;
    }
`

const StyledPlotArea = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
`

const StyledPlot = styled.div`
    margin-top: 50px;
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

    const [volcanoPlotData, setVolcanoPlotData] = useState({data: {}, ready: false});
    const [forestPlotData, setForestPlotData] = useState({data: {}, ready: false});
    const [parameters, setParameters] = useState({
        signature: '',
        outcome: '',
        model: ''
    });

    const getVolcanoPlotData = async () => {
        setVolcanoPlotData({data: {}, ready: false});
        setForestPlotData({data: {}, ready: false});
        const res = await axios.post('/api/explore/volcano_plot', parameters);
        setVolcanoPlotData({data: res.data, ready: true});
    };

    const getForestPlotData = async (params) => {
        setForestPlotData({data: {}, ready: false}); // reset the data object so that the plot is redrawn.
        const res = await axios.post('/api/explore/forest_plot', params);
        console.log(res.data.individuals);
        setForestPlotData({data: res.data, ready: true});
    };

    return(
        <Layout>
            <h2>Explore the pre-computed signature data</h2>
            <StyledForm>
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
                    <ActionButton onClick={(e) => {getVolcanoPlotData()}} text='Submit' style={{width: '100px', height: '40px', fontSize: '14px'}} />
                </div>
            </StyledForm>
            <StyledPlotArea>
                <StyledPlot className='volcano'>
                {
                    volcanoPlotData.ready &&
                    <VolcanoPlot plotId='volcano-plot' data={volcanoPlotData.data} getForestPlotData={getForestPlotData}/>
                }
                </StyledPlot>
                <StyledPlot className='forest'>
                {
                    forestPlotData.ready &&
                    <ForestPlot individuals={forestPlotData.data.individuals} meta={forestPlotData.data.meta} />
                }
                </StyledPlot>
            </StyledPlotArea>
        </Layout>
    );
}

export default Explore;
