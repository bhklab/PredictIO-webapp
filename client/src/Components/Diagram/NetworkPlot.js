/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import Plotly from 'plotly.js-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
import {withSize} from 'react-sizeme';
import { colors, plotColors } from '../../styles/colors';
// import * as d3 from 'd3';

const Plot = createPlotlyComponent(Plotly);

const NetworkPlot = (props) => {
    const { className, data, plotId, size } = props;

    const [plotData, setPlotData] = useState([]);

    useEffect(() => {
        let clusterLines = [];
        for(const [index, cluster] of data.entries()) {
            if(cluster.points.x.length > 1){
                let center = {x: cluster.points.x[cluster.points.center], y: cluster.points.y[cluster.points.center]};
                let remainingX = cluster.points.x.filter((item, i) => i !== cluster.center);
                let remainingY = cluster.points.y.filter((item, i) => i !== cluster.center);
                remainingX.forEach((x, i) => {
                    clusterLines.push({
                        x: [center.x, x],
                        y: [center.y, remainingY[i]],
                        hoverinfo: 'skip',
                        showlegend: false,
                        type: 'scatter',
                        mode: 'line',
                        marker: {
                            color: plotColors[index]
                        }
                    });
                });
            }
        }

        let clusterPoints = data.map((cluster, i) => ({
            x: cluster.points.x,
            y: cluster.points.y,
            click_ids: [...Array(cluster.points.x.length).keys()].map(item => `${cluster.cluster}-${item}`),
            hoverinfo: 'text',
            hovertext: cluster.points.signature,
            showlegend: false,
            type: 'scatter',
            mode: 'markers',
            marker: {
                color: cluster.points.signature.map(item => item === 'custom' ? colors.purple : plotColors[i]),
            },
        }));

        let clusterData = clusterLines.concat(clusterPoints);

        setPlotData(clusterData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return(
        <div className={className}>
            <Plot 
                graphDiv={plotId}
                data={plotData}
                layout={{
                    width: size.width,
                    height: size.width * 0.6 < 350 ? size.width * 0.6 : 350,
                    autosize: true,
                    paper_bgcolor: 'white',
                    plot_bgcolor: 'white',
                    yaxis: { 
                        title: '', 
                        zeroline: true, 
                        dtick: '1',
                        ticklen: 0, 
                        fixedrange : true 
                    },
                    xaxis: { 
                        title: '', 
                        zeroline: true, 
                        dtick: '1',
                        ticklen: 0, 
                        fixedrange: true
                    },
                    hovermode: 'closest',
                    font: {
                        size: 11,
                        family: 'Noto Sans',
                    },
                    margin: {
                        l: 10,
                        r: 10,
                        t: 10,
                        b: 20,
                    }
                }}
                config={{
                    responsive: true,
                    displayModeBar: false,
                }}
            />
        </div>
    )
}

export default withSize()(NetworkPlot);