import { Room, RoomStatus, Customer, Booking, BookingStatus, Expense, HotelSetting } from './types';

// Simulating Data from "1-2 ห้อง"
export const MOCK_ROOMS: Room[] = [
  { room_id: 'A101', room_number: 'A101', building: 'A', floor: 1, room_type: 'Standard', price_per_night: 400, status: RoomStatus.Available, max_occupancy: 2 },
  { room_id: 'A102', room_number: 'A102', building: 'A', floor: 1, room_type: 'Standard', price_per_night: 400, status: RoomStatus.Available, max_occupancy: 2 },
  { room_id: 'A103', room_number: 'A103', building: 'A', floor: 1, room_type: 'Standard', price_per_night: 400, status: RoomStatus.Occupied, max_occupancy: 2 },
  { room_id: 'A201', room_number: 'A201', building: 'A', floor: 2, room_type: 'Standard Twin', price_per_night: 500, status: RoomStatus.Available, max_occupancy: 2 },
  { room_id: 'B101', room_number: 'B101', building: 'B', floor: 1, room_type: 'Standard', price_per_night: 400, status: RoomStatus.Cleaning, max_occupancy: 2 },
  { room_id: 'B110', room_number: 'B110', building: 'B', floor: 1, room_type: 'Standard', price_per_night: 400, status: RoomStatus.Occupied, max_occupancy: 2 },
  { room_id: 'N1', room_number: 'N1', building: 'N', floor: 1, room_type: 'Standard', price_per_night: 400, status: RoomStatus.Maintenance, max_occupancy: 2 },
  { room_id: 'N2', room_number: 'N2', building: 'N', floor: 1, room_type: 'Standard', price_per_night: 400, status: RoomStatus.Available, max_occupancy: 2 },
];

// Simulating Data from "2-1 ลูกค้า"
export const MOCK_CUSTOMERS: Customer[] = [
  { customer_id: 'CM001', name: 'ชาตรี มงคล', phone: '081-234-5678', customer_type: 'Regular', id_card: '1-1000-12345-67-8' },
  { customer_id: 'CM002', name: 'กมลลักษ์ ใจดี', phone: '089-987-6543', customer_type: 'VIP', id_card: '2-3456-78901-23-4' },
  { customer_id: 'CM003', name: 'สมชาย รักชาติ', phone: '065-432-1111', customer_type: 'Regular' },
];

// Simulating Data from "2-2 จองห้อง/เข้าพัก"
export const MOCK_BOOKINGS: Booking[] = [
  { booking_id: 'VP01764', customer_id: 'CM001', room_id: 'B110', check_in_date: '2025-11-21', check_out_date: '2025-11-23', total_amount: 800, status: BookingStatus.CheckedIn, payment_status: 'Pending', channel: 'Walk-in' },
  { booking_id: 'VP01765', customer_id: 'CM002', room_id: 'A103', check_in_date: '2025-11-21', check_out_date: '2025-11-22', total_amount: 400, status: BookingStatus.CheckedIn, payment_status: 'Paid', channel: 'Line' },
  { booking_id: 'VP01766', customer_id: 'CM003', room_id: 'A201', check_in_date: '2025-11-25', check_out_date: '2025-11-26', total_amount: 500, status: BookingStatus.Confirmed, payment_status: 'Pending', channel: 'Phone' },
];

// Simulating Data from "2-4 รายจ่าย"
export const MOCK_EXPENSES: Expense[] = [
  { expense_id: 'EX001', category: 'Utilities', description: 'Electricity Bill Nov', amount: 4500, date: '2025-11-15', paid_by: 'Manager' },
  { expense_id: 'EX002', category: 'Maintenance', description: 'AC Repair Room N1', amount: 1200, date: '2025-11-18', paid_by: 'Admin' },
  { expense_id: 'EX003', category: 'Supplies', description: 'Cleaning Supplies', amount: 850, date: '2025-11-20', paid_by: 'Staff' },
];

// Simulating Data from "1-1 ตั้งค่า"
export const MOCK_SETTINGS: HotelSetting[] = [
  { setting_id: 'SET001', category: 'General', name: 'Hotel Name', value: 'DB-Hotel-UP' },
  { setting_id: 'SET002', category: 'Financial', name: 'VAT Rate', value: '7%' },
  { setting_id: 'SET003', category: 'Policy', name: 'Check-in Time', value: '14:00' },
  { setting_id: 'SET004', category: 'Policy', name: 'Check-out Time', value: '12:00' },
  { setting_id: 'SET005', category: 'Payment', name: 'PromptPay ID', value: '081-234-5678' },
];

export const MOCK_REVENUE_DATA = [
  { date: '16 Nov', revenue: 14150 },
  { date: '17 Nov', revenue: 15750 },
  { date: '18 Nov', revenue: 8100 },
  { date: '19 Nov', revenue: 4500 },
  { date: '20 Nov', revenue: 6200 },
  { date: '21 Nov', revenue: 1200 }, // Today (Partial)
  { date: '22 Nov', revenue: 0 },
];

export const PROMPTPAY_ID = "081-234-5678"; // Simulation