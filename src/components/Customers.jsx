import React, { useState, useEffect } from 'react';
import { Users, Search, Phone, History } from 'lucide-react';

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await fetch('/api/customers');
            if (res.ok) {
                const data = await res.json();
                setCustomers(data);
            }
        } catch (error) {
            console.error("Error fetching customers", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm)
    );

    if (loading) return <div>Loading customers...</div>;

    return (
        <div className="card-panel animation-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold m-0 flex items-center gap-2">
                    <Users /> ทะเบียนลูกค้า ({customers.length})
                </h5>
                <div className="input-group w-auto">
                    <span className="input-group-text"><Search size={16} /></span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="ค้นหาชื่อ/เบอร์..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>ID</th>
                            <th>ชื่อ-นามสกุล</th>
                            <th>เบอร์โทร</th>
                            <th>ประเภท</th>
                            <th>หมายเหตุ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCustomers.map(cust => (
                            <tr key={cust.customer_id}>
                                <td><span className="badge bg-light text-dark border">{cust.customer_id}</span></td>
                                <td className="fw-bold">{cust.name}</td>
                                <td><div className="flex items-center gap-1"><Phone size={14} className="text-muted" /> {cust.phone}</div></td>
                                <td><span className={`badge ${cust.customer_type === 'VIP' ? 'bg-warning text-dark' : 'bg-secondary'}`}>{cust.customer_type}</span></td>
                                <td className="small text-muted">{cust.notes || '-'}</td>
                            </tr>
                        ))}
                        {filteredCustomers.length === 0 && (
                            <tr><td colSpan="5" className="text-center py-4 text-muted">ไม่พบข้อมูลลูกค้า</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
