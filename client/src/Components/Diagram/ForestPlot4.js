import React, {useEffect} from "react";
import * as d3 from 'd3';
import {withSize} from 'react-sizeme';
import styled from 'styled-components';
import colors from '../../styles/colors';

/**
 * A responsive version of forest plot.
 * The plot rendering process is in 'draw()' function
 * which is called every time a window size changes.
 */

const Container = styled.div`
  width: 100%;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  .tooltip {
    position: absolute;
    font-size: 11px;
    background-color: rgba(242,255,223,0.8);
    padding: 2px 10px;
    color: rgb(7,28,44);
    border-radius: 3px;
  }
  .pointLink:hover {
    text-decoration: underline;
  }
`

const ForestPlot = (props) => {

    useEffect(() => {
        draw();
    }, [props.size.width, props.individuals]);

    const draw = () => {

        const dim = {
            width: props.size.width,
            height: props.size.width
        }

        const initial = {
            edgeSize: 8,
            fontSize: 11,
            xAxeMargin: 30,
            topMargin: 20,
            leftMargin: 200,
            rightMargin: 10
        }

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
                .range([initial.leftMargin, dim.width - initial.rightMargin])
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
                xScale(Number(overall._95ci_high)) +", "+ yScale(dataset.length) +" "+
                xScale(Number(overall.effect_size) ) +", "+ (yScale(dataset.length) + (initial.edgeSize/2)) +" "
            )
        }

        const xAxeTag = [min_low(), Math.round(overall.effect_size * 100) / 100, 0 , max_high()];

        /***
         * Mouseover data point group (text+interval+rect)
         */
        const renderToolTip = (key, id, point) => {
            let tooltip = d3.select(`#${props.id}PlotContainer`)
                .append('div')
                .attr('id', id)
                .attr('class', 'tooltip')
                .style('left', `${xScale(1) + 10}px`)
                .style('top', `${yScale(key) - 30}px`);
            if(point.study){
                tooltip.html(
                    point.study + " (" + point.primary_tissue + "; " + point.sequencing + ")" +
                    "<br />N=" + point.n +
                    "<br />hazard ratio=" + Number(point.effect_size).toFixed(4) +
                    "<br />P-value=" + Number(point.pval).toFixed(4));
            }else{
                tooltip.html(
                    "Pooled Effect Size" +
                    "<br />N=" + point.n +
                    "<br />hazard ratio=" + Number(point.effect_size).toFixed(4) +
                    "<br />P-value=" + Number(point.pval).toFixed(4));
            }
        }

        const removeToolTip = (id) => {
            d3.select(id).remove();
        }

        /**
         *  start drawing plot
         */

        let svg = d3.select(`#${props.id}`);
        svg.selectAll("*").remove(); // redraw every time the width changes
        svg.attr('width', dim.width).attr('height', dim.height);
        let canvas = svg.append('g');

        /*Creating axes*/
        canvas.append('line')
            .attr('id', 'xAxe')
            .attr('x1', xScale(min_low())-initial.leftMargin/2)
            .attr('x2', xScale(max_high())+initial.xAxeMargin)
            .attr('y1', yScale(dataset.length+1))
            .attr('y2', yScale(dataset.length+1))
            .style('stroke', "#0C3544")
            .style('stroke-width', '1');

        canvas.append('line')
            .attr('id', 'yAxe')
            .attr('x1', xScale(0))
            .attr('x2', xScale(0))
            .attr('y1', yScale(-2))
            .attr('y2', yScale(dataset.length + 1))
            .style('stroke', "#0C3544")
            .style('stroke-width', '0.5');

        canvas.append('line')
            .attr('id', 'yAxe-dash')
            .attr('x1', xScale(overall.effect_size))
            .attr('x2', xScale(overall.effect_size))
            .attr('y1', yScale(-2))
            .attr('y2', yScale(dataset.length + 1))
            .attr('stroke-dasharray', '3,4')
            .style('stroke', "#EF8020")
            .style('stroke-width', '0.5');

        Object.keys(xAxeTag).forEach((key, index) => {
            canvas.append('text')
                .attr('id', "xTag-"+ index)
                .attr('x', xScale(xAxeTag[index]))
                .attr('y', yScale(dataset.length + 2))
                .attr('font-size', initial.fontSize)
                .attr('font-weight', 'regular')
                .attr('fill', "#0C3544")
                .attr('text-anchor', 'middle')
                .text(xAxeTag[index])
        });

        Object.keys(xAxeTag).forEach((key, index) => {
            canvas.append('line')
                .attr('id', "xAxeDash"+ index)
                .attr('x1', xScale(xAxeTag[index]))
                .attr('x2', xScale(xAxeTag[index]))
                .attr('y1', yScale(dataset.length+1) - 5)
                .attr('y2', yScale(dataset.length+1) + 5)
                .style('stroke', "#0C3544")
                .style('stroke-width', '0.5');
        });

        canvas.append('text')
            .attr('x', xScale(0))
            .attr('y', yScale(dataset.length + 2.7))
            .attr('font-size', initial.fontSize)
            .attr('font-weight', 'regular')
            .attr('fill', "#0C3544")
            .attr('text-anchor', 'middle')
            .text('Hazard Ratio')

        /*Creating Data Point*/
        Object.keys(props.individuals).forEach((key, index) => {

            let tooltipId = `point-${dataset[key].study.replace(/[^a-zA-Z]/g, "")}`;

            let datapoint = svg.append('g')
                .attr('id', "datapoint-" +index)
                .style('cursor', 'arrow')
                .on('click', () => console.log(index))
                .on('mouseover', () => {
                    renderToolTip(key, tooltipId, dataset[key]);
                })
                .on('mouseout', () => {
                    removeToolTip(`#${tooltipId}`);
                });

            datapoint.append('a')
                .attr('id', "tag-"+index)
                .attr('class', 'pointLink')
                .attr('xlink:href', '/')
                .append('text')
                .attr('x', 0)
                .attr('y', yScale(index))
                .attr('font-size', initial.fontSize)
                .attr('fill', "#0C3544")
                .text(`${dataset[key].study}(${dataset[key].primary_tissue}, ${dataset[key].sequencing})`);

            let line = datapoint.append('line')
                .attr('id', "interval-" + index)
                .attr('x1', xScale(Number(dataset[key]["_95ci_low"])))
                .attr('x2', xScale(Number(dataset[key]["_95ci_high"])))
                .attr('y1', yScale(index))
                .attr('y2', yScale(index))
                .style('stroke', "#73848E")
                .style('stroke-width', '2');
            line.append('title')
                .text(`95CI:(${data()[key]["_95ci_low"]}, ${data()[key]["_95ci_high"]})`);

            datapoint.append('rect')
                .attr('id', "datPoint-" +index)
                .attr('x', xScale(Number(dataset[key]["effect_size"])) - initial.edgeSize / 2)
                .attr('y', yScale(index) - initial.edgeSize / 2)
                .style('width', initial.edgeSize)
                .style('height', initial.edgeSize)
                .style('fill', "#236e96");
        });

        /*Creating Diamond*/
        let pooledEffect = svg.append('g')
            .attr('id', 'pooled-effect')
            .on('mouseover', () => {
                renderToolTip(dataset.length, 'polygon-tooltip', overall);
            })
            .on('mouseout', () => {
                removeToolTip('#polygon-tooltip');
            });

        pooledEffect.append('text')
            .attr('id', "tag-pooled-effect")
            .attr('x', 0)
            .attr('y', yScale(dataset.length))
            .attr('font-size', initial.fontSize)
            .attr('fill', "#0C3544")
            .text(`Pooled Effect Sizes`);

        pooledEffect.append('polygon')
            .attr('id', 'diamond')
            .attr('points', polygonPoints())
            .style('fill', colors.orange_highlight);
    }

    /***
     * Creating the plot
     ***/
    return (
        <Container id={`${props.id}PlotContainer`}>
            <svg id={props.id}></svg>
        </Container>
    )
}

export default withSize()(ForestPlot);
