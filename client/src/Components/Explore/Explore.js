import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Loader from 'react-loader-spinner';

import ForestPlotContainer from './ForestPlotContainer';
import VolcanoPlotInput from './VolcanoPlotInput';
import VolcanoPlotContainer from './VolcanoPlotContainer';
import colors from '../../styles/colors';

const ExploreContainer = styled.div`
    width: 100%;
`;

const PlotContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    .volcano {
        width: 35%;
    }
    .forest {
        width: 65%;
    }
`;

const StyledPlotArea = styled.div`
    width: ${props => props.width};
    // min-width: 400px;
    padding 10px;
`;

const LoaderContainer = styled.div`
    width: 100%;
    height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Explore = (props) => {

    const {parameters, setParameters} = props;
    
    const [volcanoPlotData, setVolcanoPlotData] = useState({data: {}, ready: false});
    const [forestPlotData, setForestPlotData] = useState({data: {}, loading: false, ready: false});

    const getVolcanoPlotData = async () => {
        setVolcanoPlotData({data: {}, ready: false}); // reset the data object so that the plot is redrawn.
        setForestPlotData({data: {}, loading: false, ready: false}); 
        const res = await axios.post('/api/explore/volcano_plot', parameters);
        setVolcanoPlotData({data: res.data, ready: true});
    };

    const getForestPlotData = async (params) => {
        setForestPlotData({data: {}, loading: true, ready: false}); // reset the data object so that the plot is redrawn.
        const res = await axios.post('/api/explore/forest_plot', params);
        setForestPlotData({data: res.data, loading: false, ready: true});
    };

    useEffect(() => {
        getVolcanoPlotData();
    }, []);

    return(
        <ExploreContainer>
            <h3>Explore pre-computed signature data</h3>
            <VolcanoPlotInput 
                parameters={parameters} 
                setParameters={setParameters} 
                onSubmit={getVolcanoPlotData} 
                flexDirection='row' 
                resetButton={true} 
                onReset={() => {window.location.reload()}} />
            <PlotContainer>
                <StyledPlotArea width='40%'>
                {
                    volcanoPlotData.ready ?
                    <VolcanoPlotContainer 
                        parameters={parameters} 
                        setParameters={setParameters} 
                        volcanoPlotData={volcanoPlotData} 
                        getForestPlotData={getForestPlotData} 
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
                    <ForestPlotContainer parameters={parameters} forestPlotData={forestPlotData} />
                    :
                    forestPlotData.loading ?
                        <LoaderContainer>
                            <Loader type="Oval" color={colors.blue} height={80} width={80}/>
                        </LoaderContainer>
                        :
                        <div>
                            <h3>Forest Plot</h3>
                            <div>Click on a signature point on the volcano plot to display a corresponding forest plot.</div>
                        </div>
                }
                </StyledPlotArea>
            </PlotContainer>
        </ExploreContainer>
    );
}

export default Explore;
