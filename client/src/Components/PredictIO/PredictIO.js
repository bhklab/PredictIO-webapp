import React, { useRef, useState } from 'react';
import axios from 'axios';
import uuid from 'react-uuid'
import styled from 'styled-components';
import { Messages } from 'primereact/messages';
import Layout from '../UtilComponents/Layout';
import { Container } from '../../styles/StyledComponents';
import StyledForm from '../UtilComponents/StyledForm';
import CustomInputText from '../UtilComponents/CustomInputText';
import ActionButton from '../UtilComponents/ActionButton';
import { colors } from '../../styles/colors';
import Loader from 'react-loader-spinner';

const StyledMessages = styled(Messages)`
    .p-message {
        font-size: 12px;
        .p-message-icon {
            font-size: 18px;
            font-weight: bold;
        }
        .p-message-summary {
            font-size: 14px;
            font-weight: bold;
            padding-right: 10px;
        }
    }
`;

const StyledInputFile = styled.div`
    width: 100%;
`;

const PredictIO = () => {
    const messages = useRef(null);
    const inputFileRef = useRef();
    const [uploading, setUploading] = useState(false);
    const [parameters, setParameters] = useState({
        email: '',
        analysis_id: '',
        fileUploaded: false,
        submitting: false
    });

    const disableSubmit = () => {
        const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        return(
            parameters.analysis_id.length === 0 ||
            !parameters.fileUploaded ||
            parameters.email.length === 0 ||
            !regex.test(parameters.email)
        );
    }

    const checkFile = (e) => {
        e.preventDefault();
        let filename = inputFileRef.current.files[0].name;
        let regex = new RegExp("([a-zA-Z0-9\s_\\.\-:])+(.txt)$");
        if(regex.test(filename)){
            setParameters({
                ...parameters,
                analysis_id: uuid()
            });
        }else{
            messages.current.show([
                { 
                    severity: 'error', 
                    summary: 'Invalid File', 
                    detail: 'Your file needs to be a text file with .txt extension', 
                    sticky: false
                }
            ]);
            e.target.value = null;
        }
    }

    const uploadFile = async (e) => {
        e.preventDefault();
        setUploading(true);
        let form = new FormData();
        try{
            form.append('file', inputFileRef.current.files[0]);
            form.append('filename', parameters.analysis_id)
            const res = await axios.post('/api/upload_file', form);
            console.log(res.data);
            setParameters(prev => ({
                ...prev,
                fileUploaded: true
            }));
            messages.current.show([
                { 
                    severity: 'success', 
                    summary: 'File has been uploaded', 
                    detail: 'Enter your email and submit a request to obtain PredictIO values.', 
                    sticky: false,
                    life: 3000
                }
            ]);
        }catch(error){
            console.log(error);
            messages.current.show([
                { 
                    severity: 'error', 
                    summary: 'Unable to upload the data tile', 
                    detail: 'Please try again, or contact support@predictio.ca.', 
                    sticky: true
                }
            ]);
        }finally{
            setUploading(false);
        }
    }

    const submitRequest = async (e) => {
        e.preventDefault();
        setParameters({...parameters, submitting: true});
        const res = await axios.post('/api/analysis/request', {
            ...parameters, 
            analysis_type: 'predictio'
        });
        console.log(res.data);
        setParameters({
            analysis_id: '',
            fileUploaded: false,
            submitting: false
        });
        if(res.data.error){
            messages.current.show([
                { 
                    severity: 'error', 
                    summary: 'Unable to submit request', 
                    detail: 'Please try again, or contact support@predictio.ca.', 
                    sticky: true
                }
            ]);
        }else{
            messages.current.show([
                { 
                    severity: 'success', 
                    summary: 'Request has been submitted', 
                    detail: 'You will receive an email notification once your request is processed.', 
                    sticky: false,
                    life: 3000
                }
            ]);
        }
    }

    return(
        <Layout>
            <Container>
                <h4>Get PredictIO Values</h4>
                <StyledMessages ref={messages} />
                <StyledForm flexDirection='column'>
                    <div className='formField'>
                        <div className='label'>Upload a data file: </div>
                        <StyledInputFile>
                            <input 
                                type='file' 
                                name='file' 
                                ref={inputFileRef} 
                                onChange={checkFile} 
                            />
                        </StyledInputFile>
                        {
                            uploading ?
                            <Loader type="Oval" color={colors.blue} height={35} width={35}/>
                            :
                            <ActionButton 
                                onClick={uploadFile} 
                                text='Upload' 
                                style={{width: '90px', height: '34px', fontSize: '14px'}} 
                                disabled={parameters.analysis_id.length === 0 ? true : false}
                            />
                        }
                    </div>
                    <div className='formField'>
                        <div className='label'>Email: </div> 
                        <CustomInputText 
                            className='input'
                            value={parameters.email}
                            onChange={(e) => {setParameters({...parameters, email: e.target.value})}} 
                        />
                    </div>
                    <div className='formField buttonField'>
                        <ActionButton
                            onClick={(e) => {setParameters({...parameters, email: ''})}}
                            text='Reset'
                            type='reset'
                            style={{width: '90px', height: '34px', fontSize: '14px', marginRight: '10px'}}
                        />
                        {
                            parameters.submitting ?
                            <Loader type="Oval" color={colors.blue} height={35} width={35}/>
                            :
                            <ActionButton 
                                onClick={submitRequest} 
                                text='Submit' 
                                style={{width: '90px', height: '34px', fontSize: '14px'}} 
                                disabled={disableSubmit()}
                            />
                        }
                    </div>
                </StyledForm>
            </Container>
        </Layout>
    );
}

export default PredictIO;