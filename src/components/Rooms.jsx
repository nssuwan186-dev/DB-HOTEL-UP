import React, { useState, useEffect } from 'react';
import { BedDouble, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function Rooms() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const res = await fetch('/api/rooms'); // Vercel rewrite handles this
            if (res.ok) {
                const data = await res.json();
                setRooms(data);
            }
        } catch (error) {
            console.error("Error fetching rooms", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Available': return 'available'; // CSS class
            case 'Occupied': return 'occupied';
            case 'Cleaning': return 'cleaning';
            default: return '';
        }
    };

    // Group rooms by building (assuming room_number like 'A101')
    const groupedRooms = rooms.reduce((acc, room) => {
        const building = room.room_number.charAt(0);
        if (!acc[building]) acc[building] = [];
        acc[building].push(room);
        return acc;
    }, {});

    if (loading) return <div>Loading rooms...</div>;

    return (
        <div className="card-panel animation-fade-in">
            <h5 className="fw-bold mb-4 flex items-center gap-2">
                <BedDouble /> สถานะห้องพัก
            </h5>

            {Object.keys(groupedRooms).sort().map(building => (
                <div key={building} className="mb-4">
                    <div className="building-header">
                        ตึก {building}
                    </div>
                    <div className="room-grid">
                        {groupedRooms[building].map(room => (
                            <div key={room.room_id} className={`room-card ${getStatusColor(room.status)}`}>
                                <div className="number">{room.room_number}</div>
                                <div className="type">{room.room_type}</div>
                                <div className="mt-1 font-bold text-slate-600">฿{room.price}</div>
                                <div className="text-xs text-muted-foreground mt-1">{room.status}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
