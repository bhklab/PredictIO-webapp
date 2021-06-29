import React, { useEffect } from 'react';
import styled from 'styled-components';
import { colors, plotColors } from '../../styles/colors';
import NetworkPlot from '../Diagram/NetworkPlot';

const Container = styled.div`
    width: 100%;
    display: flex;
    margin-bottom: 30px;  
    .network-plot {
        width: 60%;
    }
    .right-panel {
        width: 40%;
        min-width: 350px;
        margin-left: 5px;
        .right-panel-header {
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 5px;
        }
    }
    .legends {
        max-height: 350px;
        font-size: 12px;
        overflow-y: auto;
        .legend {
            margin-bottom: 10px;
            .title {
                font-weight: bold;
            }
            ol {
                padding-inline-start: 20px;
                margin-block-start: 0px;
                margin-block-end: 0px;
            }
        }
    }
`;

const NetworkPlotContainer = (props) => {
    const { data } = props;

    useEffect(() => {
        console.log(data);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return(
        <React.Fragment>
            <h3>Signature Clusters</h3>
            <Container>
                <NetworkPlot className='network-plot' data={data} plotId='network-diagram' />
                <div className='right-panel'>
                    <div className='right-panel-header'>KEGG pathway enrichment</div>
                    <div className='legends'>
                    {
                        data.map((item, i) => (
                            <div className='legend' key={i}>
                                <div className='title'>
                                    <span style={{color: plotColors[i]}}>Cluster {item.cluster} </span> 
                                    {
                                        item.points.signature.includes('custom') ? 
                                        <span style={{color: colors.purple}}>(Includes custom signature)</span> : ''
                                    }:
                                </div>
                                <ol>
                                {
                                    item.kegg.map((kegg, i) => (
                                        <li key={i}>{kegg.pathway}</li>
                                    ))
                                }
                                </ol>
                            </div>
                        ))
                    }
                    </div>
                </div>
            </Container>
        </React.Fragment>
    );
}

export default NetworkPlotContainer;