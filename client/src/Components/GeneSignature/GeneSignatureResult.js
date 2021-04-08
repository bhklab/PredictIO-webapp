import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

import Layout from '../UtilComponents/Layout';

const GeneSignatureResult = () => {

    let { id } = useParams();

    useEffect(() => {
        const getData = async () => {
            console.log(id);
            const res = await axios.get(`/api/explore/signature/result/${id}`);
            console.log(res.data);
        }
        getData();
    }, []);

    return(
        <Layout>
            <h3>Result</h3>
        </Layout>
    );
}

export default GeneSignatureResult;