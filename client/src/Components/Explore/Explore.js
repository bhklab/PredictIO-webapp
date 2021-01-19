import React, {useState} from 'react';
import Layout from '../UtilComponents/Layout';
import ForestPlot from '../Diagram/ForestPlot3';
import VolcanoPlot from '../Diagram/VolcanoPlot';
import VolcanoPlotInput from './VolcanoPlotInput';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
`

const StyledPlotArea = styled.div`
    width: 48%;
    min-width: 540px;
    padding 10px;
`

const PlotParameters = styled.div`
    display: flex;
    margin-bottom: 20px;
    .parameterLine {
        margin-right: 10px;
    }
`

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
            <Container>
                <StyledPlotArea className='volcano'>
                {
                    volcanoPlotData.ready ?
                    <div>
                        <h3>Volcano Plot</h3>
                        <PlotParameters>
                            <div className='parameterLine'>Outcome: {parameters.outcome}</div>
                            <div className='parameterLine'>Model: {parameters.model}</div>
                        </PlotParameters>
                        <VolcanoPlot 
                            plotId='volcano-plot' 
                            parameters={parameters} 
                            setParameters={setParameters} 
                            data={volcanoPlotData.data} 
                            getForestPlotData={getForestPlotData}/>
                    </div>
                    :
                    <div>
                        <h3>Show Volcano Plot</h3>
                        <div>Select Outcome and Model, then click Submit.</div>
                        <VolcanoPlotInput 
                            parameters={parameters} 
                            setParameters={setParameters} 
                            getVolcanoPlotData={getVolcanoPlotData} />
                    </div>
                }
                </StyledPlotArea>
                <StyledPlotArea className='forest'>
                {
                    forestPlotData.ready ?
                    <div>
                        <h3>Forest Plot</h3>
                        <PlotParameters>
                            <div className='parameterLine'>Outcome: {parameters.outcome}</div>
                            <div className='parameterLine'>Model: {parameters.model}</div>
                            <div className='parameterLine'>Signature: {parameters.signature}</div>
                        </PlotParameters>
                        <ForestPlot id='forestplot' individuals={forestPlotData.data.individuals} meta={forestPlotData.data.meta} />
                    </div>
                    :
                    <div>
                        <h3>Show Forest Plot</h3>
                        <div>Click on a signature point on the volcano plot to display a corresponding forest plot.</div>
                    </div>
                }
                </StyledPlotArea>
            </Container>
        </Layout>
    );
}

export default Explore;
