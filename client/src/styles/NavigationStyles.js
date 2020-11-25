import styled from 'styled-components';
import colors from './colors';

export const StyledNavigation = styled.div`
    width: 100%;
    height: 60px;
    background-color: ${colors.blue};
    display: flex;
    align-items: center;
`;

export const NavigationContent = styled.div`
    width: 85%;
    max-width: 1500px;
    height: 100%;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
`

export const LogoContainer = styled.div`
    height: 70%;
    align-items: center;
    img {
        height: 100%;
    }
`

export const StyledLinks = styled.div`
    width: 80%;
    max-width: 500px;
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