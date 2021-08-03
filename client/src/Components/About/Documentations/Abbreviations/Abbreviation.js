import React from 'react';
import styled from 'styled-components';
import abbreviations from "./abbreviations";
import Table from '../../../UtilComponents/Table/Table'

const COLUMNS = [
    {
        Header: 'Abbreviation',
        accessor: 'abbrv',
    },
    {
        Header: 'Definition',
        accessor: 'definition',
    },
]


const DocHeader = styled.div`
    margin-top: 20px;
    .title {
        display: inline-block;
        font-size: 20px;
        font-weight: bold;
        border-bottom: 3px solid rgb(241, 144, 33);
    }
`;

const Abbreviations = () => {
    const abbrv = abbreviations;
    return(
        <div className='documentation'>
            <DocHeader>
                <h2>Abbreviations</h2>
                <div>
                    <Table columns={COLUMNS} data={abbrv} />
                </div>
            </DocHeader>
        </div>
    );
}

export default Abbreviations
