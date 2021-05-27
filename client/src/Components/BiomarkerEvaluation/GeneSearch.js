import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { AutoComplete } from 'primereact/autocomplete';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import colors from '../../styles/colors';

const CustomAutoComplete = styled(AutoComplete)`
    width: 100%;
    .p-inputtext {
        width: 100%;
        .p-autocomplete-input-token input {
            font-size: 12px;
            color: ${colors.gray_text};
        }
    }
    .p-autocomplete-panel {
        font-size: 12px;
        color: ${colors.gray_text};
    }
    .p-autocomplete-token {
        font-size: 12px;
    }
`;

const CustomToast = styled(Toast)`
    font-size: 14px;
    .p-toast {
        width: 15rem;
    }
`;

const GeneSearch = (props) => {
    const {className, datatype, selectedGenes, onChange} = props;
    const toast = useRef(null);
    const [suggestions, setSuggestions] = useState([]);

    const searchGene = async (e) => {
        const res = await axios.get(`/api/search_gene/${datatype}?query=${e.query}`);
        // console.log(res.data)
        if(res.data.length === 0){
            toast.current.show({severity:'info', summary: '', detail:'Gene not found', life: 2000});
        }
        setSuggestions(res.data.map(gene => ({
            name: gene.gene_name, 
            value: gene.gene_id
        })));
    }

    return(
        <React.Fragment>
            <CustomAutoComplete 
                className={className}
                value={selectedGenes} 
                suggestions={suggestions} 
                completeMethod={searchGene} 
                field="name" 
                multiple={true}
                onChange={onChange}
                placeholder='ex. B2M, CD8A, GZMA'
                disabled={typeof datatype === 'undefined' || datatype.length === 0}
            />
            <CustomToast ref={toast}></CustomToast>
        </React.Fragment>
    );
}

export default GeneSearch;