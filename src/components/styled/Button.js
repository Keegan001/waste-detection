import styled, { css } from 'styled-components';

export const Button = styled.button`
  padding: ${props => props.theme.spacing(3)} ${props => props.theme.spacing(6)};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSizes.md};
  font-weight: 500;
  transition: all ${props => props.theme.transitions.normal};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${props => props.theme.shadows.sm};
  
  ${props => props.$fullWidth && css`
    width: 100%;
  `}
  
  ${props => {
    if (props.$variant === 'outlined') {
      return css`
        background-color: transparent;
        border: 2px solid ${props.theme.colors[props.$color || 'primary']};
        color: ${props.theme.colors[props.$color || 'primary']};
        
        &:hover {
          background-color: ${props.theme.colors[props.$color || 'primary']}20;
          box-shadow: ${props.theme.shadows.md};
        }
      `;
    } else if (props.$variant === 'text') {
      return css`
        background-color: transparent;
        color: ${props.theme.colors[props.$color || 'primary']};
        box-shadow: none;
        
        &:hover {
          background-color: ${props.theme.colors[props.$color || 'primary']}10;
        }
      `;
    } else {
      return css`
        background-color: ${props.theme.colors[props.$color || 'primary']};
        color: white;
        
        &:hover {
          background-color: ${props.theme.colors[props.$color || 'primary']}d0;
          box-shadow: ${props.theme.shadows.md};
        }
      `;
    }
  }}
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    box-shadow: none;
  }
  
  svg {
    margin-right: ${props => props.$iconOnly ? '0' : props.theme.spacing(2)};
    margin-left: ${props => props.$iconOnly ? '0' : props.theme.spacing(-1)};
  }
  
  ${props => props.$size === 'small' && css`
    padding: ${props.theme.spacing(2)} ${props.theme.spacing(4)};
    font-size: ${props.theme.fontSizes.sm};
  `}
  
  ${props => props.$size === 'large' && css`
    padding: ${props.theme.spacing(4)} ${props.theme.spacing(8)};
    font-size: ${props.theme.fontSizes.lg};
  `}
`; 