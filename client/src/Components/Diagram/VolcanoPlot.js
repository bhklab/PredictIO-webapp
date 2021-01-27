/* eslint-disable radix */
import React, {useState, useEffect} from 'react';
import Plotly from 'plotly.js-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
import {withSize} from 'react-sizeme';
import colors from '../../styles/colors';
import * as d3 from 'd3';

const Plot = createPlotlyComponent(Plotly);

// for changing the cursor on hover of points
const hover = () => {
    d3.selectAll('.nsewdrag').style('cursor', 'pointer');
};

const unhover = () => {
    d3.selectAll('.nsewdrag').style('cursor', '');
};

const VolcanoPlot = (props) => {
    const {data, plotId, getForestPlotData, parameters, setParameters} = props;

    const [plotData, setPlotData] = useState({
        x: [], 
        y: [], 
        hovertext: [], 
        pointColor: [],
        pointSize: []
    });

    const [selectedPointIndex, setSelectedPointIndex] = useState(null);

    useEffect(() => {
        console.log(data);
        setPlotData({
            x: data.map(item => (item.effect_size)),
            y: data.map(item => (item.logPval)),
            click_ids: data.map((item, i) => (i)),
            hovertext: getHoverText(data),
            pointColor: getPointColor(data),
            pointSize: getPointSize(data),
            pointLine: getPointOutline(data)
        });
    }, []);

    useEffect(() => {
        if(selectedPointIndex){
            console.log(selectedPointIndex);
            let pointColor = getPointColor(data, selectedPointIndex);
            let pointLine = getPointOutline(data, selectedPointIndex);
            setPlotData({
                ...plotData, 
                pointColor: pointColor,
                pointLine: pointLine
            });
        }
    }, [selectedPointIndex]);

    const onClick = (data) => {
        let selectedPoint = props.data[data.points[0].pointIndex]
        console.log(selectedPoint);
        setSelectedPointIndex(data.points[0].pointIndex);
        setParameters({...parameters, signature: selectedPoint.signature});
        getForestPlotData({
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
    const getPointColor = (points, index = null) => {
        let pointColors = [];
        for(let i = 0; i < points.length; i++){
            if(i === index){
                pointColors.push(colors.orange_highlight);
                continue;
            }

            if(points[i].logPval < -Math.log10(0.05)){
                pointColors.push(colors.gray_text);
            }else{
                if(points[i].effect_size > 0){
                    pointColors.push(colors.red);
                }else{
                    pointColors.push(colors.blue);
                }
            }
        }
        return pointColors;
    }

    /**
     * get data point outline.
     * The outline is added if the point specified with the index is clicked.
     * @param {*} points 
     * @param {*} index 
     */
    const getPointOutline = (points, index=null) => {
        let outlineColor = [];
        let outlineWidth = [];
        points.forEach((point, i) => {
            if(i === index){
                outlineColor.push(colors.gray_text);
                outlineWidth.push(2);
            }else{
                outlineColor.push(undefined);
                outlineWidth.push(0);
            }
        });
        return { color: outlineColor, width: outlineWidth };
    }

    /**
     * get formatted hovertext for each data point.
     * @param {*} points 
     */
    const getHoverText = (points) => {
        let hoverText = [];
        points.forEach(point => {
            hoverText.push(
            `Subgroup: ${point.subgroup}<br>Signature: ${point.signature}<br>Coef: ${Math.round(point.effect_size * 1000) / 1000}<br>P-value: ${Math.round(point.pval * 10000) / 10000}<br>I2: ${Math.round(point.i2 * 10000) / 10000}<br>P-value I2: ${Math.round(point.pval_i2 * 1000) / 1000}`)
        });
        return hoverText;
    }

    return(
        <div>
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
                            size: plotData.pointSize,
                            line: plotData.pointLine
                        },
                        name: 'points',
                    }
                ]}
                layout={{
                    width: props.size.width,
                    height: props.size.width * 0.8,
                    autosize: true,
                    paper_bgcolor: 'white',
                    plot_bgcolor: 'white',
                    orientation: 'v',
                    yaxis: { ticklen: 0, title: '-log10(p value)' },
                    xaxis: { title: 'Hazard Ratio', zeroline: false },
                    hovermode: 'closest',
                    font: {
                        size: 11,
                        family: 'Noto Sans',
                    },
                    margin: {
                        l: 45,
                        r: 10,
                        t: 10,
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
                        },
                        {
                            type: 'line',
                            xref: 'x',
                            yref: 'paper',
                            x0: 0,
                            y0: 0,
                            x1: 0,
                            y1: 1,
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
                onHover={() => hover()}
                onUnhover={() => unhover()}
            />
        </div>
    );
}

export default withSize()(VolcanoPlot);