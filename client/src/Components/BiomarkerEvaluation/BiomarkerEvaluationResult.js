import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from 'react-loader-spinner';

import Layout from '../UtilComponents/Layout';
import ResultInfo from './ResultInfo';
import StyledForm from '../UtilComponents/StyledForm';
import CustomDropdown from '../UtilComponents/CustomDropdown';
import ActionButton from '../UtilComponents/ActionButton';
import NetworkPlot from '../Diagram/NetworkPlot';
import VolcanoPlotContainer from '../IOExplore/VolcanoPlotContainer';
import ForestPlotContainer from '../IOExplore/ForestPlotContainer';
import ModalContainer from "../IOExplore/ModalContainer";
import { PlotContainer, StyledPlotArea, LoaderContainer } from '../../styles/PlotStyles';
import { colors } from '../../styles/colors';

const BiomarkerEvaluationResult = () => {

    const { id } = useParams();
    const [reqInfo, setReqInfo] = useState({data: {}, ready: false});
    const [networkData, setNetworkData] = useState({data: {}, ready: false});
    const [parameters, setParameters] = useState({signatures: ['ALL'], outcome: '', model: ''});
    const [outcomeDropdown, setOutcomeDropdown] = useState([]);
    const [modelDropdown, setModelDropdown] = useState([]);
    const [volcanoPlotData, setVolcanoPlotData] = useState({data: {}, loading: false, ready: false});
    const [forestPlotData, setForestPlotData] = useState({data: {}, loading: false, ready: false});
    const [modalData, setModalData] = useState({data: {}, ready: false});

    const disableSubmit = () => {
        return parameters.outcome.length === 0 || parameters.model.length === 0;
    }

    const reset = (e) => {
        e.preventDefault();
        setParameters({signatures: ['ALL'], outcome: '', model: ''});
        setVolcanoPlotData({data: {}, loading: false, ready: false});
        setForestPlotData({data: {}, loading: false, ready: false});
    }

    const getVolcanoPlotData = async (e) => {
        e.preventDefault();
        setForestPlotData({data: {}, loading: false, ready: false});
        setVolcanoPlotData({data: {}, loading: true, ready: false}); // reset the data object so that the plot is drawn
        const res = await axios.get(`/api/explore/biomarker/result/volcano_plot/${id}?outcome=${parameters.outcome}&model=${parameters.model}`);
        console.log(res.data);
        setVolcanoPlotData({data: res.data, loading: false, ready: true});
    }

    const getForestPlotData = async (params) => {
        setForestPlotData({data: {}, loading: true, ready: false}); // reset the data object so that the plot is redrawn.
        setParameters(params);
        let res = {};
        if(params.signature === 'Custom'){
            res = await axios.get(`/api/explore/biomarker/result/forest_plot/${id}?model=${params.model}&outcome=${params.outcome}`);
        }else{
            res = await axios.post('/api/explore/forest_plot', params);
        }
        setForestPlotData({data: res.data, loading: false, ready: true});
    }

    const getModalData = async (params) => {
        // setModalData({data: {}, ready: false}); // reset the data object so that the plot is redrawn.
        const res = await axios.post('/api/explore/description_modal', params);
        console.log(res.data)
        setModalData({data: res.data, ready: true});
    };

    const removeModalData = () => {
        setModalData({data: {}, ready: false}); // reset the data object so that the plot is redrawn.
    };

    useEffect(() => {
        const getData = async () => {
            console.log(id);
            const res = await axios.get(`/api/explore/biomarker/result/${id}`);
            console.log(res.data);
            setReqInfo({data: res.data.reqInfo, ready: true});
            setNetworkData({data: res.data.network, ready: true});
            setOutcomeDropdown(res.data.outcomeDropdown);
            setModelDropdown(res.data.modelDropdown);
        }
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if(parameters.outcome === 'Response'){
            setParameters({...parameters, model: 'LogReg'});
            let models = modelDropdown.map(item => ({...item, disabled: item.value !== 'LogReg'}));
            setModelDropdown(models);
        }else if(parameters.outcome === 'OS' || parameters.outcome === 'PFS'){
            setParameters({...parameters, model: ''});
            let models = modelDropdown.map(item => ({...item, disabled: item.value === 'LogReg'}));
            setModelDropdown(models);
        }else{
            setParameters({...parameters, model: ''});
            let models = modelDropdown.map(item => ({...item, disabled: false}));
            setModelDropdown(models);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parameters.outcome]);

    return(
        <Layout>
            <h3>Biomarker Evaluation Result</h3>
            {
                
                !reqInfo.ready &&
                <React.Fragment>
                    <h3>Loading...</h3>
                    <LoaderContainer>
                        <Loader type="Oval" color={colors.blue} height={80} width={80}/>
                    </LoaderContainer>
                </React.Fragment>
            }
            {
                reqInfo.ready && <ResultInfo reqInfo={reqInfo.data} />
            }
            {
                networkData.ready && networkData.data.length > 0 &&
                <PlotContainer>
                    <StyledPlotArea width='50%'>
                        <h3>Signature Clusters</h3>
                        <NetworkPlot data={networkData.data} plotId='network-diagram' />
                    </StyledPlotArea>
                </PlotContainer>  
            }
            {
                reqInfo.ready && outcomeDropdown.length > 0 &&
                <React.Fragment>
                    <StyledForm flexDirection='row'>
                        <div className='formField'>
                            <div className='label'>Outcome: </div>
                            <CustomDropdown
                                className='input'
                                value={parameters.outcome}
                                options={outcomeDropdown}
                                onChange={(e) => {setParameters({...parameters, outcome: e.value})}}
                                placeholder="Select..."
                            />
                        </div>
                        <div className='formField'>
                            <div className='label'>Model: </div>
                            <CustomDropdown
                                className='input'
                                value={parameters.model}
                                options={modelDropdown}
                                onChange={(e) => {setParameters({...parameters, model: e.value})}}
                                placeholder="Select..."
                                disabled={parameters.outcome.length === 0}
                            />
                        </div>
                        <div className='formField buttonField'>
                            <ActionButton 
                                className='left'
                                onClick={getVolcanoPlotData} 
                                text='Submit'
                                disabled={disableSubmit()}
                            />
                            <ActionButton
                                onClick={reset}
                                text='Reset'
                                type='reset'
                            />
                        </div>
                    </StyledForm>
                    <PlotContainer>
                        <StyledPlotArea width='40%'>
                        {
                            volcanoPlotData.ready ?
                            <VolcanoPlotContainer 
                                parameters={parameters} 
                                setParameters={setParameters} 
                                volcanoPlotData={volcanoPlotData} 
                                getForestPlotData={getForestPlotData} 
                                onthefly={true}
                            />
                            :
                            volcanoPlotData.loading ?
                                <LoaderContainer>
                                    <Loader type="Oval" color={colors.blue} height={80} width={80}/>
                                </LoaderContainer>
                                :
                                <div>
                                    <h3>Volcano Plot</h3>
                                    <div className='forestPlotMessage'>
                                        Select outcome and model to view the volcano plot.
                                    </div>
                                </div>
                        }
                        </StyledPlotArea>
                        <StyledPlotArea width='60%'>
                        {
                            forestPlotData.ready ?
                            <ForestPlotContainer parameters={parameters} forestPlotData={forestPlotData} getModalData={getModalData} />
                            :
                            forestPlotData.loading ?
                                <LoaderContainer>
                                    <Loader type="Oval" color={colors.blue} height={80} width={80}/>
                                </LoaderContainer>
                                :
                                <div>
                                    <h3>Forest Plot</h3>
                                    <div className='forestPlotMessage'>
                                        Click on a signature point on the volcano plot to display a corresponding forest plot.
                                    </div>
                                </div>
                        }
                        </StyledPlotArea>
                    </PlotContainer>
                    <PlotContainer>
                    {
                        modalData.ready &&
                        <ModalContainer
                            modalData={modalData}
                            removeModalData = {removeModalData}
                        /> 
                    }
                    </PlotContainer>
                </React.Fragment>
            }
            {
                reqInfo.ready && outcomeDropdown.length === 0 &&
                <h3>The analysis did not return any significant results with the given input.</h3>
            }
        </Layout>
    );
}

export default BiomarkerEvaluationResult;