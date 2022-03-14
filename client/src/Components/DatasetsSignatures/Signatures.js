import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '../UtilComponents/Table/Table';

const Signatures = () => {
    const [signatures, setSignatures] = useState([]);

    const columns = [
        {
            Header: 'Name',
            accessor: 'signature'
        },
        {
            Header: 'Method',
            accessor: 'method'
        },
        {
            Header: 'Association',
            accessor: 'association'
        },
        {
            Header: 'Source',
            accessor: 'pmid',
            Cell: (item) => (
                <a href={item.value} target="_blank" rel="noopener noreferrer">
                    {`PMID: ${item.value.split('.gov/')[1].replace(/\D/g, '')}`}
                </a>
            )
        },
        {
            Header: 'Definition',
            accessor: 'definition'
        }
    ];

    useEffect(() => {
        const getData = async () => {
            const res = await axios.get('/api/signatures');
            console.log(res.data);
            res.data.sort((a, b) => a.signature.localeCompare(b.signature));
            setSignatures(res.data);
        }   
        getData();
    }, []);
    return(
        <React.Fragment>
            <h3>Signatures</h3>
            <div>
                <Table columns={columns} data={signatures} pageRowNum={20} />
            </div>
        </React.Fragment>
    )
}

export default Signatures;