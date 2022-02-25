import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../UtilComponents/Layout';
// import styled from 'styled-components';
import { Container } from '../../styles/StyledComponents';

const Dataset = (props) => {
    const { id } = useParams();
    useEffect(() => {
        const getData = async () => {
            const res = await axios.get(`/api/dataset/${id}`);
            console.log(res.data);
        }
        getData()
    }, []);
    return(
        <Layout>
            <Container>
                <h3>Dataset</h3>
            </Container>
        </Layout>
    );
}

export default Dataset;