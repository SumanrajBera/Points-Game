import axiosInstance from "./axiosInstance";

export const registerUser = async (userData) => {
  const res = await axiosInstance.post('/api/users/register', userData);
  return res.data;
};
