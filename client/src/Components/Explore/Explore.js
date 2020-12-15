import React, {useState} from 'react';
import Layout from '../UtilComponents/Layout';
import ActionButton from '../UtilComponents/ActionButton';
// import styled from 'styled-components';

const Explore = () => {

    const [data, setData] = useState({data: {}, ready: false});

    const getData = async () => {
        const res = await fetch('/api/test', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const json = await res.json();
        console.log(json);
        setData({data: json, ready: true});
    }

    return(
        <Layout>
            {
                data.ready ?
                <div>
                    <h2>Output from server</h2>
                    <div>
                        { JSON.stringify(data.data, null, 2)}
                    </div>
                </div>
                :
                <ActionButton onClick={(e) => {getData()}} text='Submit' style={{}} />
            }
        </Layout>
    );
}

export default Explore;