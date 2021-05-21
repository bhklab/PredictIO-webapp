import React from 'react';
import styled from 'styled-components';
import Modal from "../Modal/DescriptionModal";
import colors from "../../styles/colors";


const ModalWrapper = styled.div`
  justify-content: space-between;
  alignment: center;
  margin-top: -750px;
  margin-left: 170px;
  width: 100%;
  height: 100%;
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
  background: #cdcdcd;
  color: #000;
  display: grid;
  grid-template-columns: 1fr;
  position: relative;
  z-index: 10;
  border-radius: 10px;
  color: ${colors.gray_text};
`;


const ModalContainer = (props) => {
    const { modalData, removeModalData } = props;
    return(
        <ModalWrapper>
            {
                <Modal modalData={modalData}
                       removeModalData = {removeModalData}>
                </Modal>
            }
        </ModalWrapper>
    );
};

export default ModalContainer;
