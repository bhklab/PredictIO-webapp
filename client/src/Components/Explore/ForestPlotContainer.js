import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import CustomSelect from '../UtilComponents/CustomSelect';
import { FaSortAmountDown, FaSortAmountUpAlt } from "react-icons/fa";
import ForestPlot from '../Diagram/ForestPlot3';

const Container = styled.div`
    width: 100%;
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

    const {parameters, forestPlotData} = props;
    const [plotData, setPlotdata] = useState({ready: false, individuals: [], meta: []});
    const [sort, setSort] = useState({value: 'effect_size', asc: true});
    const [tissueValue, setTissueValue] = useState('all');
    const [sequenceValue, setSequenceValue] = useState('all');

    const [tissueOptions, setTissueOptions] = useState([]);
    const [sequenceOptions, setSequenceOptions] = useState([]);
    const sortOptions = [
        {value: 'effect_size', label: 'Hazard Ratio'},
        {value: 'study', label: 'Studies'},
    ];

    useEffect(() => {
        console.log(forestPlotData.data.individuals);

        let tmp = forestPlotData.data.individuals.map(item => item.primary_tissue);
        tmp = [...new Set(tmp)];
        tmp = tmp.map(item => ({value: item, label: item, isDisabled: false})).sort((a, b) => (a.label.localeCompare(b.label)));
        tmp.unshift({value: 'all', label: 'All'});
        setTissueOptions(tmp);
        
        tmp = forestPlotData.data.individuals.map(item => item.sequencing);
        tmp = [...new Set(tmp)];
        tmp = tmp.map(item => ({value: item, label: item, isDisabled: false})).sort((a, b) => (a.label.localeCompare(b.label)));
        tmp.unshift({value: 'all', label: 'All'});
        setSequenceOptions(tmp);

        setPlotdata({
            individuals: [...forestPlotData.data.individuals].sort((a, b) => a[sort.value] - b[sort.value]),
            meta: forestPlotData.data.meta,
            ready: true
        });
        
    }, []);

    useEffect(() => {
        let individuals = [...forestPlotData.data.individuals];
        if(tissueValue !== 'all'){
            individuals = individuals.filter(item => item.primary_tissue === tissueValue);
            let availableSeq = [...new Set(individuals.map(item => item.sequencing))];
            sequenceOptions.forEach(item => {
                item.isDisabled = !availableSeq.includes(item.value) && item.value !== 'all';
            });
        }else{
            sequenceOptions.forEach(item => {
                item.isDisabled = false;
            });
        }
        if(sequenceValue !== 'all'){
            individuals = individuals.filter(item => item.sequencing === sequenceValue);
            let availableTissue = [...new Set(individuals.map(item => item.primary_tissue))];
            tissueOptions.forEach(item => {
                item.isDisabled = !availableTissue.includes(item.value) && item.value != 'all';
            });
        }else{
            tissueOptions.forEach(item => {
                item.isDisabled = false;
            });
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
        setPlotdata(prev => ({...prev, individuals: individuals}));
    }, [sort, tissueValue, sequenceValue]);

    return(
        <div>
            {
                plotData.ready &&
                <Container>
                    <h3>Forest Plot</h3>
                    <PlotHeader>
                        <div className='parameterLine'>
                            Signature: <span className='value'>{parameters.signature}</span>
                        </div>
                        <div className='filter'>
                            <span className='label'>Sort By:</span>
                            <CustomSelect 
                                className='dropdown' 
                                value={sortOptions.find(option => option.value === sort.value)}
                                options={sortOptions}
                                onChange={(e) => {setSort(prev => ({...prev, value: e.value}))}}
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
                            <CustomSelect 
                                className='dropdown' 
                                value={tissueOptions.find(option => option.value === tissueValue)}
                                options={tissueOptions}
                                onChange={(e) => {setTissueValue(e.value)}}
                            />
                        </div>
                        <div className='filter'>
                            <span className='label'>Sequencing Type:</span>
                            <CustomSelect 
                                className='dropdown' 
                                value={sequenceOptions.find(option => option.value === sequenceValue)}
                                options={sequenceOptions}
                                onChange={(e) => {setSequenceValue(e.value)}}
                            />
                        </div>
                    </PlotHeader>
                    <PlotHeader>
                        <div className='title'>Pooled Effect Sizes: </div>
                        <div className='effectSizeValues'>
                            <div className='valueLine'>P-value: <span className='value'>{Number(plotData.meta[0].pval).toFixed(3)}</span></div>
                            <div className='valueLine'>Coef: <span className='value'>{Number(plotData.meta[0].se).toFixed(3)}</span></div>
                            <div className='valueLine'>95CI Low: <span className='value'>{Number(plotData.meta[0]._95ci_low).toFixed(3)}</span></div>
                            <div className='valueLine'>95CI High: <span className='value'>{Number(plotData.meta[0]._95ci_high).toFixed(3)}</span></div>
                        </div>    
                    </PlotHeader>
                    <ForestPlot id='forestplot' individuals={plotData.individuals} meta={plotData.meta} />
                </Container>
            }
        </div>
    );
}

export default ForestPlotContainer;
