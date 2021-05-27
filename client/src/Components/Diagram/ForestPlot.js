import React from "react";
// import Layout from '../UtilComponents/Layout';
import styled from 'styled-components';
import studies from "../../example_output/sample-output.js";
import * as d3 from 'd3';
// import Tooltip from "react-bootstrap/Tooltip";
// import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";


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
  svgWidth: 700,
  svgHight: 700,
  edgeSize: 10,
  fontSize: 9,
  xAxeMargin: 30,
  topMargin: 20,
  leftMargin: 200
}

/***
 * Get the dataset (studies + overall value)
 * keep the studies in data and the overall
 **/
const dataset = studies


const data = () => {
  return dataset.filter((element) => {
    return element.study !== "Meta-analysis";
  })
}


const overall = studies[studies.length - 1]


/***
 * Find the min and max value of all studies for adjusting the scales and axes
 ***/

const min_low = () => {
  return Math.min(...dataset.map(function (d) {
    return Number(d["95CI_low"])
  }))
}

const max_high = () => {
  return Math.max(...dataset.map(function (d) {
    return Number(d["95CI_high"])
  }))
}

/***
 * Functions for scaling X and Y
 ***/

const xScale = (d) => {
  const scale = d3
    .scaleLinear()
    .domain([min_low(), max_high()])
    .range([initial.leftMargin, initial.leftMargin + 400])
  return scale(d)
}

const yScale = (d) => {
  const scale = d3
    .scaleLinear()
    .domain([0, dataset.length + 1])
    .range([20, 460])
  return scale(d)
}

/***
 * Find the overall rhombus points on svg
 ***/

const polygonPoints = () => {
  return (xScale(Number(overall["95CI_low"])) + ", " + yScale(dataset.length) + " " +
    xScale(Number(overall["coef"])) + ", " + (yScale(dataset.length) - (initial.edgeSize / 2)) + " " +
    xScale(Number(overall["95CI_high"])) + ", " + yScale(dataset.length) + " " +
    xScale(Number(overall["coef"])) + ", " + (yScale(dataset.length) + (initial.edgeSize / 2)) + " ")
}

/***
 *
 ***/

const xAxeTag = [min_low(), overall.coef, 1, max_high()];

/***
 * Mouseover data point group (text+interval+rect)
 */
const renderTooltip = (d) => (
  < div
style = {
{
  fontSize:'12px', backgroundColor:
  'rgba(242,255,223,0.95)', padding:
  '2px 10px', color:
  'rgb(7,28,44)', borderRadius:
  3
}
}>
{
  studies[d].study + " (" + studies[d].Primary + "; " + studies[d].Sequencing + "): " +
  "N=" + studies[d].N + "; coef=" + studies[d].coef + "; P-value=" + Number(studies[d].Pval).toFixed(4)
}
</div>
)
;

/***
 * Creating the plot
 ***/

const ForestPlot = () => {
  return (
    <StyledHome>
    < svg
  height = "800"
  width = "800" >
    {/*Creating axes*/}
    < g >
    < line
  id = {"xAxe"}
  x1 = {xScale(min_low()
)
  -(initial.leftMargin * 2 / 3)
}
  y1 = {yScale(dataset.length + 1
)
}
  x2 = {xScale(max_high()
)
  +initial.xAxeMargin
}
  y2 = {yScale(dataset.length + 1
)
}
  stroke = "#0C3544"
  strokeWidth = "2"
    />
    < line
  id = {"yAxe"}
  x1 = {xScale(1
)
}
  y1 = {yScale( - 2
)
}
  x2 = {xScale(1
)
}
  y2 = {yScale(dataset.length + 1
)
}
  stroke = "#0C3544"
  strokeWidth = "2"
    />
    <line
  strokeDasharray = "3,4"
  id = {"yAxe"}
  x1 = {xScale(overall.coef
)
}
  y1 = {yScale( - 2
)
}
  x2 = {xScale(overall.coef
)
}
  y2 = {yScale(dataset.length + 1
)
}
  stroke = "#EF8020"
  strokeWidth = "1"
    />
    {
      Object.keys(xAxeTag).map((key, index) =>
        < text
      id = {"xTag-"+index}
      key = {key}
      textAnchor = "middle"
      x = {xScale(xAxeTag[index]
)
}
  y = {yScale(dataset.length + 2
)
}
  fontSize = {initial.fontSize}
  fontWeight = "bold"
  fill = "#0C3544"
    >
    {xAxeTag[index]}
    </text>
)
}
  {
    Object.keys(xAxeTag).map((key, index) =>
    <line
    id = {"xAxeDash"+index}
    key = {key}
    x1 = {xScale(xAxeTag[index]
  )
  }
    y1 = {yScale(dataset.length + 1
  )
    -5
  }
    x2 = {xScale(xAxeTag[index]
  )
  }
    y2 = {yScale(dataset.length + 1
  )
    +5
  }
    stroke = "#0C3544"
    strokeWidth = "2"
      >
      </line>
  )
  }
</g>

  {/*Creating Data Point*/
  }

  {
    Object.keys(data()).map((key, index) =>
    < React.Fragment >
    < OverlayTrigger
    placement = "right"
    overlay = {renderTooltip(index)}
    delay = {
    {
      show: 100, hide: 200
    }
  }
  >
  <g
    id = {"datapoint-" +index}
    onClick = {() => console.log(index)}>
    {/* Tags */}
  <text
    id = {"tag-"+index}
    key = {key}
    x = {initial.leftMargin / 3}
    y = {yScale(index) + 2
  }
    fontSize = {initial.fontSize}
    fill = "#0C3544"
      >
      {dataset[key].study}({dataset[key].Primary}, {dataset[key].Sequencing})
      </text>
      {/* Intervals */}
      < line
    id = {"interval-"+index}
    x1 = {xScale(Number(dataset[key]["95CI_low"])
  )
  }
    y1 = {yScale(index)}
    x2 = {xScale(Number(dataset[key]["95CI_high"])
  )
  }
    y2 = {yScale(index)}
    stroke = "#73848E"
    strokeWidth = "2" >

      <title>
      95
    CI:({data()[key]["95CI_low"]}, {data()[key]["95CI_high"]})
    </title>
    </line>

    {/* Data point marks */}
    <rect
    id = {"datPoint-" +index}
    x = {xScale(Number(dataset[key]["coef"])
  )
    -initial.edgeSize / 2
  }
    y = {yScale(index) - initial.edgeSize / 2
  }
    width = {initial.edgeSize}
    height = {initial.edgeSize}
    fill = "#236e96" >
      </rect>
      </g>
      </OverlayTrigger>
      </React.Fragment>
  )
  }
  {/*Creating Diamond*/
  }
<polygon
  id = "diamond"
  points = {polygonPoints()}
  fill = "#F2950B"
    >
    </polygon>
    </svg>
    </StyledHome>
)
}

export default ForestPlot;
