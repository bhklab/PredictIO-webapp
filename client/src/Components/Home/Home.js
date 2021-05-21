import React, {useState} from 'react';
import { Redirect } from 'react-router-dom';
import Layout from '../UtilComponents/Layout';
import VolcanoPlotInput from '../IOExplore/VolcanoPlotInput';
import styled from 'styled-components';

const HomeContainer = styled.div`
    width: 100%;
    height: calc(100vh - 105px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const HomeLogo = styled.div`
    height: 100px;
    img {
        height: 100%;
    }
`;

const AppDescription = styled.div`
    width: 90%;
    max-width: 550px;
    min-width: 415px;
    margin-top: 20px;
    margin-bottom: 20px;
    line-height: 1.5;
    letter-spacing: 1.5px;
`;

const HomeInput = styled.div`
    width: 90%;
    max-width: 550px;
    min-width: 415px;
    display: flex;
    flex-direction: column;
    aling-items: center;
    margin-top: 30px;

    .subText {
        font-size: 20px;
        font-weight: bold;
    }
`

const Home = () => {
    const [redirect, setRedirect] = useState(false);
    const [parameters, setParameters] = useState({signatures: ['ALL'], outcome: '', model: ''});

    const onSubmit = async () => {
        setRedirect(true);
    };

    return (
        <Layout>
            {
                redirect ?
                <Redirect 
                    to={{
                        pathname: '/explore/precomputed',
                        state: { preset: parameters}
                    }}
                />
                :
                <HomeContainer>
                    <HomeLogo>
                        <img alt='PredictIO' src='./images/logos/logo-main.png' />
                    </HomeLogo>
                    <AppDescription>
                        Investigate predictive and prognostic values of your gene.
                        <br />
                        Predict a patient response to ICB therapy.
                    </AppDescription>
                    <HomeInput>
                        <div className='subText'>Explore pre-computed signature data</div>
                        <VolcanoPlotInput 
                            parameters={parameters} 
                            setParameters={setParameters} 
                            onSubmit={onSubmit} 
                            onReset={() => {setParameters({signatures: ['ALL'], outcome: '', model: ''})}}
                            flexDirection='column' 
                        />
                    </HomeInput>
                </HomeContainer>
            }
        </Layout>
    );
};

export default Home;