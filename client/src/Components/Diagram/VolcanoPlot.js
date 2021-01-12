/* eslint-disable radix */
import React, {useState, useEffect} from 'react';
import Plotly from 'plotly.js-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
import colors from '../../styles/colors';

const Plot = createPlotlyComponent(Plotly);

const VolcanoPlot = (props) => {
    const {data, plotId} = props;

    const [plotData, setPlotData] = useState({
        x: [], 
        y: [], 
        hovertext: [], 
        pointColor: [],
        pointSize: []
    });

    useEffect(() => {
        console.log(data);
        setPlotData({
            x: data.map(item => (item.effect_size)),
            y: data.map(item => (item.logPval)),
            click_ids: data.map((item, i) => (i)),
            hovertext: getHoverText(data),
            pointColor: getPointColor(data),
            pointSize: getPointSize(data)
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

    /**
     * get data point sizes based on standard error value (se)
     * @param {*} points 
     */
    const getPointSize = (points) => {
        let size = [];
        points.forEach(point => {
            if(point.se <= 0.05){
                size.push(6);
            }else if(point.se > 0.05 && point.se <= 0.1){
                size.push(8);
            }else if(point.se > 0.1 && point.se <= 0.15){
                size.push(10);
            }else if(point.se > 0.15){
                size.push(12);
            }
        });
        return size;
    }

    /**
     * get data point color based on HR (effect size) value and -log10 p-value
     * @param {*} points 
     */
    const getPointColor = (points) => {
        let pointColors = [];
        points.forEach(point => {
            if(point.logPval < -Math.log10(0.05)){
                pointColors.push(colors.gray_text);
            }else{
                if(point.effect_size > 1){
                    pointColors.push(colors.red);
                }else{
                    pointColors.push(colors.blue);
                }
            }
        });
        return pointColors;
    }

    /**
     * get formatted hovertext for each data point.
     * @param {*} points 
     */
    const getHoverText = (points) => {
        let hoverText = [];
        points.forEach(point => {
            hoverText.push(`Signature: ${point.signature}<br>Coef: ${Math.round(point.effect_size * 1000) / 1000}<br>P-value: ${Math.round(point.pval * 10000) / 10000}<br>I2: ${Math.round(point.i2 * 10000) / 10000}<br>P-value I2: ${Math.round(point.pval_i2 * 1000) / 1000}`)
        });
        return hoverText;
    }

    return(
        <Plot
            data={[
                {
                    showlegend: false,
                    type: 'scatter',
                    mode: 'markers',
                    x: plotData.x,
                    y: plotData.y,
                    click_ids: plotData.click_ids,
                    hoverinfo: 'text',
                    hovertext: plotData.hovertext,
                    marker: {
                        color: plotData.pointColor,
                        size: plotData.pointSize
                    },
                    name: 'points',
                }
            ]}
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
                shapes: [
                    {
                        type: 'line',
                        xref: 'paper',
                        x0: 0,
                        y0: -Math.log10(0.05),
                        x1: 1,
                        y1: -Math.log10(0.05),
                        line: {
                            color: colors.light_gray,
                            width: 2,
                            dash: 'dot'
                        }
                    }
                ]
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