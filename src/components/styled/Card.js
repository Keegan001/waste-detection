import styled from 'styled-components';

export const Card = styled.div`
  background-color: ${props => props.theme.colors.paper};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.md};
  padding: ${props => props.theme.spacing(6)};
  margin-bottom: ${props => props.theme.spacing(6)};
  transition: box-shadow ${props => props.theme.transitions.normal};
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

export const CardHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing(4)};
  
  h2, h3, h4 {
    margin-bottom: ${props => props.theme.spacing(1)};
  }
`;

export const CardContent = styled.div`
  margin-bottom: ${props => props.theme.spacing(4)};
`;

export const CardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  
  > * + * {
    margin-left: ${props => props.theme.spacing(3)};
  }
`; 