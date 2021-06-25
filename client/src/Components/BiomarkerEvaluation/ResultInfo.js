import React from 'react';
import styled from 'styled-components';

const StyledResultInfo = styled.div`
    
`;

const StyledRow = styled.div`
    display: flex;
    margin-bottom: 5px;
`;

const StyledDataLine = styled.div`
    font-size: 12px;
    margin-right: 20px;
    .title {
        font-weight: bold;
        margin-right: 10px;
    }
`;

const DataLine = (props) => {
    const { title, value } = props;
    return(
        <StyledDataLine>
            <span className='title'>{title}:</span>
            <span className='value'>{value}</span>
        </StyledDataLine>
    );
}

const ResultInfo = (props) => {

    const {reqInfo} = props;

    return(
        <StyledResultInfo>
            <StyledRow>
                <DataLine title='Analysis ID' value={reqInfo.analysis_id} />
                <DataLine title='Time Submitted' value={reqInfo.time_submitted} />
                <DataLine title='Time Completed' value={reqInfo.time_completed} />
            </StyledRow>
            <StyledRow>
                <DataLine title='Data Type' value={reqInfo.input_datatype} />
                <DataLine title='Sequencing Type' value={reqInfo.input_sequencing.join(', ')} />
                <DataLine title='Drug Type' value={reqInfo.input_drug_type.join(', ')} />
                <DataLine title='Sex' value={reqInfo.input_sex.map(s => s === 'M' ? 'Male' : 'Female').join(', ')} />
            </StyledRow>
            <StyledRow>
                <DataLine title='Gene(s)' value={reqInfo.input_genes.join(', ')} />
            </StyledRow>
            <StyledRow>
                <DataLine title='Primary' value={reqInfo.input_primary.join(', ')} />
            </StyledRow>
        </StyledResultInfo>
    );
}

export default ResultInfo;