import axiosInstance from "./axiosInstance";

export const loginUser = async (credentials) => {
  const res = await axiosInstance.post('/api/users/login', credentials);
  return res.data;
};
