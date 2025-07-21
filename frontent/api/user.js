import axiosInstance from "./axiosInstance"; // adjust path if needed

export const fetchUserById = async (userId) => {
  let res = await axiosInstance.get(`/api/users/${userId}`);
  return res;
};