import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../UtilComponents/Layout';
// import styled from 'styled-components';
import { Container } from '../../styles/StyledComponents';
import Table from '../UtilComponents/Table/Table';

const Datasets = () => {
    const [datasets, setDatasets] = useState([]);

    const columns = [
        {
            Header: 'Name',
            accessor: 'dataset_name'
        },
        {
            Header: 'Identifier',
            accessor: 'pmid'
        },
        
    ];

    useEffect(() => {
        const getData = async () => {
            const res = await axios.get('/api/datasets')
            res.data.sort((a, b) => a.dataset_name.localeCompare(b.dataset_name));
            setDatasets(res.data);
        }   
        getData();
    }, []);

    return(
        <Layout>
            <Container>
                <h3>Datasets</h3>
                <div>
                    <Table columns={columns} data={datasets} />
                </div>
            </Container>
        </Layout>
    );
}

export default Datasets;