import axios from 'axios';

const API_URL = 'http://localhost:5004/api/daily-usage';

// Get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const dailyUsageAPI = {
  getTodayUsage: () => axios.get(API_URL, getAuthHeader()),
  recordUsage: (data) => axios.post(API_URL, data, getAuthHeader())
};
