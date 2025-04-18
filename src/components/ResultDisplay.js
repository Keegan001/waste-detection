import React from 'react';
import styled from 'styled-components';
import { Card, CardHeader, CardContent } from './styled/Card';
import { Grid, GridItem } from './styled/Grid';
import { FaTrash, FaRecycle, FaCheck } from 'react-icons/fa';

const ResultItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing(4)};
  padding-bottom: ${props => props.theme.spacing(4)};
  border-bottom: 1px solid ${props => props.theme.colors.background};
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const ResultIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: ${props => props.theme.borderRadius.round};
  background-color: ${props => {
    switch(props.$type) {
      case 'recyclable':
        return props.theme.colors.primary + '20';
      case 'waste':
        return props.theme.colors.error + '20';
      default:
        return props.theme.colors.secondary + '20';
    }
  }};
  margin-right: ${props => props.theme.spacing(4)};
  
  svg {
    color: ${props => {
      switch(props.$type) {
        case 'recyclable':
          return props.theme.colors.primary;
        case 'waste':
          return props.theme.colors.error;
        default:
          return props.theme.colors.secondary;
      }
    }};
    font-size: 1.5rem;
  }
`;

const ResultContent = styled.div`
  flex: 1;
`;

const ResultTitle = styled.h4`
  font-size: ${props => props.theme.fontSizes.md};
  margin-bottom: ${props => props.theme.spacing(1)};
`;

const ResultConfidence = styled.div`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.text.secondary};
  display: flex;
  align-items: center;
`;

const ConfidenceBar = styled.div`
  height: 8px;
  width: 100px;
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.sm};
  margin-left: ${props => props.theme.spacing(2)};
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.$value}%;
    background-color: ${props => {
      if (props.$value > 80) return props.theme.colors.success;
      if (props.$value > 50) return props.theme.colors.primary;
      if (props.$value > 30) return props.theme.colors.warning;
      return props.theme.colors.error;
    }};
    border-radius: ${props => props.theme.borderRadius.sm};
  }
`;

const ImageContainer = styled.div`
  margin-bottom: ${props => props.theme.spacing(6)};
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.md};
  
  img {
    width: 100%;
    height: auto;
    display: block;
  }
`;

const CropContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${props => props.theme.spacing(2)};
`;

const CropImage = styled.div`
  width: 100%;
  height: 120px;
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
  margin-bottom: ${props => props.theme.spacing(2)};
  box-shadow: ${props => props.theme.shadows.sm};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CropDetails = styled.div`
  display: flex;
  margin-bottom: ${props => props.theme.spacing(3)};
`;

const NoResults = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing(8)};
  color: ${props => props.theme.colors.text.secondary};
`;

const getIconByClass = (classification) => {
  const lowerClass = classification.toLowerCase();
  if (lowerClass.includes('recycle') || lowerClass.includes('recyclable') || lowerClass.includes('plastic') || lowerClass.includes('paper') || lowerClass.includes('glass')) {
    return { icon: <FaRecycle />, type: 'recyclable' };
  } else if (lowerClass.includes('waste') || lowerClass.includes('trash') || lowerClass.includes('garbage')) {
    return { icon: <FaTrash />, type: 'waste' };
  }
  return { icon: <FaCheck />, type: 'other' };
};

const ResultDisplay = ({ results, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <h3>Processing Image...</h3>
        </CardHeader>
        <CardContent>
          <NoResults>
            Please wait while we analyze your image...
          </NoResults>
        </CardContent>
      </Card>
    );
  }
  
  if (!results || !results.results || results.results.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h3>No Results</h3>
        </CardHeader>
        <CardContent>
          <NoResults>
            No waste objects detected. Try uploading a different image.
          </NoResults>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <>
      <Card>
        <CardHeader>
          <h3>Detection Results</h3>
        </CardHeader>
        <CardContent>
          <Grid $columns={2} $mobileCols={1} $spacing={6}>
            <GridItem $span={1}>
              {results.image_urls?.annotated_image && (
                <ImageContainer>
                  <img src={`http://localhost:8000${results.image_urls.annotated_image}`} alt="Annotated" />
                </ImageContainer>
              )}
            </GridItem>
            <GridItem $span={1}>
              {results.results[0]?.boxes.map((box, index) => {
                const classification = box.classification_results?.top_class || 'Unknown';
                const confidence = box.classification_results?.confidence || 0;
                const confidencePercent = Math.round(confidence * 100);
                const { icon, type } = getIconByClass(classification);
                
                return (
                  <ResultItem key={index}>
                    <ResultIcon $type={type}>
                      {icon}
                    </ResultIcon>
                    <ResultContent>
                      <ResultTitle>{classification}</ResultTitle>
                      <ResultConfidence>
                        Confidence: {confidencePercent}%
                        <ConfidenceBar $value={confidencePercent} />
                      </ResultConfidence>
                    </ResultContent>
                  </ResultItem>
                );
              })}
            </GridItem>
          </Grid>
        </CardContent>
      </Card>

      {/* New card to display cropped images */}
      <Card>
        <CardHeader>
          <h3>Individual Objects</h3>
        </CardHeader>
        <CardContent>
          <Grid $columns={3} $mobileCols={1} $tabletCols={2} $spacing={4}>
            {results.results[0]?.boxes.map((box, index) => {
              const classification = box.classification_results?.top_class || 'Unknown';
              const confidence = box.classification_results?.confidence || 0;
              const confidencePercent = Math.round(confidence * 100);
              const { icon, type } = getIconByClass(classification);
              
              return (
                <GridItem key={index} $span={1}>
                  <CropContainer>
                    {box.crop_url && (
                      <CropImage>
                        <img src={`http://localhost:8000${box.crop_url}`} alt={`Object ${index + 1}`} />
                      </CropImage>
                    )}
                    <CropDetails>
                      <ResultIcon $type={type}>
                        {icon}
                      </ResultIcon>
                      <ResultContent>
                        <ResultTitle>{classification}</ResultTitle>
                        <ResultConfidence>
                          Confidence: {confidencePercent}%
                          <ConfidenceBar $value={confidencePercent} />
                        </ResultConfidence>
                      </ResultContent>
                    </CropDetails>
                  </CropContainer>
                </GridItem>
              );
            })}
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default ResultDisplay; 