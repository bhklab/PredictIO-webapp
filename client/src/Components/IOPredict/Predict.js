import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import axios from 'axios';

import Layout from '../UtilComponents/Layout';
import StyledForm from '../UtilComponents/StyledForm';
import ActionButton from '../UtilComponents/ActionButton';
import CustomMultiSelect from '../UtilComponents/CustomMultiSelect';
import CustomInputText from '../UtilComponents/CustomInputText';
import CustomDropdown from '../UtilComponents/CustomDropdown';
import GeneSearch from './GeneSearch';

// {value: 'B2M', label: 'B2M'}, {value: 'CD8A', label: 'CD8A'}, {value: 'GZMA', label: 'GZMA'}

const StyledPredict = styled.div`
    width: 50%;
`;

const Predict = (props) => {

    const [parameters, setParameters] = useState({
        study: [],
        sex: [],
        primary: [],
        drugType: [],
        dataType: [],
        sequencingType: [],
        gene: [],
        email: ''
    });

    const [dataTypeOptions, setDataTypeOptions] = useState({options: [], disabled: true});
    const [sexOptions, setSexOptions] = useState({options: [], disabled: true});
    const [primaryOptions, setPrimaryOptions] = useState({options: [], disabled: true});
    const [drugTypeOptions, setDrugTypeOptions] = useState({options: [], disabled: true});
    const [sequencingOptions, setSequencingOptions] = useState({options: [], disabled: true});
    const [studyOptions, setStudyOptions] = useState({options: [], disabled: true});

    const disableSubmit = () => {
        return(
            parameters.study.length === 0 || 
            parameters.sex.length === 0 ||
            parameters.primary.length === 0 ||
            parameters.drugType.length === 0 ||
            parameters.dataType.length === 0 ||
            parameters.sequencingType.length === 0 ||
            parameters.email.length === 0
        )
    }

    const submitRequest = async () => {
        const res = await axios.post('/api/predict', parameters);
        console.log(res.data);
    }

    const getDropdownOptions = async (dropdownName, paramName, selected) => {
        let paramStr = '';
        selected.forEach((item, i) => {
            paramStr = paramStr.concat(`${paramName}=${item.value}${i < selected.length - 1 ? '&' : ''}`);
        })
        let uri = `/api/dropdown_option/predict/${dropdownName}?${paramStr}`;
        console.log(uri);
        const res = await axios.get(uri);
        console.log(res.data);

        switch(dropdownName){
            case 'datatype':
                setDataTypeOptions({options: res.data, disabled: false});
                break;
            case 'sex':
                break;
            case 'primary':
                break;
            case 'drugtype':
                break;
            case 'sequencing':
                break;
            case 'study':
                break
            default:
                break;
        }
    }

    useEffect(() => {
        if(parameters.gene.length > 0){
            console.log(parameters.gene);
            // get available data type options and enable the dropdown
            getDropdownOptions('datatype', 'gene', parameters.gene);
        }else{
            // reset all parameters and disable dropdowns
            setDataTypeOptions({options: [], disabled: true});
            setSexOptions({options: [], disabled: true});
            setPrimaryOptions({options: [], disabled: true});
            setDrugTypeOptions({options: [], disabled: true});
            setSequencingOptions({options: [], disabled: true});
            setStudyOptions({options: [], disabled: true});
        }
    }, [parameters.gene]);

    return(
        <Layout>
            <StyledPredict>
                <h4>IOPredict</h4>
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
                            onClick={(e) => {submitRequest()}} 
                            text='Submit' 
                            style={{width: '90px', height: '34px', fontSize: '14px'}} 
                            disabled={disableSubmit()}
                        />
                    </div>
                </StyledForm>
            </StyledPredict>
        </Layout>
    );
}

export default Predict;