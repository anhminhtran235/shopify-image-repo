import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css?family=Montserrat:400,900|Roboto');
    @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');

    html {
        --lighter-blue: #24b6c8;
        --darker-blue: #26aec0;
        --darkest-blue: #22a0b1;

        --lighter-grey: #f4f7f9;
        --darker-grey: #dbdbdb;
        --darkest-grey: #acacac;

        --lighter-orange: #e05100;
        --darker-orange: #cc4b01;
        --darkest-orange: #bd4703;

        --lighter-black: #2d3e50;
        --darker-black: #222222;
        --darkest-black: #161616;

        --container-padding: 120px;
        @media (max-width: 1300px) {
            --container-padding: 60px;
        }
        @media (max-width: 1015px) {
            --container-padding: 40px;
        }
        @media (max-width: 927px) {
            --container-padding: 20px;
        }
        @media (max-width: 500px) {
            --container-padding: 10px;
        }

        box-sizing: border-box;
    }

    *,
    *:before,
    *:after {
        box-sizing: inherit;
    }

    body {
        font-family: 'Montserrat';
        padding: 0;
        margin: 0;
        font-size: 20px;
        background: var(--lighter-grey);
    }

    ul {
        text-decoration: none;
        list-style: none;
    }

    a {
        text-decoration: none;
        color: var(---darker-black);
    }

    a:hover {
        text-decoration: underline;
    }

    button {
        font-family: 'Montserrat';
    }

    .special-text {
        font-family: 'Dancing Script', cursive
    }
`;

export default GlobalStyles;
