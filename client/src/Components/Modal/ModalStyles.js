import styled from 'styled-components';
import { colors } from '../../styles/colors';

const ModalPage = styled.div`
  position: absolute;  
  width: 100%;
  height: calc(100% + 600px);
  left: 0;
  top: 0;
  z-index: 1;
  background-color: ${colors.light_gray};
  opacity: 0.5;
`;

const ModalWrapper = styled.div`
  position: absolute;  
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;


const StyledModal = styled.div`
  width: 80%;
  height: auto;
  overflow-y: auto;
  align-items: center;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 10px;
  z-index: 10;
  background: rgba(96, 96, 96, 0.95);
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.3);
  position: absolute;
  align-content: center;
  font-family: ${"Noto Sans"};
  color: whitesmoke;
`;

const StyledButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    border: none;
    font-weight: normal;
    letter-spacing: 1.5px;
    width: 80px;
    height: 30px;
    background-color: ${colors.blue};
    font-size: 16px;
    color: #ffffff;
    cursor: pointer;
    align-self: flex-end;
    position: relative;
`;

export {
  ModalPage,
  ModalWrapper,
  StyledModal,
  StyledButton
}

