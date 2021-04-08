import React, {useState} from 'react';
import styled from 'styled-components';
import { AutoComplete } from 'primereact/autocomplete';
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

const GeneSearch = (props) => {

    const {className, selectedGenes, onChange} = props;

    const [suggestions, setSuggestions] = useState([]);

    const searchGene = async (e) => {
        const res = await axios.get(`/api/search_gene?query=${e.query}`);
        setSuggestions(res.data.map(gene => ({
            name: gene.gene_name, 
            value: gene.gene_id
        })));
    }

    return(
        <CustomAutoComplete 
            className={className}
            value={selectedGenes} 
            suggestions={suggestions} 
            completeMethod={searchGene} 
            field="name" 
            multiple={true}
            onChange={onChange}
            placeholder='ex. B2M, CD8A, GZMA'
        />
    );
}

export default GeneSearch;