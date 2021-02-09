import React, {useState} from 'react';
import Layout from '../UtilComponents/Layout';
import VolcanoPlotInput from '../Explore/VolcanoPlotInput';
import Explore from '../Explore/Explore';
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

    const [displayHome, setDisplayHome] = useState(true);

    const [parameters, setParameters] = useState({
        signatures: ['ALL'],
        outcome: '',
        model: '',
        subgroup: 'ALL'
    });

    const onSubmit = async () => {
        setDisplayHome(false);
    };

    return (
        <Layout>
            {
                displayHome ?
                <HomeContainer>
                    <HomeLogo>
                        <img alt='IO.db' src='./images/logos/IOdb-logo-main.png' />
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
                                flexDirection='column' />
                    </HomeInput>
                </HomeContainer>
                :
                <Explore parameters={parameters} setParameters={setParameters} />
            }
        </Layout>
    );
};

export default Home;