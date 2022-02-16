import React from 'react';
import axios from 'axios';
import { StyledButton } from './ModalStyles';
import styled from 'styled-components';

const StyledModal = styled.div`
    width: 100%;
    .title {
        font-weight: bold;
    }
    .content {
        padding-top: 20px;
        padding-bottom: 30px;
        font-size: 14px;
        .download-file {
            border: none;
            background: none;
            cursor: pointer;
            color: #ffffff;
            text-decoration: underline;
        }
    }
    .buttonGroup {
        width: 100%;
        display: flex;
        justify-content: flex-end;
    }
`;

const PredictIOFileModal = (props) => {
    const { removeModalData } = props;

    const downloadExampleFile = async (e) => {
        e.preventDefault();
        const res = await axios.get('/api/predictio/download_example', { responseType: 'blob' });
        const blob = new Blob([res.data], {type: 'application/text'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'EXPR.txt';
        a.click();
    }

    return(
        <StyledModal>
            <div className='title'>Accepted File Format</div>
            <div className='content'>
                The PredictIO feature follows strict input file format as described below. <b>Uploading data in incorrect format will cause error in the analysis process.</b>
                <ul>
                    <li>A text file with .txt extension.</li>
                    <li>The maximum file size is 50MB.</li>
                    <li>Data in tabular format. Each column needs to be separated by a tab character.</li>
                    <li>The first line should be column names.</li>
                    <li>The first column should be genes, followed by patient data.</li>
                </ul>
                <button className='download-file' onClick={downloadExampleFile}>Download Example File</button>
            </div>
            <div className='buttonGroup'>
                <StyledButton
                    style={{width: '90px', height: '34px', fontSize: '14px', marginLeft: '10px'}}
                    as="a"
                    onClick={removeModalData}
                    target="_blank"
                    rel="noopener"
                    primary
                >
                    Close
                </StyledButton>
            </div>
        </StyledModal>
    );
}

export default PredictIOFileModal;