import axiosInstance from './axiosInstance';

export const history = async(userId) => {
    const res = await axiosInstance.get(`/api/games/history/${userId}`);
    return res.data
}