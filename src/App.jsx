import React, { useState, useEffect } from 'react';
import { LayoutDashboard, BedDouble, CalendarPlus, BookOpenCheck, Users, Wallet, Settings, Menu, User, DollarSign, Home } from 'lucide-react';

// Simple currency formatter
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount);
};

function App() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/stats');
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (error) {
            console.error("Failed to fetch stats", error);
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard stats={stats} />;
            default:
                return (
                    <div className="card-panel text-center py-5">
                        <h2 className="text-muted mb-3">ส่วนนี้กำลังพัฒนา ({activeTab})</h2>
                        <p>Features for {activeTab} will be available soon.</p>
                    </div>
                );
        }
    };

    return (
        <>
            <div className="sidebar">
                <div className="logo">
                    <Home size={24} />
                    <span>VIPAT Hotel <span className="badge bg-primary" style={{ fontSize: '0.5rem', verticalAlign: 'middle' }}>PRO</span></span>
                </div>
                <nav>
                    <MenuItem id="dashboard" icon={<LayoutDashboard size={20} />} label="แดชบอร์ด" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                    <MenuItem id="rooms" icon={<BedDouble size={20} />} label="จัดการห้องพัก" active={activeTab === 'rooms'} onClick={() => setActiveTab('rooms')} />
                    <MenuItem id="checkin" icon={<CalendarPlus size={20} />} label="จองห้อง/เช็คอิน" active={activeTab === 'checkin'} onClick={() => setActiveTab('checkin')} />
                    <MenuItem id="bookings" icon={<BookOpenCheck size={20} />} label="รายการจอง" active={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')} />
                    <MenuItem id="customers" icon={<Users size={20} />} label="ฐานข้อมูลลูกค้า" active={activeTab === 'customers'} onClick={() => setActiveTab('customers')} />
                    <MenuItem id="accounting" icon={<Wallet size={20} />} label="บัญชี & รายจัดการ" active={activeTab === 'accounting'} onClick={() => setActiveTab('accounting')} />

                    <div style={{ marginTop: 'auto' }}>
                        <MenuItem id="settings" icon={<Settings size={20} />} label="ตั้งค่าระบบ" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                    </div>
                </nav>
            </div>

            <main className="content">
                <header className="content-header">
                    <div className="d-flex align-items-center gap-3">
                        <Menu className="d-md-none cursor-pointer" />
                        <h4 className="fw-bold m-0" style={{ textTransform: 'capitalize' }}>{activeTab}</h4>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <div className="text-end d-none d-sm-block">
                            <div className="fw-bold">ผู้ดูแลระบบ</div>
                            <small className="text-muted">Admin</small>
                        </div>
                        <div className="avatar bg-light rounded-circle p-2 border"><User size={20} /></div>
                    </div>
                </header>

                <div className="page-content active" style={{ display: 'block' }}>
                    {loading ? (
                        <div className="d-flex justify-content-center mt-5">
                            <div className="spinner-border text-primary"></div>
                        </div>
                    ) : (
                        renderContent()
                    )}
                </div>
            </main>
        </>
    );
}

const MenuItem = ({ icon, label, active, onClick }) => (
    <div className={`menu-item ${active ? 'active' : ''}`} onClick={onClick}>
        {icon} <span>{label}</span>
    </div>
);

const Dashboard = ({ stats }) => {
    if (!stats) return null;
    return (
        <div className="row g-3">
            <StatCard title="รายรับรวม" value={formatCurrency(stats.total_revenue)} icon={<DollarSign size={24} className="text-success op-50" />} />
            <StatCard title="รายจ่ายรวม" value={formatCurrency(stats.total_expenses)} icon={<DollarSign size={24} className="text-danger op-50" />} />
            <StatCard title="ห้องว่าง" value={stats.available_rooms} icon={<BedDouble size={24} className="text-primary op-50" />} />
            <StatCard title="เข้าพักแล้ว" value={stats.occupied_rooms} icon={<Home size={24} className="text-info op-50" />} />
        </div>
    );
};

const StatCard = ({ title, value, icon }) => (
    <div className="col-md-3">
        <div className="stat-card">
            <div>
                <small className="text-muted">{title}</small>
                <h3 className="m-0 mt-1">{value}</h3>
            </div>
            <div className="p-3 bg-light rounded-circle">
                {icon}
            </div>
        </div>
    </div>
);

export default App;
