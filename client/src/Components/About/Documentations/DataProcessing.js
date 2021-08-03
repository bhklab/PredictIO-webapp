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

const DataProcessing = () => {
    return(
        <div className='documentation'>
            <DocHeader>
                <h2>Data collection and processing</h2>
                <div>
                    <h3>Data processing</h3>
                    <p>
                        Outcome data and processed copy-number (CNA), mutational, and transcriptomic profiles were collected for each study. If not publicly available, individual patient clinical and genomic data information were requested from the corresponding authors. CNA profiles were composed of segmented log ratio (LogR) and gene-level data, while somatic mutation data was composed of gene-level with context information (i.e. synonymous or non-synonymous). The transcriptomic profile was composed of log2-transformed of two normalized data including FPKM (Fragments Per Kilobase of transcript per Million mapped reads) and TPM (Transcripts Per Million). For each dataset, genes with zero expression value in at least 50% of the samples were filtered out.
                    </p>
                </div>
            </DocHeader>
        </div>
    );
}

export default DataProcessing
