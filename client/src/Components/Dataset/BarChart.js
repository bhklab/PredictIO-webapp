import React from 'react';
import Plotly from 'plotly.js-dist';
import createPlotlyComponent from 'react-plotly.js/factory';

const Plot = createPlotlyComponent(Plotly);

const BarChart = (props) => {
    const { data, text, orientation, hoverinfo } = props;
    return(
        <Plot 
            data={data.map(item => ({
                x: item.x,
                y: item.y,
                name: item.name,
                type: 'bar',
                hoverinfo: hoverinfo, 
                orientation: orientation ? orientation : 'h'
            }))}
            layout={{
                title: text,
                font: {
                    size: 11,
                    family: 'Noto Sans',
                },
                height: 400,
                width: 400,
                margin: {
                    l: 50,
                    r: 10,
                    t: 30,
                    b: 40,
                },
            }}
            config={{
                responsive: true,
                displayModeBar: false,
            }}
        />
    );
}

export default BarChart;