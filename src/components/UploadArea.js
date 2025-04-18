import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import { FaUpload, FaImage } from 'react-icons/fa';
import { Button } from './styled/Button';

const DropzoneContainer = styled.div`
  border: 2px dashed ${props => props.$isDragActive 
    ? props.theme.colors.primary 
    : props.theme.colors.text.disabled};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing(12)};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.$isDragActive 
    ? props.theme.colors.primary + '10' 
    : props.theme.colors.background};
  transition: all ${props => props.theme.transitions.normal};
  cursor: pointer;
  text-align: center;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.primary + '10'};
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  color: ${props => props.$isDragActive 
    ? props.theme.colors.primary 
    : props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing(4)};
`;

const UploadText = styled.p`
  font-size: ${props => props.theme.fontSizes.md};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing(2)};
`;

const UploadSubText = styled.p`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.text.disabled};
  margin-bottom: ${props => props.theme.spacing(6)};
`;

const UploadArea = ({ onFileSelected }) => {
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onFileSelected(acceptedFiles[0]);
    }
  }, [onFileSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <DropzoneContainer {...getRootProps()} $isDragActive={isDragActive}>
      <input {...getInputProps()} />
      <UploadIcon $isDragActive={isDragActive}>
        {isDragActive ? <FaImage /> : <FaUpload />}
      </UploadIcon>
      <UploadText>
        {isDragActive ? 'Drop the image here' : 'Drag & drop an image here'}
      </UploadText>
      <UploadSubText>
        or click to select an image from your device
      </UploadSubText>
      <Button $size="small" $color="primary">
        Select Image
      </Button>
    </DropzoneContainer>
  );
};

export default UploadArea; 