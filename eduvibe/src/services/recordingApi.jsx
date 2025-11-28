import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const recordingApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const searchRecordings = async (query) => {
  try {
    const response = await recordingApi.get('/recordings/search', {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching recordings:', error);
    throw error;
  }
};

export const getAllRecordings = async () => {
  try {
    const response = await recordingApi.get('/recordings');
    return response.data;
  } catch (error) {
    console.error('Error fetching recordings:', error);
    throw error;
  }
};

export const getPendingRecordings = async () => {
  try {
    const response = await recordingApi.get('/recordings/pending');
    return response.data;
  } catch (error) {
    console.error('Error fetching pending recordings:', error);
    throw error;
  }
};

export const approveRecording = async (recordingId) => {
  try {
    const response = await recordingApi.post(`/recordings/${recordingId}/approve`);
    return response.data;
  } catch (error) {
    console.error('Error approving recording:', error);
    throw error;
  }
};

export const rejectRecording = async (recordingId, reason) => {
  try {
    const response = await recordingApi.post(`/recordings/${recordingId}/reject`, { reason });
    return response.data;
  } catch (error) {
    console.error('Error rejecting recording:', error);
    throw error;
  }
};

export const deleteRecording = async (recordingId) => {
  try {
    const response = await recordingApi.delete(`/recordings/${recordingId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting recording:', error);
    throw error;
  }
};

export default recordingApi;
