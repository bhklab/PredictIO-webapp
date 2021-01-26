import React, {useState, useEffect} from 'react';
import ForestPlot from '../Diagram/ForestPlot3';
import VolcanoPlot from '../Diagram/VolcanoPlot';
import VolcanoPlotInput from './VolcanoPlotInput';
import styled from 'styled-components';
import axios from 'axios';

const ExploreContainer = styled.div`
    width: 100%;
`;

const PlotContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
`;

const StyledPlotArea = styled.div`
    width: 48%;
    min-width: 540px;
    padding 10px;
`;

const PlotParameters = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .parameterLine {
        margin-right: 20px;
    }
    .value {
        font-weight: bold;
    }
`;

const EffectSizeValues = styled.div`
    width: 100%;
    margin-bottom: 15px;
    .title {
        font-weight: bold;
    }
    .effectSizeValues {
        display: flex;
        margin-left: 10px;
    }
    .valueLine {
        margin-right: 20px;
    }
    .value {
        font-weight: bold;
    }
`

const Explore = (props) => {

    const {parameters, setParameters} = props;
    
    const [volcanoPlotData, setVolcanoPlotData] = useState({data: {}, ready: false});
    const [forestPlotData, setForestPlotData] = useState({data: {}, ready: false});

    const getVolcanoPlotData = async () => {
        setVolcanoPlotData({data: {}, ready: false}); // reset the data object so that the plot is redrawn.
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

    useEffect(() => {
        getVolcanoPlotData();
    }, []);

    return(
        <ExploreContainer>
            <h2>Explore pre-computed signature data</h2>
            <VolcanoPlotInput 
                parameters={parameters} 
                setParameters={setParameters} 
                onSubmit={getVolcanoPlotData} 
                flexDirection='row' 
                resetButton={true} 
                onReset={() => {window.location.reload()}} />
            <PlotContainer>
                <StyledPlotArea className='volcano'>
                {
                    volcanoPlotData.ready &&
                    <div>
                        <h3>Volcano Plot</h3>
                        <PlotParameters>
                            <div className='parameterLine'>Outcome: <span className='value'>{parameters.outcome}</span></div>
                            <div className='parameterLine'>Model: <span className='value'>{parameters.model}</span></div>
                            <div className='parameterLine'>Subgroup: <span className='value'>{parameters.subgroup}</span></div>
                        </PlotParameters>
                        <VolcanoPlot 
                            plotId='volcano-plot' 
                            parameters={parameters} 
                            setParameters={setParameters} 
                            data={volcanoPlotData.data} 
                            getForestPlotData={getForestPlotData}/>
                    </div>
                }
                </StyledPlotArea>
                <StyledPlotArea className='forest'>
                {
                    forestPlotData.ready ?
                    <div>
                        <h3>Forest Plot</h3>
                        <PlotParameters>
                            <div className='parameterLine'>Signature: <span className='value'>{parameters.signature}</span></div>
                        </PlotParameters>
                        <EffectSizeValues>
                            <div className='title'>Pooled Effect Sizes: </div>
                            <div className='effectSizeValues'>
                                <div className='valueLine'>P-value: <span className='value'>{Math.round(forestPlotData.data.meta[0].pval * 100) / 100}</span></div>
                                <div className='valueLine'>Coef: <span className='value'>{Math.round(forestPlotData.data.meta[0].se * 100) / 100}</span></div>
                                <div className='valueLine'>95CI Low: <span className='value'>{Math.round(forestPlotData.data.meta[0]._95ci_low * 100) / 100}</span></div>
                                <div className='valueLine'>95CI High: <span className='value'>{Math.round(forestPlotData.data.meta[0]._95ci_high * 100) / 100}</span></div>
                            </div>    
                        </EffectSizeValues>
                        <ForestPlot id='forestplot' individuals={forestPlotData.data.individuals} meta={forestPlotData.data.meta} />
                    </div>
                    :
                    <div>
                        <h3>Forest Plot</h3>
                        <div>Click on a signature point on the volcano plot to display a corresponding forest plot.</div>
                    </div>
                }
                </StyledPlotArea>
            </PlotContainer>
        </ExploreContainer>
    );
}

export default Explore;
