import { useState } from "react"
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'
import { loginUser } from "../../api/login";
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext'

export default function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const { login } = useAuth();

    const handleSubmit = async(e) => {
        e.preventDefault()
        try {
            const res = await loginUser({ username, password });

            // Store token
            localStorage.setItem("token", res.token);

            // Update Context
            login(res.token);

            // Toast Notification
            toast.success(res.message); 

            // Redirect dashboard
            setTimeout(() => navigate("/"),
                1000
            )
        } catch (err) {
            const msg = err.response?.data?.message|| err.response?.data?.error || "Login failed";
            if (Array.isArray(msg)) {
                msg.forEach((error) => {
                    toast.error(error);
                });
            }
            toast.error(msg);
        }
    }

    return (
        <div className="login_form" >
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input type="text" name="username" id="username" value={username} placeholder="Enter your username" onChange={(e) => setUsername(e.target.value)} />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" value={password} placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
                <button>Login</button>
                <Link className="form_link" to={"/register"}>Don't have an account?</Link>
            </form>
        </div>
    )
}