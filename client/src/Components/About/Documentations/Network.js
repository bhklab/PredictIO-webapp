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

const DataContribution = () => {
    return(
        <div className='documentation'>
            <DocHeader>
                <h2>Data collection and processing</h2>
                <div>
                    <h3>Gene signature network analysis</h3>
                    <p>
                        In order to assess the level of similarity between the curated signatures, we computed the matrix of overlapping genes defining each signature. Distance between signatures was then assessed using Principal Component Analysis (PCA). Clusters of signatures were then derived by applying the PC1 and PC2 into Affinity Propagation Clustering (APC) using the apcluster (v1.4.8) R package. Within each cluster of at least 2 signatures, we combined all the genes and computed the KEGG pathway enrichment analysis using the enrichR (v.3.0) R package.
                    </p>
                </div>
            </DocHeader>
        </div>
    );
}

export default DataContribution
