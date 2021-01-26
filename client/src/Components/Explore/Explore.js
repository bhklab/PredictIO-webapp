import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import axios from 'axios';

import ForestPlotContainer from './ForestPlotContainer';
import VolcanoPlotInput from './VolcanoPlotInput';
import VolcanoPlotContainer from './VolcanoPlotContainer';

const ExploreContainer = styled.div`
    width: 100%;
`;

const PlotContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
`;

const StyledPlotArea = styled.div`
    width: 48%;
    min-width: 540px;
    padding 10px;
`;

const Explore = (props) => {

    const {parameters, setParameters} = props;
    
    const [volcanoPlotData, setVolcanoPlotData] = useState({data: {}, ready: false});
    const [forestPlotData, setForestPlotData] = useState({data: {}, ready: false});

    const getVolcanoPlotData = async () => {
        setVolcanoPlotData({data: {}, ready: false}); // reset the data object so that the plot is redrawn.
        setForestPlotData({data: {}, ready: false}); 
        const res = await axios.post('/api/explore/volcano_plot', parameters);
        setVolcanoPlotData({data: res.data, ready: true});
    };

    const getForestPlotData = async (params) => {
        setForestPlotData({data: {}, ready: false}); // reset the data object so that the plot is redrawn.
        const res = await axios.post('/api/explore/forest_plot', params);
        setForestPlotData({data: res.data, ready: true});
    };

    useEffect(() => {
        getVolcanoPlotData();
    }, []);

    return(
        <ExploreContainer>
            <h2>Explore pre-computed signature data</h2>
            <VolcanoPlotInput 
                parameters={parameters} 
                setParameters={setParameters} 
                onSubmit={getVolcanoPlotData} 
                flexDirection='row' 
                resetButton={true} 
                onReset={() => {window.location.reload()}} />
            <PlotContainer>
                <StyledPlotArea className='volcano'>
                {
                    volcanoPlotData.ready &&
                    <VolcanoPlotContainer 
                        parameters={parameters} 
                        setParameters={setParameters} 
                        volcanoPlotData={volcanoPlotData} 
                        getForestPlotData={getForestPlotData} 
                    />
                }
                </StyledPlotArea>
                <StyledPlotArea className='forest'>
                {
                    forestPlotData.ready ?
                    <ForestPlotContainer parameters={parameters} forestPlotData={forestPlotData} />
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
