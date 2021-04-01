import styled from 'styled-components';

const StyledForm = styled.div`
    width: ${props => props.flexDirection === 'column' ? '100%' : '80%'};
    margin-top: 30px;
    display: flex;
    flex-direction: ${props => props.flexDirection};
    align-items: center;
    justify-content: space-between;
    font-size: 12px;

    .formField {
        width: ${props => props.flexDirection === 'column' ? '100%' : '30%'};
        display: flex;
        align-items: center;
        justify-content: ${props => props.flexDirection === 'column' ? 'space-between' : 'center'};
        margin-bottom: 10px;
        margin-right: ${props => props.flexDirection === 'column' ? '0px' : '20px'};
        .label {
            margin-right: 10px;
            font-size: 14px;
        }
        .input {
            width: 70%;
        }
    }

    .buttonField {
        display: flex;
        justify-content: ${props => props.flexDirection === 'column' ? 'flex-end' : 'flex-start'};
    }
`;

export default StyledForm;