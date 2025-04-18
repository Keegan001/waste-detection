import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Header from './components/Header';
import { Container } from './components/styled/Container';
import { Card, CardHeader, CardContent, CardFooter } from './components/styled/Card';
import { Button } from './components/styled/Button';
import UploadArea from './components/UploadArea';
import ResultDisplay from './components/ResultDisplay';
import { api } from './services/api';
import { FaUpload, FaSync } from 'react-icons/fa';

const MainContent = styled.main`
  padding: ${props => props.theme.spacing(8)} 0;
`;

const StyledHeading = styled.h1`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing(8)};
  color: ${props => props.theme.colors.text.primary};
`;

const StyledSubheading = styled.p`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing(12)};
  color: ${props => props.theme.colors.text.secondary};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const App = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');

  // Check API health on component mount
  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        await api.checkHealth();
        setApiStatus('healthy');
      } catch (err) {
        setApiStatus('error');
        setError('Unable to connect to the API. Please ensure the backend server is running.');
      }
    };
    
    checkApiHealth();
  }, []);

  const handleFileSelected = (selectedFile) => {
    setFile(selectedFile);
    setResults(null);
    setError(null);
    
    // Create a preview URL
    const fileUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(fileUrl);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await api.detectWaste(file);
      setResults(data);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('An error occurred while processing the image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setResults(null);
    setError(null);
    
    // Revoke object URL to prevent memory leaks
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  return (
    <>
      <Header />
      <MainContent>
        <Container>
          <StyledHeading>Waste Detection & Classification</StyledHeading>
          <StyledSubheading>
            Upload an image to detect and classify waste objects using our advanced AI model
          </StyledSubheading>
          
          {apiStatus === 'error' ? (
            <Card>
              <CardHeader>
                <h3>Connection Error</h3>
              </CardHeader>
              <CardContent>
                <p>{error}</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => window.location.reload()} $color="primary">
                  <FaSync /> Retry Connection
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <>
              {!file ? (
                <Card>
                  <CardHeader>
                    <h3>Upload Image</h3>
                  </CardHeader>
                  <CardContent>
                    <UploadArea onFileSelected={handleFileSelected} />
                  </CardContent>
                </Card>
              ) : !results ? (
                <Card>
                  <CardHeader>
                    <h3>Preview & Upload</h3>
                  </CardHeader>
                  <CardContent>
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '400px', 
                        display: 'block',
                        margin: '0 auto',
                        borderRadius: '8px',
                        boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'
                      }} 
                    />
                    
                    {error && (
                      <div style={{ color: 'red', margin: '1rem 0', textAlign: 'center' }}>
                        {error}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleReset} $variant="text" disabled={loading}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleUpload} 
                      $color="primary" 
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : (
                        <>
                          <FaUpload /> Analyze Image
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <>
                  <ResultDisplay results={results} loading={loading} />
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                    <Button onClick={handleReset} $color="primary" $size="large">
                      <FaUpload /> Upload New Image
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
        </Container>
      </MainContent>
    </>
  );
};

export default App;