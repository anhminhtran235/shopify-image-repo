import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css?family=Montserrat:400,900|Roboto');
    @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');

    html {
        --lighter-blue: #2371e7;
        --darker-blue: #005ce4;
        --darkest-blue: #0e2f5a;

        --lighter-grey: #e4ebf1;
        --darker-grey: #d0d6db;
        --darkest-grey: #b5bbc0;

        --lighter-orange: #e05100;
        --darker-orange: #cc4b01;
        --darkest-orange: #bd4703;

        --lighter-black: #2d3e50;
        --darker-black: #222222;
        --darkest-black: #161616;

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
    }

    ul {
        text-decoration: none;
        list-style: none;
    }

    a {
        text-decoration: none;
        color: white
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
