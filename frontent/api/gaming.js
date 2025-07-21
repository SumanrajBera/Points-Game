import axiosInstance from './axiosInstance';

// Get games where current user is the issuer
export const fetchMyGames = async () => {
    const res = await axiosInstance.get('/api/games/myGames');
    return res.data;
};

// Get available games user can join
export const fetchAvailableGames = async () => {
    const res = await axiosInstance.get('/api/games/availableGames');
    return res.data;
};

// Participate in a game
export const participateInGame = async (gameId) => {
    const res = await axiosInstance.post(`/api/games/participate/${gameId}`);
    return res.data;
};

// Fetch Game by Id
export const fetchGameById = async (gameId) => {
    const res = await axiosInstance.get(`/api/games/view/${gameId}`);
    return res.data;
};

// Issue and delete

export const issueDrawAndDeleteGame = async (gameId, participantId) => {
    const res = await axiosInstance.post(`/api/games/issue-and-delete/${gameId}/${participantId}`);
    return res.data;
};