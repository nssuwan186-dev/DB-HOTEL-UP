# 🎉 DB-HOTEL-UP - พร้อมใช้งานทันที

## ✅ ทุกอย่างพร้อมแล้ว

**สร้างเมื่อ:** 29 ธันวาคม 2025 09:55 AM  
**Database:** Supabase PostgreSQL  
**Status:** ✅ **READY TO USE**

---

## 🔐 ข้อมูลการเชื่อมต่อ (ตั้งค่าแล้ว)

**Database URL:**

```
postgresql://postgres:Fc_0958872848@db.eeizuypqyhepkczqmqky.supabase.co:5432/postgres
```

**Host:** `db.eeizuypqyhepkczqmqky.supabase.co`  
**Port:** `5432`  
**Database:** `postgres`  
**User:** `postgres`  
**Password:** `Fc_0958872848`

✅ **ไฟล์ `.env.local` พร้อมใช้งานแล้ว!**

---

## 🚀 เริ่มใช้งานเลย! (3 คำสั่ง)

### 1. Setup Database

**เปิด Supabase SQL Editor:**

```
https://supabase.com/dashboard/project/eeizuypqyhepkczqmqky/sql/new
```

**Copy และ Run:**

- เปิดไฟล์ `database/schema.sql`
- Copy ทั้งหมด
- Paste ใน SQL Editor
- กด **Run** (Ctrl+Enter)

### 2. ติดตั้ง Dependencies

```bash
cd C:\Users\Hotel\.gemini\antigravity\scratch\DB-HOTEL-UP-NEW
npm install
```

### 3. รัน Server

```bash
npm run server
```

**เปิดเบราว์เซอร์:**

- <http://localhost:5000/api/health>
- <http://localhost:5000/api/rooms>
- <http://localhost:5000/api/stats>

---

## 📋 คำสั่งที่ใช้บ่อย

### ทดสอบ Database Connection

```bash
# Windows PowerShell
curl http://localhost:5000/api/health
```

### ดูข้อมูลห้องทั้งหมด

```bash
curl http://localhost:5000/api/rooms
```

### ดูสถิติ

```bash
curl http://localhost:5000/api/stats
```

### เพิ่มลูกค้าใหม่

```bash
curl -X POST http://localhost:5000/api/customers -H "Content-Type: application/json" -d "{\"name\":\"ทดสอบ\",\"phone\":\"0899999999\",\"country\":\"ไทย\"}"
```

### สร้างการจองใหม่

```bash
curl -X POST http://localhost:5000/api/bookings -H "Content-Type: application/json" -d "{\"room_id\":\"101\",\"customer_id\":\"CM0001\",\"customer_name\":\"สมชาย ใจดี\",\"customer_phone\":\"0812345678\",\"check_in_date\":\"2025-12-30\",\"check_out_date\":\"2026-01-01\",\"nights\":2,\"room_type\":\"Standard\",\"room_price\":800,\"service_fee\":100,\"total_amount\":1700,\"status\":\"Confirmed\",\"channel\":\"Walk-in\"}"
```

### อัพเดทสถานะห้อง

```bash
curl -X PUT http://localhost:5000/api/rooms/101/status -H "Content-Type: application/json" -d "{\"status\":\"Occupied\"}"
```

---

## 📁 โครงสร้างโปรเจค

```
DB-HOTEL-UP-NEW/
├── database/
│   └── schema.sql          ✅ PostgreSQL schema (พร้อม sample data)
├── api/
│   └── index.js            ✅ Express.js REST API
├── .env.local              ✅ Environment variables (พร้อมใช้งาน)
├── .env.template           📝 Template สำหรับ reference
├── .gitignore              🔒 ป้องกัน commit รหัสผ่าน
├── package.json            ✅ Dependencies
├── vercel.json             ✅ Vercel config
├── README.md               📚 คู่มือหลัก
├── DATABASE-SETUP.md       📚 คู่มือ database
├── QUICKSTART.md           ⚡ Quick start guide
├── SUMMARY.md              📋 สรุปทั้งหมด
└── READY.md                ✅ ไฟล์นี้
```

---

## 🔌 API Endpoints ทั้งหมด

### Rooms

- `GET /api/rooms` - ดึงข้อมูลห้องทั้งหมด
- `GET /api/rooms/:id` - ดึงข้อมูลห้องตาม ID
- `PUT /api/rooms/:id/status` - อัพเดทสถานะห้อง

### Customers

- `GET /api/customers` - ดึงข้อมูลลูกค้าทั้งหมด
- `GET /api/customers/:id` - ดึงข้อมูลลูกค้าตาม ID
- `POST /api/customers` - เพิ่มลูกค้าใหม่

### Bookings

- `GET /api/bookings` - ดึงข้อมูลการจองทั้งหมด
- `GET /api/bookings/:id` - ดึงข้อมูลการจองตาม ID
- `POST /api/bookings` - สร้างการจองใหม่
- `PUT /api/bookings/:id/status` - อัพเดทสถานะการจอง

### Ledger

- `GET /api/ledger` - ดึงข้อมูลสมุดบัญชีทั้งหมด
- `POST /api/ledger` - เพิ่มรายการใหม่

### Statistics

- `GET /api/stats` - ดึงสถิติทั้งหมด

### Health

- `GET /api/health` - ตรวจสอบสถานะ API และ Database

---

## 📊 Sample Data ที่มีในระบบ

### Rooms (8 ห้อง)

| Room ID | Type | Price | Status |
|---------|------|-------|--------|
| 101, 102, 201, 202 | Standard | 800 | Available |
| 103, 203 | Deluxe | 1,200 | Available |
| 301, 302 | Suite | 2,000 | Available |

### Customers (3 คน)

| ID | Name | Phone | Country |
|----|------|-------|---------|
| CM0001 | สมชาย ใจดี | 0812345678 | ไทย |
| CM0002 | สมหญิง รักสะอาด | 0823456789 | ไทย (VIP) |
| CM0003 | John Smith | 0834567890 | USA |

### Bookings (2 รายการ)

| ID | Room | Customer | Dates | Amount |
|----|------|----------|-------|--------|
| BK202512290001 | 101 | สมชาย | 29-31 Dec | 1,700 |
| BK202512290002 | 203 | สมหญิง | 30 Dec - 2 Jan | 3,750 |

### Ledger Summary

- **รายรับ:** 5,450 บาท
- **รายจ่าย:** 3,300 บาท
- **คงเหลือ:** 2,150 บาท

---

## 🚀 Deploy to Vercel

### Step 1: ตั้งค่า Environment Variables

ไปที่:

```
https://vercel.com/nssuwan186-7911s-projects/bd_hotel/settings/environment-variables
```

เพิ่ม:

- **Name:** `DATABASE_URL`
- **Value:** `postgresql://postgres:Fc_0958872848@db.eeizuypqyhepkczqmqky.supabase.co:5432/postgres`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

### Step 2: Deploy

```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit with PostgreSQL"
git remote add origin https://github.com/nssuwan186-dev/DB-HOTEL-UP.git
git push -u origin main

# Or deploy directly
vercel --prod
```

---

## ✅ Checklist

### Database Setup

- [ ] เปิด Supabase SQL Editor
- [ ] Copy `database/schema.sql`
- [ ] Run SQL (กด Run)
- [ ] ตรวจสอบว่ามี 4 tables

### Local Development

- [ ] รัน `npm install`
- [ ] รัน `npm run server`
- [ ] เห็น "Database connected"
- [ ] ทดสอบ <http://localhost:5000/api/health>

### Testing

- [ ] ทดสอบ GET /api/rooms
- [ ] ทดสอบ GET /api/stats
- [ ] ทดสอบ POST /api/customers
- [ ] ทดสอบ POST /api/bookings

### Deployment

- [ ] ตั้งค่า DATABASE_URL ใน Vercel
- [ ] Push to GitHub
- [ ] Deploy สำเร็จ
- [ ] ทดสอบ production URL

---

## 🆘 Quick Troubleshooting

| ปัญหา | แก้ไข |
|-------|-------|
| Database connection failed | ตรวจสอบ `.env.local` มีไฟล์หรือไม่ |
| npm install ล้มเหลว | ลบ `node_modules` และลองใหม่ |
| Port 5000 ถูกใช้งาน | เปลี่ยน `PORT=5001` ใน `.env.local` |
| Table does not exist | รัน `schema.sql` ใน Supabase |
| API returns 500 | ดู console logs |

---

## 📞 Important Links

- **Supabase Dashboard:** <https://supabase.com/dashboard/project/eeizuypqyhepkczqmqky>
- **SQL Editor:** <https://supabase.com/dashboard/project/eeizuypqyhepkczqmqky/sql/new>
- **Vercel Project:** <https://vercel.com/nssuwan186-7911s-projects/bd_hotel>
- **Vercel Env Vars:** <https://vercel.com/nssuwan186-7911s-projects/bd_hotel/settings/environment-variables>

---

## 🎯 What's Next?

1. ✅ รัน `npm install`
2. ✅ รัน `npm run server`
3. ✅ ทดสอบ API endpoints
4. 🚀 Deploy to Vercel
5. 🎨 สร้าง Frontend (ถ้าต้องการ)

---

## 📚 Documentation

- **Quick Start:** `QUICKSTART.md` - เริ่มใช้งานใน 5 นาที
- **Database Setup:** `DATABASE-SETUP.md` - คู่มือตั้งค่า database
- **Full Guide:** `README.md` - คู่มือเต็ม
- **Summary:** `SUMMARY.md` - สรุปทั้งหมด

---

**Status:** ✅ **READY TO USE**  
**Database:** Supabase PostgreSQL  
**Password:** Fc_0958872848  
**Location:** `C:\Users\Hotel\.gemini\antigravity\scratch\DB-HOTEL-UP-NEW\`

🎉 **ทุกอย่างพร้อมแล้ว! เริ่มใช้งานได้เลย!** 🚀
