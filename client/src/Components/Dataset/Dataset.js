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
    margin-top: 20px;
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
    let ageRanges = ['>19', '20-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60-64', '65-69', '70-74', '75-79', '80-84', '85-89', '90+'];
    let ageGroups = [];
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
    ageGroups.push({range: 'Unknown', count: ages.filter(age => age === 0).length});
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
                sexGroups: {
                    female: res.data.dataset_patient.filter(item => item.sex === 'F').length, 
                    male: res.data.dataset_patient.filter(item => item.sex === 'M').length,
                    unknown: res.data.dataset_patient.filter(item => item.sex.length === 0).length
                },
                primary: getSortedUniqueItem(res.data.dataset_patient, 'primary_tissue'),
                drugTypes: getSortedUniqueItem(res.data.dataset_patient, 'drug_type'),
                sequencingTypesDNA: getSortedUniqueItem(res.data.dataset_patient, 'dna').filter(item => item.length > 0), 
                sequencingTypesRNA: getSortedUniqueItem(res.data.dataset_patient, 'rna').filter(item => item.length > 0), 
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
                                        {dataset.sexGroups.female > 0 ? `F:${dataset.sexGroups.female} ` : ''} 
                                        {dataset.sexGroups.male > 0 ? `M:${dataset.sexGroups.male} ` : ''} 
                                        {dataset.sexGroups.unknown > 0 ? `Unknown:${dataset.sexGroups.unknown}` : ''}
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
                            data={[{
                                y: dataset.ageGroups.map(item => item.range),
                                x: dataset.ageGroups.map(item => item.count)
                            }]}
                        />
                        <PieChart 
                            text='Sex'
                            data={{
                                values: [dataset.sexGroups.female, dataset.sexGroups.male, dataset.sexGroups.unknown],
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
                        <PieChart 
                            text='Drug Type'
                            data={{
                                values: dataset.drugTypes.map(item => dataset.patients.filter(patient => patient.drug_type === item).length),
                                labels: dataset.drugTypes.map(item => item.length > 0 ? item : 'Unknown'),
                            }}
                        />
                        <BarChart 
                            text='Sequencing Type'
                            data={[
                                {
                                    name: 'DNA',
                                    x: dataset.sequencingTypesDNA,
                                    y: dataset.sequencingTypesDNA.map(item => dataset.patients.filter(patient => patient.dna === item).length)
                                },
                                {
                                    name: 'RNA',
                                    x: dataset.sequencingTypesRNA,
                                    y: dataset.sequencingTypesRNA.map(item => dataset.patients.filter(patient => patient.rna === item).length)
                                }
                            ]}
                            orientation='v'
                        />
                        <BarChart 
                            text='Data Type'
                            data={dataset.datatype.map(item => ({
                                name: item.type,
                                x: [item.type],
                                y: [dataset.patients.filter(patient => patient[item.type.toLowerCase()]).length]
                            }))}
                            orientation='v'
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