import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import CustomDropdown from '../UtilComponents/CustomDropdown';
import { FaSortAmountDown, FaSortAmountUpAlt } from "react-icons/fa";
import ForestPlot from '../Diagram/ForestPlot';
import FileSaver from 'file-saver';
import DownloadButton from '../UtilComponents/DownloadButton';
import * as saveSvg from 'save-svg-as-png';

const Container = styled.div`
    width: 100%;
    .heading {
        display: flex;
        align-items: center;
    }
    .left {
        margin-right: 10px;
    }
`;

const PlotHeader = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    font-size: 12px;

    .title {
        font-weight: bold;
    }

    .parameterLine {
        .value {
            font-weight: bold;
        }
    }
    
    .filter {
        display: flex;
        flex: 30%;
        align-items: center;
        margin-left: 20px;
        .label {
            margin-right: 5px;
        }
        .dropdown {
            flex: 30%;
        }
        .sortIconBtn {
            font-size: 14px;
            margin-left: 10px;
            background: none;
            border: none;
            padding: 0;
            cursor: pointer;
            outline: none;
        }
    }

    .effectSizeValues {
        display: flex;
        .valueLine {
            margin-left: 15px;
            .value {
                margin-left: 5px;
                font-weight: bold;
            }
        }
    }
`;

const ForestPlotContainer = (props) => {

    const {parameters, forestPlotData, getModalData} = props;
    const [plotData, setPlotdata] = useState({ready: false, individuals: [], meta: []});
    const [sort, setSort] = useState({value: 'effect_size', asc: true});
    const [tissueValue, setTissueValue] = useState('ALL');
    const [sequenceValue, setSequenceValue] = useState('ALL');

    const [tissueOptions, setTissueOptions] = useState([]);
    const [sequenceOptions, setSequenceOptions] = useState([]);
    const sortOptions = [
        {value: 'effect_size', label: 'Hazard Ratio'},
        {value: 'study', label: 'Studies'},
    ];

    useEffect(() => {
        // const getModalData = props
        let tmp = forestPlotData.data.meta.filter(item => item.subgroup === 'Tumor' && item.n >= 3);
        tmp = tmp.map(item => ({value: item.tissue_type, label: item.tissue_type})).sort((a, b) => (a.label.localeCompare(b.label)));
        tmp.unshift({value: 'ALL', label: 'All'});

        setTissueOptions(tmp);
        
        tmp = forestPlotData.data.meta.filter(item => item.subgroup === 'Sequencing' && item.n >= 3);
        tmp = tmp.map(item => ({value: item.tissue_type, label: item.tissue_type})).sort((a, b) => (a.label.localeCompare(b.label)));
        tmp.unshift({value: 'ALL', label: 'All'});

        setSequenceOptions(tmp);

        setPlotdata({
            individuals: [...forestPlotData.data.individuals].sort((a, b) => a[sort.value] - b[sort.value]),
            meta: forestPlotData.data.meta.filter(item => item.tissue_type === 'ALL'),
            ready: true
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        let filterVal = 'ALL';
        let individuals = [...forestPlotData.data.individuals];
        let meta = [...forestPlotData.data.meta];

        if(tissueValue !== 'ALL'){
            individuals = individuals.filter(item => item.primary_tissue === tissueValue);
            filterVal = tissueValue;
            setSequenceValue('ALL');
        }

        if(sequenceValue !== 'ALL'){
            individuals = individuals.filter(item => item.sequencing === sequenceValue);
            filterVal = sequenceValue;
            setTissueValue('ALL');
        }

        if(sort.value === 'effect_size'){
            individuals.sort((a, b) => (sort.asc ? a[sort.value] - b[sort.value] : b[sort.value] - a[sort.value]));
        }else{
            individuals.sort((a, b) => a[sort.value] - b[sort.value]);
            if(!sort.asc){
                individuals.reverse();
            }
        }

        individuals.sort((a, b) => (sort.asc ? a[sort.value] - b[sort.value] : b[sort.value] - a[sort.value]));
        setPlotdata(prev => ({
            ...prev, 
            individuals: individuals,
            meta: meta.filter(item => item.tissue_type === filterVal)
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sort, tissueValue, sequenceValue]);

    const downloadPlotImage = (e) => {
        e.preventDefault();
        const imageOptions = {
            scale: 2,
            encoderOptions: 1,
            backgroundColor: 'white'
        }
        saveSvg.saveSvgAsPng(document.getElementById('forest-plot'), 'forest-plot.png', imageOptions);
    }

    const downloadCSV = (e) => {
        e.preventDefault();
        console.log(forestPlotData);
        let data = forestPlotData.data.individuals.map(item => ({
            signature: parameters.signature ? parameters.signature : 'Custom',
            outcome: item.outcome,
            model: item.model,
            study: item.study,
            primary_tissue: item.primary_tissue,
            sequencing: item.sequencing,
            n: item.n,
            effect_size: item.effect_size,
            se: item.se,
            _95ci_low: item._95ci_low,
            _95ci_high: item._95ci_high,
            pval: item.pval
        }));
        let csv = [
            [...Object.keys(data[0])],
            ...data.map(item =>[
                item.signature,
                item.outcome,
                item.model,
                item.study,
                item.primary_tissue,
                item.sequencing,
                item.n,
                item.effect_size,
                item.se,
                item._95ci_low,
                item._95ci_high,
                item.pval
            ])
        ];
        csv = csv.map(item => item.join(',')).join('\n');
        const csvData = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
        FileSaver.saveAs(csvData, 'forest-plot.csv');
    }

    return(
        <div>
            {
                plotData.ready &&
                <Container>
                    <div className='heading'>
                        <h3 className='left'>Forest Plot</h3>
                        <DownloadButton className='left' onClick={downloadPlotImage} text='Image' />
                        <DownloadButton onClick={downloadCSV} text='CSV' />
                    </div>
                    <PlotHeader>
                        <div className='parameterLine'>
                            Signature: <span className='value'>{parameters.signature ? parameters.signature : 'Custom'}</span>
                        </div>
                        <div className='filter'>
                            <span className='label'>Sort By:</span>
                            <CustomDropdown 
                                className='dropdown' 
                                value={sort.value}
                                options={sortOptions}
                                onChange={(e) => {setSort(prev => ({...prev, value: e.value}))}}
                                placeholder='Select...'
                            />
                            <button className='sortIconBtn' onClick={(e) => {setSort(prev => ({...prev, asc: !prev.asc}))}}>
                                {
                                    sort.asc ? <FaSortAmountDown /> : <FaSortAmountUpAlt />
                                }
                            </button>
                        </div>
                    </PlotHeader>
                    <PlotHeader>
                        <div className='title'>Filter By: </div>
                        <div className='filter'>
                            <span className='label'>Tissue Type:</span>
                            <CustomDropdown 
                                className='dropdown' 
                                value={tissueValue}
                                options={tissueOptions}
                                onChange={(e) => {setTissueValue(e.value)}}
                                disabled={sequenceValue !== 'ALL'}
                                placeholder='Select...'
                            />
                        </div>
                        <div className='filter'>
                            <span className='label'>Sequencing Type:</span>
                            <CustomDropdown 
                                className='dropdown' 
                                value={sequenceValue}
                                options={sequenceOptions}
                                onChange={(e) => {setSequenceValue(e.value)}}
                                disabled={tissueValue !== 'ALL'}
                                placeholder='Select...'
                            />
                        </div>
                    </PlotHeader>
                    <PlotHeader>
                        <div className='title'>Pooled Effect Sizes: </div>
                        <div className='effectSizeValues'>
                            <div className='valueLine'>
                                Coef:
                                <span className='value'>{Number(plotData.meta[0].effect_size).toFixed(2)} </span>
                                [95CI%:
                                <span className='value'>{Number(plotData.meta[0]._95ci_low).toFixed(2)} </span>
                                -
                                <span className='value'>{Number(plotData.meta[0]._95ci_high).toFixed(2)}</span>
                                ]
                            </div>
                            <div className='valueLine'>P-value: <span className='value'>{Number(plotData.meta[0].pval).toFixed(3)}</span></div>
                            <div className='valueLine'>Het. I2: <span className='value'>{Number(plotData.meta[0].i2).toFixed(3)}</span></div>
                            <div className='valueLine'>I2 Pval: <span className='value'>{Number(plotData.meta[0].pval_i2).toFixed(3)}</span></div>
                        </div>
                    </PlotHeader>
                    <ForestPlot id='forest-plot' individuals={plotData.individuals} meta={plotData.meta} getModalData={getModalData}/>
                </Container>
            }
        </div>
    );
}

export default ForestPlotContainer;
