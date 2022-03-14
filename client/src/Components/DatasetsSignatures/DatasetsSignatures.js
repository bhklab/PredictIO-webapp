import React, { useState } from 'react';
import Layout from '../UtilComponents/Layout';
import styled from 'styled-components';
import { Container } from '../../styles/StyledComponents';
import Datasets from './Datasets';
import Signatures from './Signatures';
import { RadioButton } from 'primereact/radiobutton';
import { colors } from '../../styles/colors';

const StyledRadioButtonGroup = styled.div`
    display: flex;
    margin-top: 20px;
    font-size: 14px;
    .radiobutton-field {
        margin-right: 20px;
        label {
            margin-left: 5px;
        }
    }
`;

const StyledRadioButton = styled(RadioButton)`
    .p-radiobutton-box.p-highlight {
        border-color: ${colors.blue};
        background: ${colors.blue};
    }
    .p-radiobutton-box.p-highlight.p-focus {
        border-color: ${colors.blue};
        background: ${colors.blue};
        box-shadow: none;
    }
`;

const DatasetsSignatures = () => {

    const [display, setDisplay] = useState('datasets');

    return(
        <Layout>
            <Container>
                <StyledRadioButtonGroup>
                    <div className='radiobutton-field'>
                        Display:
                    </div>
                    <div className='radiobutton-field'>
                        <StyledRadioButton inputId="datasets" value="datasets" name="display" onChange={(e) => setDisplay(e.value)} checked={display === 'datasets'} />
                        <label htmlFor="datasets">Datasets</label>
                    </div>
                    <div className='radiobutton-field'>
                        <StyledRadioButton inputId="signatures" value="signatures" name="display" onChange={(e) => setDisplay(e.value)} checked={display === 'signatures'} />
                        <label htmlFor="signatures">Signatures</label>
                    </div>
                </StyledRadioButtonGroup>
                {
                    display === 'datasets' && <Datasets />
                }
                {
                    display === 'signatures' && <Signatures />
                }
            </Container>
        </Layout>
    );
}

export default DatasetsSignatures;