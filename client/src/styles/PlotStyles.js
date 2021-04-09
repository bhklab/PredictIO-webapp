import styled from 'styled-components';

export const PlotContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    .volcano {
        width: 35%;
    }
    .forest {
        width: 65%;
    }
`;

export const StyledPlotArea = styled.div`
    width: ${props => props.width};
    .forestPlotMessage {
        font-size: 12px;
    }
    padding 10px;
`;

export const LoaderContainer = styled.div`
    width: 100%;
    height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
`;