import React, { useState, useEffect } from 'react';
import { BookOpenCheck, Save, Search } from 'lucide-react';

export default function Bookings() {
    const [bookings, setBookings] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        room_id: '',
        customer_name: '',
        customer_phone: '',
        check_in_date: new Date().toISOString().slice(0, 10),
        check_out_date: new Date().toISOString().slice(0, 10),
        total_amount: 0,
        payment_method: 'Transfer'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [resBookings, resRooms] = await Promise.all([
                fetch('/api/bookings'),
                fetch('/api/rooms')
            ]);

            if (resBookings.ok) setBookings(await resBookings.json());
            if (resRooms.ok) setRooms(await resRooms.json());

        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Find room price
            const selectedRoom = rooms.find(r => r.room_id == formData.room_id);
            const price = selectedRoom ? parseFloat(selectedRoom.price) : 0;

            // Calculate nights
            const d1 = new Date(formData.check_in_date);
            const d2 = new Date(formData.check_out_date);
            const diffTime = Math.abs(d2 - d1);
            const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

            const payload = {
                ...formData,
                room_price: price,
                nights: nights,
                total_amount: price * nights, // Simple calc for now
                customer_id: 'GUEST-' + Date.now(), // Temp ID generation logic
                status: 'Confirmed'
            };

            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("Booked successfully!");
                fetchData(); // Refresh
                setFormData({
                    room_id: '',
                    customer_name: '',
                    customer_phone: '',
                    check_in_date: new Date().toISOString().slice(0, 10),
                    check_out_date: new Date().toISOString().slice(0, 10),
                    total_amount: 0,
                    payment_method: 'Transfer'
                });
            } else {
                alert("Booking failed");
            }

        } catch (error) {
            console.error("Booking error", error);
            alert("Error creating booking");
        }
    };

    if (loading) return <div>Loading bookings...</div>;

    const availableRooms = rooms.filter(r => r.status === 'Available');

    return (
        <div className="animation-fade-in">
            <div className="row g-4">
                {/* Booking Form */}
                <div className="col-lg-5">
                    <div className="card-panel h-100">
                        <h5 className="fw-bold mb-4 flex items-center gap-2 text-primary">
                            <BookOpenCheck /> จองห้องพักใหม่
                        </h5>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">ชื่อลูกค้า</label>
                                <input required type="text" className="form-control" name="customer_name" value={formData.customer_name} onChange={handleInputChange} placeholder="ระบุชื่อ..." />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">เบอร์โทร</label>
                                <input required type="tel" className="form-control" name="customer_phone" value={formData.customer_phone} onChange={handleInputChange} placeholder="08x-xxx-xxxx" />
                            </div>
                            <div className="row g-2 mb-3">
                                <div className="col-6">
                                    <label className="form-label">Check In</label>
                                    <input required type="date" className="form-control" name="check_in_date" value={formData.check_in_date} onChange={handleInputChange} />
                                </div>
                                <div className="col-6">
                                    <label className="form-label">Check Out</label>
                                    <input required type="date" className="form-control" name="check_out_date" value={formData.check_out_date} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="form-label">เลือกห้องพัก (ว่าง)</label>
                                <select required className="form-select" name="room_id" value={formData.room_id} onChange={handleInputChange}>
                                    <option value="">-- เลือกห้อง --</option>
                                    {availableRooms.map(r => (
                                        <option key={r.room_id} value={r.room_id}>
                                            {r.room_number} ({r.room_type}) - ฿{r.price}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button type="submit" className="btn btn-primary w-100 py-2 fw-bold">
                                <Save size={18} className="inline mr-2" /> ยืนยันการจอง
                            </button>
                        </form>
                    </div>
                </div>

                {/* Booking List */}
                <div className="col-lg-7">
                    <div className="card-panel h-100">
                        <h5 className="fw-bold mb-4">รายการจองล่าสุด</h5>
                        <div className="table-responsive" style={{ maxHeight: '500px' }}>
                            <table className="table table-hover">
                                <thead className="table-light sticky-top">
                                    <tr>
                                        <th>ID</th>
                                        <th>ลูกค้า</th>
                                        <th>ห้อง</th>
                                        <th>เข้า-ออก</th>
                                        <th>สถานะ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map(b => (
                                        <tr key={b.booking_id}>
                                            <td><small>{b.booking_id}</small></td>
                                            <td>
                                                <div className="fw-bold">{b.customer_name}</div>
                                                <small className="text-muted">{b.customer_phone}</small>
                                            </td>
                                            <td>RM-{b.room_id}</td>
                                            <td>
                                                <small>{new Date(b.check_in_date).toLocaleDateString()} - <br />
                                                    {new Date(b.check_out_date).toLocaleDateString()}</small>
                                            </td>
                                            <td><span className="badge bg-green-100 text-green-800 border-green-200 border">{b.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
