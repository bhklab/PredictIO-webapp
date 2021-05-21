import React, {useEffect} from 'react';
import Layout from '../UtilComponents/Layout';
import axios from 'axios';

const Test = () => {

    useEffect(() => {
        const getData = async () => {
            try{
                const res = await axios.get('http://localhost:5000/api/explore/itnt_data');
                console.log(res.data);
            }catch(error){
                console.log(error);
            }
        }
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Layout>
            <h1>Test</h1>
        </Layout>
    );
};

export default Test;