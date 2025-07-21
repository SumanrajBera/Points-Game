import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchGameById, issueDrawAndDeleteGame } from "../../api/gaming";
import { toast } from "react-toastify";

export default function GameView() {
    const { gameId } = useParams();
    const [game, setGame] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        const loadGame = async () => {
            try {
                const res = await fetchGameById(gameId);
                setGame(res);
            } catch (err) {
                toast.error("Failed to fetch game");
            }
        };

        loadGame();
    }, [gameId]);

    const handleFinalDrawAndDelete = async (participantId) => {
        try {
            await issueDrawAndDeleteGame(game._id, participantId);
            toast.success("Final draw issued, game deleted!");
            navigate("/");
        } catch (err) {
            toast.error("Failed to issue final draw or delete game");
        }
    };

    if (!game) return <p>Loading game...</p>;

    return (
        <>
            <h2>Game name: {game.name}</h2>
            <p>Issued by: {game.issuer?.username || "Unknown"}</p>
            <p>Participants: {game.participants.length}/10</p>
            <hr />
            <div style={{ padding: "1rem", backgroundColor: "#f5f5f5" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1rem" }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Selector</th>
                        </tr>
                    </thead>
                    <tbody>
                        {game.participants.length == 0 ? (
                            <tr><td colSpan="3">No participants yet.</td></tr>
                        ) : (game.participants.map((participant, index) => (
                            <tr key={participant._id}>
                                <td>{participant._id}</td>
                                <td>{participant.username}</td>
                                <td>
                                    <button onClick={() => handleFinalDrawAndDelete(participant._id)}>Issue</button>
                                </td>
                            </tr>
                        )))}
                    </tbody>
                </table>
            </div>

        </>
    )
}