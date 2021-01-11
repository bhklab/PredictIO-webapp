/* eslint-disable radix */
import React, {useState, useEffect} from 'react';
import Plot from 'react-plotly.js';
import styled from 'styled-components';
import * as d3 from 'd3';

const StyledDiv = styled.div`
    min-height: 600px;    
    width: 100%;    

    h3 {
        text-align: center;
    }
    .js-plotly-plot {
        width: 100%;
    }
    .scatterpts {
        opacity: 0;
    }

`;

const d3Changes = (type) => {
    d3.select('.groups:nth-of-type(1) path.scatterpts').style('fill', 'black');
    if (type === 'drug') {
        d3.select('.groups:nth-of-type(2) path.scatterpts').style('fill', 'black');
        d3.selectAll('.groups:nth-of-type(3) .legendtoggle').style('cursor', 'default');
        d3.select('.groups:nth-of-type(3)').attr('transform', 'translate(0,100)');
    } else {
        d3.selectAll('.groups:nth-of-type(2) .legendtoggle').style('cursor', 'default');
        d3.select('.groups:nth-of-type(2)').attr('transform', 'translate(0,100)');
    }

    d3.select('g.scrollbox').attr('clip-path', '');

    d3.select('.scrollbox').attr('transform', 'translate(0,30)');
};

// for clicking on the points
const click = (data, type, queryId) => {
    const id = parseInt(data.points[0].data.click_ids[data.points[0].pointIndex]);
    if (type === 'drug') {
        document.location.href = `/expression?compoundId=${queryId}&geneId=${id}`;
    } else {
        document.location.href = `/expression?compoundId=${id}&geneId=${queryId}`;
    }
};

// for changing the cursor on hover of points
const hover = () => {
    d3.selectAll('.nsewdrag').style('cursor', 'pointer');
};

const unhover = () => {
    d3.selectAll('.nsewdrag').style('cursor', '');
};

const VolcanoPlot = (props) => {
    const [state, setState] = useState({
        allLayout: null,
        allData: null,
        selectedData: [],
        selectedLayout: {},
    });
    const [className, setClassName] = useState('plot');
    const [hide, setHide] = useState(false);
    const [doses, setDoses] = useState([]);
    const [times, setTimes] = useState([]);

    const {
        data, type, queryId, datasetName, plotId, selected, selectedTime, selectedDose, alertCallback,
    } = props;
    
    const formatData = (data) => {
        // for each key, calculate traces => TGGATES: {2Low: [greenTrace, blueTrace], 2Mid: ...}
        const retData = {};
        Object.keys(data).forEach((x) => {
            const curData = data[x];
            // setting up the traces; can't really deep copy
            const greenTrace = {
                showlegend: false,
                type: 'scatter',
                mode: 'markers',
                x: [],
                y: [],
                click_ids: [],
                hoverinfo: 'text',
                hovertext: [],
                marker: {
                    color: '#5cc33c',
                    size: 8,
                },
                name: 'green',
            };

            const blueTrace = {
                showlegend: false,
                type: 'scatter',
                mode: 'markers',
                x: [],
                y: [],
                click_ids: [],
                // hoverinfo: 'text',
                // hovertext: [],
                hoverinfo: 'none',
                marker: {
                    color: '#e1f1fb',
                    size: 8,
                },
                name: 'blue',
            };

            // calculate lowest pvalue that isn't 0, -log10 it, and set all 0s to the cutoff
            // const cutoff = -Math.log10(Math.max(...data.map((x) => (parseFloat(x.p_value) === 0 ? null : parseFloat(x.p_value))).filter((x) => x !== null)));
            // BEWARE! Math.max exceeds call stack at a certain point. I have resorted to
            // sorting the array by ascending and taking the last element.
            const cut1 = curData.map((x) => {
                if (parseFloat(x.p_value) === 0) {
                    return null;
                }
                return parseFloat(x.p_value);
            });
            const cut2 = cut1.filter((x) => x !== null);
            cut2.sort((a, b) => a - b);
            const cutoff = -Math.log10(cut2[cut2.length - 1]);
            // putting data in
            curData.forEach((d) => {
                if (parseFloat(d.p_value) <= 0.05) {
                    if (parseFloat(d.fdr) < 0.05 && Math.abs(d.fold_change) >= 1) {
                        const trace = greenTrace;
                        trace.x.push(d.fold_change);
                        trace.y.push(parseFloat(d.p_value) === 0 ? cutoff : -Math.log10(d.p_value));
                        if (type === 'drug') {
                            trace.click_ids.push(d.gene_id);
                        } else {
                            trace.click_ids.push(d.drug_id);
                        }
                        trace.hovertext.push(`(${parseFloat(d.fold_change).toFixed(1)}, ${(parseFloat(d.p_value) === 0 ? cutoff : -Math.log10(d.p_value)).toFixed(1)}) ${d.drug_name || d.gene_name}`);
                    } else if (parseFloat(d.fdr) < 0.05 && Math.abs(d.fold_change) < 1) {
                        const trace = blueTrace;
                        trace.x.push(d.fold_change);
                        trace.y.push(parseFloat(d.p_value) === 0 ? cutoff : -Math.log10(d.p_value));
                        if (type === 'drug') {
                            trace.click_ids.push(d.gene_id);
                        } else {
                            trace.click_ids.push(d.drug_id);
                        }
                    // trace.hovertext.push(`(${parseFloat(d.fold_change).toFixed(1)}, ${(parseFloat(d.p_value) === 0 ? cutoff : -Math.log10(d.p_value)).toFixed(1)}) ${d.drug_name || d.gene_name}`);
                    }
                }
            });
            retData[x] = [greenTrace, blueTrace];
        });
        return retData;
    };

    const formatLayout = (retData) => {
        if (retData !== undefined) {
            // for each key, calculate traces => TGGATES: {2Low: {}, 2Mid: ...}
            const layoutData = {};
            Object.keys(retData).forEach((x) => {
                const greenTrace = retData[x][0];
                const blueTrace = retData[x][1];

                // calculating highest y value for plotting lines for fold change
                const maxY = d3.max([d3.max(greenTrace.y), d3.max(blueTrace.y)]);
                const minY = d3.min([d3.min(greenTrace.y), d3.min(blueTrace.y)]);

                // calculating highest x value for plotting the pvalue at 20
                const maxX = d3.max([d3.max(greenTrace.x), d3.max(blueTrace.x)]);
                const minX = d3.min([d3.min(greenTrace.x), d3.min(blueTrace.x)]);

                const layout = {
                    height: 600,
                    autosize: true,
                    // width: 800,
                    paper_bgcolor: 'white',
                    plot_bgcolor: 'white',
                    orientation: 'v',
                    yaxis: { ticklen: 0, title: '-log10(p value)' },
                    xaxis: { title: 'log2(fold change)', zeroline: false },
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
                };

                // determine if show x axis fold change lines or not
                layout.shapes = [];
                if (minX < -1) {
                    layout.shapes.push(
                    // x: -1
                        {
                            type: 'line',
                            x0: -1,
                            y0: minY,
                            x1: -1,
                            y1: maxY,
                            line: {
                                color: '#accffa',
                                width: 1,
                            },
                        },
                    );
                }

                if (maxX > 1) {
                    layout.shapes.push(
                    // x: 1
                        {
                            type: 'line',
                            x0: 1,
                            y0: minY,
                            x1: 1,
                            y1: maxY,
                            line: {
                                color: '#accffa',
                                width: 1,
                            },
                        },
                    );
                }

                // determine if plot the y axis pvalue line (max beyond 20)
                if (maxY > 20) {
                    layout.shapes.push({
                        type: 'line',
                        x0: minX,
                        y0: 20,
                        x1: maxX,
                        y1: 20,
                        line: {
                            color: '#accffa',
                            width: 1,
                        },
                    });
                }
                layoutData[x] = layout;
            });
            return { retData, layoutData };
        }
    };

    // determines if hide plot based on selected array of datasets
    const changePlotClass = () => {
        // if dataset is not selected, give class hidden to hide
        const name = selected.includes(datasetName) ? 'plot' : 'plot hidden';
        setClassName(name);
    };

    useEffect(() => {
        const plotData = formatData(data);
        const { retData, layoutData } = formatLayout(plotData);

        // getting available doses and times
        const tempDoses = [];
        const tempTimes = [];
        Object.keys(retData).forEach((x) => {
            const ind = x.indexOf('+');
            const dose = x.slice(0, ind);
            const time = x.slice(ind + 1, x.length);
            tempDoses.push(dose);
            tempTimes.push(time);
        });
        setDoses([...new Set(tempDoses)]);
        setTimes([...new Set(tempTimes)]);

        // set all data and layout
        setState({
            ...state,
            allData: retData,
            allLayout: layoutData,
            selectedData: retData[`${selectedDose}+${selectedTime}`],
            selectedLayout: layoutData[`${selectedDose}+${selectedTime}`],
        });
        changePlotClass();
    }, []);

    // determining if selected changes
    useEffect(() => {
        if (state.allData !== null) {
            // if dataset is DrugMatrix, and anything other than 16 or 24 is selected, hide
            // if (datasetName === 'DrugMatrixRat' && (selectedTime === 2 || selectedTime === 8)) {
            //     setClassName('plot hidden');
            //     setHide(true);
            // } else if (datasetName !== 'DrugMatrixRat' && selectedTime === 16) { // tggates and time 16
            //     setClassName('plot hidden');
            //     setHide(true);
            // } else { // default
            //     changePlotClass();
            //     setHide(false);
            // }
            // if plot not available, hide
            if (!times.includes(selectedTime.toString()) || !doses.includes(selectedDose)) {
                setClassName('plot hidden');
                setHide(true);
                alertCallback(datasetName);
            } else { // default
                changePlotClass();
                setHide(false);
            }
            // if (className === 'plot hidden') {
            //     console.log(datasetName);

            // }
            setState({
                ...state,
                selectedData: state.allData[`${selectedDose}+${selectedTime}`],
                selectedLayout: state.allLayout[`${selectedDose}+${selectedTime}`],
            });
        }
    }, [selected, selectedTime, selectedDose, hide]);


    return (
        <StyledDiv className={className}>
            {hide ? null : (
                <>
                    {state.selectedData.length === 0 ? null : (
                        <Plot
                            data={state.selectedData}
                            layout={state.selectedLayout}
                            graphDiv={plotId}
                            config={{
                                responsive: true,
                                displayModeBar: false,
                            }}
                            onClick={(d) => click(d, type, queryId)}
                            onHover={() => hover()}
                            onUnhover={() => unhover()}
                        />

                    )}
                </>
            )}

        </StyledDiv>
    );
};

export default VolcanoPlot;