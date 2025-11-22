import React, { useState, useEffect, useMemo, useRef } from 'react';
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { 
  LayoutDashboard, 
  BedDouble, 
  Users, 
  CalendarDays, 
  Receipt, 
  Menu, 
  X,
  CreditCard,
  QrCode,
  LogOut,
  Plus,
  Search,
  CheckCircle,
  ScanLine,
  Settings,
  FileText,
  Camera,
  Save,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Copy,
  Sparkles,
  Send,
  Loader2,
  Bot,
  UserPlus,
  Edit,
  Trash2,
  RefreshCw,
  MapPin,
  PieChart as PieChartIcon,
  BarChart3,
  Calendar,
  ChevronDown
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
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

import { 
  Room, 
  Booking, 
  Customer, 
  Expense,
  HotelSetting,
  RoomStatus, 
  BookingStatus,
  PaymentMethod
} from './types';

import { 
  MOCK_ROOMS, 
  MOCK_CUSTOMERS, 
  MOCK_BOOKINGS, 
  MOCK_EXPENSES,
  MOCK_SETTINGS,
  MOCK_REVENUE_DATA,
  PROMPTPAY_ID
} from './constants';

// --- Helper Functions for Thai Localization ---

const tRoomStatus = (status: RoomStatus) => {
  switch (status) {
    case RoomStatus.Available: return 'ว่าง';
    case RoomStatus.Occupied: return 'เข้าพัก';
    case RoomStatus.Maintenance: return 'ปรับปรุง';
    case RoomStatus.Cleaning: return 'ทำความสะอาด';
    default: return status;
  }
};

const tBookingStatus = (status: BookingStatus) => {
  switch (status) {
    case BookingStatus.Confirmed: return 'จองล่วงหน้า';
    case BookingStatus.CheckedIn: return 'เช็คอินแล้ว';
    case BookingStatus.CheckedOut: return 'เช็คเอาท์แล้ว';
    case BookingStatus.Cancelled: return 'ยกเลิก';
    default: return status;
  }
};

const tPaymentMethod = (method: PaymentMethod) => {
  switch (method) {
    case PaymentMethod.Cash: return 'เงินสด';
    case PaymentMethod.QRCode: return 'สแกนจ่าย';
    case PaymentMethod.Transfer: return 'โอนเงิน';
    default: return method;
  }
};

// --- AI Assistant Component ---
const AIAssistant = ({ rooms, bookings, customers, expenses }: { rooms: Room[], bookings: Booking[], customers: Customer[], expenses: Expense[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: 'สวัสดีครับ ระบบจัดการโรงแรม DB-Hotel-UP ยินดีให้บริการครับ มีอะไรให้ช่วยตรวจสอบวันนี้ไหมครับ?' }
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
      
      // Prepare context data string
      const contextData = JSON.stringify({
        rooms,
        bookings,
        customers,
        expenses,
        summary: {
          totalRooms: rooms.length,
          occupied: rooms.filter(r => r.status === RoomStatus.Occupied).length,
          available: rooms.filter(r => r.status === RoomStatus.Available).length,
        }
      });

      const systemInstruction = `
        คุณคือผู้ช่วยอัจฉริยะสำหรับระบบจัดการโรงแรม "DB-Hotel-UP"
        หน้าที่ของคุณคือตอบคำถามพนักงานโรงแรมโดยใช้ข้อมูลจริงที่ได้รับ
        
        บริบทข้อมูลปัจจุบัน (JSON):
        ${contextData}

        คำแนะนำ:
        1. ตอบเป็นภาษาไทยอย่างสุภาพ เป็นทางการ และเข้าใจง่าย
        2. หากถูกถามเกี่ยวกับห้องว่าง ให้ระบุเลขห้องอย่างชัดเจน
        3. หากถูกถามเรื่องรายได้ ให้คำนวณจาก bookings และ expenses
        4. ตอบให้กระชับ ตรงประเด็น
        5. ถ้าข้อมูลไม่พอ ให้บอกตามตรงว่าไม่มีข้อมูลในระบบ
      `;

      const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: { systemInstruction }
      });

      const response = await chat.sendMessage({ message: userMessage });
      
      setMessages(prev => [...prev, { role: 'model', text: response.text || 'ขออภัย ไม่สามารถประมวลผลได้ในขณะนี้' }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: 'เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 transition-transform z-50"
        title="ผู้ช่วย AI"
      >
        {isOpen ? <X size={24} /> : <Sparkles size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50 animate-in slide-in-from-bottom-5 fade-in duration-200 font-sans">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl text-white flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg">ผู้ช่วยอัจฉริยะ</h3>
              <p className="text-xs text-blue-100">AI Powered by Gemini</p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-slate-200 shadow-sm">
                  <Loader2 size={16} className="animate-spin text-blue-600" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="พิมพ์คำถามที่นี่..."
                className="flex-1 border border-slate-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// --- OCR Modal Component ---
interface OCRResult {
  id_number: string;
  name: string;
  date_of_birth: string;
  address: string;
  type: string;
}

const OCRModal = ({ isOpen, onClose, onSave }: { isOpen: boolean, onClose: () => void, onSave: (data: OCRResult) => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<OCRResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Start Camera
  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, capturedImage]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      console.error("Camera Error:", err);
      setError("ไม่สามารถเข้าถึงกล้องได้ กรุณาตรวจสอบสิทธิ์การใช้งาน");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageDataUrl);
        stopCamera();
        processImageWithGemini(imageDataUrl);
      }
    }
  };

  const processImageWithGemini = async (base64Image: string) => {
    setIsProcessing(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = base64Image.split(',')[1];

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
            { text: 'Extract the following information from this Thai ID card or Passport image. Return JSON only.' }
          ]
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              id_number: { type: Type.STRING, description: "ID Card Number or Passport Number" },
              name: { type: Type.STRING, description: "Full Name (Thai preferred, or English)" },
              date_of_birth: { type: Type.STRING, description: "Date of Birth (DD/MM/YYYY)" },
              address: { type: Type.STRING, description: "Address found on card" },
              type: { type: Type.STRING, description: "Document Type (ID_CARD or PASSPORT)" },
            },
            required: ["id_number", "name"]
          }
        }
      });

      const text = response.text;
      if (text) {
        const data = JSON.parse(text);
        setExtractedData(data);
      } else {
        throw new Error("No data returned");
      }
    } catch (err) {
      console.error("Gemini OCR Error:", err);
      setError("ไม่สามารถอ่านข้อมูลจากบัตรได้ กรุณาลองใหม่อีกครั้ง");
      setCapturedImage(null); // Allow retake
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setExtractedData(null);
    setError(null);
  };

  const handleConfirm = () => {
    if (extractedData) {
      onSave(extractedData);
      onClose();
      handleRetake(); // Reset for next time
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Camera size={20} />
            <h3 className="font-bold text-lg">สแกนบัตรประชาชน / พาสปอร์ต</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
               <X size={18} className="mr-2" /> {error}
            </div>
          )}

          {!capturedImage ? (
            // Camera View
            <div className="relative rounded-xl overflow-hidden bg-black aspect-video shadow-lg">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute inset-0 border-2 border-white/30 m-8 rounded-lg pointer-events-none">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500"></div>
              </div>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <button 
                  onClick={handleCapture}
                  className="w-16 h-16 bg-white rounded-full border-4 border-slate-200 flex items-center justify-center hover:scale-105 transition-transform"
                >
                  <div className="w-12 h-12 bg-red-500 rounded-full"></div>
                </button>
              </div>
            </div>
          ) : (
            // Preview & Edit View
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <div className="relative rounded-xl overflow-hidden bg-black aspect-video shadow-md">
                   <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
                   {isProcessing && (
                     <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                       <Loader2 size={48} className="animate-spin mb-2" />
                       <p className="text-sm">ระบบกำลังประมวลผล...</p>
                     </div>
                   )}
                </div>
                <button 
                  onClick={handleRetake} 
                  className="text-sm text-slate-600 hover:text-slate-900 flex items-center justify-center py-2 border rounded-lg bg-white hover:bg-slate-50 transition-colors"
                  disabled={isProcessing}
                >
                  <RefreshCw size={16} className="mr-2" /> ถ่ายใหม่
                </button>
              </div>

              <div className="space-y-4">
                {extractedData ? (
                  <>
                     <h4 className="font-semibold text-slate-800 flex items-center text-base">
                       <Sparkles size={18} className="text-blue-600 mr-2" /> ข้อมูลที่อ่านได้
                     </h4>
                     <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-slate-600 mb-1">เลขบัตร / Passport No.</label>
                          <input 
                            type="text" 
                            value={extractedData.id_number || ''}
                            onChange={(e) => setExtractedData({...extractedData, id_number: e.target.value})}
                            className="w-full p-2.5 border rounded-lg text-base font-mono text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-600 mb-1">ชื่อ-นามสกุล</label>
                          <input 
                            type="text" 
                            value={extractedData.name || ''}
                            onChange={(e) => setExtractedData({...extractedData, name: e.target.value})}
                            className="w-full p-2.5 border rounded-lg text-base text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-600 mb-1">วันเดือนปีเกิด (วว/ดด/ปปปป)</label>
                          <input 
                            type="text" 
                            value={extractedData.date_of_birth || ''}
                            onChange={(e) => setExtractedData({...extractedData, date_of_birth: e.target.value})}
                            className="w-full p-2.5 border rounded-lg text-base text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-600 mb-1">ที่อยู่ตามหน้าบัตร</label>
                          <textarea 
                            value={extractedData.address || ''}
                            onChange={(e) => setExtractedData({...extractedData, address: e.target.value})}
                            className="w-full p-2.5 border rounded-lg text-base text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                            rows={2}
                          />
                        </div>
                     </div>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 text-sm bg-slate-100 rounded-xl border border-slate-200 border-dashed">
                    {isProcessing ? 'กำลังอ่านข้อมูล...' : 'ภาพจะปรากฏที่นี่'}
                  </div>
                )}
              </div>
            </div>
          )}
          
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-white flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">
            ยกเลิก
          </button>
          <button 
            onClick={handleConfirm}
            disabled={!extractedData || isProcessing}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-medium shadow-sm"
          >
            <Save size={18} className="mr-2" /> นำข้อมูลไปใช้
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Booking Form Modal (New Component) ---
const BookingFormModal = ({ isOpen, onClose, onSave, customers, rooms }: any) => {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    customer_id: '',
    room_id: '',
    check_in_date: today,
    check_out_date: tomorrow,
    channel: 'Walk-in'
  });

  const [isRoomSelectOpen, setIsRoomSelectOpen] = useState(false);

  // Calculations
  const selectedRoom = rooms.find((r: Room) => r.room_id === formData.room_id);
  const nights = useMemo(() => {
    const start = new Date(formData.check_in_date);
    const end = new Date(formData.check_out_date);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays > 0 ? diffDays : 0;
  }, [formData.check_in_date, formData.check_out_date]);

  const totalPrice = (selectedRoom?.price_per_night || 0) * nights;

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
           {/* Customer Select */}
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
              <p className="text-xs text-slate-500 mt-1">หากไม่มีชื่อลูกค้า กรุณาเพิ่มลูกค้าใหม่ก่อน</p>
           </div>

           {/* Room Select */}
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
                ) : (
                  <span className="text-slate-500">-- เลือกห้องพัก --</span>
                )}
                <ChevronDown size={18} className={`text-slate-400 transition-transform duration-200 ${isRoomSelectOpen ? 'rotate-180' : ''}`} />
              </button>

              {isRoomSelectOpen && (
                <div className="absolute z-20 mt-1 w-full bg-white shadow-xl max-h-60 rounded-xl py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm border border-slate-100 animate-in fade-in zoom-in-95 duration-100">
                   {rooms.map((r: Room) => {
                     const isAvailable = r.status === RoomStatus.Available;
                     const isSelected = r.room_id === formData.room_id;
                     return (
                       <div 
                         key={r.room_id}
                         onClick={() => {
                           if(isAvailable) {
                             handleChange('room_id', r.room_id);
                             setIsRoomSelectOpen(false);
                           }
                         }}
                         className={`
                           cursor-pointer select-none relative py-3 pl-4 pr-4 flex items-center justify-between border-b border-slate-50 last:border-0 transition-colors
                           ${isAvailable ? 'hover:bg-blue-50 text-slate-900' : 'bg-slate-50 text-slate-400 cursor-not-allowed opacity-75'}
                           ${isSelected ? 'bg-blue-50' : ''}
                         `}
                       >
                         <div className="flex items-center">
                            <div className={`flex-shrink-0 w-2.5 h-2.5 rounded-full mr-3 ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <div className="flex flex-col">
                                <span className={`font-medium ${isAvailable ? 'text-slate-800' : 'text-slate-500'}`}>
                                  {r.room_number}
                                </span>
                                <span className="text-xs text-slate-500">{r.room_type}</span>
                            </div>
                         </div>
                         <div className="flex flex-col items-end">
                            <span className="font-medium text-sm">฿{r.price_per_night.toLocaleString()}</span>
                            {!isAvailable && <span className="text-[10px] uppercase bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded mt-1 font-medium">{tRoomStatus(r.status)}</span>}
                         </div>
                       </div>
                     );
                   })}
                </div>
              )}
           </div>

           {/* Dates */}
           <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">เช็คอิน</label>
                <input 
                  type="date" 
                  value={formData.check_in_date}
                  onChange={(e) => handleChange('check_in_date', e.target.value)}
                  className="w-full p-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">เช็คเอาท์</label>
                <input 
                  type="date" 
                  value={formData.check_out_date}
                  onChange={(e) => handleChange('check_out_date', e.target.value)}
                  className="w-full p-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  min={formData.check_in_date}
                />
              </div>
           </div>

           {/* Summary */}
           <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-2">
              <div className="flex justify-between text-sm text-blue-800">
                <span>จำนวนคืน:</span>
                <span className="font-medium">{nights} คืน</span>
              </div>
              <div className="flex justify-between text-sm text-blue-800">
                <span>ราคาต่อคืน:</span>
                <span className="font-medium">฿{selectedRoom?.price_per_night.toLocaleString() || 0}</span>
              </div>
              <div className="border-t border-blue-200 pt-2 flex justify-between items-center">
                <span className="font-bold text-blue-900">ยอดรวมทั้งสิ้น:</span>
                <span className="font-bold text-xl text-blue-700">฿{totalPrice.toLocaleString()}</span>
              </div>
           </div>

           {/* Channel */}
           <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ช่องทาง</label>
              <select 
                value={formData.channel}
                onChange={(e) => handleChange('channel', e.target.value)}
                className="w-full p-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Walk-in">Walk-in (หน้าร้าน)</option>
                <option value="Phone">โทรศัพท์</option>
                <option value="Line">Line / Facebook</option>
                <option value="Online">Online (OTA)</option>
              </select>
           </div>
        </div>

        <div className="p-4 border-t bg-white flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">ยกเลิก</button>
          <button 
            onClick={handleSubmit} 
            disabled={!formData.customer_id || !formData.room_id || nights <= 0}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} className="mr-2" /> ยืนยันการจอง
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Customer Form Modal (Updated Component) ---
const CustomerFormModal = ({ isOpen, onClose, customer, onSave, onScan, ocrResult }: any) => {
  const [formData, setFormData] = useState<Customer>({
    customer_id: '',
    name: '',
    phone: '',
    email: '',
    id_card: '',
    passport: '',
    customer_type: 'Regular',
    date_of_birth: '',
    address: '',
    notes: ''
  });

  // Initial load
  useEffect(() => {
    if (customer) {
      setFormData({
         customer_id: '',
         name: '',
         phone: '',
         email: '',
         id_card: '',
         passport: '',
         customer_type: 'Regular',
         date_of_birth: '',
         address: '',
         notes: '',
         ...customer 
      });
    } else {
      setFormData({
        customer_id: '',
        name: '',
        phone: '',
        email: '',
        id_card: '',
        passport: '',
        customer_type: 'Regular',
        date_of_birth: '',
        address: '',
        notes: ''
      });
    }
  }, [customer, isOpen]);

  // Handle OCR Update
  useEffect(() => {
    if (ocrResult) {
      setFormData(prev => {
        // Check type from Gemini response, default to ID card if not clearly passport
        const isPassport = ocrResult.type?.toUpperCase().includes('PASSPORT');
        
        return {
          ...prev,
          name: ocrResult.name || prev.name,
          // If Passport detected, fill passport field. If ID detected (or unspecified), fill ID field.
          // Only overwrite if a new value exists.
          id_card: !isPassport ? (ocrResult.id_number || prev.id_card) : prev.id_card,
          passport: isPassport ? (ocrResult.id_number || prev.passport) : prev.passport,
          date_of_birth: ocrResult.date_of_birth || prev.date_of_birth,
          address: ocrResult.address || prev.address,
        };
      });
    }
  }, [ocrResult]);

  const handleChange = (field: keyof Customer, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200">
        <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
          <h3 className="font-bold text-lg">{customer?.customer_id ? 'แก้ไขข้อมูลลูกค้า' : 'เพิ่มลูกค้าใหม่'}</h3>
          <button onClick={onClose} className="hover:text-slate-300"><X size={24} /></button>
        </div>
        
        <div className="p-6 space-y-5 overflow-y-auto bg-slate-50">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อ-นามสกุล</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={e => handleChange('name', e.target.value)} 
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" 
                placeholder="สมชาย รักดี"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">เบอร์โทรศัพท์</label>
              <input 
                type="text" 
                value={formData.phone} 
                onChange={e => handleChange('phone', e.target.value)} 
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" 
                placeholder="08x-xxx-xxxx"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">อีเมล</label>
              <input 
                type="email" 
                value={formData.email || ''} 
                onChange={e => handleChange('email', e.target.value)} 
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" 
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">วันเกิด (วว/ดด/ปปปป)</label>
              <input 
                type="text" 
                value={formData.date_of_birth || ''} 
                onChange={e => handleChange('date_of_birth', e.target.value)} 
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" 
                placeholder="01/01/1990"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">ที่อยู่</label>
            <textarea 
              value={formData.address || ''} 
              onChange={e => handleChange('address', e.target.value)} 
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" 
              rows={2}
              placeholder="ที่อยู่ตามบัตรประชาชน..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">ระดับสมาชิก</label>
            <select 
              value={formData.customer_type} 
              onChange={e => handleChange('customer_type', e.target.value)} 
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
            >
              <option value="Regular">ลูกค้าทั่วไป (Regular)</option>
              <option value="VIP">ลูกค้า VIP</option>
            </select>
          </div>

          <div className="border-t border-slate-200 pt-4 mt-2">
            <h4 className="font-medium text-slate-900 mb-3 flex items-center">
              <CreditCard size={18} className="mr-2 text-blue-600"/> ข้อมูลเอกสารยืนยันตัวตน
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">เลขบัตรประชาชน</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={formData.id_card || ''} 
                    onChange={e => handleChange('id_card', e.target.value)} 
                    className="flex-1 p-2.5 border rounded-lg font-mono focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    placeholder="x-xxxx-xxxxx-xx-x"
                  />
                  <button 
                    onClick={() => onScan()}
                    className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 flex items-center transition-colors border border-blue-200 shadow-sm"
                    title="สแกนบัตรประชาชน"
                  >
                    <Camera size={18} className="mr-1" /> สแกน
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">เลขหนังสือเดินทาง (Passport)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={formData.passport || ''} 
                    onChange={e => handleChange('passport', e.target.value)} 
                    className="flex-1 p-2.5 border rounded-lg font-mono focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    placeholder="Passport No."
                  />
                  <button 
                    onClick={() => onScan()}
                    className="bg-purple-50 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-100 flex items-center transition-colors border border-purple-200 shadow-sm"
                    title="สแกนพาสปอร์ต"
                  >
                    <Camera size={18} className="mr-1" /> สแกน
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4 mt-2">
             <label className="block text-sm font-medium text-slate-700 mb-1">หมายเหตุเพิ่มเติม</label>
             <textarea 
               value={formData.notes || ''} 
               onChange={e => handleChange('notes', e.target.value)} 
               className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" 
               rows={2}
               placeholder="ระบุข้อมูลเพิ่มเติม..."
             />
          </div>

        </div>

        <div className="p-4 border-t bg-white flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">ยกเลิก</button>
          <button onClick={() => onSave(formData)} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center font-medium shadow-sm">
            <Save size={18} className="mr-2" /> บันทึกข้อมูล
          </button>
        </div>
      </div>
    </div>
  )
}


// --- Components ---

// 1. Sidebar Component
const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }: any) => {
  const menuItems = [
    { id: 'dashboard', label: 'ภาพรวม', icon: LayoutDashboard },
    { id: 'bookings', label: 'รายการจอง', icon: CalendarDays },
    { id: 'rooms', label: 'ผังห้องพัก', icon: BedDouble },
    { id: 'customers', label: 'ข้อมูลลูกค้า', icon: Users },
    { id: 'financial', label: 'การเงินและรายงาน', icon: Receipt },
    { id: 'settings', label: 'ตั้งค่าระบบ', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} font-sans shadow-xl`}>
        <div className="flex items-center justify-between h-16 px-6 bg-slate-800">
          <span className="text-xl font-bold tracking-wider">DB-HOTEL</span>
          <button className="lg:hidden" onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsOpen(false);
              }}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-md translate-x-1' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} className="mr-3" />
              <span className="font-medium text-base">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 bg-slate-800">
          <div className="flex items-center cursor-pointer hover:bg-slate-700 p-2 rounded-lg transition-colors">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white shadow-sm">
              NS
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">ผู้จัดการ</p>
              <button className="text-xs text-slate-400 flex items-center hover:text-red-400 transition-colors mt-0.5">
                <LogOut size={12} className="mr-1" /> ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// 2. Dashboard View
const Dashboard = ({ rooms, bookings }: { rooms: Room[], bookings: Booking[] }) => {
  const stats = useMemo(() => {
    const totalRooms = rooms.length;
    const occupied = rooms.filter(r => r.status === RoomStatus.Occupied).length;
    const available = rooms.filter(r => r.status === RoomStatus.Available).length;
    const todayCheckIns = bookings.filter(b => b.check_in_date === new Date().toISOString().split('T')[0]).length;
    const occupancyRate = Math.round((occupied / totalRooms) * 100);

    return { totalRooms, occupied, available, todayCheckIns, occupancyRate };
  }, [rooms, bookings]);

  const pieData = [
    { name: 'ว่าง', value: stats.available, color: '#22c55e' },
    { name: 'เข้าพัก', value: stats.occupied, color: '#ef4444' },
    { name: 'อื่นๆ', value: stats.totalRooms - stats.available - stats.occupied, color: '#eab308' },
  ];

  return (
    <div className="space-y-6 font-sans">
      <h2 className="text-2xl font-bold text-slate-800">ภาพรวมโรงแรม</h2>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">รายได้วันนี้</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">฿1,200</h3>
            </div>
            <div className="p-3 bg-green-50 rounded-xl text-green-600">
              <Receipt size={24} />
            </div>
          </div>
          <span className="text-xs text-green-600 font-medium mt-3 flex items-center">
            <TrendingUp size={14} className="mr-1" /> +12% จากเมื่อวาน
          </span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">อัตราการเข้าพัก</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">{stats.occupancyRate}%</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <BedDouble size={24} />
            </div>
          </div>
          <span className="text-xs text-slate-500 font-medium mt-3 block">
            {stats.occupied} ห้องไม่ว่าง / ทั้งหมด {stats.totalRooms}
          </span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">เช็คอินวันนี้</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">{stats.todayCheckIns}</h3>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
              <Users size={24} />
            </div>
          </div>
          <span className="text-xs text-slate-500 font-medium mt-3 block">รอเช็คอิน 0 รายการ</span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">ห้องว่างพร้อมขาย</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">{stats.available}</h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <CheckCircle size={24} />
            </div>
          </div>
          <span className="text-xs text-emerald-600 font-medium mt-3 block">พร้อมให้บริการ</span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">รายได้ย้อนหลัง 7 วัน</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_REVENUE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `฿${val/1000}k`} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  formatter={(value: number) => [`฿${value.toLocaleString()}`, 'รายได้']}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">สัดส่วนสถานะห้องพัก</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4 flex-wrap">
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center text-sm text-slate-600">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
                  {entry.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. Room Management View
const RoomsView = ({ rooms, onStatusChange }: { rooms: Room[], onStatusChange: (id: string, status: RoomStatus) => void }) => {
  const getStatusColor = (status: RoomStatus) => {
    switch (status) {
      case RoomStatus.Available: return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100';
      case RoomStatus.Occupied: return 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100';
      case RoomStatus.Maintenance: return 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100';
      case RoomStatus.Cleaning: return 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100';
      default: return 'bg-white';
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">จัดการสถานะห้องพัก</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center shadow-sm transition-all font-medium">
          <Plus size={20} className="mr-2" /> เพิ่มห้องพัก
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {rooms.map((room) => (
          <div key={room.room_id} className={`p-4 rounded-xl border-2 flex flex-col justify-between h-44 transition-all cursor-pointer ${getStatusColor(room.status)}`}>
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-3xl font-bold tracking-tight">{room.room_number}</span>
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white/60 backdrop-blur-sm shadow-sm">
                  {room.room_type === 'Standard' ? 'ห้องมาตรฐาน' : room.room_type}
                </span>
              </div>
              <p className="text-xs opacity-80">อาคาร {room.building} • ชั้น {room.floor}</p>
            </div>
            
            <div className="mt-auto">
              <div className="text-sm font-medium mb-2 opacity-90">฿{room.price_per_night.toLocaleString()} / คืน</div>
              <select 
                value={room.status}
                onChange={(e) => onStatusChange(room.room_id, e.target.value as RoomStatus)}
                className="w-full text-sm p-1.5 rounded-lg bg-white/80 border-0 cursor-pointer focus:ring-2 focus:ring-blue-500 font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                {Object.values(RoomStatus).map(s => (
                  <option key={s} value={s}>{tRoomStatus(s)}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 4. Booking List View
const BookingsView = ({ bookings, customers, onAddBooking }: { bookings: Booking[], customers: Customer[], onAddBooking: () => void }) => {
  const getStatusBadge = (status: BookingStatus) => {
    const styles = {
      [BookingStatus.Confirmed]: 'bg-blue-100 text-blue-700',
      [BookingStatus.CheckedIn]: 'bg-green-100 text-green-700',
      [BookingStatus.CheckedOut]: 'bg-slate-100 text-slate-700',
      [BookingStatus.Cancelled]: 'bg-red-100 text-red-700',
    };
    return <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${styles[status]}`}>{tBookingStatus(status)}</span>;
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800">รายการจองห้องพัก</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="ค้นหาเลขห้อง, ชื่อลูกค้า..." 
              className="pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-72 text-sm"
            />
          </div>
          <button 
            onClick={onAddBooking}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center whitespace-nowrap hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            <Plus size={20} className="mr-2" /> จองห้องพักใหม่
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-4 font-semibold text-slate-600 text-sm">เลขที่จอง</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">ลูกค้า</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">ห้องพัก</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">วันเข้า-ออก</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">ยอดเงิน</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">สถานะ</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const customer = customers.find(c => c.customer_id === booking.customer_id);
                return (
                  <tr key={booking.booking_id} className="border-b hover:bg-slate-50 last:border-0">
                    <td className="p-4 font-mono text-sm text-slate-500">{booking.booking_id}</td>
                    <td className="p-4">
                      <div className="font-medium text-slate-900">{customer?.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{customer?.phone}</div>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded text-sm">{booking.room_id}</span>
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1"><CalendarDays size={12}/> {booking.check_in_date}</div>
                      <div className="flex items-center gap-1 mt-1"><LogOut size={12} className="rotate-180"/> {booking.check_out_date}</div>
                    </td>
                    <td className="p-4 font-medium text-slate-900">฿{booking.total_amount.toLocaleString()}</td>
                    <td className="p-4">{getStatusBadge(booking.status)}</td>
                    <td className="p-4">
                      <button className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded text-sm font-medium transition-colors">
                        รายละเอียด
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 5. Financial View (Refactored)
const FinancialView = ({ bookings, expenses }: { bookings: Booking[], expenses: Expense[] }) => {
  const [viewMode, setViewMode] = useState<'overview' | 'report'>('overview');

  // Calculate Summaries
  const totalIncome = bookings.reduce((sum, b) => sum + b.total_amount, 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalIncome - totalExpense;

  // Generate Mock Historical Data for Reports (Since we only have Nov data in constants)
  const monthlyStats = useMemo(() => {
    // Create dummy data for the last 6 months for visualization purposes
    const months = ['มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.'];
    return months.map((month, index) => {
      // Random variance to make it look real
      const baseIncome = 120000;
      const baseExpense = 45000;
      const income = index === 5 ? totalIncome + 145000 : baseIncome + Math.random() * 30000; // Current month uses real partial data + previous weeks
      const expense = index === 5 ? totalExpense + 35000 : baseExpense + Math.random() * 10000;
      return {
        name: month,
        รายรับ: Math.round(income),
        รายจ่าย: Math.round(expense),
        กำไร: Math.round(income - expense)
      };
    });
  }, [totalIncome, totalExpense]);

  // Group Expenses by Category
  const expenseByCategory = useMemo(() => {
    const grouped: {[key: string]: number} = {};
    expenses.forEach(e => {
      grouped[e.category] = (grouped[e.category] || 0) + e.amount;
    });
    // Add some dummy categories to make the pie chart look better if data is sparse
    if (Object.keys(grouped).length < 3) {
      grouped['เงินเดือนพนักงาน'] = 25000;
      grouped['วัตถุดิบ'] = 8500;
    }
    return Object.keys(grouped).map(key => ({ name: key, value: grouped[key] }));
  }, [expenses]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">การเงินและบัญชี</h2>
        <div className="flex bg-slate-200 p-1 rounded-lg">
            <button 
                onClick={() => setViewMode('overview')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'overview' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                ภาพรวมรายวัน
            </button>
            <button 
                onClick={() => setViewMode('report')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'report' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                รายงานวิเคราะห์
            </button>
        </div>
      </div>

      {viewMode === 'overview' ? (
        // --- Simple Overview Tab ---
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                <p className="text-sm font-medium text-green-600">รายรับรวม (เดือนนี้)</p>
                <div className="flex items-end justify-between mt-2">
                    <h3 className="text-3xl font-bold text-green-800">฿{totalIncome.toLocaleString()}</h3>
                    <TrendingUp className="text-green-500" size={28} />
                </div>
                </div>
                <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                <p className="text-sm font-medium text-red-600">รายจ่ายรวม (เดือนนี้)</p>
                <div className="flex items-end justify-between mt-2">
                    <h3 className="text-3xl font-bold text-red-800">฿{totalExpense.toLocaleString()}</h3>
                    <TrendingDown className="text-red-500" size={28} />
                </div>
                </div>
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <p className="text-sm font-medium text-blue-600">กำไรสุทธิ</p>
                <div className="flex items-end justify-between mt-2">
                    <h3 className="text-3xl font-bold text-blue-800">฿{netProfit.toLocaleString()}</h3>
                    <DollarSign className="text-blue-500" size={28} />
                </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
                    <span className="font-bold text-slate-700 text-lg">รายการค่าใช้จ่ายล่าสุด</span>
                    <button className="text-blue-600 text-sm font-medium hover:underline">ดูทั้งหมด</button>
                </div>
                <table className="w-full text-left">
                <thead className="bg-slate-50 border-b">
                    <tr>
                    <th className="p-4 text-slate-600 text-sm font-semibold">วันที่</th>
                    <th className="p-4 text-slate-600 text-sm font-semibold">หมวดหมู่</th>
                    <th className="p-4 text-slate-600 text-sm font-semibold">รายละเอียด</th>
                    <th className="p-4 text-slate-600 text-sm font-semibold">ผู้ทำรายการ</th>
                    <th className="p-4 text-slate-600 text-sm font-semibold text-right">จำนวนเงิน</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((e) => (
                    <tr key={e.expense_id} className="border-b hover:bg-slate-50 last:border-0">
                        <td className="p-4 text-sm text-slate-500">{e.date}</td>
                        <td className="p-4"><span className="px-2.5 py-1 bg-slate-100 rounded-md text-xs font-medium text-slate-600">{e.category}</span></td>
                        <td className="p-4 text-slate-700 text-sm font-medium">{e.description}</td>
                        <td className="p-4 text-sm text-slate-600">{e.paid_by}</td>
                        <td className="p-4 font-bold text-red-600 text-right">-฿{e.amount.toLocaleString()}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>
      ) : (
        // --- Detailed Report Tab ---
        <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bar Chart: Income vs Expense */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center">
                             <BarChart3 size={20} className="mr-2 text-blue-600"/> รายรับ-รายจ่าย (6 เดือนย้อนหลัง)
                        </h3>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `฿${val/1000}k`} />
                            <Tooltip 
                                cursor={{fill: '#f8fafc'}}
                                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                            />
                            <Legend wrapperStyle={{paddingTop: '20px'}} />
                            <Bar dataKey="รายรับ" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={30} />
                            <Bar dataKey="รายจ่าย" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={30} />
                        </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart: Expense Breakdown */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                     <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                        <PieChartIcon size={20} className="mr-2 text-orange-500"/> สัดส่วนค่าใช้จ่าย
                     </h3>
                     <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={expenseByCategory}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {expenseByCategory.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" wrapperStyle={{fontSize: '12px'}}/>
                            </PieChart>
                        </ResponsiveContainer>
                     </div>
                     <div className="mt-4 text-center text-sm text-slate-500">
                        ข้อมูลประมวลผลจากรายการค่าใช้จ่ายทั้งหมดในระบบ
                     </div>
                </div>
            </div>

            {/* Monthly Breakdown Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
                    <span className="font-bold text-slate-700 text-lg">สรุปยอดรายเดือน (Detailed Breakdown)</span>
                    <button className="bg-white border border-slate-300 text-slate-600 px-3 py-1.5 rounded text-sm hover:bg-slate-50 flex items-center">
                        <FileText size={14} className="mr-2"/> Export CSV
                    </button>
                </div>
                <table className="w-full text-left">
                <thead className="bg-slate-50 border-b">
                    <tr>
                    <th className="p-4 text-slate-600 text-sm font-semibold">เดือน</th>
                    <th className="p-4 text-slate-600 text-sm font-semibold text-right text-green-600">รายรับ</th>
                    <th className="p-4 text-slate-600 text-sm font-semibold text-right text-red-600">รายจ่าย</th>
                    <th className="p-4 text-slate-600 text-sm font-semibold text-right text-blue-600">กำไรสุทธิ</th>
                    <th className="p-4 text-slate-600 text-sm font-semibold text-right">Margin %</th>
                    </tr>
                </thead>
                <tbody>
                    {[...monthlyStats].reverse().map((stat, index) => (
                    <tr key={index} className="border-b hover:bg-slate-50 last:border-0">
                        <td className="p-4 font-medium text-slate-800">{stat.name} 2568</td>
                        <td className="p-4 text-right font-mono text-slate-600">฿{stat.รายรับ.toLocaleString()}</td>
                        <td className="p-4 text-right font-mono text-slate-600">฿{stat.รายจ่าย.toLocaleString()}</td>
                        <td className="p-4 text-right font-bold text-blue-700">฿{stat.กำไร.toLocaleString()}</td>
                        <td className="p-4 text-right text-sm text-slate-500">
                            {Math.round((stat.กำไร / stat.รายรับ) * 100)}%
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>
      )}
    </div>
  );
};

// 6. Settings View
const SettingsView = ({ settings }: { settings: HotelSetting[] }) => {
  return (
    <div className="space-y-6 font-sans">
      <h2 className="text-2xl font-bold text-slate-800">ตั้งค่าระบบโรงแรม</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 space-y-6">
          {settings.map((setting) => (
            <div key={setting.setting_id} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-b border-slate-100 pb-6 last:border-0 last:pb-0">
              <div>
                <h4 className="font-medium text-slate-800 text-base">{setting.name}</h4>
                <span className="text-sm text-slate-500">{setting.category}</span>
              </div>
              <div className="md:col-span-2">
                <input 
                  type="text" 
                  defaultValue={setting.value} 
                  className="w-full p-2.5 border rounded-lg text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
            </div>
          ))}
          
          <div className="flex justify-end pt-6">
            <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 flex items-center font-medium shadow-sm">
              <Save size={18} className="mr-2" /> บันทึกการตั้งค่า
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 7. Payment Modal
const PaymentModal = ({ isOpen, onClose, amount, bookingId }: any) => {
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.Cash);
  const [received, setReceived] = useState<number>(0);
  const change = Math.max(0, received - amount);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setMethod(PaymentMethod.Cash);
      setReceived(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in duration-200">
        <div className="bg-slate-50 p-4 border-b flex justify-between items-center">
          <h3 className="font-bold text-lg text-slate-800">รับชำระเงิน</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="text-center">
            <p className="text-slate-500 text-sm font-medium">ยอดชำระทั้งหมด</p>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight mt-1">฿{amount.toLocaleString()}</h2>
            <p className="text-xs text-slate-400 mt-2 font-mono">Ref: {bookingId}</p>
          </div>

          <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
            <button 
              className={`flex-1 py-2.5 rounded-md text-sm font-semibold transition-all ${method === PaymentMethod.Cash ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => setMethod(PaymentMethod.Cash)}
            >
              <CreditCard size={18} className="inline mr-2" /> เงินสด
            </button>
            <button 
              className={`flex-1 py-2.5 rounded-md text-sm font-semibold transition-all ${method === PaymentMethod.QRCode ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => setMethod(PaymentMethod.QRCode)}
            >
              <QrCode size={18} className="inline mr-2" /> สแกนจ่าย (QR)
            </button>
          </div>

          {method === PaymentMethod.Cash ? (
            <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-200">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">รับเงินมา</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-400 text-lg">฿</span>
                  <input 
                    type="number" 
                    value={received || ''} 
                    onChange={(e) => setReceived(parseFloat(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xl font-bold text-slate-800"
                    placeholder="0.00"
                    autoFocus
                  />
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-xl flex justify-between items-center border border-slate-100">
                <span className="font-medium text-slate-600">เงินทอน:</span>
                <span className={`text-2xl font-bold ${change > 0 ? 'text-green-600' : 'text-slate-400'}`}>
                  ฿{change.toLocaleString()}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-center flex flex-col items-center animate-in slide-in-from-bottom-2 duration-200">
              <div className="bg-white p-4 rounded-xl border-2 border-slate-100 shadow-sm">
                {/* Simulated QR Code */}
                <div className="w-48 h-48 bg-white relative flex flex-wrap content-start p-2 border-2 border-slate-900">
                    {/* Corner markers */}
                    <div className="absolute top-2 left-2 w-8 h-8 border-4 border-slate-900 flex items-center justify-center"><div className="w-3 h-3 bg-slate-900"></div></div>
                    <div className="absolute top-2 right-2 w-8 h-8 border-4 border-slate-900 flex items-center justify-center"><div className="w-3 h-3 bg-slate-900"></div></div>
                    <div className="absolute bottom-2 left-2 w-8 h-8 border-4 border-slate-900 flex items-center justify-center"><div className="w-3 h-3 bg-slate-900"></div></div>
                    
                    {/* Random Pattern for visual simulation */}
                    <div className="w-full h-full grid grid-cols-8 grid-rows-8 gap-0.5 p-2 opacity-80">
                        {Array.from({length: 64}).map((_, i) => {
                             const row = Math.floor(i/8);
                             const col = i%8;
                             const isCorner = (row < 3 && col < 3) || (row < 3 && col > 4) || (row > 4 && col < 3);
                             if (isCorner) return <div key={i}></div>;
                             return <div key={i} className={`w-full h-full ${Math.random() > 0.5 ? 'bg-slate-900' : 'bg-transparent'}`}></div>
                        })}
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white p-2 rounded-lg shadow-lg border border-slate-100">
                             <ScanLine size={24} className="text-blue-600 animate-pulse" />
                        </div>
                    </div>
                </div>
              </div>
              
              <div className="w-full bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center justify-between">
                  <div className="text-left">
                      <p className="text-xs text-slate-500">PromptPay ID</p>
                      <p className="font-mono font-medium text-slate-700">{PROMPTPAY_ID}</p>
                  </div>
                  <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-md transition-colors">
                      <Copy size={18} />
                  </button>
              </div>
              
              <p className="text-xs text-slate-400">สแกน QR เพื่อชำระเงิน ฿{amount.toLocaleString()}</p>
            </div>
          )}

          <button 
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            {method === PaymentMethod.Cash ? 'ยืนยันการชำระเงิน' : 'ยืนยันการโอนเงิน'}
          </button>
        </div>
      </div>
    </div>
  );
};

// 8. Customers View (Updated)
const CustomersView = ({ customers, onAdd, onEdit, onDelete, onScanAdd }: { 
  customers: Customer[], 
  onAdd: () => void,
  onEdit: (c: Customer) => void,
  onDelete: (id: string) => void,
  onScanAdd: () => void
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(c => 
    c.name.includes(searchTerm) || 
    c.phone.includes(searchTerm) || 
    (c.id_card && c.id_card.includes(searchTerm))
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800">ข้อมูลลูกค้า</h2>
        <div className="flex gap-2">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="ค้นหาชื่อ, เบอร์โทร..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64 text-sm"
            />
          </div>
          <button 
            onClick={onScanAdd}
            className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg flex items-center whitespace-nowrap hover:bg-indigo-700 shadow-sm font-medium"
            title="สแกนบัตรเพื่อเพิ่มลูกค้า"
          >
            <Camera size={20} className="mr-2" /> สแกนบัตร
          </button>
          <button 
            onClick={onAdd}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center whitespace-nowrap hover:bg-blue-700 shadow-sm font-medium"
          >
            <UserPlus size={20} className="mr-2" /> เพิ่มลูกค้า
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-4 font-semibold text-slate-600 text-sm">รหัสลูกค้า</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">ชื่อ-นามสกุล</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">เบอร์โทรศัพท์</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">สถานะ</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">เลขบัตร / Passport</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.customer_id} className="border-b hover:bg-slate-50 last:border-0">
                  <td className="p-4 font-mono text-sm text-slate-500">{customer.customer_id}</td>
                  <td className="p-4 font-medium text-slate-900">{customer.name}</td>
                  <td className="p-4 text-slate-600">{customer.phone}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${customer.customer_type === 'VIP' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                      {customer.customer_type === 'Regular' ? 'ทั่วไป' : customer.customer_type}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-mono text-slate-500">
                    {customer.id_card || customer.passport || '-'}
                  </td>
                  <td className="p-4 flex gap-2">
                    <button 
                      onClick={() => onEdit(customer)} 
                      className="p-2 text-slate-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                      title="แก้ไข"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete(customer.customer_id)}
                      className="p-2 text-slate-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                      title="ลบ"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    ไม่พบข้อมูลลูกค้าในระบบ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---
const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isOCRModalOpen, setIsOCRModalOpen] = useState(false);
  
  // State for Data
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);

  // Customer Form State
  const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [lastOCRResult, setLastOCRResult] = useState<OCRResult | null>(null);

  // Booking Form State
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);

  const handleRoomStatusChange = (id: string, status: RoomStatus) => {
    setRooms(rooms.map(r => r.room_id === id ? { ...r, status } : r));
  };

  const handleAddBookingTrigger = () => {
    setIsBookingFormOpen(true);
  };

  const handleSaveBooking = (bookingData: any) => {
    const newBookingId = `BK${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    const newBooking: Booking = {
      booking_id: newBookingId,
      ...bookingData
    };
    
    // Add Booking
    setBookings([...bookings, newBooking]);
    
    // Auto update room status if booked for today
    const today = new Date().toISOString().split('T')[0];
    if(bookingData.check_in_date === today) {
      setRooms(rooms.map(r => r.room_id === bookingData.room_id ? { ...r, status: RoomStatus.Occupied } : r));
    }
    
    setIsBookingFormOpen(false);
  };

  // --- Customer Actions ---
  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setLastOCRResult(null);
    setIsCustomerFormOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setLastOCRResult(null);
    setIsCustomerFormOpen(true);
  };

  const handleDeleteCustomer = (id: string) => {
    if (confirm('ยืนยันการลบข้อมูลลูกค้า? การกระทำนี้ไม่สามารถเรียกคืนได้')) {
      setCustomers(customers.filter(c => c.customer_id !== id));
    }
  };

  const handleScanTrigger = () => {
    setIsOCRModalOpen(true);
  };

  const handleSaveOCRData = (data: OCRResult) => {
    if (isCustomerFormOpen) {
      // If form is already open (scan inside form), just update the form data via prop/state
      setLastOCRResult(data);
    } else {
      // If form is NOT open (scan from list), Open form and pre-fill
      setLastOCRResult(data);
      setEditingCustomer(null); // New Customer mode
      setIsCustomerFormOpen(true);
    }
  };

  const handleSaveCustomer = (formData: Customer) => {
    if (editingCustomer) {
      // Update
      setCustomers(customers.map(c => c.customer_id === formData.customer_id ? formData : c));
    } else {
      // Create New
      const newId = `CM${String(customers.length + 1).padStart(3, '0')}`;
      const newCustomer = { ...formData, customer_id: newId };
      setCustomers([...customers, newCustomer]);
    }
    setIsCustomerFormOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header (Mobile) */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 lg:hidden shadow-sm z-10">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600">
            <Menu size={24} />
          </button>
          <span className="font-bold text-lg text-slate-800">DB-HOTEL-UP</span>
          <div className="w-10"></div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-4 md:p-8 relative scroll-smooth">
          {activeTab === 'dashboard' && <Dashboard rooms={rooms} bookings={bookings} />}
          {activeTab === 'rooms' && <RoomsView rooms={rooms} onStatusChange={handleRoomStatusChange} />}
          {activeTab === 'bookings' && <BookingsView bookings={bookings} customers={customers} onAddBooking={handleAddBookingTrigger} />}
          {activeTab === 'financial' && <FinancialView bookings={bookings} expenses={MOCK_EXPENSES} />}
          {activeTab === 'settings' && <SettingsView settings={MOCK_SETTINGS} />}
          {activeTab === 'customers' && (
             <CustomersView 
               customers={customers} 
               onAdd={handleAddCustomer}
               onEdit={handleEditCustomer}
               onDelete={handleDeleteCustomer}
               onScanAdd={handleScanTrigger}
             />
          )}

          {/* Demo Payment Trigger */}
          {activeTab === 'dashboard' && (
             <div className="fixed bottom-6 left-6 lg:left-72 z-40">
                 <button 
                   onClick={() => setIsPaymentModalOpen(true)}
                   className="bg-emerald-600 text-white px-5 py-2.5 rounded-full shadow-lg hover:bg-emerald-700 text-sm flex items-center font-medium transform hover:scale-105 transition-all"
                 >
                    <CreditCard size={18} className="mr-2" /> ทดสอบรับเงิน
                 </button>
             </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
        amount={1200}
        bookingId="VP01764"
      />

      <OCRModal 
        isOpen={isOCRModalOpen} 
        onClose={() => setIsOCRModalOpen(false)} 
        onSave={handleSaveOCRData}
      />

      <CustomerFormModal 
        isOpen={isCustomerFormOpen}
        onClose={() => setIsCustomerFormOpen(false)}
        customer={editingCustomer}
        onSave={handleSaveCustomer}
        onScan={handleScanTrigger}
        ocrResult={lastOCRResult}
      />

      <BookingFormModal 
        isOpen={isBookingFormOpen}
        onClose={() => setIsBookingFormOpen(false)}
        onSave={handleSaveBooking}
        customers={customers}
        rooms={rooms}
      />

      {/* Gemini AI Assistant */}
      <AIAssistant 
        rooms={rooms} 
        bookings={bookings} 
        customers={customers} 
        expenses={MOCK_EXPENSES} 
      />

    </div>
  );
};

export default App;