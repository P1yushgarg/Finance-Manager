import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import BottomNav from '../components/layout/BottomNav';

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
            <div className="container dashboard-content-wrapper" style={{ flex: 1 }}>
                <Outlet />
            </div>
            <BottomNav />
        </div>
    );
};

export default Dashboard;
