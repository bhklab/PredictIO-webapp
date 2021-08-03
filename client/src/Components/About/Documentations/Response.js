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


const Response = () => {
    return(
        <div className='documentation'>
            <DocHeader>
                <h2>Data collection and processing</h2>
                <div>
                    <h3>Response to ICB treatment</h3>
                    <p>
                        Response (R) was defined as RECIST (v1.1) complete (CR) or partial (PR) response or stable disease (SD) without PFS event at 6 months. Non-response (NR) was defined as RECIST progressive disease (PD) or RECIST SD with a PFS event occurring within 6 months. If RECIST information was not available, patients without any PFS event at 6 months and patients with a PFS event occurring within 6 months were classified as R and NR, respectively. If PFS information was unavailable, patients with RECIST SD as best response were classified as not evaluable.
                    </p>
                </div>
            </DocHeader>
        </div>
    );
}

export default Response
