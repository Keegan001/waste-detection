import React from 'react';
import styled from 'styled-components';
import { Container } from './styled/Container';
import { Flex } from './styled/Grid';
import { FaRecycle } from 'react-icons/fa';

const StyledHeader = styled.header`
  background-color: ${props => props.theme.colors.paper};
  box-shadow: ${props => props.theme.shadows.md};
  padding: ${props => props.theme.spacing(4)} 0;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  
  svg {
    margin-right: ${props => props.theme.spacing(2)};
  }
`;

const Header = () => {
  return (
    <StyledHeader>
      <Container>
        <Flex $justify="space-between" $align="center">
          <Logo>
            <FaRecycle />
            Waste Detection
          </Logo>
        </Flex>
      </Container>
    </StyledHeader>
  );
};

export default Header; 