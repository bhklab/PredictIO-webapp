import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../UtilComponents/Layout';
import Loader from 'react-loader-spinner';
import { LoaderContainer } from '../../styles/PlotStyles';
import styled from 'styled-components';
import { Container } from '../../styles/StyledComponents';
import { colors } from '../../styles/colors';
import PieChart from './PieChart';
import BarChart from './BarChart';

const StyledDatasetSummary = styled.table`
    font-size: 12px;
    td {
        padding-bottom: 5px;
    }
    .label {
        width: 120px;
        font-weight: bold;
    }
    .data {
        padding-left: 10px;
    }
`;

const StyledPlotContainer = styled.div`
    .title {
        display: flex;
        align-items: center;
        h4 {
            margin-right: 10px;
        }
    }
`;

const getSortedUniqueItem = (arr, field) => {
    return [...new Set(arr.map(item => item[field]))].sort((a, b) => a.localeCompare(b));
}

const getAgeGroup = (ages) => {
    let ageRanges = ['90+', '85-89', '80-84', '75-79', '70-74', '65-69', '60-64', '55-59', '50-54', '45-49', '40-44', '35-39', '30-34', '25-29', '20-24', '>19'];
    let ageGroups = [{range: 'Unknown', count: ages.filter(age => age === 0).length}];
    ageGroups = ageGroups.concat(ageRanges.map(range => {
        if(range === '90+'){
            return({range: range, count: ages.filter(age => age !== 0 && age >= 90).length});
        }
        if(range === '>19'){
            return({range: range, count: ages.filter(age => age !== 0 && age <= 19).length});
        }
        let nums = range.split('-');
        return({range: range, count: ages.filter(age => age >= nums[0] && age <= nums[1]).length})
    }));
    return ageGroups;
}

const Dataset = () => {
    const { id } = useParams();
    const [dataset, setDataset] = useState({ ready: false });
    
    useEffect(() => {
        const getData = async () => {
            const res = await axios.get(`/api/dataset/${id}`);
            console.log(res.data)
            setDataset({
                name: res.data.dataset.dataset_name,
                authors: res.data.dataset.authors,
                summary: res.data.dataset.summary,
                pmid: res.data.dataset.pmid,
                patients: res.data.dataset_patient,
                ageGroups: getAgeGroup(res.data.dataset_patient.map(patient => patient.age)),
                patient_f: res.data.dataset_patient.filter(item => item.sex === 'F').length,
                patient_m: res.data.dataset_patient.filter(item => item.sex === 'M').length,
                patient_unknown: res.data.dataset_patient.filter(item => item.sex.length === 0).length,
                primary: getSortedUniqueItem(res.data.dataset_patient, 'primary_tissue'),
                drugTypes: getSortedUniqueItem(res.data.dataset_patient, 'drug_type'),
                sequencingTypesDNA: getSortedUniqueItem(res.data.dataset_patient, 'dna').filter(item => item.length > 0).map(item => `${item.toUpperCase()} (DNA)`), 
                sequencingTypesRNA: getSortedUniqueItem(res.data.dataset_patient, 'rna').filter(item => item.length > 0).map(item => `${item.toUpperCase()} (RNA)`), 
                datatype: [
                    {type: 'Expression', available: res.data.dataset_patient.map(item => item.expression).find(item => item === 1)},
                    {type: 'CNA', available: res.data.dataset_patient.map(item => item.cna).find(item => item === 1)},
                    {type: 'SNV', available: res.data.dataset_patient.map(item => item.snv).find(item => item === 1)}
                ],
                num_genes: res.data.num_genes,
                ready: true
            });
        }
        getData();
    }, []);

    return(
        <Layout>
            {
                dataset.ready ?
                <Container>
                    <h3>Dataset: {dataset.name}</h3>
                    <StyledDatasetSummary>
                        <tbody>
                            <tr>
                                <td className='label'>Authors</td>
                                <td className='data'>{dataset.authors}</td>
                            </tr>
                            <tr>
                                <td className='label'>Summary</td>
                                <td className='data'>{dataset.summary}</td>
                            </tr>
                            <tr>
                                <td className='label'>Publication</td>
                                <td className='data'>
                                    <a href={dataset.pmid} target="_blank" rel="noopener noreferrer">{dataset.pmid}</a>
                                </td>
                            </tr>
                            <tr>
                                <td className='label'>Number of Patients</td>
                                <td className='data'>
                                    {dataset.patients.length} (
                                        {dataset.patient_f > 0 ? `F:${dataset.patient_f} ` : ''} 
                                        {dataset.patient_m > 0 ? `M:${dataset.patient_m} ` : ''} 
                                        {dataset.patient_unknown > 0 ? `Unknown:${dataset.patient_unknown}` : ''}
                                    )
                                </td>
                            </tr>
                            <tr>
                                <td className='label'>Number of Genes</td>
                                <td className='data'>{dataset.num_genes}</td>
                            </tr>
                            <tr>
                                <td className='label'>Primary</td>
                                <td className='data'>{dataset.primary.filter(item => item.length > 0).join(', ')}</td>
                            </tr>
                            <tr>
                                <td className='label'>Drug Type</td>
                                <td className='data'>{dataset.drugTypes.filter(item => item.length > 0).join(', ')}</td>
                            </tr>
                            <tr>
                                <td className='label'>Sequencing Type</td>
                                <td className='data'>
                                    {dataset.sequencingTypesDNA.concat(dataset.sequencingTypesRNA).join(', ')}
                                </td>
                            </tr>
                            <tr>
                                <td className='label'>Data Type</td>
                                <td className='data'>
                                    {dataset.datatype.filter(item => item.available === 1).map(item => item.type).join(', ')}
                                </td>
                            </tr>
                        </tbody>
                    </StyledDatasetSummary>
                    <StyledPlotContainer>
                        <BarChart 
                            text='Age'
                            data={{
                                y: dataset.ageGroups.map(item => item.range),
                                x: dataset.ageGroups.map(item => item.count)
                            }}
                        />
                        <PieChart 
                            text='Sex'
                            data={{
                                values: [dataset.patient_f, dataset.patient_m, dataset.patient_unknown],
                                labels: ['F', 'M', 'Unknown'],
                            }}
                        />
                        <PieChart 
                            text='Primary'
                            data={{
                                values: dataset.primary.map(item => dataset.patients.filter(patient => patient.primary_tissue === item).length),
                                labels: dataset.primary.map(item => item.length > 0 ? item : 'Unknown'),
                            }}
                        />
                    </StyledPlotContainer>
                </Container>
                :
                <LoaderContainer>
                    <Loader type="Oval" color={colors.blue} height={80} width={80}/>
                </LoaderContainer>
            }
        </Layout>
    );
}

export default Dataset;