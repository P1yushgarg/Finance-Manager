import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';

const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const storedData = localStorage.getItem('user');
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        if (!storedData || isLoggedIn !== 'true') {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div className="container" style={{ flex: 1, padding: '3rem 2rem 5rem 2rem' }}>
                <Outlet />
            </div>
        </div>
    );
};

export default Dashboard;
