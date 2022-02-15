import React from 'react';
import DatasetModal from "../Modal/DescriptionModal";
import PredictIOFileModal from '../Modal/PredictIOFileModal';
import { StyledModal, ModalWrapper } from '../Modal/ModalStyles';

const ModalContainer = (props) => {
    const { modalData, removeModalData, modalType } = props;
    return(
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
            </StyledModal>
        </ModalWrapper>
    );
};

export default ModalContainer;
