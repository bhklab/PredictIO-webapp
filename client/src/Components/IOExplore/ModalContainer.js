import React from 'react';
import DatasetModal from "../Modal/DescriptionModal";
import SignatureModal from '../Modal/SignatureModal';
import PredictIOFileModal from '../Modal/PredictIOFileModal';
import { StyledModal, ModalWrapper, ModalPage } from '../Modal/ModalStyles';

const ModalContainer = (props) => {
    const { modalData, removeModalData, modalType } = props;
    return(
        <React.Fragment>
            <ModalPage></ModalPage>
            <ModalWrapper>
                <StyledModal>
                {
                    modalType === 'dataset' &&
                    <DatasetModal 
                        modalData={modalData}
                        removeModalData = {removeModalData}
                    />
                }
                {
                    modalType === 'predictIOFile' &&
                    <PredictIOFileModal 
                        removeModalData = {removeModalData}
                    />
                }
                {
                    modalType === 'signature' &&
                    <SignatureModal 
                        modalData={modalData}
                        removeModalData = {removeModalData}
                    />
                }
                </StyledModal>
            </ModalWrapper>
        </React.Fragment>
    );
};

export default ModalContainer;
