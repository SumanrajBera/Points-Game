import axiosInstance from './axiosInstance';

export const issueGame = async(name) => {
    const res = await axiosInstance.post(`/api/games/createGames`, {name});
    return res.data
}