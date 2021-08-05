import React from 'react';
import styled from "styled-components";

const DocHeader = styled.div`
    margin-top: 20px;
    .title {
        display: inline-block;
        font-size: 20px;
        font-weight: bold;
        border-bottom: 3px solid rgb(241, 144, 33);
    }
`;

const Overview = () => {
    return(
        <div className='documentation'>
            <DocHeader>
                <h2>Overview</h2>
                <div>
                    <h3>Introduction</h3>
                    <p>
                        PredictIO is a clinical database of immune-checkpoint blockade (ICB) treated patients with available molecular sequencing data, which aims to characterize biological mechanisms of response and resistance to therapy.
                    </p>
                </div>
            </DocHeader>
        </div>
    );
}
export default Overview
