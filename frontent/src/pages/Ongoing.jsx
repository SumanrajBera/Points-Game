import { useEffect, useState } from 'react';
import { fetchMyGames, fetchAvailableGames, participateInGame } from '../../api/gaming';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Ongoing.css'

export default function Ongoing() {
    const [myGames, setMyGames] = useState([]);
    const [availableGames, setAvailableGames] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const myRes = await fetchMyGames(user._id);
                const availRes = await fetchAvailableGames(user._id);
                setMyGames(myRes || []);
                setAvailableGames(availRes || []);
            } catch (err) {
                toast.error("Failed to load games");
                console.error(err);
            }
        };
        fetchGames();
    }, [user._id]);

    const handleParticipate = async (gameId) => {
        try {
            await participateInGame(gameId);
            toast.success('Participated successfully!');
        } catch (err) {
            console.log(err)
            toast.error(err.response?.data?.message || err.response?.data?.error || 'Error joining game');
        }
    };

    return (
        <>
            <h2>Your Games</h2>
            <hr />
            <div className="gameCards">
                {myGames.length === 0 ? (
                    <p>No games issued by you yet.</p>
                ) : (
                    myGames.map((game) => (
                        <div className="gameCard" key={game._id}>
                            <p>Name: {game.name}</p>
                            <p>Participants: {game.participants.length}/10</p>
                            <button onClick={() => navigate(`/games/${game._id}`)}>View</button>
                        </div>
                    ))
                )}
            </div>
            <h2>Ongoing Games</h2>
            <hr />
            <div className="gameCards">
                {availableGames.length === 0 ? (
                    <p>No games available to join.</p>
                ) : (
                    availableGames.map((game) => (
                        <div className="gameCard" key={game._id}>
                            <p>Name: {game.name}</p>
                            <p>Issued by: {game.issuer.username}</p>
                            <p>Participants: {game.participants.length}/10</p>
                            <button onClick={() => handleParticipate(game._id)}>Participate</button>
                        </div>
                    ))
                )}
            </div>
        </>
    );
};

