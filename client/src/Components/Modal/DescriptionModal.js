import React from 'react';
import { StyledButton } from './ModalStyles';

const Modal = (props) => {
    const {
        dataset_id,
        dataset_name,
        title,
        // authors,
        summary,
        pmid
    } = props.modalData.data;

    const removeModalData = props.removeModalData

    return (
        <React.Fragment>
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
                <div>
                    <StyledButton
                        style={{width: '90px', height: '34px', fontSize: '14px', marginLeft: '100px'}}
                        as="a"
                        href={`/dataset/${dataset_id}`}
                        target="_blank"
                        rel="noopener"
                        primary>
                        Info
                    </StyledButton>
                </div>
                <div>
                    <StyledButton
                        style={{width: '90px', height: '34px', fontSize: '14px', marginLeft: '10px'}}
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
                        onClick={removeModalData}
                        target="_blank"
                        rel="noopener"
                        primary>
                        Close
                    </StyledButton>
                </div>
            </div>
        </React.Fragment>
    )

}

export default Modal;
