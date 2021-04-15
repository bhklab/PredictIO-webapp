import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Loader from 'react-loader-spinner';
import axios from 'axios';
import { Messages } from 'primereact/messages';

import colors from '../../styles/colors';
import Layout from '../UtilComponents/Layout';
import StyledForm from '../UtilComponents/StyledForm';
import ActionButton from '../UtilComponents/ActionButton';
import CustomMultiSelect from '../UtilComponents/CustomMultiSelect';
import CustomInputText from '../UtilComponents/CustomInputText';
import CustomDropdown from '../UtilComponents/CustomDropdown';
import GeneSearch from './GeneSearch';

// {value: 'B2M', label: 'B2M'}, {value: 'CD8A', label: 'CD8A'}, {value: 'GZMA', label: 'GZMA'}

const Container = styled.div`
    width: 80%;
    height: calc(100vh + 50px);
`;

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

const BiomarkerEvaluationRequest = () => {
    const messages = useRef(null);

    const [parameters, setParameters] = useState({
        gene: [],
        dataType: '',
        sex: [],
        primary: [],
        drugType: [],
        sequencingType: [],
        study: [],
        email: '',
        submitting: false
    });

    const [dataTypeOptions, setDataTypeOptions] = useState({options: [], disabled: true});
    const [sexOptions, setSexOptions] = useState({options: [], disabled: true});
    const [primaryOptions, setPrimaryOptions] = useState({options: [], disabled: true});
    const [drugTypeOptions, setDrugTypeOptions] = useState({options: [], disabled: true});
    const [sequencingOptions, setSequencingOptions] = useState({options: [], disabled: true});
    const [studyOptions, setStudyOptions] = useState({options: [], disabled: true});

    const disableSubmit = () => {
        const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        return(
            parameters.study.length === 0 || 
            parameters.sex.length === 0 ||
            parameters.primary.length === 0 ||
            parameters.drugType.length === 0 ||
            parameters.dataType.length === 0 ||
            parameters.sequencingType.length === 0 ||
            parameters.email.length === 0 ||
            !regex.test(parameters.email) ||
            parameters.submitting
        )
    }

    const submitRequest = async (e) => {
        e.preventDefault();
        setParameters({...parameters, submitting: true});
        console.log(parameters);
        let dataType = '';
        switch(parameters.dataType){
            case 'expression':
                dataType = 'EXP';
                break;
            case 'snp':
                dataType = 'SNP';
                break;
            case 'cna':
                dataType = 'CNA';
                break;
        }
        const res = await axios.post('/api/explore/biomarker/request', {
            ...parameters, 
            gene: parameters.gene.map(g => g.name),
            dataType: dataType
        });
        console.log(res.data);
        setParameters({...parameters, submitting: false});
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
                    sticky: true 
                }
            ]);
        }
    }

    const getDropdownOptions = async (dropdownName, paramStr) => {
        let uri = `/api/dropdown_option/clinical_data/${dropdownName}?${paramStr}`;
        console.log(uri);
        const res = await axios.get(uri);
        console.log(res.data);

        switch(dropdownName){
            case 'datatype':
                setDataTypeOptions({options: res.data, disabled: false});
                break;
            case 'sex':
                setSexOptions({options: res.data, disabled: false});
                break;
            case 'primary':
                setPrimaryOptions({options: res.data, disabled: false});
                break;
            case 'drugtype':
                setDrugTypeOptions({options: res.data, disabled: false});
                break;
            case 'sequencing':
                setSequencingOptions({options: res.data, disabled: false});
                break;
            case 'study':
                setStudyOptions({options: res.data, disabled: false});
                setParameters({...parameters, study: res.data.map(item => item.value)});
                break;
            default:
                break;
        }
    }

    const buildQueryStr = (paramList, paramName) => {
        let str = ''
        paramList.forEach((item, i) => {
            console.log(item);
            str = str.concat(`${paramName}=${item}${i < paramList.length - 1 ? '&' : ''}`);
        });
        return str;
    }

    useEffect(() => {
        // reset parameters and disable dropdowns
        setParameters({...parameters, dataType: [], sex: [], primary: [], drugType: [], sequencingType: [], study: []});
        setDataTypeOptions({options: [], disabled: true});
        setSexOptions({options: [], disabled: true});
        setPrimaryOptions({options: [], disabled: true});
        setDrugTypeOptions({options: [], disabled: true});
        setSequencingOptions({options: [], disabled: true});
        setStudyOptions({options: [], disabled: true});
        if(parameters.gene.length > 0){
            // build query parameter string
            let paramStr = buildQueryStr(parameters.gene.map(g => g.value), 'gene');
            // get available data type options and enable the dropdown
            getDropdownOptions('datatype', paramStr);
        }
    }, [parameters.gene]);

    useEffect(() => {
        // reset parameters and disable dropdowns
        setParameters({...parameters, sex: [], primary: [], drugType: [], sequencingType: [], study: []});
        setSexOptions({options: [], disabled: true});
        setPrimaryOptions({options: [], disabled: true});
        setDrugTypeOptions({options: [], disabled: true});
        setSequencingOptions({options: [], disabled: true});
        setStudyOptions({options: [], disabled: true});
        if(parameters.dataType.length > 0){
            // build query parameter string
            let paramStr = buildQueryStr(parameters.gene.map(g => g.value), 'gene');
            paramStr = paramStr.concat(`&datatype=${parameters.dataType}`);
            // get available data type options and enable the dropdown
            getDropdownOptions('sex', paramStr);
        }
    }, [parameters.dataType]);

    useEffect(() => {
        // reset parameters and disable dropdowns
        setParameters({...parameters, primary: [], drugType: [], sequencingType: [], study: []});
        setPrimaryOptions({options: [], disabled: true});
        setDrugTypeOptions({options: [], disabled: true});
        setSequencingOptions({options: [], disabled: true});
        setStudyOptions({options: [], disabled: true});
        if(parameters.sex.length > 0){
            // build query parameter string
            let paramStr = buildQueryStr(parameters.gene.map(g => g.value), 'gene');
            paramStr = paramStr.concat(`&datatype=${parameters.dataType}`);
            paramStr = paramStr.concat(`&${buildQueryStr(parameters.sex, 'sex')}`);
            // get available data type options and enable the dropdown
            getDropdownOptions('primary', paramStr);
        }
    }, [parameters.sex]);

    useEffect(() => {
        // reset parameters and disable dropdowns
        setParameters({...parameters, drugType: [], sequencingType: [], study: []});
        setDrugTypeOptions({options: [], disabled: true});
        setSequencingOptions({options: [], disabled: true});
        setStudyOptions({options: [], disabled: true});
        if(parameters.primary.length > 0){
            // build query parameter string
            let paramStr = buildQueryStr(parameters.gene.map(g => g.value), 'gene');
            paramStr = paramStr.concat(`&datatype=${parameters.dataType}`);
            paramStr = paramStr.concat(`&${buildQueryStr(parameters.sex, 'sex')}`);
            paramStr = paramStr.concat(`&${buildQueryStr(parameters.primary, 'primary')}`);
            // get available data type options and enable the dropdown
            getDropdownOptions('drugtype', paramStr);
        }
    }, [parameters.primary]);

    useEffect(() => {
        if(parameters.drugType.length > 0){
            // reset parameters and disable dropdowns
            setParameters({...parameters, sequencingType: [], study: []});
            setSequencingOptions({options: [], disabled: true});
            setStudyOptions({options: [], disabled: true});
            // build query parameter string
            let paramStr = buildQueryStr(parameters.gene.map(g => g.value), 'gene');
            paramStr = paramStr.concat(`&datatype=${parameters.dataType}`);
            paramStr = paramStr.concat(`&${buildQueryStr(parameters.sex, 'sex')}`);
            paramStr = paramStr.concat(`&${buildQueryStr(parameters.primary, 'primary')}`);
            paramStr = paramStr.concat(`&${buildQueryStr(parameters.drugType, 'drugtype')}`);
            // get available data type options and enable the dropdown
            getDropdownOptions('sequencing', paramStr);
        }
    }, [parameters.drugType]);

    useEffect(() => {
        // reset parameters and disable dropdowns
        setParameters({...parameters, study: []});
        setStudyOptions({options: [], disabled: true});
        if(parameters.sequencingType.length > 0){
            // build query parameter string
            let paramStr = buildQueryStr(parameters.gene.map(g => g.value), 'gene');
            paramStr = paramStr.concat(`&datatype=${parameters.dataType}`);
            paramStr = paramStr.concat(`&${buildQueryStr(parameters.sex, 'sex')}`);
            paramStr = paramStr.concat(`&${buildQueryStr(parameters.primary, 'primary')}`);
            paramStr = paramStr.concat(`&${buildQueryStr(parameters.drugType, 'drugtype')}`);
            paramStr = paramStr.concat(`&${buildQueryStr(parameters.sequencingType, 'sequencing')}`);
            // get available data type options and enable the dropdown
            getDropdownOptions('study', paramStr);
        }
    }, [parameters.sequencingType]);

    return(
        <Layout>
            <Container>
                <h4>Biomarker Evaluation</h4>
                <StyledMessages ref={messages} />
                <StyledForm flexDirection='column'>
                    <div className='formField'>
                        <div className='label'>Search for Gene(s): </div>
                        <GeneSearch 
                            className='input'
                            selectedGenes={parameters.gene}
                            onChange={(e) => {setParameters({...parameters, gene: e.value})}}
                        />
                    </div>
                    <div className='formField'>
                        <div className='label'>Data Type: </div> 
                        <CustomDropdown
                            className='input'
                            value={parameters.dataType}
                            options={dataTypeOptions.options} 
                            onChange={(e) => {setParameters({...parameters, dataType: e.value})}} 
                            filter={true}
                            checkbox={true}
                            placeholder='Select...'
                            disabled={dataTypeOptions.disabled}
                        />
                    </div>
                    <div className='formField'>
                        <div className='label'>Sex: </div> 
                        <CustomMultiSelect 
                            className='input'
                            value={parameters.sex}
                            options={sexOptions.options} 
                            onChange={(e) => {setParameters({...parameters, sex: e.value})}} 
                            filter={true}
                            checkbox={true}
                            placeholder='Select...'
                            disabled={sexOptions.disabled}
                        />
                    </div>
                    <div className='formField'>
                        <div className='label'>Primary Tissue: </div> 
                        <CustomMultiSelect 
                            className='input'
                            value={parameters.primary}
                            options={primaryOptions.options} 
                            onChange={(e) => {setParameters({...parameters, primary: e.value})}} 
                            filter={true}
                            checkbox={true}
                            placeholder='Select...'
                            disabled={primaryOptions.disabled}
                        />
                    </div>
                    <div className='formField'>
                        <div className='label'>Drug Type: </div> 
                        <CustomMultiSelect 
                            className='input'
                            value={parameters.drugType}
                            options={drugTypeOptions.options} 
                            onChange={(e) => {setParameters({...parameters, drugType: e.value})}} 
                            filter={true}
                            checkbox={true}
                            placeholder='Select...'
                            disabled={drugTypeOptions.disabled}
                        />
                    </div>
                    <div className='formField'>
                        <div className='label'>Sequencing Type: </div> 
                        <CustomMultiSelect 
                            className='input'
                            value={parameters.sequencingType}
                            options={sequencingOptions.options} 
                            onChange={(e) => {setParameters({...parameters, sequencingType: e.value})}} 
                            filter={true}
                            checkbox={true}
                            placeholder='Select...'
                            disabled={sequencingOptions.disabled}
                        />
                    </div>
                    <div className='formField'>
                        <div className='label'>Studies: </div> 
                        <CustomMultiSelect 
                            className='input'
                            value={parameters.study}
                            options={studyOptions.options} 
                            onChange={(e) => {setParameters({...parameters, study: e.value})}} 
                            filter={true}
                            checkbox={true}
                            placeholder='Select...'
                            disabled={studyOptions.disabled}
                        />
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
                            onClick={(e) => {setParameters({...parameters, gene: [], email: ''})}}
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

export default BiomarkerEvaluationRequest;