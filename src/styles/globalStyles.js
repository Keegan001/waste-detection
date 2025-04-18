import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${props => props.theme.fonts.main};
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text.primary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    min-height: 100vh;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.3;
    margin-bottom: 1rem;
  }

  p {
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  a {
    text-decoration: none;
    color: ${props => props.theme.colors.primary};
    transition: color ${props => props.theme.transitions.normal};
    
    &:hover {
      color: ${props => props.theme.colors.secondary};
    }
  }

  button {
    font-family: ${props => props.theme.fonts.main};
    cursor: pointer;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  ::selection {
    background-color: ${props => props.theme.colors.primary};
    color: white;
  }
`; 