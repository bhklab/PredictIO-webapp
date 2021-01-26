import React from 'react';
import VolcanoPlot from '../Diagram/VolcanoPlot';
import styled from 'styled-components';

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

const VolcanoPlotContainer = (props) => {

    const { parameters, setParameters, volcanoPlotData, getForestPlotData } = props;

    return(
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
    );
}

export default VolcanoPlotContainer;