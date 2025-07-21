import { useState } from "react"
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from "../../api/register";
import { toast } from 'react-toastify';

export default function Register() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await registerUser({ username, email, password });
            toast.success(res.message);
            setTimeout(() => navigate("/login"), 1000);
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.error || "Registration failed";
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
                <input type="text" name="username" id="username" value={username} placeholder="Enter username" onChange={(e) => setUsername(e.target.value)} />
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" value={email} placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" value={password} placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} />
                <button>Register</button>
                <Link className="form_link" to={"/login"}>Already have an account?</Link>
            </form>
        </div>
    )
}