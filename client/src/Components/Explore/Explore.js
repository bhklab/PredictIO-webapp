import React from 'react';
import Layout from '../UtilComponents/Layout';
import ActionButton from '../UtilComponents/ActionButton';
// import styled from 'styled-components';

const Explore = () => {

    const getData = async () => {
        const res = await fetch('/api/test', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const json = await res.json();
        console.log(json);
    }

    return(
        <Layout>
            {/* input form fields go here. */}
            <ActionButton onClick={(e) => {getData()}} text='Submit' style={{}} />
        </Layout>
    );
}

export default Explore;