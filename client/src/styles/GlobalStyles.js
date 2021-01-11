
import { createGlobalStyle } from 'styled-components';
import colors from './colors';

const GlobalStyles = createGlobalStyle`
    html, body {
        height: 100%;
        margin: 0;
    }
    // html {
    //     background-image: url('./images/background.png');
    //     background-size: cover;
    //     background-position: center;
    //     background-repeat: no-repeat;
    // }

    body {
        color: ${colors.gray_text};
        font-family: 'Noto Sans', sans-serif;
        font-weight: 400;
    }

    #root {
        height: 100%;
        min-height: 100vh;
    }

    main {
        min-height: calc(100vh - 105px);
        width: 85%;
        max-width: 1500px;
        margin-left: auto;
        margin-right: auto;
        display: flex;
        flex-direction: column;
    }

    a {
        text-decoration: none;
        transition: all 0.25s ease-out 0s;
    }

    a:hover {
        transition: all 0.25s ease-out 0s;
    }
`;

export default GlobalStyles;