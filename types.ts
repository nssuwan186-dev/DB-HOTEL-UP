export enum RoomStatus {
  Available = 'Available',
  Occupied = 'Occupied',
  Maintenance = 'Maintenance',
  Cleaning = 'Cleaning'
}

export enum BookingStatus {
  Confirmed = 'Confirmed',
  CheckedIn = 'CheckedIn',
  CheckedOut = 'CheckedOut',
  Cancelled = 'Cancelled'
}

export enum PaymentMethod {
  Cash = 'Cash',
  QRCode = 'QRCode',
  Transfer = 'Transfer'
}

export interface Room {
  room_id: string;
  room_number: string;
  building: string;
  floor: number;
  room_type: string;
  price_per_night: number;
  status: RoomStatus;
  max_occupancy: number;
}

export interface Customer {
  customer_id: string;
  name: string;
  phone: string;
  email?: string;
  id_card?: string;
  passport?: string;
  customer_type: 'Regular' | 'VIP';
  date_of_birth?: string;
  address?: string;
  notes?: string;
}

export interface Booking {
  booking_id: string;
  customer_id: string;
  room_id: string;
  check_in_date: string;
  check_out_date: string;
  total_amount: number;
  status: BookingStatus;
  payment_status: 'Pending' | 'Paid' | 'Partial';
  channel: 'Walk-in' | 'Line' | 'Phone' | 'Online';
}

export interface Expense {
  expense_id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  paid_by: string;
}

export interface HotelSetting {
  setting_id: string;
  category: string;
  name: string;
  value: string;
}

export interface Transaction {
  id: string;
  booking_id: string;
  amount: number;
  method: PaymentMethod;
  date: string;
  type: 'Income' | 'Expense';
}