import React from 'react';
import styled from 'styled-components';

const DocHeader = styled.div`
  margin-top: 20px;
  .title {
    display: inline-block;
    font-size: 20px;
    font-weight: bold;
    border-bottom: 3px solid rgb(241, 144, 33);
  }
`;

const Computation = () => {
    return(
        <div className='documentation'>
            <DocHeader>
                <h2>Data collection and processing</h2>
                <div>
                    <h3>Gene signature computation</h3>
                    <p>
                        <b>Expression:</b> Gene signatures were computed using Gene Set Variation Analysis (GSVA) enrichment score. We applied z-score transformation to the genes of each signature before the computation.<br/>
                        <b>SNV:</b> Gene signatures were computed using the sum of all the mutated genes within each patient.
                    </p>
                </div>
            </DocHeader>
        </div>
    );
}

export default Computation
