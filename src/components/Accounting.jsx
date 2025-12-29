import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount);
};

export default function Accounting() {
    const [ledger, setLedger] = useState([]);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });

    useEffect(() => {
        fetchLedger();
    }, []);

    const fetchLedger = async () => {
        try {
            const res = await fetch('/api/ledger');
            if (res.ok) {
                const data = await res.json();
                setLedger(data);
                calculateSummary(data);
            }
        } catch (error) {
            console.error("Error fetching ledger", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateSummary = (data) => {
        const income = data.reduce((sum, item) => sum + parseFloat(item.income || 0), 0);
        const expense = data.reduce((sum, item) => sum + parseFloat(item.expense || 0), 0);

        // Balance from latest entry or calc
        const latestBalance = data.length > 0 ? parseFloat(data[0].balance) : 0;

        setSummary({ income, expense, balance: latestBalance });
    };

    if (loading) return <div>Loading accounting...</div>;

    return (
        <div className="animation-fade-in">
            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <div className="stat-card bg-success text-white">
                        <div>
                            <small className="opacity-75">รายรับรวม</small>
                            <h4 className="m-0">{formatCurrency(summary.income)}</h4>
                        </div>
                        <TrendingUp className="opacity-50" size={32} />
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="stat-card bg-danger text-white">
                        <div>
                            <small className="opacity-75">รายจ่ายรวม</small>
                            <h4 className="m-0">{formatCurrency(summary.expense)}</h4>
                        </div>
                        <TrendingDown className="opacity-50" size={32} />
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="stat-card bg-primary text-white">
                        <div>
                            <small className="opacity-75">ยอดคงเหลือ (Latest)</small>
                            <h4 className="m-0">{formatCurrency(summary.balance)}</h4>
                        </div>
                        <Wallet className="opacity-50" size={32} />
                    </div>
                </div>
            </div>

            <div className="card-panel">
                <h5 className="fw-bold mb-4 flex items-center gap-2">
                    <DollarSign /> รายการเดินบัญชีล่าสุด
                </h5>
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>วันที่</th>
                                <th>รายการ</th>
                                <th>ห้อง</th>
                                <th className="text-end text-success">ยอดรับ</th>
                                <th className="text-end text-danger">ยอดจ่าย</th>
                                <th className="text-end fw-bold">คงเหลือ</th>
                                <th>หมายเหตุ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ledger.map((item) => (
                                <tr key={item.id}>
                                    <td className="small text-muted">{new Date(item.date).toLocaleDateString('th-TH')}</td>
                                    <td className="fw-bold">{item.item}</td>
                                    <td className="text-center">{item.room_id || '-'}</td>
                                    <td className="text-end text-success">{parseFloat(item.income) > 0 ? formatCurrency(item.income) : '-'}</td>
                                    <td className="text-end text-danger">{parseFloat(item.expense) > 0 ? formatCurrency(item.expense) : '-'}</td>
                                    <td className="text-end fw-bold">{formatCurrency(item.balance)}</td>
                                    <td className="small text-muted">{item.note}</td>
                                </tr>
                            ))}
                            {ledger.length === 0 && (
                                <tr><td colSpan="7" className="text-center py-4 text-muted">ไม่พบรายการเดินบัญชี</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
