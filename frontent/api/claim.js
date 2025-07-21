import axiosInstance from './axiosInstance';

export const claimPoints = async () => {
  const res = await axiosInstance.post('/api/games/claim');
  return res.data;
};