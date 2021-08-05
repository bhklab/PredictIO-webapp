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

const Review = () => {
    return(
        <div className='documentation'>
            <DocHeader>
                <h2>Data collection and processing</h2>
                <div>
                    <h3>Systematic review of published clinical studies</h3>
                    <p>
                        Studies were identified by an electronic search on PubMed using the MeSH terms: (cancer OR tumor) AND ( (PD-1 OR PD1) OR (PD-L1 OR PDL1) OR (CTLA-4 OR CTLA4) ) AND ( (anti-PD-1 OR anti-PD1) OR (anti-PD-L1 OR anti-PDL1) OR (anti-CTLA-4 OR anti-CTLA4) ) AND (genomic OR transcriptomic OR mutation) (Figure1). Eligible studies were English language, including at least one type of genomic data and clinical outcome information from advanced solid tumor patients treated with anti-PD-1/L1 and/or anti-CTLA-4 ICB therapy, and were published between January 2015 and September 2020. Genomic data was defined as RNA-sequencing and/or tumor exome or targeted-DNA sequencing. Clinical outcome data included response (according to RECIST or other response criteria), progression free survival (PFS), or overall survival (OS). Studies with fewer than 20 patients were excluded. Trials of ICB in combination with other treatment modalities such as chemotherapy, targeted therapies, and radiation were excluded. There was no minimum duration of follow-up for inclusion. Trials in the neoadjuvant setting were excluded.
                    </p>
                </div>
            </DocHeader>
        </div>
    );
}
export default Review
