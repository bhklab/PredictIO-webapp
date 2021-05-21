import styled from 'styled-components';
import colors from '../../styles/colors';

export const StyledNavigation = styled.div`
    width: 100%;
    height: 50px;
    background-color: ${colors.blue};
`;

export const NavigationContent = styled.div`
    width: 90%;
    max-width: 1500px;
    height: 100%;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    align-items: center;
    font-size: 12px;
`

export const LogoContainer = styled.div`
    height: 70%;
    align-items: center;
    img {
        height: 100%;
    }
`

export const StyledLinks = styled.div`
    width: 70%;
    min-width: 560px;
    display: flex;
    justify-content: space-between;
    padding: 0px 30px;
    a {
        color: #ffffff;
    }
    a:last-child {
        margin-right: 0;
    }
`