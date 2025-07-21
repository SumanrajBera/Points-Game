import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // adjust the path
import { getLeaderboard } from '../../api/getLeaderboard'; // your API call

export default function Leaderboard() {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    const { user } = useAuth(); // 👈 Get current user from context

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await getLeaderboard(page, limit);
                setUsers(res.data.users);
                setTotalPages(res.data.totalPages);
            } catch (err) {
                console.error("Failed to fetch leaderboard", err);
            }
        };

        fetchLeaderboard();
    }, [page]);

    return (
        <div style={{ padding: "1rem", backgroundColor: "#f5f5f5" }}>
            <h2>🏆 Leaderboard</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1rem" }}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Username</th>
                        <th>Points</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u, idx) => {
                        const isCurrentUser = user && u.username === user.username;
                        return (
                            <tr
                                key={u._id}
                                style={{
                                    backgroundColor: isCurrentUser ? "#ffeaa7" : "transparent",
                                    fontWeight: isCurrentUser ? "bold" : "normal",
                                }}
                            >
                                <td>{(page - 1) * limit + idx + 1}</td>
                                <td>{u.username}</td>
                                <td>{u.points}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                >
                    ⬅️ Prev
                </button>
                <span>Page {page} of {totalPages}</span>
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                >
                    Next ➡️
                </button>
            </div>
        </div>
    );
}
