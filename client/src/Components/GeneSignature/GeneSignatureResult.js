import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import Loader from 'react-loader-spinner';

import Layout from '../UtilComponents/Layout';
import ResultInfo from './ResultInfo';
// import StyledForm from '../UtilComponents/StyledForm';
// import CustomDropdown from '../UtilComponents/CustomDropdown';
import VolcanoPlotContainer from '../IOExplore/VolcanoPlotContainer';
import ForestPlotContainer from '../IOExplore/ForestPlotContainer';
import { PlotContainer, StyledPlotArea, LoaderContainer } from '../../styles/PlotStyles';
import ModalContainer from "../IOExplore/ModalContainer";
import colors from '../../styles/colors';

const ResultContainer = styled.div`
   
`;

const GeneSignatureResult = () => {

    let { id } = useParams();
    const [parameters, setParameters] = useState({
        signatures: ['ALL'],
        outcome: '',
        model: ''
    });
    // const [outcomeOptions, setOutcomeOptions] = useState({
    //     selected: '',
    //     options: []
    // });
    // const [modelOptions, setModelOptions] = useState({
    //     selected: '',
    //     options: []
    // });
    const [reqInfo, setReqInfo] = useState();
    const [volcanoPlotData, setVolcanoPlotData] = useState({data: {}, ready: false});
    const [forestPlotData, setForestPlotData] = useState({data: {}, loading: false, ready: false});
    const [modalData, setModalData] = useState({data: {}, ready: false});

    const getForestPlotData = async (params) => {
        setForestPlotData({data: {}, loading: true, ready: false}); // reset the data object so that the plot is redrawn.
        setParameters(params);
        const res = await axios.get(`/api/explore/signature/forest_plot/${id}?model=${params.model}&outcome=${params.outcome}`);
        console.log(res.data);
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
            const res = await axios.get(`/api/explore/signature/result/${id}`);
            console.log(res.data);
            
            // let outcome = [...new Set(res.data.result.map(item => item.outcome))];
            // outcome.sort((a, b) => a.localeCompare(b));
            // setOutcomeOptions({
            //     ...outcomeOptions,
            //     options: outcome.map(item => ({label: item, value: item, disabled: false}))
            // });

            // let model = [...new Set(res.data.result.map(item => item.model))];
            // model.sort((a, b) => a.localeCompare(b));
            // setModelOptions({
            //     ...modelOptions,
            //     options: model.map(item => ({label: item, value: item, disabled: false}))
            // });

            setReqInfo(res.data.reqInfo);
            setVolcanoPlotData({data: res.data.result, ready: true});
        }
        getData();
    }, []);

    return(
        <Layout>
            <ResultContainer>
                <h3>Gene Signature Analysis Result</h3>
                {
                    typeof reqInfo !== 'undefined' && <ResultInfo reqInfo={reqInfo} />
                }
                {/* <StyledForm flexDirection='row'>
                    <div className='formField'>
                        <div className='label'>Outcome: </div>
                        <CustomDropdown
                            className='input'
                            value={outcomeOptions.selected}
                            options={outcomeOptions.options}
                            onChange={(e) => {setOutcomeOptions({...outcomeOptions, selected: e.value})}}
                            placeholder="Select..."
                        />
                    </div>
                    <div className='formField'>
                        <div className='label'>Model: </div>
                        <CustomDropdown
                            className='input'
                            value={modelOptions.selected}
                            options={modelOptions.options}
                            onChange={(e) => {setModelOptions({...modelOptions, selected: e.value})}}
                            placeholder="Select..."
                        />
                    </div>
                </StyledForm> */}
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
                        <LoaderContainer>
                            <Loader type="Oval" color={colors.blue} height={80} width={80}/>
                        </LoaderContainer>
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
            </ResultContainer>
        </Layout>
    );
}

export default GeneSignatureResult;