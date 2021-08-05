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

const StatisticalAnalysis = () => {
    return(
        <div className='documentation'>
            <DocHeader>
                <h2>Data collection and processing</h2>
                <div>
                    <h3>Statistical analysis</h3>
                    <p>
                        Association of specific biomarkers with ICB response was assessed using a logistic regression model (LogReg). Association of specific biomarkers with ICB survival (either PFS or OS) was assessed using Coxph regression model (COX), along with D-statistics (DI), to assess the discrimination or separation of a survival model. To improve reproducibility, the results of individual independent studies were pooled using random-effects meta-analysis with inverse variance weighting in DerSimonian and Laird random-effects models (Borenstein et al., 2010). Heterogeneity across studies was evaluated by using the Q statistic along with I2 index, which describes the total variation across studies attributable to heterogeneity rather than sampling error (Higgins and Thompson, 2002; Lin et al., 2017; Whitehead and Whitehead, 1991). Note that I2 value of greater than 50% along with Cochran’s Q statistic P &lt; 0.05 represent moderate to high heterogeneity (Higgins et al., 2003). Subgroup analysis was considered to assess the impact of tumor type, sequencing technology and normalization method on the source of moderate to high heterogeneity (Borenstein and Higgins, 2013).
                    </p>
                </div>
            </DocHeader>
        </div>
    );
}

export default StatisticalAnalysis
