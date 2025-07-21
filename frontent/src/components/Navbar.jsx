import './Navbar.css'
import { useState } from 'react';

export default function Navbar({ toggleSidebar }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen(prev => !prev);
        toggleSidebar(); 
    };

    return (
        <nav>
            <div>
                <p>POINTS GAME</p>
            </div>
            <div className='menuBtn'>
                <button onClick={handleToggle}><i className={isOpen ? "ri-close-line" : "ri-menu-line"}></i></button>
            </div>
        </nav>
    )
}