# 🚀 Quick Start - DB-HOTEL-UP

## ⚡ เริ่มใช้งานใน 5 นาที

**Database:** Supabase PostgreSQL  
**Status:** ✅ พร้อมใช้งาน (รหัสผ่านตั้งค่าแล้ว)

---

## 📋 Step 1: Setup Database (2 นาที)

### 1.1 เปิด Supabase SQL Editor

👉 <https://supabase.com/dashboard/project/eeizuypqyhepkczqmqky/sql/new>

### 1.2 Copy SQL Schema

เปิดไฟล์ `database/schema.sql` และ copy ทั้งหมด

### 1.3 Run SQL

1. Paste SQL ลงใน SQL Editor
2. กด **Run** (หรือ Ctrl+Enter)
3. รอจนเสร็จ (ประมาณ 5-10 วินาที)

**ผลลัพธ์ที่ได้:**

- ✅ 4 Tables: rooms, customers, bookings, ledger
- ✅ Sample data (8 rooms, 3 customers, 2 bookings, 4 ledger entries)
- ✅ Indexes, Triggers, Views

---

## 📦 Step 2: ติดตั้ง Dependencies (1 นาที)

เปิด Terminal และรันคำสั่ง:

```bash
cd C:\Users\Hotel\.gemini\antigravity\scratch\DB-HOTEL-UP-NEW
npm install
```

**Dependencies ที่จะติดตั้ง:**

- express - Web server
- pg - PostgreSQL client
- cors - CORS support
- dotenv - Environment variables
- react - Frontend framework
- และอื่นๆ

---

## 🔐 Step 3: Environment Variables (แล้วเสร็จ!)

**ไฟล์ `.env.local` พร้อมใช้งานแล้ว!**

ตรวจสอบว่ามีไฟล์นี้:

```
C:\Users\Hotel\.gemini\antigravity\scratch\DB-HOTEL-UP-NEW\.env.local
```

เนื้อหา:

```env
DATABASE_URL=postgresql://postgres:Fc_0958872848@db.eeizuypqyhepkczqmqky.supabase.co:5432/postgres
PORT=5000
```

✅ **ไม่ต้องทำอะไร - พร้อมใช้งาน!**

---

## 🚀 Step 4: รันโปรเจค (1 นาที)

### 4.1 รัน Backend API

เปิด Terminal และรัน:

```bash
npm run server
```

**ควรเห็น:**

```
🚀 DB-HOTEL-UP API running on port 5000
📊 Database: PostgreSQL (Supabase)
✅ Database connected: 2025-12-29T...
```

### 4.2 ทดสอบ API

เปิด browser ไปที่:

- <http://localhost:5000/> - API info
- <http://localhost:5000/api/health> - Health check
- <http://localhost:5000/api/rooms> - ดูข้อมูลห้อง
- <http://localhost:5000/api/stats> - ดูสถิติ

หรือใช้ curl:

```bash
curl http://localhost:5000/api/health
curl http://localhost:5000/api/rooms
curl http://localhost:5000/api/stats
```

---

## ✅ Step 5: ทดสอบการทำงาน (1 นาที)

### Test 1: ดึงข้อมูลห้อง

```bash
curl http://localhost:5000/api/rooms
```

**ควรได้:**

```json
[
  {
    "room_id": "101",
    "building": "A",
    "floor": "1",
    "room_type": "Standard",
    "price": "800.00",
    "status": "Available"
  },
  ...
]
```

### Test 2: ดูสถิติ

```bash
curl http://localhost:5000/api/stats
```

**ควรได้:**

```json
{
  "total_rooms": "8",
  "available_rooms": "8",
  "occupied_rooms": "0",
  "total_bookings": "2",
  "active_bookings": "2",
  "total_revenue": "5450.00",
  "total_expenses": "3300.00",
  "current_balance": "2150.00"
}
```

### Test 3: เพิ่มลูกค้าใหม่

```bash
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"ทดสอบ ระบบ\",\"phone\":\"0899999999\",\"country\":\"ไทย\"}"
```

**ควรได้:**

```json
{
  "success": true,
  "customer": {
    "customer_id": "CM0004",
    "name": "ทดสอบ ระบบ",
    "phone": "0899999999",
    ...
  }
}
```

---

## 🎉 เสร็จแล้ว

ถ้าทุก test ผ่าน แสดงว่าระบบพร้อมใช้งานแล้ว!

---

## 📊 ข้อมูลที่มีในระบบ

### Rooms (8 ห้อง)

- 101, 102, 201, 202 - Standard (800 บาท)
- 103, 203 - Deluxe (1,200 บาท)
- 301, 302 - Suite (2,000 บาท)

### Customers (3 คน)

- CM0001 - สมชาย ใจดี
- CM0002 - สมหญิง รักสะอาด (VIP)
- CM0003 - John Smith (USA)

### Bookings (2 รายการ)

- BK202512290001 - ห้อง 101 (สมชาย)
- BK202512290002 - ห้อง 203 (สมหญิง)

### Ledger (4 รายการ)

- รายรับ: 5,450 บาท
- รายจ่าย: 3,300 บาท
- คงเหลือ: 2,150 บาท

---

## 🔗 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/rooms` | GET | ดึงข้อมูลห้องทั้งหมด |
| `/api/rooms/:id` | GET | ดึงข้อมูลห้องตาม ID |
| `/api/rooms/:id/status` | PUT | อัพเดทสถานะห้อง |
| `/api/customers` | GET | ดึงข้อมูลลูกค้าทั้งหมด |
| `/api/customers/:id` | GET | ดึงข้อมูลลูกค้าตาม ID |
| `/api/customers` | POST | เพิ่มลูกค้าใหม่ |
| `/api/bookings` | GET | ดึงข้อมูลการจองทั้งหมด |
| `/api/bookings/:id` | GET | ดึงข้อมูลการจองตาม ID |
| `/api/bookings` | POST | สร้างการจองใหม่ |
| `/api/bookings/:id/status` | PUT | อัพเดทสถานะการจอง |
| `/api/ledger` | GET | ดึงข้อมูลสมุดบัญชี |
| `/api/ledger` | POST | เพิ่มรายการใหม่ |
| `/api/stats` | GET | ดึงสถิติทั้งหมด |
| `/api/health` | GET | Health check |

---

## 🚀 Next Steps

### 1. รัน Frontend (ถ้ามี)

```bash
# Terminal ใหม่
npm run dev
```

### 2. Deploy to Vercel

```bash
# ตั้งค่า Environment Variables ใน Vercel
# Name: DATABASE_URL
# Value: postgresql://postgres:Fc_0958872848@db.eeizuypqyhepkczqmqky.supabase.co:5432/postgres

# Deploy
vercel --prod
```

### 3. Customize

- แก้ไข sample data ใน `database/schema.sql`
- เพิ่ม API endpoints ใน `api/index.js`
- สร้าง Frontend components

---

## 🆘 Troubleshooting

### ปัญหา: npm install ล้มเหลว

```bash
# ลบ node_modules และลองใหม่
rm -rf node_modules package-lock.json
npm install
```

### ปัญหา: Database connection failed

```bash
# ทดสอบ connection
curl http://localhost:5000/api/health

# ตรวจสอบ .env.local
cat .env.local
```

### ปัญหา: Port 5000 ถูกใช้งาน

```bash
# เปลี่ยน port ใน .env.local
PORT=5001
```

---

## 📞 Links

- **Supabase Dashboard:** <https://supabase.com/dashboard/project/eeizuypqyhepkczqmqky>
- **SQL Editor:** <https://supabase.com/dashboard/project/eeizuypqyhepkczqmqky/sql/new>
- **Vercel:** <https://vercel.com/nssuwan186-7911s-projects/bd_hotel>

---

**เวลาทั้งหมด:** ~5 นาที  
**Status:** ✅ พร้อมใช้งาน  
**Database:** Supabase PostgreSQL  
**Password:** Fc_0958872848

**Happy coding! 🎉**
