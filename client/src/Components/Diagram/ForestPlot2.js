import React from "react";
import * as d3 from 'd3';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

const initial = {
  svgWidth : 700,
  svgHight : 700,
  edgeSize: 10,
  fontSize: 8,
  xAxeMargin: 30,
  topMargin: 20,
  leftMargin: 200
}

const ForestPlot = (props) => {

    /***
     * Get the dataset (studies + overall value)
     * keep the studies in data and the overall
     **/
    const dataset = props.individuals.concat(props.meta);
    const overall = props.meta[0]

    const data = () =>{
        return props.individuals;
    }

    /***
     * Find the min and max value of all studies for adjusting the scales and axes
     ***/

    const min_low = () => {
        return Math.min(...dataset.map(function (d){ return Number(d["_95ci_low"])}))
    }
    
    const max_high = () => {
        return Math.max(...dataset.map(function (d){ return Number(d["_95ci_high"])}))
    }
    
    /***
     * Functions for scaling X and Y
     ***/
    
    const xScale= (d) => {
        const scale = d3
            .scaleLinear()
            .domain([min_low(), max_high()])
            .range([initial.leftMargin, initial.leftMargin+400])
        return scale(d)
    }
    
    const yScale= (d) => {
        const scale = d3
            .scaleLinear()
            .domain([0, dataset.length + 1])
            .range([20, 460])
        return scale(d)
    }
    
    /***
     * Find the overall rhombus points on svg
     ***/

    const polygonPoints = () =>{
        return (
            xScale(Number(overall._95ci_low)) + ", "+ yScale(dataset.length) +" "+
            xScale(Number(overall.effect_size)) + ", "+ (yScale(dataset.length) - (initial.edgeSize/2)) +" "+
            xScale(Number(overall._95ci_high)) +", "+ yScale(dataset.length ) +" "+
            xScale(Number(overall.effect_size) ) +", "+ (yScale(dataset.length) + (initial.edgeSize/2)) +" "
        )
    }
    
    const xAxeTag = [min_low(), overall.effect_size, 1 , max_high()];

    /***
    * Mouseover data point group (text+interval+rect)
    */
    const renderTooltip = (d) => (
        <div style = {{fontSize:'12px', backgroundColor: 'rgba(242,255,223,0.95)', padding: '2px 10px', color: 'rgb(7,28,44)', borderRadius: 3}}>
        {
            dataset[d].study + " (" + dataset[d].primary_tissue + "; " + dataset[d].sequencing + "): " +
            "N=" + dataset[d].n + "; coef=" + dataset[d].effect_size + "; P-value=" + Number(dataset[d].pval).toFixed(4)
        }
        </div>
    );

    /***
     * Creating the plot
     ***/
    return (
        <svg height="800" width="800">
            {/*Creating axes*/}
            <g>
                <line 
                    id={"xAxe"}
                    x1= {xScale(min_low())-initial.leftMargin/2}
                    y1= {yScale(dataset.length+1)}
                    x2= {xScale(max_high())+initial.xAxeMargin}
                    y2= {yScale(dataset.length+1)}
                    stroke="#0C3544"
                    strokeWidth="2"
                />
                <line
                    id={"yAxe"}
                    x1={xScale(1)}
                    y1={yScale(-2)}
                    x2={xScale(1)}
                    y2={yScale(dataset.length + 1)}
                    stroke="#0C3544"
                    strokeWidth="2"
                />
                <line 
                    strokeDasharray="3,4"
                    id={"yAxe"}
                    x1={xScale(overall.effect_size)}
                    y1={yScale(-2)}
                    x2={xScale(overall.effect_size)}
                    y2={yScale(dataset.length + 1)}
                    stroke="#EF8020"
                    strokeWidth="1"
                />
            {
                Object.keys(xAxeTag).map((key, index) =>
                    <text
                        id = {"xTag-"+ index}
                        key = {key}
                        textAnchor="middle"
                        x = {xScale(xAxeTag[index])}
                        y = {yScale(dataset.length + 2)}
                        fontSize={initial.fontSize}
                        fontWeight="bold"
                        fill="#0C3544"
                        >
                        {xAxeTag[index]}
                    </text>
                )
            }
            {
                Object.keys(xAxeTag).map((key, index) =>
                    <line
                        id = {"xAxeDash"+ index}
                        key = {key}
                        x1 = {xScale(xAxeTag[index])}
                        y1 = {yScale(dataset.length+1) - 5}
                        x2 = {xScale(xAxeTag[index])}
                        y2 = {yScale(dataset.length+1) + 5}
                        stroke="#0C3544"
                        strokeWidth="2"
                        >
                    </line>
                )
            }
            </g>

            {/*Creating Data Point*/}
            {
                Object.keys(data()).map((key, index) =>
                    <OverlayTrigger 
                        key={key}
                        placement = "right" 
                        overlay = {renderTooltip(index)} 
                        delay = {{show: 100, hide: 200}}>
                        <g id = {"datapoint-" +index} onClick = {() => console.log(index)}>
                            {/*Tags*/}
                            <text
                                id = {"tag-"+index}
                                key = {key}
                                x = {initial.leftMargin / 3}
                                y = {yScale(index) + 2}
                                fontSize = {initial.fontSize}
                                fill = "#0C3544">
                                {dataset[key].study}({dataset[key].primary_tissue}, {dataset[key].sequencing})
                            </text>

                            {/* Intervals */}
                            <line 
                                id = {"interval-"+index} 
                                x1 = {xScale(Number(dataset[key]["_95ci_low"]))}
                                y1 = {yScale(index)}
                                x2 = {xScale(Number(dataset[key]["_95ci_high"]))}
                                y2 = {yScale(index)}
                                stroke = "#73848E"
                                strokeWidth = "2">
                                <title>95CI:({data()[key]["_95ci_low"]}, {data()[key]["_95ci_high"]})</title>
                            </line>

                            {/*Data point marks*/}
                            <rect
                                id = {"datPoint-" +index}
                                x = {xScale(Number(dataset[key]["effect_size"])) - initial.edgeSize / 2}
                                y = {yScale(index) - initial.edgeSize / 2}
                                width = {initial.edgeSize}
                                height = {initial.edgeSize}
                                fill = "#236e96">
                            </rect>
                        </g>
                    </OverlayTrigger>
                )
            }

            {/*Creating Diamond*/}
            <polygon id = "diamond" points= {polygonPoints()} fill="#F2950B">
                <title>
                    {overall.study} : {overall.effect_size} <br />
                    interval: {overall._95ci_low} to {overall._95ci_high}
                </title>
            </polygon>
        </svg>
    )
}

export default ForestPlot;
