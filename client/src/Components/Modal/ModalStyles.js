import styled from 'styled-components';
import { colors } from '../../styles/colors';

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


const StyledModal = styled.div`
  width: 80%;
  height: auto;
  overflow-y: auto;
  align-items: center;
  top: -25%;
  left: 0%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 10px;
  z-index: 9;
  //background: rgb(255, 255, 255);
  background: rgba(96, 96, 96, 0.95);
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.3);
  position: absolute;
  align-content: center;
  font-family: ${"Noto Sans"};
    //color: ${colors.light_gray};
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
    }
`;

export {
    ModalWrapper,
    StyledModal,
    StyledButton
}

