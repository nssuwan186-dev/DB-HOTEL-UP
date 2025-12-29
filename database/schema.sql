-- DB-HOTEL-UP Database Schema
-- PostgreSQL + Supabase

-- ==========================================
-- Table: rooms (ห้องพัก)
-- ==========================================
CREATE TABLE IF NOT EXISTS rooms (
  room_id VARCHAR(10) PRIMARY KEY,
  building VARCHAR(10) NOT NULL,
  floor VARCHAR(10) NOT NULL,
  room_type VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'Available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- Table: customers (ลูกค้า)
-- ==========================================
CREATE TABLE IF NOT EXISTS customers (
  customer_id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  country VARCHAR(100) DEFAULT 'ไทย',
  id_card VARCHAR(20),
  passport VARCHAR(20),
  email VARCHAR(255),
  customer_type VARCHAR(20) DEFAULT 'Regular',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- Table: bookings (การจอง)
-- ==========================================
CREATE TABLE IF NOT EXISTS bookings (
  booking_id VARCHAR(30) PRIMARY KEY,
  room_id VARCHAR(10) REFERENCES rooms(room_id),
  customer_id VARCHAR(20) REFERENCES customers(customer_id),
  customer_name VARCHAR(255),
  customer_phone VARCHAR(20),
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  nights INTEGER NOT NULL,
  room_type VARCHAR(50),
  room_price DECIMAL(10, 2),
  service_fee DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'Confirmed',
  channel VARCHAR(50) DEFAULT 'Walk-in',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- Table: ledger (สมุดบัญชี)
-- ==========================================
CREATE TABLE IF NOT EXISTS ledger (
  id VARCHAR(20) PRIMARY KEY,
  date DATE NOT NULL,
  item VARCHAR(255) NOT NULL,
  room_id VARCHAR(10),
  phone VARCHAR(20),
  nights INTEGER DEFAULT 0,
  income DECIMAL(10, 2) DEFAULT 0,
  expense DECIMAL(10, 2) DEFAULT 0,
  balance DECIMAL(10, 2) DEFAULT 0,
  deposit DECIMAL(10, 2) DEFAULT 0,
  note TEXT,
  booking_id VARCHAR(30),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- Indexes for better performance
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(check_in_date, check_out_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_ledger_date ON ledger(date);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

-- ==========================================
-- Insert sample data
-- ==========================================

-- Sample Rooms
INSERT INTO rooms (room_id, building, floor, room_type, price, status) VALUES
('101', 'A', '1', 'Standard', 800, 'Available'),
('102', 'A', '1', 'Standard', 800, 'Available'),
('103', 'A', '1', 'Deluxe', 1200, 'Available'),
('201', 'A', '2', 'Standard', 800, 'Available'),
('202', 'A', '2', 'Standard', 800, 'Available'),
('203', 'A', '2', 'Deluxe', 1200, 'Available'),
('301', 'A', '3', 'Suite', 2000, 'Available'),
('302', 'A', '3', 'Suite', 2000, 'Available')
ON CONFLICT (room_id) DO NOTHING;

-- Sample Customers
INSERT INTO customers (customer_id, name, phone, address, country, id_card, email, customer_type) VALUES
('CM0001', 'สมชาย ใจดี', '0812345678', '123 ถนนสุขุมวิท กรุงเทพฯ', 'ไทย', '1234567890123', 'somchai@example.com', 'Regular'),
('CM0002', 'สมหญิง รักสะอาด', '0823456789', '456 ถนนพระราม 4 กรุงเทพฯ', 'ไทย', '9876543210987', 'somying@example.com', 'VIP'),
('CM0003', 'John Smith', '0834567890', '789 Main Street, New York, USA', 'USA', NULL, 'john.smith@example.com', 'Regular')
ON CONFLICT (customer_id) DO NOTHING;

-- Sample Bookings
INSERT INTO bookings (booking_id, room_id, customer_id, customer_name, customer_phone, check_in_date, check_out_date, nights, room_type, room_price, service_fee, total_amount, status, channel) VALUES
('BK202512290001', '101', 'CM0001', 'สมชาย ใจดี', '0812345678', '2025-12-29', '2025-12-31', 2, 'Standard', 800, 100, 1700, 'Confirmed', 'Walk-in'),
('BK202512290002', '203', 'CM0002', 'สมหญิง รักสะอาด', '0823456789', '2025-12-30', '2026-01-02', 3, 'Deluxe', 1200, 150, 3750, 'Confirmed', 'Online')
ON CONFLICT (booking_id) DO NOTHING;

-- Sample Ledger
INSERT INTO ledger (id, date, item, room_id, phone, nights, income, expense, balance, deposit, note, booking_id) VALUES
('LED0001', '2025-12-29', 'รายรับค่าห้อง - สมชาย ใจดี', '101', '0812345678', 2, 1700, 0, 1700, 500, 'จ่ายเงินสด', 'BK202512290001'),
('LED0002', '2025-12-28', 'รายรับค่าห้อง - สมหญิง รักสะอาด', '203', '0823456789', 3, 3750, 0, 5450, 1000, 'โอนเงิน', 'BK202512290002'),
('LED0003', '2025-12-29', 'ค่าไฟฟ้า', NULL, NULL, 0, 0, 2500, 2950, 0, 'ค่าไฟประจำเดือน', NULL),
('LED0004', '2025-12-29', 'ค่าน้ำประปา', NULL, NULL, 0, 0, 800, 2150, 0, 'ค่าน้ำประจำเดือน', NULL)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- Functions and Triggers
-- ==========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_rooms_updated_at ON rooms;
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- Views for easier querying
-- ==========================================

-- View: Active bookings with customer details
CREATE OR REPLACE VIEW active_bookings AS
SELECT 
  b.*,
  c.name as customer_full_name,
  c.email as customer_email,
  r.room_type as room_type_name,
  r.building,
  r.floor
FROM bookings b
LEFT JOIN customers c ON b.customer_id = c.customer_id
LEFT JOIN rooms r ON b.room_id = r.room_id
WHERE b.status IN ('Confirmed', 'Checked In')
ORDER BY b.check_in_date;

-- View: Room availability
CREATE OR REPLACE VIEW room_availability AS
SELECT 
  r.*,
  COUNT(b.booking_id) as total_bookings,
  COALESCE(SUM(CASE WHEN b.status = 'Confirmed' THEN 1 ELSE 0 END), 0) as confirmed_bookings
FROM rooms r
LEFT JOIN bookings b ON r.room_id = b.room_id
GROUP BY r.room_id;

-- View: Financial summary
CREATE OR REPLACE VIEW financial_summary AS
SELECT 
  DATE_TRUNC('month', date) as month,
  SUM(income) as total_income,
  SUM(expense) as total_expense,
  SUM(income) - SUM(expense) as net_profit
FROM ledger
GROUP BY DATE_TRUNC('month', date)
ORDER BY month DESC;

-- ==========================================
-- Grant permissions (for Supabase)
-- ==========================================

-- Enable Row Level Security
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now, adjust based on your needs)
CREATE POLICY "Allow all operations on rooms" ON rooms FOR ALL USING (true);
CREATE POLICY "Allow all operations on customers" ON customers FOR ALL USING (true);
CREATE POLICY "Allow all operations on bookings" ON bookings FOR ALL USING (true);
CREATE POLICY "Allow all operations on ledger" ON ledger FOR ALL USING (true);

-- ==========================================
-- Success message
-- ==========================================
DO $$
BEGIN
  RAISE NOTICE 'Database schema created successfully!';
  RAISE NOTICE 'Tables: rooms, customers, bookings, ledger';
  RAISE NOTICE 'Sample data inserted';
  RAISE NOTICE 'Ready to use!';
END $$;
