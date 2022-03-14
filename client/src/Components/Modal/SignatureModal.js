import React from 'react';
import { StyledButton } from './ModalStyles';
import styled from 'styled-components';
import { colors } from '../../styles/colors';

const StyledModal = styled.div`
    width: 100%;
    .title {
        font-weight: bold;
        margin-bottom: 20px;
    }
    .line {
        .label {
            padding-right: 10px;
            font-weight: bold;
        }
        td {
            padding-bottom: 10px;
        }
        a {
            color: ${colors.hyper_link};
        }
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

const SignatureModal = (props) => {
    const { modalData, removeModalData } = props;
    
    const renderContent = () => {
        if(modalData){
            if(modalData.signatureType === 'Custom'){
                return(
                    <div className='title'>This is a custom signature.</div>
                );
            }
            return(
                <React.Fragment>
                    <div className='title'>Signature: {modalData.data.signature}</div>
                    <table>
                        <tbody>
                            <tr className='line'>
                                <td className='label'>Association:</td>
                                <td>{modalData.data.association}</td>
                            </tr>
                            <tr className='line'>
                                <td className='label'>Method:</td>
                                <td>{modalData.data.method}</td>
                            </tr>
                            <tr className='line'>
                                <td className='label'>Definition:</td>
                                <td>{modalData.data.definition}</td>
                            </tr>
                            <tr className='line'>
                                <td className='label'>PMID:</td>
                                <td><a href={modalData.data.pmid} target="_blank" rel="noreferrer noopener">{modalData.data.pmid}</a></td>
                            </tr>
                        </tbody>
                    </table>
                </React.Fragment>
            );
        }
        return(
            <div className='title'>Signature description could not be found.</div>
        );
    }
    
    return(
        <StyledModal>
            {
                renderContent()
            }

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

export default SignatureModal;