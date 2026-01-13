import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, BedDouble, Users, CalendarDays, Receipt, Settings,
  LogOut, Menu, X, Plus, ChevronDown, Save, Sparkles, Send, Bot,
  Loader2, TrendingUp, DollarSign, CheckCircle, Clock, MoreHorizontal,
  Check, Database, LogIn, Scan, MapPin, FileText, AlertCircle, 
  Phone, CreditCard, Zap, Droplets, Building2, UserPlus, Wrench,
  Filter, Search, Bell, Download, Upload, Trash2
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';

// ============================================================================
// TYPES & ENUMS
// ============================================================================
enum RoomStatus {
  Available = 'ว่าง',
  Occupied = 'มีผู้เข้าพัก',
  Cleaning = 'ทำความสะอาด',
  Maintenance = 'ซ่อมบำรุง'
}

enum BookingStatus {
  Confirmed = 'ยืนยันแล้ว',
  CheckedIn = 'เข้าพักแล้ว',
  CheckedOut = 'เช็คเอาท์แล้ว',
  Cancelled = 'ยกเลิก'
}

interface Room {
  room_id: string;
  room_number: string;
  room_type: string;
  building: string;
  floor: number;
  price_per_night: number;
  status: RoomStatus;
  guest?: string;
  phone?: string;
  deposit?: number;
  checkInDate?: string;
  elecStart?: number;
  waterStart?: number;
}

interface Customer {
  customer_id: string;
  name: string;
  phone: string;
  email?: string;
  id_card?: string;
  customer_type: 'Regular' | 'VIP';
  date_of_birth?: string;
  address?: string;
  notes?: string;
}

interface Booking {
  booking_id: string;
  customer_id: string;
  room_id: string;
  check_in_date: string;
  check_out_date: string;
  total_amount: number;
  status: BookingStatus;
  payment_status: string;
  channel: string;
}

// ============================================================================
// MOCK DATA
// ============================================================================
const MOCK_ROOMS: Room[] = [
  { room_id: 'R001', room_number: '101', room_type: 'Standard', building: 'A', floor: 1, price_per_night: 1200, status: RoomStatus.Available },
  { room_id: 'R002', room_number: '102', room_type: 'Deluxe', building: 'A', floor: 1, price_per_night: 1800, status: RoomStatus.Occupied, guest: 'สมชาย ใจดี', phone: '081-234-5678', deposit: 2000 },
  { room_id: 'R003', room_number: '103', room_type: 'Suite', building: 'A', floor: 1, price_per_night: 2500, status: RoomStatus.Cleaning },
  { room_id: 'R004', room_number: '201', room_type: 'Standard', building: 'A', floor: 2, price_per_night: 1200, status: RoomStatus.Available },
  { room_id: 'R005', room_number: '202', room_type: 'Deluxe', building: 'A', floor: 2, price_per_night: 1800, status: RoomStatus.Maintenance },
  { room_id: 'R006', room_number: '203', room_type: 'Standard', building: 'B', floor: 2, price_per_night: 1200, status: RoomStatus.Available },
  { room_id: 'R007', room_number: '301', room_type: 'Suite', building: 'B', floor: 3, price_per_night: 2500, status: RoomStatus.Available },
  { room_id: 'R008', room_number: '302', room_type: 'Deluxe', building: 'B', floor: 3, price_per_night: 1800, status: RoomStatus.Occupied, guest: 'วิไล สุขใจ', phone: '082-345-6789', deposit: 2000 },
];

const MOCK_CUSTOMERS: Customer[] = [
  { customer_id: 'C001', name: 'สมชาย ใจดี', phone: '081-234-5678', email: 'somchai@email.com', customer_type: 'VIP', id_card: '1-1234-56789-01-2' },
  { customer_id: 'C002', name: 'สมหญิง รักษ์ดี', phone: '082-345-6789', customer_type: 'Regular', id_card: '1-2345-67890-12-3' },
  { customer_id: 'C003', name: 'วิไล สุขใจ', phone: '083-456-7890', customer_type: 'Regular', id_card: '1-3456-78901-23-4' },
];

const MOCK_BOOKINGS: Booking[] = [
  { booking_id: 'BK001', customer_id: 'C001', room_id: 'R002', check_in_date: '2026-01-13', check_out_date: '2026-01-15', total_amount: 3600, status: BookingStatus.CheckedIn, payment_status: 'Paid', channel: 'Walk-in' },
  { booking_id: 'BK002', customer_id: 'C003', room_id: 'R008', check_in_date: '2026-01-12', check_out_date: '2026-01-14', total_amount: 3600, status: BookingStatus.CheckedIn, payment_status: 'Paid', channel: 'Online' },
];

const MOCK_REVENUE_DATA = [
  { date: '7 ม.ค.', revenue: 12000 },
  { date: '8 ม.ค.', revenue: 18000 },
  { date: '9 ม.ค.', revenue: 15000 },
  { date: '10 ม.ค.', revenue: 22000 },
  { date: '11 ม.ค.', revenue: 19000 },
  { date: '12 ม.ค.', revenue: 25000 },
  { date: '13 ม.ค.', revenue: 28000 },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
const getStatusColor = (status: RoomStatus): string => {
  const colorMap = {
    [RoomStatus.Available]: 'bg-green-500',
    [RoomStatus.Occupied]: 'bg-blue-500',
    [RoomStatus.Cleaning]: 'bg-orange-500',
    [RoomStatus.Maintenance]: 'bg-red-500'
  };
  return colorMap[status] || 'bg-gray-500';
};

const getStatusBgColor = (status: RoomStatus): string => {
  const colorMap = {
    [RoomStatus.Available]: 'bg-white border-2 border-green-500 text-slate-800',
    [RoomStatus.Occupied]: 'bg-blue-600 text-white shadow-blue-200',
    [RoomStatus.Cleaning]: 'bg-orange-400 text-white',
    [RoomStatus.Maintenance]: 'bg-red-500 text-white'
  };
  return colorMap[status] || 'bg-gray-500';
};

const calculateNights = (checkIn: string, checkOut: string): number => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

// ============================================================================
// AI ASSISTANT COMPONENT
// ============================================================================
interface AIMessage {
  role: 'user' | 'model';
  text: string;
}

const AIAssistant: React.FC<{ rooms: Room[]; bookings: Booking[] }> = React.memo(({ rooms, bookings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([
    { role: 'model', text: 'สวัสดีครับ ระบบเชื่อมต่อข้อมูลเรียบร้อยแล้ว มีอะไรให้ช่วยไหมครับ?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const stats = {
        totalRooms: rooms.length,
        available: rooms.filter(r => r.status === RoomStatus.Available).length,
        occupied: rooms.filter(r => r.status === RoomStatus.Occupied).length,
        revenueToday: bookings.filter(b => b.check_in_date === new Date().toISOString().split('T')[0]).reduce((sum, b) => sum + b.total_amount, 0)
      };

      let response = '';
      const lowerInput = userMessage.toLowerCase();
      
      if (lowerInput.includes('ห้อง') && (lowerInput.includes('ว่าง') || lowerInput.includes('available'))) {
        response = `ขณะนี้มีห้องว่าง ${stats.available} ห้องจากทั้งหมด ${stats.totalRooms} ห้องครับ มีผู้เข้าพัก ${stats.occupied} ห้อง`;
      } else if (lowerInput.includes('รายได้') || lowerInput.includes('ยอดขาย') || lowerInput.includes('revenue')) {
        response = `รายได้วันนี้อยู่ที่ ฿${stats.revenueToday.toLocaleString()} บาทครับ`;
      } else if (lowerInput.includes('สถานะ') || lowerInput.includes('ภาพรวม') || lowerInput.includes('overview')) {
        response = `📊 ภาพรวมโรงแรม:\n• ห้องว่าง: ${stats.available} ห้อง\n• มีผู้เข้าพัก: ${stats.occupied} ห้อง\n• รายได้วันนี้: ฿${stats.revenueToday.toLocaleString()}`;
      } else if (lowerInput.includes('ห้องไหน') || lowerInput.includes('แนะนำ')) {
        const availableRooms = rooms.filter(r => r.status === RoomStatus.Available);
        if (availableRooms.length > 0) {
          response = `ห้องว่างที่แนะนำ: ${availableRooms.slice(0, 3).map(r => `${r.room_number} (${r.room_type} ฿${r.price_per_night})`).join(', ')}`;
        } else {
          response = 'ขออภัยครับ ขณะนี้ไม่มีห้องว่างค่ะ';
        }
      } else {
        response = 'ผมสามารถช่วยคุณเรื่อง: สอบถามห้องว่าง, ดูรายได้, ภาพรวมโรงแรม หรือแนะนำห้องพักได้ครับ 😊';
      }

      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'ระบบ AI ขัดข้องชั่วคราว กรุณาลองใหม่อีกครั้ง' }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, rooms, bookings]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50 animate-bounce"
        aria-label="AI Assistant"
      >
        <Sparkles size={28} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col z-50 animate-in slide-in-from-bottom-5">
      <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center gap-3 rounded-t-3xl">
        <Bot size={24} />
        <div className="flex-1">
          <h3 className="font-bold">AI Assistant</h3>
          <p className="text-xs text-blue-100">พร้อมให้บริการ 24/7</p>
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-sm' 
                : 'bg-white text-slate-800 shadow-sm rounded-bl-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl shadow-sm">
              <Loader2 size={16} className="animate-spin text-blue-600" />
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-white border-t rounded-b-3xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="ถามข้อมูลโรงแรม..."
            className="flex-1 border-2 border-slate-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            disabled={isLoading}
          />
          <button 
            onClick={handleSend} 
            disabled={isLoading || !input.trim()} 
            className="p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
});

AIAssistant.displayName = 'AIAssistant';

// ============================================================================
// QUICK ACTION MODAL (สำหรับจัดการห้องด่วน)
// ============================================================================
interface QuickActionModalProps {
  room: Room | null;
  onClose: () => void;
  onCheckIn: () => void;
  onCheckOut: (roomId: string) => void;
  onChangeStatus: (roomId: string, status: RoomStatus) => void;
}

const QuickActionModal: React.FC<QuickActionModalProps> = ({ room, onClose, onCheckIn, onCheckOut, onChangeStatus }) => {
  if (!room) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in-95">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-3xl font-black">ห้อง {room.room_number}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="mb-6 p-4 bg-slate-50 rounded-2xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-500">สถานะปัจจุบัน</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(room.status)} text-white`}>
              {room.status}
            </span>
          </div>
          {room.guest && (
            <>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-slate-500">ผู้เข้าพัก:</span>
                <span className="font-bold">{room.guest}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-slate-500">โทรศัพท์:</span>
                <span className="font-medium">{room.phone}</span>
              </div>
            </>
          )}
        </div>

        <div className="space-y-3">
          {room.status === RoomStatus.Available && (
            <button 
              onClick={onCheckIn}
              className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-blue-700 transition-colors shadow-lg"
            >
              <UserPlus size={24}/> ลงทะเบียนเช็คอิน
            </button>
          )}
          
          {room.status === RoomStatus.Occupied && (
            <button 
              onClick={() => onCheckOut(room.room_id)}
              className="w-full bg-orange-500 text-white p-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-orange-600 transition-colors shadow-lg"
            >
              <LogOut size={24}/> เช็คเอาท์ / คืนห้อง
            </button>
          )}
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => onChangeStatus(room.room_id, RoomStatus.Cleaning)}
              className="bg-orange-100 text-orange-700 p-4 rounded-2xl font-bold text-sm flex flex-col items-center gap-2 hover:bg-orange-200 transition-colors"
            >
              <Check size={20}/> ทำความสะอาด
            </button>
            <button 
              onClick={() => onChangeStatus(room.room_id, RoomStatus.Maintenance)}
              className="bg-red-100 text-red-700 p-4 rounded-2xl font-bold text-sm flex flex-col items-center gap-2 hover:bg-red-200 transition-colors"
            >
              <Wrench size={20}/> แจ้งซ่อม
            </button>
          </div>
          
          {room.status !== RoomStatus.Available && (
            <button 
              onClick={() => onChangeStatus(room.room_id, RoomStatus.Available)}
              className="w-full bg-green-100 text-green-700 p-3 rounded-2xl font-bold text-sm hover:bg-green-200 transition-colors"
            >
              ✓ เปลี่ยนเป็นห้องว่าง
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// CHECK-IN FORM MODAL (ฟอร์มเช็คอินแบบเต็ม)
// ============================================================================
interface CheckInFormModalProps {
  isOpen: boolean;
  room: Room | null;
  customers: Customer[];
  onClose: () => void;
  onSave: (data: any) => void;
}

const CheckInFormModal: React.FC<CheckInFormModalProps> = ({ isOpen, room, customers, onClose, onSave }) => {
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    customer_id: '',
    guestName: '',
    phone: '',
    idCard: '',
    checkInDate: today,
    checkOutDate: '',
    deposit: '',
    elecStart: '',
    waterStart: '',
    notes: ''
  });
  const [isSimulating, setIsSimulating] = useState(false);

  const handleChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleOCR = useCallback(async () => {
    setIsSimulating(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    setFormData(prev => ({
      ...prev,
      guestName: 'สมศรี มีโชค',
      idCard: '3-4509-00123-45-6',
    }));
    setIsSimulating(false);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  }, [formData, onSave]);

  if (!isOpen || !room) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-lg" onClick={onClose} />
      <div className="relative bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-10">
        
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-black flex items-center gap-3">
              <UserPlus size={28}/> เช็คอินห้อง {room.room_number}
            </h3>
            <p className="text-xs text-blue-100 mt-1">{room.room_type} • ฿{room.price_per_night}/คืน</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* OCR Simulation */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-100 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <Scan size={24} />
              </div>
              <div>
                <h4 className="font-bold text-blue-900">Smart ID Scan</h4>
                <p className="text-xs text-blue-600">สแกนบัตรประชาชนเพื่อกรอกอัตโนมัติ</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleOCR}
              disabled={isSimulating}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {isSimulating ? <Loader2 size={16} className="animate-spin" /> : <Scan size={16} />}
              {isSimulating ? 'กำลังสแกน...' : 'สแกน'}
            </button>
          </div>

          {/* Customer Selection */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">เลือกจากฐานข้อมูล</label>
            <select
              value={formData.customer_id}
              onChange={(e) => {
                const customer = customers.find(c => c.customer_id === e.target.value);
                if (customer) {
                  setFormData(prev => ({
                    ...prev,
                    customer_id: e.target.value,
                    guestName: customer.name,
                    phone: customer.phone,
                    idCard: customer.id_card || ''
                  }));
                } else {
                  handleChange('customer_id', e.target.value);
                }
              }}
              className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">-- เลือกลูกค้าเก่า หรือกรอกข้อมูลใหม่ --</option>
              {customers.map(c => (
                <option key={c.customer_id} value={c.customer_id}>
                  {c.name} ({c.phone}) {c.customer_type === 'VIP' && '⭐'}
                </option>
              ))}
            </select>
          </div>

          {/* Guest Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">ชื่อ-นามสกุล *</label>
              <div className="relative">
                <Users className="absolute left-4 top-3.5 text-slate-400" size={18}/>
                <input 
                  required
                  type="text" 
                  value={formData.guestName}
                  onChange={(e) => handleChange('guestName', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-colors" 
                  placeholder="ระบุชื่อจริง-นามสกุล" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">เบอร์โทรศัพท์ *</label>
              <div className="relative">
                <Phone className="absolute left-4 top-3.5 text-slate-400" size={18}/>
                <input 
                  required
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-blue-500" 
                  placeholder="0xx-xxx-xxxx" 
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">เลขบัตรประชาชน</label>
            <div className="relative">
              <CreditCard className="absolute left-4 top-3.5 text-slate-400" size={18}/>
              <input 
                type="text" 
                value={formData.idCard}
                onChange={(e) => handleChange('idCard', e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-blue-500" 
                placeholder="x-xxxx-xxxxx-xx-x" 
              />
            </div>
          </div>

          {/* Dates & Deposit */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">วันเช็คอิน</label>
              <input 
                type="date" 
                value={formData.checkInDate}
                onChange={(e) =>
