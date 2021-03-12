import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import axios from 'axios';

import Layout from '../UtilComponents/Layout';
import StyledForm from '../UtilComponents/StyledForm';
import ActionButton from '../UtilComponents/ActionButton';
import CustomMultiSelect from '../UtilComponents/CustomMultiSelect';
import CustomInputText from '../UtilComponents/CustomInputText';

const StyledPredict = styled.div`
    width: 50%;
`;

const studyOptions = [
    {value: 'Braun', label: 'Braun'},
    {value: 'Damotte', label: 'Damotte'},
    {value: 'Fumet.1', label: 'Fumet.1'},
    {value: 'Fumet.2', label: 'Fumet.2'},
    {value: 'Hugo', label: 'Hugo'},
    {value: 'Hwang', label: 'Hwang'},
    {value: 'Jerby_Arnon', label: 'Jerby_Arnon'},
    {value: 'Jung', label: 'Jung'},
    {value: 'Liu', label: 'Liu'},
    {value: 'Mariathasan', label: 'Mariathasan'},
    {value: 'Miao.1', label: 'Miao.1'},
    {value: 'Miao.2', label: 'Miao.2'},
    {value: 'Nathanson', label: 'Nathanson'},
    {value: 'Riaz', label: 'Riaz'},
    {value: 'Rizvi.15', label: 'Rizvi.15'},
    {value: 'Rizvi.18', label: 'Rizvi.18'},
    {value: 'Roh', label: 'Roh'},
    {value: 'Samstein', label: 'Samstein'},
    {value: 'Snyder', label: 'Snyder'},
    {value: 'Van_Allen', label: 'Van_Allen'},
];
const sexOptions = [
    {value: 'M', label: 'Male'}, {value: 'F', label: 'Female'}
];
const primaryOptions = [
    {value: 'Melanoma', label: 'Melanoma'}, {value: 'Lung', label: 'Lung'}, {value: 'Kidney', label: 'Kidney'}
];
const drugOptions = [
    {value: 'PD-1/PD-L1', label: 'PD-1/PD-L1'}, {value: 'CTLA4', label: 'CTLA4'}
];
const dataOptions = [
    {value: 'EXP', label: 'EXP'},
];
const sequencingOptions  = [
    {value: 'FPKM', label: 'FPKM'}, {value: 'TPM', label: 'TPM'}
];
const geneOptions = [
    {value: 'B2M', label: 'B2M'}, {value: 'CD8A', label: 'CD8A'}, {value: 'GZMA', label: 'GZMA'}
];

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

    const submitRequest = async () => {
        const res = await axios.post('/api/predict', parameters);
        console.log(res.data);
    }

    return(
        <Layout>
            <StyledPredict>
                <h4>IOPredict</h4>
                <StyledForm flexDirection='column'>
                    <div className='formField'>
                        <div className='label'>Studies: </div> 
                        <CustomMultiSelect 
                            className='select'
                            value={parameters.study}
                            options={studyOptions} 
                            onChange={(e) => {setParameters({...parameters, study: e.value})}} 
                            filter={true}
                            placeholder='Select...'
                        />
                    </div>
                    <div className='formField'>
                        <div className='label'>Sex: </div> 
                        <CustomMultiSelect 
                            className='select'
                            value={parameters.sex}
                            options={sexOptions} 
                            onChange={(e) => {setParameters({...parameters, sex: e.value})}} 
                            filter={true}
                            placeholder='Select...'
                        />
                    </div>
                    <div className='formField'>
                        <div className='label'>Primary Tissue: </div> 
                        <CustomMultiSelect 
                            className='select'
                            value={parameters.primary}
                            options={primaryOptions} 
                            onChange={(e) => {setParameters({...parameters, primary: e.value})}} 
                            filter={true}
                            placeholder='Select...'
                        />
                    </div>
                    <div className='formField'>
                        <div className='label'>Drug Type: </div> 
                        <CustomMultiSelect 
                            className='select'
                            value={parameters.drugType}
                            options={drugOptions} 
                            onChange={(e) => {setParameters({...parameters, drugType: e.value})}} 
                            filter={true}
                            placeholder='Select...'
                        />
                    </div>
                    <div className='formField'>
                        <div className='label'>Data Type: </div> 
                        <CustomMultiSelect 
                            className='select'
                            value={parameters.dataType}
                            options={dataOptions} 
                            onChange={(e) => {setParameters({...parameters, dataType: e.value})}} 
                            filter={true}
                            placeholder='Select...'
                        />
                    </div>
                    <div className='formField'>
                        <div className='label'>Sequencing Type: </div> 
                        <CustomMultiSelect 
                            className='select'
                            value={parameters.sequencingType}
                            options={sequencingOptions} 
                            onChange={(e) => {setParameters({...parameters, sequencingType: e.value})}} 
                            filter={true}
                            placeholder='Select...'
                        />
                    </div>
                    <div className='formField'>
                        <div className='label'>Gene: </div> 
                        <CustomMultiSelect 
                            className='select'
                            value={parameters.gene}
                            options={geneOptions} 
                            onChange={(e) => {setParameters({...parameters, gene: e.value})}} 
                            filter={true}
                            placeholder='Select...'
                        />
                    </div>
                    <div className='formField'>
                        <div className='label'>Email: </div> 
                        <CustomInputText 
                            className='select'
                            value={parameters.email}
                            onChange={(e) => {setParameters({...parameters, email: e.target.value})}} 
                        />
                    </div>
                    <div className='formField buttonField'>
                        <ActionButton 
                            onClick={(e) => {submitRequest()}} 
                            text='Submit' 
                            style={{width: '90px', height: '34px', fontSize: '14px'}} 
                        />
                    </div>
                </StyledForm>
            </StyledPredict>
        </Layout>
    );
}

export default Predict;