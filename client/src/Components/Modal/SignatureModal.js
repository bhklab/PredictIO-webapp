import React from 'react';
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

const SignatureModal = (props) => {
    const { removeModalData } = props;
    return(
        
        <StyledModal>
            <div className='title'>Signature</div>
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