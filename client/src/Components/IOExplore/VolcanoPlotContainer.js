import React, { useEffect } from 'react';
import Plotly from 'plotly.js-dist';
import VolcanoPlot from '../Diagram/VolcanoPlot';
import styled from 'styled-components';
import FileSaver from 'file-saver';
import DownloadButton from '../UtilComponents/DownloadButton';
import { models } from '../../util/enum';

const Container = styled.div`
    width: 100%;
    margin-bottom: 30px;
    .heading {
        display: flex;
        align-items: center;
    }
    .left {
        margin-right: 10px;
    }
`;

const PlotParameters = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    font-size: 12px;
    .parameterLine {
        margin-right: 20px;
    }
    .value {
        font-weight: bold;
    }
`;

const VolcanoPlotContainer = (props) => {

    const { parameters, setParameters, volcanoPlotData, getForestPlotData, onthefly } = props;

    useEffect(() => {
        console.log(volcanoPlotData.data);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const downloadPlotImage = (e) => {
        e.preventDefault();
        Plotly.downloadImage('volcano-plot', {scale: 2, filename: 'volcano-plot'});
    }

    const downloadCSV = (e) => {
        e.preventDefault();
        let data = volcanoPlotData.data.map(item => ({
            signature: item.signature,
            outcome: item.outcome,
            model: item.model,
            subgroup: item.subgroup,
            tissue_type: item.tissue_type,
            n: item.n,
            effect_size: item.effect_size,
            se: item.se,
            _95ci_low: item._95ci_low,
            _95ci_high: item._95ci_high,
            pval: item.pval,
            i2: item.i2,
            pval_i2: item.pval_i2
        }));
        let csv = [
            [...Object.keys(data[0])],
            ...data.map(item =>[
                item.signature,
                item.outcome,
                item.model,
                item.subgroup,
                item.tissue_type,
                item.n,
                item.effect_size,
                item.se,
                item._95ci_low,
                item._95ci_high,
                item.pval,
                item.i2,
                item.pval_i2
            ])
        ];
        csv = csv.map(item => item.join(',')).join('\n');
        const csvData = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
        FileSaver.saveAs(csvData, 'volcano-plot.csv');
    }

    return(
        <Container>
            <div className='heading'>
                <h3 className='left'>Volcano Plot</h3>
                <DownloadButton className='left' onClick={downloadPlotImage} text='Image' />
                <DownloadButton onClick={downloadCSV} text='CSV' />
            </div>
            <PlotParameters>
                <div className='parameterLine'>Outcome: <span className='value'>{parameters.outcome}</span></div>
                <div className='parameterLine'>Model: <span className='value'>{parameters.model}</span></div>
                {!onthefly ? <div className='parameterLine'>Subgroup: <span className='value'>{parameters.subgroup}</span></div> : ''}
            </PlotParameters>
            <VolcanoPlot 
                plotId='volcano-plot' 
                parameters={parameters} 
                setParameters={setParameters} 
                data={volcanoPlotData.data} 
                getForestPlotData={getForestPlotData}
                onthefly={onthefly}
                attributes={{xAxis: models[parameters.model]}}
            />
        </Container>
    );
}

export default VolcanoPlotContainer;