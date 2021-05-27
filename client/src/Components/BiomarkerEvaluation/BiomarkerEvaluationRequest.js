import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Loader from 'react-loader-spinner';
import axios from 'axios';
import { Messages } from 'primereact/messages';
import { usePromiseTracker, trackPromise } from "react-promise-tracker";

import colors from '../../styles/colors';
import Layout from '../UtilComponents/Layout';
import StyledForm from '../UtilComponents/StyledForm';
import ActionButton from '../UtilComponents/ActionButton';
import CustomMultiSelect from '../UtilComponents/CustomMultiSelect';
import CustomInputText from '../UtilComponents/CustomInputText';
import CustomDropdown from '../UtilComponents/CustomDropdown';
import GeneSearch from './GeneSearch';

const Container = styled.div`
    width: 80%;
    height: calc(100vh + 50px);
`;

const LoaderOverlay = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    z-index: 9999;
    background-color: #cccccc;
    opacity: 0.6;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
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

const dataTypeOptions = [
    {label: 'CNA', value: 'cna'},
    {label: 'Expression', value: 'expression'},
    {label: 'SNV', value: 'snv'}
];

const BiomarkerEvaluationRequest = () => {
    const messages = useRef(null);
    const { promiseInProgress } = usePromiseTracker();

    const [parameters, setParameters] = useState({
        dataType: '',
        gene: [],
        sex: [],
        primary: [],
        drugType: [],
        sequencingType: [],
        study: [],
        email: '',
        submitting: false
    });

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
            default:
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
        let uri = `/api/explore/biomarker/query/${dropdownName}?${paramStr}`;
        console.log(uri);
        const res = await trackPromise(axios.get(uri));
        console.log(res.data);

        switch(dropdownName){
            case 'sex':
                setSexOptions({options: res.data.sex, disabled: false});
                setPrimaryOptions({options: res.data.primary, disabled: false});
                setDrugTypeOptions({options: res.data.drugtype, disabled: false});
                setSequencingOptions({options: res.data.sequencing, disabled: false});
                setStudyOptions({options: res.data.study, disabled: false});
                break;
            case 'primary':
                setPrimaryOptions({options: res.data.primary, disabled: false});
                setDrugTypeOptions({options: res.data.drugtype, disabled: false});
                setSequencingOptions({options: res.data.sequencing, disabled: false});
                setStudyOptions({options: res.data.study, disabled: false});
                break;
            case 'drugtype':
                setDrugTypeOptions({options: res.data.drugtype, disabled: false});
                setSequencingOptions({options: res.data.sequencing, disabled: false});
                setStudyOptions({options: res.data.study, disabled: false});
                break;
            case 'sequencing':
                setSequencingOptions({options: res.data.sequencing, disabled: false});
                setStudyOptions({options: res.data.study, disabled: false});
                break;
            case 'study':
                setStudyOptions({options: res.data.study, disabled: false});
                break;
            default:
                break;
        }

        return res.data;
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
        setParameters({...parameters, gene: [], sex: [], primary: [], drugType: [], sequencingType: [], study: []});
        setSexOptions({options: [], disabled: true});
        setPrimaryOptions({options: [], disabled: true});
        setDrugTypeOptions({options: [], disabled: true});
        setSequencingOptions({options: [], disabled: true});
        setStudyOptions({options: [], disabled: true});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parameters.dataType]);

    useEffect(() => {
        const getDownstreamOptions = async () => {
            // reset parameters and disable dropdowns
            setParameters({...parameters, sex: [], primary: [], drugType: [], sequencingType: [], study: []});
            setSexOptions({options: [], disabled: true});
            setPrimaryOptions({options: [], disabled: true});
            setDrugTypeOptions({options: [], disabled: true});
            setSequencingOptions({options: [], disabled: true});
            setStudyOptions({options: [], disabled: true});
            if(parameters.gene.length > 0){
                // build query parameter string
                let paramStr = buildQueryStr(parameters.gene.map(g => g.value), 'gene');
                paramStr = paramStr.concat(`&datatype=${parameters.dataType}`);
                let options = await getDropdownOptions('sex', paramStr);
                setParameters({
                    ...parameters, 
                    sex: options.sex.map(item => item.value),
                    primary: options.primary.map(item => item.value),
                    drugType: options.drugtype.map(item => item.value),
                    sequencingType: options.sequencing.map(item => item.value),
                    study: options.study.map(item => item.value)
                });
            }
        }
        getDownstreamOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parameters.gene]);

    const getDownstreamSex = async (sex) => {
        // reset downstream dropdowns
        setPrimaryOptions({options: [], disabled: true});
        setDrugTypeOptions({options: [], disabled: true});
        setSequencingOptions({options: [], disabled: true});
        setStudyOptions({options: [], disabled: true});
        if(parameters.sex.length > 0){
            // build query parameter string
            let paramStr = buildQueryStr(parameters.gene.map(g => g.value), 'gene');
            paramStr = paramStr.concat(`&datatype=${parameters.dataType}`);
            paramStr = paramStr.concat(`&${buildQueryStr(sex, 'sex')}`);
            // get available options and enable downstream dropdowns
            let options = await getDropdownOptions('primary', paramStr);
            setParameters({
                ...parameters,
                sex: sex, 
                primary: options.primary.map(item => item.value),
                drugType: options.drugtype.map(item => item.value),
                sequencingType: options.sequencing.map(item => item.value),
                study: options.study.map(item => item.value)
            });
        }else{
            setParameters({...parameters, primary: [], drugType: [], sequencingType: [], study: []});
        }
    };

    const getDownStreamPrimary = async (primary) => {
        // reset downstream dropdowns
        setDrugTypeOptions({options: [], disabled: true});
        setSequencingOptions({options: [], disabled: true});
        setStudyOptions({options: [], disabled: true});
        if(parameters.primary.length > 0){
            // build query parameter string
            let paramStr = buildQueryStr(parameters.gene.map(g => g.value), 'gene');
            paramStr = paramStr.concat(`&datatype=${parameters.dataType}`);
            paramStr = paramStr.concat(`&${buildQueryStr(parameters.sex, 'sex')}`);
            paramStr = paramStr.concat(`&${buildQueryStr(primary, 'primary')}`);
            // get available options and enable downstream dropdowns
            let options = await getDropdownOptions('drugtype', paramStr);
            setParameters({
                ...parameters,
                primary: primary,
                drugType: options.drugtype.map(item => item.value),
                sequencingType: options.sequencing.map(item => item.value),
                study: options.study.map(item => item.value)
            });
        }else{
            setParameters({...parameters, drugType: [], sequencingType: [], study: []});
        }
    };

    const getDownstreamDrugType = async (drugType) => {
        if(parameters.drugType.length > 0){
            // reset downstream dropdowns
            setSequencingOptions({options: [], disabled: true});
            setStudyOptions({options: [], disabled: true});
            // build query parameter string
            let paramStr = buildQueryStr(parameters.gene.map(g => g.value), 'gene');
            paramStr = paramStr.concat(`&datatype=${parameters.dataType}`);
            paramStr = paramStr.concat(`&${buildQueryStr(parameters.sex, 'sex')}`);
            paramStr = paramStr.concat(`&${buildQueryStr(parameters.primary, 'primary')}`);
            paramStr = paramStr.concat(`&${buildQueryStr(drugType, 'drugtype')}`);
            // get available options and enable downstream dropdowns
            let options = await getDropdownOptions('sequencing', paramStr);
            setParameters({
                ...parameters,
                drugType: drugType,
                sequencingType: options.sequencing.map(item => item.value),
                study: options.study.map(item => item.value)
            });
        }else{
            setParameters({...parameters, sequencingType: [], study: []});
        }
    };

    const getDownstreamSequencing = async (sequencingType) => {
        // reset downstream dropdowns
        setStudyOptions({options: [], disabled: true});
        if(parameters.sequencingType.length > 0){
            // build query parameter string
            let paramStr = buildQueryStr(parameters.gene.map(g => g.value), 'gene');
            paramStr = paramStr.concat(`&datatype=${parameters.dataType}`);
            paramStr = paramStr.concat(`&${buildQueryStr(parameters.sex, 'sex')}`);
            paramStr = paramStr.concat(`&${buildQueryStr(parameters.primary, 'primary')}`);
            paramStr = paramStr.concat(`&${buildQueryStr(parameters.drugType, 'drugtype')}`);
            paramStr = paramStr.concat(`&${buildQueryStr(sequencingType, 'sequencing')}`);
            // get available options and enable downstream dropdowns
            let options = await getDropdownOptions('study', paramStr);
            setParameters({
                ...parameters,
                sequencingType: sequencingType,
                study: options.study.map(item => item.value)
            });
        }else{
            setParameters({...parameters, study: []});
        }
    };

    return(
        <Layout>
            {
                promiseInProgress && 
                <LoaderOverlay>
                    <Loader type="Oval" color={colors.blue} height={150} width={150}/>
                </LoaderOverlay>
            }
            <Container>
                <h4>Biomarker Evaluation</h4>
                <StyledMessages ref={messages} />
                <StyledForm flexDirection='column'>
                    <div className='formField'>
                        <div className='label'>Data Type: </div> 
                        <CustomDropdown
                            className='input'
                            value={parameters.dataType}
                            options={dataTypeOptions} 
                            onChange={(e) => {setParameters({...parameters, dataType: e.value})}} 
                            filter={true}
                            checkbox={true}
                            placeholder='Select...'
                            disabled={false}
                        />
                    </div>
                    <div className='formField'>
                        <div className='label'>Search for Gene(s): </div>
                        <GeneSearch 
                            className='input'
                            datatype={parameters.dataType}
                            selectedGenes={parameters.gene}
                            onChange={(e) => {setParameters({...parameters, gene: e.value})}}
                        />
                    </div>
                    <div className='formField'>
                        <div className='label'>Sex: </div> 
                        <CustomMultiSelect 
                            className='input'
                            value={parameters.sex}
                            options={sexOptions.options} 
                            onChange={(e) => {getDownstreamSex(e.value)}} 
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
                            onChange={(e) => {getDownStreamPrimary(e.value)}} 
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
                            onChange={(e) => {getDownstreamDrugType(e.value)}} 
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
                            onChange={(e) => {getDownstreamSequencing(e.value)}} 
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
                            onClick={(e) => {setParameters({...parameters, dataType: '', email: ''})}}
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