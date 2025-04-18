import styled from 'styled-components';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.$columns || 12}, 1fr);
  gap: ${props => props.$spacing ? props.theme.spacing(props.$spacing) : props.theme.spacing(4)};
  width: 100%;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: repeat(${props => props.$mobileCols || 1}, 1fr);
  }
  
  @media (min-width: ${props => props.theme.breakpoints.sm}) and (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(${props => props.$tabletCols || Math.min(props.$columns || 12, 6)}, 1fr);
  }
`;

export const GridItem = styled.div`
  grid-column: span ${props => props.$span || 12};
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-column: span ${props => props.$mobileSpan || props.$span || 1};
  }
  
  @media (min-width: ${props => props.theme.breakpoints.sm}) and (max-width: ${props => props.theme.breakpoints.md}) {
    grid-column: span ${props => props.$tabletSpan || Math.min(props.$span || 12, 6)};
  }
`;

export const Flex = styled.div`
  display: flex;
  flex-direction: ${props => props.$direction || 'row'};
  justify-content: ${props => props.$justify || 'flex-start'};
  align-items: ${props => props.$align || 'stretch'};
  flex-wrap: ${props => props.$wrap || 'nowrap'};
  gap: ${props => props.$gap ? props.theme.spacing(props.$gap) : 0};
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: ${props => props.$mobileDirection || 'column'};
  }
`; 