import styled,{ createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
body{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
    background: #f4f4f4;
}
`;
const Titles = styled.h1`
color: #364936;
text-transform: uppercase;
padding-bottom: 2rem;
`;

const SubTitle = styled.h3`
color: white;
text-transform: uppercase;
padding-bottom: 1rem;
`;

//Smaller than the normal subtitle
const SubTitle2 = styled.h4`
color: #364936;
text-transform: uppercase;
`;

//Subtitle but without the padding bottom
const ModalTitle = styled.h2`
color: #364936;
text-transform: uppercase;
`;

const Labels = styled.h3`
color: #364936;
text-transform: uppercase;
`;

const LoginStyle = createGlobalStyle`
body{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
    background: #E2FBD7;
}
`;


export  {GlobalStyles, Titles, SubTitle, SubTitle2,ModalTitle, Labels, LoginStyle};