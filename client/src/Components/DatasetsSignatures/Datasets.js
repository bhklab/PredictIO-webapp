import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '../UtilComponents/Table/Table';

const Datasets = () => {
    const [datasets, setDatasets] = useState([]);

    const columns = [
        {
            Header: 'Name',
            accessor: 'dataset_name',
            Cell: (item) => (
                <a href={`/dataset/${item.row.original.dataset_id}`}>
                    {item.value}
                </a>
            )
        },
        {
            Header: 'Publication',
            accessor: 'pmid',
            Cell: (item) => (
                <a href={item.value} target="_blank" rel="noopener noreferrer">
                    {`PMID: ${item.value.split('.gov/')[1].replace(/\D/g, '')}`}
                </a>
            )
        },
        {
            Header: 'Source',
            accessor: 'identifiers',
            Cell: (item) => {
                if(item.value.length > 0){
                    return(
                        <span>
                            {
                                item.value.map((link, i) => (
                                    <span key={i}>
                                        {
                                            link.link.length > 0 ?
                                            <a href={link.link} target="_blank" rel="noopener noreferrer">{link.identifier}</a>
                                            :
                                            link.identifier
                                        }
                                        {(i + 1) < item.value.length ? ', ' : ''}
                                    </span>
                                ))
                            }
                        </span>
                    );
                }else{
                    return 'Data Access Restricted'
                }
            }
        }
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
        <React.Fragment>
            <h3>Datasets</h3>
            <div>
                <Table columns={columns} data={datasets} pageRowNum={25} />
            </div>
        </React.Fragment>
    );
}

export default Datasets;