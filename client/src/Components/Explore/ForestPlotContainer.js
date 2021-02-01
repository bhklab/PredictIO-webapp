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
    const [tissueValue, setTissueValue] = useState('ALL');
    const [sequenceValue, setSequenceValue] = useState('ALL');

    const [tissueOptions, setTissueOptions] = useState([]);
    const [sequenceOptions, setSequenceOptions] = useState([]);
    const sortOptions = [
        {value: 'effect_size', label: 'Hazard Ratio'},
        {value: 'study', label: 'Studies'},
    ];

    useEffect(() => {

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
                                isDisabled={sequenceValue !== 'ALL'}
                            />
                        </div>
                        <div className='filter'>
                            <span className='label'>Sequencing Type:</span>
                            <CustomSelect 
                                className='dropdown' 
                                value={sequenceOptions.find(option => option.value === sequenceValue)}
                                options={sequenceOptions}
                                onChange={(e) => {setSequenceValue(e.value)}}
                                isDisabled={tissueValue !== 'ALL'}
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
