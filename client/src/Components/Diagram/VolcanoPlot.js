/* eslint-disable radix */
import React, {useState, useEffect} from 'react';
import Plotly from 'plotly.js-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
import styled from 'styled-components';
import * as d3 from 'd3';

const Plot = createPlotlyComponent(Plotly);

const VolcanoPlot = (props) => {
    const {data, plotId} = props;

    const [plotData, setPlotData] = useState({x: [], y: [], hovertext: []});

    useEffect(() => {
        console.log(data);
        setPlotData({
            x: data.map(item => (item.effect_size)),
            y: data.map(item => (item.logPval)),
            click_ids: data.map((item, i) => (i)),
            hovertext: data.map(item => (`${item.signature}, ${item.subgroup}, ${item.tissue_type}`))
        });
    }, []);

    const onClick = (data) => {
        let selectedPoint = props.data[data.points[0].data.click_ids[data.points[0].pointIndex]]
        console.log(selectedPoint);
        props.getForestPlotData({
            signature: selectedPoint.signature, 
            outcome: selectedPoint.outcome, 
            model: selectedPoint.model
        });
    }

    return(
        <Plot
            data={[{
                showlegend: false,
                type: 'scatter',
                mode: 'markers',
                x: plotData.x,
                y: plotData.y,
                click_ids: plotData.click_ids,
                hoverinfo: 'text',
                hovertext: plotData.hovertext,
                marker: {
                    color: '#5cc33c',
                    size: 8,
                },
                name: 'green',
            }]}
            layout={{
                height: 500,
                autosize: true,
                // width: 800,
                paper_bgcolor: 'white',
                plot_bgcolor: 'white',
                orientation: 'v',
                yaxis: { ticklen: 0, title: '-log10(p value)' },
                xaxis: { title: 'Hazard Ratio', zeroline: false },
                hovermode: 'closest',
                font: {
                    size: 14,
                    family: 'Arial',
                },
                margin: {
                    l: 45,
                    r: 0,
                    t: 0,
                    b: 40,
                },
            }}
            graphDiv={plotId}
            config={{
                responsive: true,
                displayModeBar: false,
            }}
            onClick={(data) => onClick(data)}
        />
    );
}

export default VolcanoPlot;