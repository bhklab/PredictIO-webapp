import React from 'react';
import styled from 'styled-components';
import { colors } from '../../styles/colors';

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


const StyledModal = styled.div`
  width: 80%;
  height: auto;
  overflow-y: scroll;
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


// const Heading = styled.h4`
//   display: inline;
//   margin-top:40px;
// `;


export const Modal = (props) => {
    const {
        dataset_name, 
        title, 
        // authors, 
        summary, 
        pmid
    } = props.modalData.data;
    const removeModalData = props.removeModalData

    const closeModal = () => {
        removeModalData();
    }

    return (
        <StyledModal>
            <div>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <h3>{dataset_name} Study</h3>
                </div>
                <div><h4>{title}</h4></div>
                <div>{summary}</div><br/>
                {/*<div><Heading>Authors: </Heading> {authors}</div><br/>*/}
                {/*<div><Heading>Summary: </Heading> {summary}</div><br/>*/}
            </div>
            <br />
            <div style={{ display: 'flex', float: 'center', position:"absolute", right:"20px", bottom:"10px"}}>
            {/*<div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>*/}
                <div>
                    <StyledButton
                        style={{width: '90px', height: '34px', fontSize: '14px', marginLeft: '100px'}}
                        // style={{width: '90px', height: '34px', fontSize: '14px'}}
                        as="a"
                        href={pmid}
                        target="_blank"
                        rel="noopener"
                        primary>
                        Pubmed
                    </StyledButton>
                </div>
                <div>
                    <StyledButton
                        style={{width: '90px', height: '34px', fontSize: '14px', marginLeft: '10px'}}
                        as="a"
                        onClick={closeModal}
                        target="_blank"
                        rel="noopener"
                        primary>
                        Close
                    </StyledButton>
                </div>
            </div>
        </StyledModal>
    )

}

export default Modal;