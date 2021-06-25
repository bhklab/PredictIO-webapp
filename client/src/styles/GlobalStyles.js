
import { createGlobalStyle } from 'styled-components';
import { colors } from './colors';

const GlobalStyles = createGlobalStyle`
    html, body {
        height: 100%;
        margin: 0;
    }

    body {
        color: ${colors.gray_text};
        font-family: 'Noto Sans', sans-serif;
        font-weight: 400;
    }

    #root {
        height: 100%;
        min-height: 100vh;
    }

    a {
        text-decoration: none;
        transition: all 0.25s ease-out 0s;
    }

    a:hover {
        transition: all 0.25s ease-out 0s;
    }

    .p-tooltip {
        .p-tooltip-text {
            font-size: 12px;
        }
    }
`;

export default GlobalStyles;