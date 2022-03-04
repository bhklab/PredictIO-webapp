import React from 'react';
import Plotly from 'plotly.js-dist';
import createPlotlyComponent from 'react-plotly.js/factory';

const Plot = createPlotlyComponent(Plotly);

const PieChart = (props) => {
    const { data, text } = props;
    return(
        <Plot 
            data={[{
                values: data.values,
                labels: data.labels,
                type: 'pie',
                hole: .4,
            }]}
            layout = {{
                height: 400,
                width: 500,
                annotations: [{
                    font: {
                        size: 20
                    },
                    showarrow: false,
                    text: text,
                    x: 0.5,
                    y: 0.5
                }],
                margin: {
                    l: 50,
                    r: 10,
                    t: 50,
                    b: 50,
                },
            }}
            config={{
                responsive: true,
                displayModeBar: false,
            }}
        />
    );
}

export default PieChart;
