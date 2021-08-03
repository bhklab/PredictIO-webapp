// export default Download;
import React, { Component }from "react";
import styled from 'styled-components';
import studies from "../../example_output/sample-output.js";
import 'react-table-6/react-table.css';
import Layout from '../UtilComponents/Layout';
import { Link } from 'react-router-dom';
import Table from '../UtilComponents/Table/Table'

const COLUMNS = [
    {
        Header: 'Name',
        accessor: 'name',
    },
    {
        Header: 'Publication',
        accessor: 'pmid',
    },
    {
        Header: 'Download',
        accessor: 'definition',
    },
]

const StyledDatasets = styled.div`
    width: 100%;
    height: 100%;
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 1200px;
    padding: 140px 0px;
    h1 {
        color: #666666;
        font-family: 'Raleway', sans-serif;
        font-size: calc(1em + 1vw);
        text-align:center;
        margin-bottom:50px;
    }
    a {
        color: blue
    }
  }
`;

class Download extends Component {
    constructor() {
        super();
        this.state = {
            datasetData: [],
            loading: true,
        };
    }

    componentDidMount() {
        fetch(/api/)
        const data = [
            {id: 1, name: 'Roh', pmid: 'https://pubmed.ncbi.nlm.nih.gov/28251903', link: '',},
            {id: 2, name: 'Miao.2', pmid: 'https://pubmed.ncbi.nlm.nih.gov/30150660/', link: '',},
            {id: 3, name: 'INSPIRE', pmid: '', num_compounds: 0, link: '',},
        ];

        this.setState({ datasetData: data, loading: false });
    }

    render() {
        const { loading, datasetData } = this.state;
        const columns = [
            {
                Header: 'Name',
                accessor: 'name',
                sortable: true,
                minWidth: 200,
                Cell: (row) => (<span style={{fontSize: '12px'}}>{row.value}</span>)
            },
            {
                Header: 'Publication',
                accessor: 'pmid',
                sortable: false,
                minWidth: 200,
                Cell: (row) => (<a
                    style={{fontSize: '12px'}}
                    href= "www.google.com"
                    target="_blank"
                    rel="noopener">
                    Pubmed
                </a>)
            },
            {
                Header: 'File',
                accessor: 'download',
                sortable: false,
                minWidth: 500,
                Cell: (row) => (<a
                    style={{fontSize: '12px'}}
                    href="https://www.google.com"
                    target="_blank"
                    rel="noopener">
                    Download
                </a>)
            },
        ];

        return (
            <Layout>
                <StyledDatasets>
                    <div>
                        <h1>Studies</h1>
                        <Table columns={columns} data={datasetData}></Table>
                    </div>
                </StyledDatasets>
            </Layout>
        );
    }
}

export default Download;
