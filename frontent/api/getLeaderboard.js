import axiosInstance from "./axiosInstance";

export const getLeaderboard = async (page = 1, limit = 10) => {
  const res = await axiosInstance.get(`/api/games/leaderboard?page=${page}&limit=${limit}`);
  return res;
};
