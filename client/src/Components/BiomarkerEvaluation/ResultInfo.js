import React from 'react';
import styled from 'styled-components';

const StyledResultInfo = styled.div`
    display: flex;
    font-size: 12px;
    .left {
        margin-right: 30px;
    }
    td {
        padding-bottom: 10px;
    }
    .title {
        font-weight: bold;
        padding-right: 10px;
    }
`;

const ResultInfo = (props) => {

    const {reqInfo} = props;

    return(
        <StyledResultInfo>
            <table className='left'>
                <tbody>
                    <tr>
                        <td className='title'>Analysis ID: </td>
                        <td>{reqInfo.analysis_id}</td>
                    </tr>
                    <tr>
                        <td className='title'>Time Submitted: </td>
                        <td>{reqInfo.time_submitted}</td>
                    </tr>
                    <tr>
                        <td className='title'>Time Completed: </td>
                        <td>{reqInfo.time_completed}</td>
                    </tr>
                </tbody>
            </table>
            <table className='left'>
                <tbody>
                    <tr>
                        <td className='title'>Genes: </td>
                        <td>{reqInfo.input_genes.join(', ')}</td>
                    </tr>
                    <tr>
                        <td className='title'>Datatype: </td>
                        <td>{reqInfo.input_datatype}</td>
                    </tr>
                    <tr>
                        <td className='title'>Sex: </td>
                        <td>{reqInfo.input_sex.map(s => s === 'M' ? 'Male' : 'Female').join(', ')}</td>
                    </tr>
                </tbody>
            </table>
            <table>
                <tbody>
                    <tr>
                        <td className='title'>Primary: </td>
                        <td>{reqInfo.input_primary.join(', ')}</td>
                    </tr>
                    <tr>
                        <td className='title'>Drug Type: </td>
                        <td>{reqInfo.input_drug_type.join(', ')}</td>
                    </tr>
                    <tr>
                        <td className='title'>Sequencing Type: </td>
                        <td>{reqInfo.input_sequencing.join(', ')}</td>
                    </tr>
                </tbody>
            </table>
        </StyledResultInfo>
    );
}

export default ResultInfo;