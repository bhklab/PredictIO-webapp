import React from 'react';
import Layout from '../UtilComponents/Layout';
import LinkButton from '../UtilComponents/LinkButton';
import styled from 'styled-components';

const StyledHome = styled.div`
    width: 60%;
    height: 60%;
    margin-top: -150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const HomeLogo = styled.div`
    height: 155px;
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

const HomeButtons = styled.div`
    width: 90%;
    max-width: 550px;
    min-width: 415px;
    margin-top: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const Home = () => {
    return (
        <Layout>
            <StyledHome>
                <HomeLogo>
                    <img alt='IO.db' src='./images/logos/IOdb-logo-main.png' />
                </HomeLogo>
                <AppDescription>
                    Investigate predictive and prognostic values of your gene.
                    <br />
                    Predict a patient response to ICB therapy.
                </AppDescription>
                <HomeButtons>
                    <LinkButton href='/' text='Explore' style={{}} />
                    <LinkButton href='/' text='IO Predict' style={{}} />
                </HomeButtons>
            </StyledHome>
        </Layout>
    );
};

export default Home;