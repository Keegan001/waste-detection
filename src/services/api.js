import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const api = {
  /**
   * Upload an image for waste detection
   * @param {File} file - Image file to upload
   * @returns {Promise<Object>} - Detection results
   */
  async detectWaste(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post(`${API_URL}/predict`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error detecting waste:', error);
      throw error;
    }
  },
  
  /**
   * Check API health status
   * @returns {Promise<Object>} - Health status
   */
  async checkHealth() {
    try {
      const response = await axios.get(`${API_URL}/health`);
      return response.data;
    } catch (error) {
      console.error('Error checking health:', error);
      throw error;
    }
  }
}; 