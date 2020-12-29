import React from "react";
import Layout from '../UtilComponents/Layout';
import styled from 'styled-components';
import studies from "../../example_output/sample-output.js";
import * as d3 from 'd3';



const StyledHome = styled.div`
    width: 100%;
    height: 100%;
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;


const initial = {
  svgWidth : 700,
  svgHight : 700,
  edgeSize: 10,
  fontSize: 8,
  xAxeMargin: 30,
  topMargin: 20,
  leftMargin: 200
}

/***
 * Get the dataset (studies + overall value)
 * keep the studies in data and the overall
 **/
const dataset = studies


const data = () =>{
  return dataset.filter((element) => {
    return element.study != "Meta-analysis";
  })
}


const overall = studies[studies.length-1]


/***
 * Find the min and max value of all studies for adjusting the scales and axes
 ***/

const min_low = () => {
  return Math.min(... dataset.map(function (d){ return Number(d["95CI_low"])}))
}

const max_high = () => {
  return Math.max(... dataset.map(function (d){ return Number(d["95CI_high"])}))
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
  return (xScale(Number(overall["95CI_low"])) + ", "+ yScale(dataset.length) +" "+
    xScale(Number(overall["coef"])) + ", "+ (yScale(dataset.length) - (initial.edgeSize/2)) +" "+
    xScale(Number(overall["95CI_high"])) +", "+ yScale(dataset.length ) +" "+
    xScale(Number(overall["coef"]) ) +", "+ (yScale(dataset.length) + (initial.edgeSize/2)) +" ")
}

/***
 *
 ***/

const xAxeTag = [min_low(), overall.coef, 1 , max_high()];

/***
 * Creating the plot
 ***/

const ForestPlot = () => {
  return (
    <Layout id="forestPlot">
      <StyledHome>
       <svg height="800" width="800">
         {/*Creating axes*/}
         <g>
          <line id={"xAxe"}
                x1= {xScale(min_low())-initial.xAxeMargin}
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
           <line strokeDasharray="3,4"
                 id={"yAxe"}
                 x1={xScale(overall.coef)}
                 y1={yScale(-2)}
                 x2={xScale(overall.coef)}
                 y2={yScale(dataset.length + 1)}
                 stroke="#EF8020"
                 strokeWidth="1"
           />
           {Object.keys(xAxeTag).map((key, index) =>
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
           )}
         </g>
         {/*Creating Data Point*/}
         <g>
         {Object.keys(data()).map((key, index) =>
           <text
             id = {"tag-"+ index}
             key = {key}
             x = {initial.leftMargin/2}
             y = {yScale(index)+2}
             fontSize={initial.fontSize}
             fill="#0C3544"
             >
             {dataset[key].study} ({dataset[key].Primary})
            </text>
         )}
         {Object.keys(data()).map((key, index) =>
           <line
             key = {key}
             id = {"interval-"+ index}
             x1= {xScale(Number(dataset[key]["95CI_low"]))}
             y1= {yScale(index)}
             x2= {xScale(Number(dataset[key]["95CI_high"]))}
             y2= {yScale(index)}
             stroke="#73848E"
             strokeWidth="2"
           >
             <title>
               interval:
               {data()[key]["95CI_low"]} to {data()[key]["95CI_high"]}
             </title>
           </line>
         )}
         {Object.keys(data()).map((key, index) =>
           <rect
             id = {"datPoint-"+ index}
             x={xScale(Number(dataset[key]["coef"]))-initial.edgeSize/2}
             y={yScale(index) - initial.edgeSize/2}
             width={initial.edgeSize}
             height={initial.edgeSize}
             fill="#236e96"
           >
            <title>
              {dataset[key].study} ({dataset[key].Primary}) : {dataset[key].coef}
            </title>
           </rect>
         )}
         </g>
         {/*Creating Diamond*/}
         <polygon
           id = "diamond"
           points= {polygonPoints()}
           fill="#F2950B"
         >
           <title>
             {overall.study} : {overall.coef} <br />
             interval: {overall["95CI_low"]} to {overall["95CI_high"]}
           </title>
         </polygon>
        </svg>
      </StyledHome>
    </Layout>
  )
}

export default ForestPlot;
