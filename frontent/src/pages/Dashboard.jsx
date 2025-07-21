import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchUserById } from '../../api/user';
import { claimPoints } from '../../api/claim';
import { history } from '../../api/history';
import { issueGame } from '../../api/issueGame';
import './Dashboard.css'
import { toast } from 'react-toastify';

export default function Dashboard() {
    const { isLoading } = useAuth();
    const [userData, setUserData] = useState(null);
    const [gameName, setGameName] = useState("")
    const [loading, setLoading] = useState(false);
    const [issuing, setIssuing] = useState(false);
    const [claimHistory, setClaimHistory] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const storedToken = localStorage.getItem("token");
                if (!storedToken) return;

                const payload = JSON.parse(atob(storedToken.split('.')[1]));
                const userId = payload.id || payload._id;

                const res = await fetchUserById(userId);
                setUserData(res.data);

                const claimRes = await history(userId);
                setClaimHistory(claimRes || []);
            } catch (err) {
                console.error("Failed to fetch user", err.response?.data || err.message);
            }
        };

        fetchUser();
    }, []);

    const handleClaim = async () => {
        try {
            setLoading(true);
            const data = await claimPoints();

            setUserData(prev => ({
                ...prev,
                points: data.points,
                draws: data.draws,
            }));

            toast.success(`You earned ${data.earned} points!`);

            const storedToken = localStorage.getItem("token");
            const payload = JSON.parse(atob(storedToken.split('.')[1]));
            const userId = payload.id || payload._id;
            const claimRes = await history(userId);
            setClaimHistory(claimRes || []);

        } catch (err) {
            const msg = err.response?.data?.message || "Claim failed";
            toast.error(msg);
            console.error("Claim error:", msg);
        } finally {
            setLoading(false);
        }
    };

    const handleIssueGame = async(e) => {
        e.preventDefault();
        try {
            setIssuing(true);
            const data = await issueGame(gameName);
            toast.success("Game issued successfully!");

            setGameName(""); 
        } catch (err) {
            const msg = err.response?.data?.message || "Game issue failed";
            toast.error(msg);
            console.error("Game issue error:", msg);
        } finally {
            setIssuing(false);
        }
    }

    if (isLoading || !userData) return <p>Loading dashboard...</p>;

    return (<>
        <h1>Welcome, {userData.username}!</h1>

        <h2>Game Data</h2>
        <hr />
        <div className="dashboard_row1">
            <div className='userInfo'>
                <p><strong>User ID:</strong> {userData._id}</p>
                <p><strong>Username:</strong> {userData.username}</p>
            </div>

            <div className="userPoints">
                <h3>Points Collected:</h3>
                <p>{userData.points} <strong>Pts</strong></p>
            </div>

            <div className="claimPoints">
                <h3>Number of draws: {userData.draws}</h3>
                <button onClick={handleClaim} disabled={userData.draws <= 0}>{userData.draws > 0 ? "Claim Points" : "No Draws Left"}</button>
            </div>
            <div className="issueGame">
                <h3>Issue a Game:</h3>
                <form onSubmit={handleIssueGame}>
                    <label htmlFor="gameName">Name of the Game: </label>
                    <input type="text" name="gameName" id="gameName" value={gameName} placeholder='Enter name of the Game' onChange={(e) => setGameName(e.target.value)} />
                    <button>{issuing ? "Issuing..." : "Issue Game"}</button>
                </form>
            </div>
        </div>

        <h2>Transaction History</h2>
        <hr />
        <div className="dashboard_row2">
            <div className="transHis">
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Date</th>
                            <th>Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {claimHistory.length === 0 ? (
                            <tr><td colSpan="3">No claim history yet.</td></tr>
                        ) : (
                            claimHistory.map((claim, index) => (
                                <tr key={claim._id || index}>
                                    <td>{claim._id}</td>
                                    <td>{new Date(claim.claimedAt).toLocaleDateString()}</td>
                                    <td>{claim.points}</td>
                                </tr>
                            ))
                        )}
                    </tbody>

                </table>
            </div>
        </div>

    </>)
}