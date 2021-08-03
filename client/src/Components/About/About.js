import React, { useState } from 'react';
import './About.css';
import Layout from '../UtilComponents/Layout';

import Overview from './Documentations/Overview';
import DataProcessing from './Documentations/DataProcessing';
import Response from './Documentations/Response';
import StatisticalAnalysis from './Documentations/StatisticalAnalysis';
import Review from "./Documentations/Review";
import Computation from "./Documentations/Computation";
import Network from "./Documentations/Network";
import Abbreviation from "./Documentations/Abbreviations/Abbreviation";

const About = () => {

    const [display, setDisplay] = useState('overview');

    return(
        <Layout>
            <div className='pageContent'>
                <div className='documentationContent'>
                    <nav className='documentationNav'>
                        <h3>Overview</h3>
                        <ul>
                            <li className={display === 'overview' ? 'selected' : undefined}>
                                <button type='button' onClick={() => setDisplay('overview')}>Introduction</button>
                            </li>
                        </ul>
                        <h3>Data collection and processing</h3>
                        <ul>
                            <li className={display === 'review' ? 'selected' : undefined}>
                                <button type='button' onClick={() => setDisplay('review')}>Systematic review of published clinical studies</button>
                                {/*<button type='button' onClick={() => setDisplay('review')}>Review</button>*/}
                            </li>
                            <li className={display === 'response' ? 'selected' : undefined}>
                                <button type='button' onClick={() => setDisplay('response')}>Response to ICB treatment</button>
                                {/*<button type='button' onClick={() => setDisplay('response')}>ICB treatment</button>*/}
                            </li>
                            <li className={display === 'processing' ? 'selected' : undefined}>
                                <button type='button' onClick={() => setDisplay('processing')}>Data processing</button>
                            </li>
                            <li className={display === 'computation' ? 'selected' : undefined}>
                                <button type='button' onClick={() => setDisplay('computation')}>Gene signature computation</button>
                            </li>
                            <li className={display === 'network' ? 'selected' : undefined}>
                                <button type='button' onClick={() => setDisplay('network')}>Gene signature network analysis</button>
                            </li>
                            <li className={display === 'analysis' ? 'selected' : undefined}>
                                <button type='button' onClick={() => setDisplay('analysis')}>Statistical analysis</button>
                            </li>
                        </ul>
                        <h3>Abbreviations</h3>
                        <ul>
                            <li className={display === 'abbreviation' ? 'selected' : undefined}>
                                <button type='button' onClick={() => setDisplay('abbreviation')}>Abbreviations</button>
                            </li>
                        </ul>
                    </nav>
                    {display === 'overview' && <Overview /> }
                    {display === 'review' && <Review /> }
                    {display === 'response' && <Response /> }
                    {display === 'processing' && <DataProcessing /> }
                    {display === 'computation' && <Computation /> }
                    {display === 'network' && <Network /> }
                    {display === 'analysis' && <StatisticalAnalysis /> }
                    {display === 'abbreviation' && <Abbreviation /> }
                </div>
            </div>
        </Layout>
    );
}

export default About;
