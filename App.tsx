import React, { useState, useMemo, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  LayoutDashboard, 
  BedDouble, 
  Users, 
  CalendarDays, 
  Receipt, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Plus, 
  Search, 
  Filter, 
  ChevronDown, 
  Save,
  Sparkles,
  Send,
  Bot,
  Loader2,
  TrendingUp,
  DollarSign,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Check,
  Database,
  RefreshCw,
  LogIn,
  Scan,
  MapPin,
  FileText
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { Room, RoomStatus, Customer, BookingStatus, Booking } from './types';
import { MOCK_ROOMS, MOCK_CUSTOMERS, MOCK_BOOKINGS, MOCK_REVENUE_DATA } from './constants';

// --- Helpers ---
const tRoomStatus = (status: RoomStatus) => {
  switch (status) {
    case RoomStatus.Available: return 'ว่าง';
    case RoomStatus.Occupied: return 'ไม่ว่าง';
    case RoomStatus.Maintenance: return 'ปรับปรุง';
    case RoomStatus.Cleaning: return 'ทำความสะอาด';
    default: return status;
  }
};

const getStatusColor = (status: RoomStatus) => {
  switch (status) {
    case RoomStatus.Available: return 'bg-green-500';
    case RoomStatus.Occupied: return 'bg-red-500';
    case RoomStatus.Maintenance: return 'bg-slate-500';
    case RoomStatus.Cleaning: return 'bg-orange-500';
    default: return 'bg-gray-500';
  }
};

const getStatusBadgeColor = (status: RoomStatus) => {
  switch (status) {
    case RoomStatus.Available: return 'bg-green-100 text-green-700';
    case RoomStatus.Occupied: return 'bg-red-100 text-red-700';
    case RoomStatus.Maintenance: return 'bg-slate-100 text-slate-700';
    case RoomStatus.Cleaning: return 'bg-orange-100 text-orange-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

// --- AI Assistant Component ---
const AIAssistant = ({ rooms, bookings }: { rooms: Room[], bookings: Booking[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: 'สวัสดีครับ ระบบเชื่อมต่อข้อมูลเรียบร้อยแล้ว มีอะไรให้ช่วยไหมครับ?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Enhanced Context with "Real" Data
      const revenueToday = bookings
        .filter(b => b.check_in_date === new Date().toISOString().split('T')[0])
        .reduce((sum, b) => sum + b.total_amount, 0);

      const contextData = JSON.stringify({
        summary: {
          totalRooms: rooms.length,
          occupied: rooms.filter(r => r.status === RoomStatus.Occupied).length,
          available: rooms.filter(r => r.status === RoomStatus.Available).length,
          cleaning: rooms.filter(r => r.status === RoomStatus.Cleaning).length,
          revenueToday: revenueToday
        },
        roomDetails: rooms.map(r => ({ number: r.room_number, status: r.status, price: r.price_per_night })),
        recentBookingsCount: bookings.length
      });

      const systemInstruction = `You are a helpful hotel management assistant connected to the live database. 
      Current Data Context: ${contextData}. 
      Answer in Thai. Keep it professional but friendly. Short answers are preferred for quick reading.`;

      const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: { systemInstruction }
      });

      const response = await chat.sendMessage({ message: userMessage });
      setMessages(prev => [...prev, { role: 'model', text: response.text || 'ขออภัย เกิดข้อผิดพลาด' }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'ระบบ AI ขัดข้องชั่วคราว' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 transition-transform z-50"
      >
        {isOpen ? <X size={24} /> : <Sparkles size={24} />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50 animate-in slide-in-from-bottom-5 fade-in duration-200 font-sans overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center gap-3">
            <Bot size={20} />
            <div>
              <h3 className="font-bold text-sm">ผู้ช่วยอัจฉริยะ</h3>
              <p className="text-xs text-blue-100">Gemini AI • Connected</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && <Loader2 size={16} className="animate-spin text-blue-600 ml-4" />}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-3 bg-white border-t flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="ถามข้อมูลโรงแรม..."
              className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
            <button onClick={handleSend} disabled={isLoading || !input.trim()} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50">
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// --- Booking Form Modal ---
const BookingFormModal = ({ isOpen, onClose, onSave, customers, rooms }: any) => {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    customer_id: '',
    room_id: '',
    room_rate: 0,
    check_in_date: today,
    check_out_date: tomorrow,
    channel: 'Walk-in'
  });

  const [isRoomSelectOpen, setIsRoomSelectOpen] = useState(false);

  const selectedRoom = rooms.find((r: Room) => r.room_id === formData.room_id);
  const nights = useMemo(() => {
    const start = new Date(formData.check_in_date);
    const end = new Date(formData.check_out_date);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays > 0 ? diffDays : 0;
  }, [formData.check_in_date, formData.check_out_date]);

  const totalPrice = (formData.room_rate || 0) * nights;

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if(!formData.customer_id || !formData.room_id) return;
    onSave({
      ...formData,
      total_amount: totalPrice,
      status: BookingStatus.Confirmed,
      payment_status: 'Pending'
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
          <h3 className="font-bold text-lg">จองห้องพักใหม่</h3>
          <button onClick={onClose} className="hover:text-slate-300"><X size={24} /></button>
        </div>
        <div className="p-6 space-y-5 overflow-y-auto bg-slate-50">
           <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ลูกค้า</label>
              <select 
                value={formData.customer_id}
                onChange={(e) => handleChange('customer_id', e.target.value)}
                className="w-full p-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">-- เลือกลูกค้า --</option>
                {customers.map((c: Customer) => (
                  <option key={c.customer_id} value={c.customer_id}>{c.name} ({c.phone})</option>
                ))}
              </select>
           </div>
           <div className="relative">
              <label className="block text-sm font-medium text-slate-700 mb-1">ห้องพัก</label>
              <button 
                type="button"
                onClick={() => setIsRoomSelectOpen(!isRoomSelectOpen)}
                className="w-full p-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none text-left flex justify-between items-center border-slate-300 shadow-sm hover:bg-slate-50 transition-colors"
              >
                {selectedRoom ? (
                  <div className="flex items-center">
                     <div className={`w-3 h-3 rounded-full mr-2 ${selectedRoom.status === RoomStatus.Available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                     <span className="font-medium text-slate-700">{selectedRoom.room_number}</span>
                     <span className="mx-2 text-slate-300">|</span>
                     <span className="text-sm text-slate-600">{selectedRoom.room_type}</span>
                  </div>
                ) : <span className="text-slate-500">-- เลือกห้องพัก --</span>}
                <ChevronDown size={18} className={`text-slate-400 transition-transform duration-200 ${isRoomSelectOpen ? 'rotate-180' : ''}`} />
              </button>
              {isRoomSelectOpen && (
                <div className="absolute z-20 mt-1 w-full bg-white shadow-xl max-h-60 rounded-xl py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm border border-slate-100">
                   {rooms.map((r: Room) => (
                     <div 
                       key={r.room_id}
                       onClick={() => {
                         if(r.status === RoomStatus.Available) {
                           setFormData(prev => ({ ...prev, room_id: r.room_id, room_rate: r.price_per_night }));
                           setIsRoomSelectOpen(false);
                         }
                       }}
                       className={`cursor-pointer select-none py-3 px-4 flex justify-between border-b last:border-0 ${r.status === RoomStatus.Available ? 'hover:bg-blue-50 text-slate-900' : 'bg-slate-50 text-slate-400 cursor-not-allowed opacity-75'}`}
                     >
                       <span>{r.room_number} ({r.room_type})</span>
                       <span className="font-medium">฿{r.price_per_night.toLocaleString()}</span>
                     </div>
                   ))}
                </div>
              )}
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">เช็คอิน</label>
                <input type="date" value={formData.check_in_date} onChange={(e) => handleChange('check_in_date', e.target.value)} className="w-full p-2.5 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">เช็คเอาท์</label>
                <input type="date" value={formData.check_out_date} onChange={(e) => handleChange('check_out_date', e.target.value)} className="w-full p-2.5 border rounded-lg" min={formData.check_in_date} />
              </div>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ราคาต่อคืน (฿)</label>
                <input type="number" value={formData.room_rate} onChange={(e) => handleChange('room_rate', parseFloat(e.target.value))} className="w-full p-2.5 border rounded-lg font-medium" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ช่องทาง</label>
                <select value={formData.channel} onChange={(e) => handleChange('channel', e.target.value)} className="w-full p-2.5 border rounded-lg">
                  <option value="Walk-in">Walk-in</option>
                  <option value="Phone">โทรศัพท์</option>
                  <option value="Line">Line / Facebook</option>
                  <option value="Online">Online</option>
                </select>
              </div>
           </div>
           <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-2">
              <div className="flex justify-between text-sm text-blue-800"><span>จำนวนคืน:</span><span className="font-medium">{nights} คืน</span></div>
              <div className="flex justify-between items-center border-t border-blue-200 pt-2"><span className="font-bold text-blue-900">ยอดรวม:</span><span className="font-bold text-xl text-blue-700">฿{totalPrice.toLocaleString()}</span></div>
           </div>
        </div>
        <div className="p-4 border-t bg-white flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">ยกเลิก</button>
          <button onClick={handleSubmit} disabled={!formData.customer_id || !formData.room_id || nights <= 0} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">ยืนยันการจอง</button>
        </div>
      </div>
    </div>
  );
};

// --- Customer Form Modal (New) ---
const CustomerFormModal = ({ isOpen, onClose, onSave }: any) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    id_card: '',
    customer_type: 'Regular',
    date_of_birth: '',
    address: '',
    notes: ''
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Simulated OCR Function
  const handleOCR = () => {
    // Simulate network delay for OCR
    setFormData(prev => ({
      ...prev,
      name: 'สมศรี มีโชค',
      id_card: '3-4509-00123-45-6',
      date_of_birth: '1985-08-22',
      address: '99/9 หมู่ 2 ต.สุเทพ อ.เมือง จ.เชียงใหม่ 50200'
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
          <h3 className="font-bold text-lg">เพิ่มข้อมูลลูกค้าใหม่</h3>
          <button onClick={onClose} className="hover:text-slate-300"><X size={24} /></button>
        </div>
        
        <div className="p-6 space-y-5 overflow-y-auto bg-slate-50">
          {/* OCR Simulation Section */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                 <Scan size={24} />
               </div>
               <div>
                 <h4 className="font-bold text-blue-900 text-sm">Smart ID Card OCR</h4>
                 <p className="text-xs text-blue-700">สแกนบัตรประชาชนเพื่อกรอกข้อมูลอัตโนมัติ</p>
               </div>
            </div>
            <button 
              onClick={handleOCR}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
            >
              จำลองสแกน
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อ-นามสกุล</label>
               <input type="text" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="ระบุชื่อลูกค้า" />
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">เบอร์โทรศัพท์</label>
               <input type="tel" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="08x-xxx-xxxx" />
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">เลขบัตรประชาชน</label>
               <input type="text" value={formData.id_card} onChange={(e) => handleChange('id_card', e.target.value)} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="13 หลัก" />
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">วันเกิด</label>
               <input type="date" value={formData.date_of_birth} onChange={(e) => handleChange('date_of_birth', e.target.value)} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">อีเมล (ถ้ามี)</label>
               <input type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">ประเภทลูกค้า</label>
               <select value={formData.customer_type} onChange={(e) => handleChange('customer_type', e.target.value)} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                 <option value="Regular">ลูกค้าทั่วไป (Regular)</option>
                 <option value="VIP">ลูกค้า VIP</option>
               </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
              <MapPin size={16} className="text-slate-500" /> ที่อยู่ตามบัตรประชาชน
            </label>
            <textarea 
              value={formData.address} 
              onChange={(e) => handleChange('address', e.target.value)}
              rows={3}
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="บ้านเลขที่ หมู่ ตำบล อำเภอ จังหวัด รหัสไปรษณีย์"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
              <FileText size={16} className="text-slate-500" /> หมายเหตุ / Notes
            </label>
            <textarea 
              value={formData.notes} 
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={2}
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="ข้อมูลเพิ่มเติม เช่น แพ้อาหาร, ชอบห้องชั้นบน ฯลฯ"
            ></textarea>
          </div>

        </div>
        <div className="p-4 border-t bg-white flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">ยกเลิก</button>
          <button 
            onClick={() => {
              if(formData.name && formData.phone) {
                 onSave(formData);
              }
            }} 
            disabled={!formData.name || !formData.phone}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Save size={18} /> บันทึกข้อมูล
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Sidebar Component ---
const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const menuItems = [
    { id: 'dashboard', label: 'แดชบอร์ด', icon: LayoutDashboard },
    { id: 'rooms', label: 'จัดการห้องพัก', icon: BedDouble },
    { id: 'bookings', label: 'รายการจอง', icon: CalendarDays },
    { id: 'customers', label: 'ข้อมูลลูกค้า', icon: Users },
    { id: 'expenses', label: 'รายรับ-รายจ่าย', icon: Receipt },
    { id: 'settings', label: 'ตั้งค่าระบบ', icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col shadow-xl z-30 transition-all duration-300">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/50">
          <BedDouble size={24} className="text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-none">DB-Hotel</h1>
          <span className="text-xs text-slate-400">Management System</span>
        </div>
      </div>
      
      <nav className="flex-1 py-6 px-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30 font-medium' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon size={20} className={activeTab === item.id ? 'animate-pulse' : ''} />
            <span>{item.label}</span>
            {activeTab === item.id && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3 text-slate-500 text-sm">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
           <span>Connected to Sheet</span>
        </div>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors mt-2">
          <LogOut size={20} />
          <span>ออกจากระบบ</span>
        </button>
      </div>
    </div>
  );
};

// --- Views ---

const DashboardView = ({ rooms, bookings }: { rooms: Room[], bookings: Booking[] }) => {
  const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#64748B'];
  
  const statusData = useMemo(() => [
    { name: 'ว่าง', value: rooms.filter(r => r.status === RoomStatus.Available).length },
    { name: 'มีผู้เข้าพัก', value: rooms.filter(r => r.status === RoomStatus.Occupied).length },
    { name: 'ทำความสะอาด', value: rooms.filter(r => r.status === RoomStatus.Cleaning).length },
    { name: 'ปรับปรุง', value: rooms.filter(r => r.status === RoomStatus.Maintenance).length },
  ], [rooms]);

  const revenueToday = useMemo(() => {
     const today = new Date().toISOString().split('T')[0];
     return bookings
       .filter(b => b.check_in_date === today)
       .reduce((sum, b) => sum + b.total_amount, 0);
  }, [bookings]);

  const activeBookings = useMemo(() => {
    return bookings.filter(b => b.status === BookingStatus.CheckedIn).length;
  }, [bookings]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'รายได้วันนี้', value: `฿${revenueToday.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'ห้องว่าง', value: `${statusData[0].value} ห้อง`, icon: BedDouble, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'เข้าพักวันนี้', value: `${activeBookings} รายการ`, icon: CheckCircle, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'รอเช็คอิน', value: '0 รายการ', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon size={24} className={stat.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-600" /> รายได้ย้อนหลัง 7 วัน
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_REVENUE_DATA}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `฿${value/1000}k`} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  formatter={(value: number) => [`฿${value.toLocaleString()}`, 'รายได้']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-lg text-slate-800 mb-6">สถานะห้องพัก</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  <Tooltip />
                </PieChart>
             </ResponsiveContainer>
          </div>
          <div className="text-center text-slate-500 text-sm mt-4">
             ทั้งหมด {rooms.length} ห้อง
          </div>
        </div>
      </div>
    </div>
  );
};

const RoomView = ({ rooms, onBookClick, onUpdateStatus }: { rooms: Room[], onBookClick: () => void, onUpdateStatus: (id: string, status: RoomStatus) => void }) => {
  const [filterStatus, setFilterStatus] = useState<RoomStatus | 'All'>('All');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const filteredRooms = useMemo(() => {
    if (filterStatus === 'All') return rooms;
    return rooms.filter(room => room.status === filterStatus);
  }, [filterStatus, rooms]);

  const filters = [
    { label: 'ทั้งหมด', value: 'All' },
    { label: 'ว่าง', value: RoomStatus.Available },
    { label: 'ไม่ว่าง', value: RoomStatus.Occupied },
    { label: 'ทำความสะอาด', value: RoomStatus.Cleaning },
    { label: 'ปรับปรุง', value: RoomStatus.Maintenance },
  ];

  const statusOptions = [
    { label: 'ว่าง', value: RoomStatus.Available },
    { label: 'ไม่ว่าง', value: RoomStatus.Occupied },
    { label: 'ทำความสะอาด', value: RoomStatus.Cleaning },
    { label: 'ปรับปรุง', value: RoomStatus.Maintenance },
  ];

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    if (openDropdownId) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openDropdownId]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 min-h-[500px]">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="bg-white p-1.5 rounded-xl shadow-sm border border-slate-200 flex overflow-x-auto no-scrollbar gap-1">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilterStatus(f.value as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                filterStatus === f.value ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button onClick={onBookClick} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20 font-medium">
          <Plus size={18} /> จองห้องพัก
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-visible">
        <div className="overflow-x-auto overflow-y-visible min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-5 text-sm font-semibold text-slate-600">หมายเลขห้อง</th>
                <th className="p-5 text-sm font-semibold text-slate-600">ประเภท</th>
                <th className="p-5 text-sm font-semibold text-slate-600">อาคาร / ชั้น</th>
                <th className="p-5 text-sm font-semibold text-slate-600">ราคาต่อคืน</th>
                <th className="p-5 text-sm font-semibold text-slate-600">สถานะ</th>
                <th className="p-5 text-sm font-semibold text-slate-600 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRooms.map((room) => (
                <tr key={room.room_id} className="hover:bg-slate-50/80 transition-colors relative group">
                  <td className={`p-5 font-bold ${room.status !== RoomStatus.Available ? 'text-slate-400 line-through decoration-slate-400' : 'text-slate-800'}`}>{room.room_number}</td>
                  <td className="p-5 text-sm text-slate-600">{room.room_type}</td>
                  <td className="p-5 text-sm text-slate-500">
                    <span className="bg-slate-100 px-2 py-1 rounded text-xs text-slate-600">ตึก {room.building}</span>
                    <span className="ml-2 text-slate-400">ชั้น {room.floor}</span>
                  </td>
                  <td className="p-5 font-medium text-blue-600">฿{room.price_per_night.toLocaleString()}</td>
                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-2 ${getStatusBadgeColor(room.status)}`}>
                      <span className={`w-2 h-2 rounded-full ${getStatusColor(room.status)}`}></span>
                      {tRoomStatus(room.status)}
                    </span>
                  </td>
                  <td className="p-5 text-right relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdownId(openDropdownId === room.room_id ? null : room.room_id);
                      }}
                      className={`p-2 rounded-lg transition-colors ${openDropdownId === room.room_id ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
                    >
                      <MoreHorizontal size={20} />
                    </button>
                    
                    {/* Status Dropdown Menu */}
                    {openDropdownId === room.room_id && (
                      <div 
                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 animate-in zoom-in-95 duration-100 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase border-b border-slate-50 bg-slate-50/50">
                          เปลี่ยนสถานะ
                        </div>
                        {statusOptions.map(option => (
                          <button
                            key={option.value}
                            onClick={() => {
                              onUpdateStatus(room.room_id, option.value);
                              setOpenDropdownId(null);
                            }}
                            className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 flex items-center justify-between group"
                          >
                            <span className={`flex items-center gap-2 ${room.status === option.value ? 'font-medium text-slate-900' : 'text-slate-600'}`}>
                              <span className={`w-2 h-2 rounded-full ${getStatusColor(option.value)}`}></span>
                              {option.label}
                            </span>
                            {room.status === option.value && <Check size={16} className="text-blue-600" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const BookingsView = ({ bookings, customers, rooms, onUpdateStatus }: { 
  bookings: Booking[], 
  customers: Customer[], 
  rooms: Room[], 
  onUpdateStatus: (id: string, status: BookingStatus) => void 
}) => {
  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.Confirmed: return 'bg-blue-100 text-blue-700';
      case BookingStatus.CheckedIn: return 'bg-green-100 text-green-700';
      case BookingStatus.CheckedOut: return 'bg-slate-100 text-slate-700';
      case BookingStatus.Cancelled: return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCustomerName = (id: string) => customers.find(c => c.customer_id === id)?.name || id;
  const getRoomNumber = (id: string) => rooms.find(r => r.room_id === id)?.room_number || id;

  const sortedBookings = [...bookings].sort((a, b) => new Date(b.check_in_date).getTime() - new Date(a.check_in_date).getTime());

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-5 text-sm font-semibold text-slate-600">Booking ID</th>
                <th className="p-5 text-sm font-semibold text-slate-600">ลูกค้า</th>
                <th className="p-5 text-sm font-semibold text-slate-600">ห้องพัก</th>
                <th className="p-5 text-sm font-semibold text-slate-600">วันที่</th>
                <th className="p-5 text-sm font-semibold text-slate-600">ยอดรวม</th>
                <th className="p-5 text-sm font-semibold text-slate-600">สถานะ</th>
                <th className="p-5 text-sm font-semibold text-slate-600 text-right">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedBookings.map((booking) => (
                <tr key={booking.booking_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-5 font-medium text-slate-600 text-sm">{booking.booking_id}</td>
                  <td className="p-5">
                    <div className="font-bold text-slate-800">{getCustomerName(booking.customer_id)}</div>
                    <div className="text-xs text-slate-500">{booking.channel}</div>
                  </td>
                  <td className="p-5 text-blue-600 font-medium">{getRoomNumber(booking.room_id)}</td>
                  <td className="p-5 text-sm text-slate-500">
                    <div>{booking.check_in_date}</div>
                    <div className="text-xs opacity-70">to {booking.check_out_date}</div>
                  </td>
                   <td className="p-5 font-medium text-slate-800">฿{booking.total_amount.toLocaleString()}</td>
                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    {booking.status === BookingStatus.Confirmed && (
                      <button 
                        onClick={() => onUpdateStatus(booking.booking_id, BookingStatus.CheckedIn)}
                        className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2 ml-auto shadow-green-200"
                      >
                        <LogIn size={16} /> Check In
                      </button>
                    )}
                    {booking.status === BookingStatus.CheckedIn && (
                      <button 
                        onClick={() => onUpdateStatus(booking.booking_id, BookingStatus.CheckedOut)}
                        className="px-4 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors shadow-sm flex items-center gap-2 ml-auto shadow-orange-200"
                      >
                        <LogOut size={16} /> Check Out
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const CustomersView = ({ customers, onAddClick }: { customers: Customer[], onAddClick: () => void }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
         <h3 className="font-bold text-slate-800 text-lg">รายชื่อลูกค้า ({customers.length})</h3>
         <button onClick={onAddClick} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-sm">
           <Plus size={18} /> เพิ่มลูกค้า
         </button>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-4 text-sm font-semibold text-slate-600">ชื่อ-นามสกุล</th>
                <th className="p-4 text-sm font-semibold text-slate-600">เบอร์โทร</th>
                <th className="p-4 text-sm font-semibold text-slate-600">ประเภท</th>
                <th className="p-4 text-sm font-semibold text-slate-600">เลขบัตร P.</th>
                <th className="p-4 text-sm font-semibold text-slate-600">วันเกิด</th>
                <th className="p-4 text-sm font-semibold text-slate-600">หมายเหตุ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((c) => (
                <tr key={c.customer_id} className="hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-800">{c.name}</td>
                  <td className="p-4 text-slate-600">{c.phone}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${c.customer_type === 'VIP' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                      {c.customer_type}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-500 font-mono">{c.id_card || '-'}</td>
                   <td className="p-4 text-sm text-slate-500">{c.date_of_birth || '-'}</td>
                  <td className="p-4 text-sm text-slate-500 max-w-xs truncate">{c.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- Main App ---
const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Centralized State "Database"
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  // Simulate connecting to "Real Data" (Google Sheets)
  useEffect(() => {
    const fetchData = async () => {
      setIsInitializing(true);
      // In a real backend scenario, this would use the Service Account to fetch rows from the Sheet
      // For this frontend demo, we simulate the network delay and load the Mock data as if it came from the Sheet
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setRooms(MOCK_ROOMS);
      setBookings(MOCK_BOOKINGS);
      setCustomers(MOCK_CUSTOMERS);
      setIsInitializing(false);
    };

    fetchData();
  }, []);

  const handleSaveBooking = (booking: any) => {
    const newBooking = { ...booking, booking_id: `BK${Math.floor(Math.random() * 10000)}` };
    setBookings(prev => [...prev, newBooking]);
    setIsBookingModalOpen(false);
    // Auto-update room status
    setRooms(prev => prev.map(r => r.room_id === booking.room_id ? {...r, status: RoomStatus.Occupied} : r));
    alert('บันทึกข้อมูลการจองเรียบร้อยแล้ว (Saved to Database)');
  };

  const handleSaveCustomer = (customerData: any) => {
    const newCustomer: Customer = {
      ...customerData,
      customer_id: `CM${Math.floor(Math.random() * 10000)}`
    };
    setCustomers(prev => [...prev, newCustomer]);
    setIsCustomerModalOpen(false);
  };

  const handleUpdateRoomStatus = (roomId: string, newStatus: RoomStatus) => {
    setRooms(prev => prev.map(room => 
      room.room_id === roomId ? { ...room, status: newStatus } : room
    ));
  };

  const handleUpdateBookingStatus = (bookingId: string, newStatus: BookingStatus) => {
    setBookings(prev => prev.map(b => 
      b.booking_id === bookingId ? { ...b, status: newStatus } : b
    ));
    
    // Automatically update room status
    const booking = bookings.find(b => b.booking_id === bookingId);
    if (booking) {
       if (newStatus === BookingStatus.CheckedIn) {
          handleUpdateRoomStatus(booking.room_id, RoomStatus.Occupied);
       } else if (newStatus === BookingStatus.CheckedOut) {
          handleUpdateRoomStatus(booking.room_id, RoomStatus.Cleaning);
       }
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-600 gap-4">
        <Loader2 size={48} className="animate-spin text-blue-600" />
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-800">กำลังเชื่อมต่อฐานข้อมูล</h2>
          <p className="text-sm text-slate-500">Connecting to Google Sheets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex">
      {/* Sidebar for Desktop */}
      <div className="hidden md:block">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-64 h-full bg-slate-900 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <Sidebar activeTab={activeTab} setActiveTab={(tab) => {setActiveTab(tab); setIsMobileMenuOpen(false)}} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 flex-shrink-0 z-20">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <h2 className="font-bold text-xl text-slate-800">
              {activeTab === 'dashboard' && 'ภาพรวมระบบ'}
              {activeTab === 'rooms' && 'จัดการห้องพัก'}
              {activeTab === 'bookings' && 'รายการจอง'}
              {activeTab === 'customers' && 'ข้อมูลลูกค้า'}
              {activeTab === 'expenses' && 'รายรับ-รายจ่าย'}
              {activeTab === 'settings' && 'ตั้งค่า'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800">Admin User</p>
                <p className="text-xs text-slate-500">ผู้จัดการทั่วไป</p>
             </div>
             <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                <Users size={20} />
             </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
           {activeTab === 'dashboard' && <DashboardView rooms={rooms} bookings={bookings} />}
           {activeTab === 'rooms' && <RoomView rooms={rooms} onBookClick={() => setIsBookingModalOpen(true)} onUpdateStatus={handleUpdateRoomStatus} />}
           {activeTab === 'bookings' && (
             <BookingsView 
                bookings={bookings} 
                customers={customers} 
                rooms={rooms} 
                onUpdateStatus={handleUpdateBookingStatus} 
             />
           )}
           {activeTab === 'customers' && (
             <CustomersView 
                customers={customers}
                onAddClick={() => setIsCustomerModalOpen(true)}
             />
           )}
           {activeTab === 'expenses' && (
             <div className="flex items-center justify-center h-64 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
               <div className="text-center">
                  <Receipt size={48} className="mx-auto mb-2 opacity-20" />
                  <p>หน้าจัดการรายรับรายจ่าย (Coming Soon)</p>
                </div>
             </div>
           )}
           {activeTab === 'settings' && (
             <div className="max-w-2xl">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6">
                   <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Database size={20} /> การเชื่อมต่อข้อมูล</h3>
                   <div className="flex items-center justify-between p-4 bg-green-50 border border-green-100 rounded-xl text-green-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                           <Check size={20} className="text-green-700" />
                        </div>
                        <div>
                           <p className="font-bold">Google Sheets Connected</p>
                           <p className="text-sm opacity-80">Sync ล่าสุด: เมื่อสักครู่</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-white text-green-700 rounded-lg border border-green-200 text-sm font-bold hover:bg-green-50">
                         Sync Now
                      </button>
                   </div>
                   <div className="mt-4 text-sm text-slate-500">
                      <p>Linked Sheet ID: 1DYV-6zG0ZAYi3NDUl4R...</p>
                   </div>
                </div>
             </div>
           )}
        </main>
      </div>

      <AIAssistant rooms={rooms} bookings={bookings} />

      <BookingFormModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
        onSave={handleSaveBooking}
        customers={customers}
        rooms={rooms}
      />

      <CustomerFormModal 
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSave={handleSaveCustomer}
      />
    </div>
  );
};

export default App;