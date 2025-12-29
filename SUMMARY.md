# 🎉 DB-HOTEL-UP - สรุปโปรเจคใหม่

## ✅ โปรเจคสร้างเสร็จสมบูรณ์

**สร้างเมื่อ:** 29 ธันวาคม 2025 09:48 AM  
**เวอร์ชัน:** 2.0.0  
**ฐานข้อมูล:** Supabase PostgreSQL

---

## 📦 สิ่งที่สร้างให้คุณ

### 🗄️ **Database (PostgreSQL)**

**Connection String:**

```
postgresql://postgres:[YOUR-PASSWORD]@db.eeizuypqyhepkczqmqky.supabase.co:5432/postgres
```

**ไฟล์:**

- ✅ `database/schema.sql` - Database schema พร้อม sample data
  - 4 Tables: rooms, customers, bookings, ledger
  - Indexes สำหรับ performance
  - Triggers สำหรับ auto-update
  - Views สำหรับ complex queries
  - Sample data พร้อมใช้งาน

### 🔌 **Backend API (Express.js)**

**ไฟล์:**

- ✅ `api/index.js` - REST API server
  - เชื่อมต่อกับ PostgreSQL
  - CRUD operations ครบถ้วน
  - Transaction support
  - Error handling
  - Connection pooling

**Endpoints:**

- `/api/rooms` - จัดการห้องพัก
- `/api/customers` - จัดการลูกค้า
- `/api/bookings` - จัดการการจอง
- `/api/ledger` - จัดการสมุดบัญชี
- `/api/stats` - สถิติทั้งหมด
- `/api/health` - Health check

### ⚙️ **Configuration Files**

- ✅ `package.json` - Dependencies (Express, pg, React)
- ✅ `vercel.json` - Vercel deployment config
- ✅ `.env.template` - Environment variables template

### 📚 **Documentation**

- ✅ `README.md` - คู่มือหลัก (10.8 KB)
- ✅ `DATABASE-SETUP.md` - คู่มือตั้งค่า database (8.4 KB)

---

## 🚀 วิธีใช้งาน (3 ขั้นตอน)

### 1. Setup Database

**ไปที่ Supabase:**

1. เปิด <https://supabase.com/dashboard>
2. เลือกโปรเจคของคุณ
3. ไปที่ **SQL Editor**
4. Copy เนื้อหาจาก `database/schema.sql`
5. Paste และกด **Run**

### 2. ตั้งค่า Environment Variables

**สร้างไฟล์ `.env.local`:**

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.eeizuypqyhepkczqmqky.supabase.co:5432/postgres
PORT=5000
```

**แทนที่ `YOUR_PASSWORD`** ด้วยรหัสผ่าน Supabase ของคุณ

### 3. รันโปรเจค

```bash
# ติดตั้ง dependencies
cd DB-HOTEL-UP-NEW
npm install

# รัน backend
npm run server

# รัน frontend (terminal ใหม่)
npm run dev
```

**เปิดเบราว์เซอร์:**

- Frontend: <http://localhost:5173>
- Backend: <http://localhost:5000>

---

## 📊 Database Schema

### Tables Created

| Table | Records | Description |
|-------|---------|-------------|
| `rooms` | 8 | ห้องพัก (101-302) |
| `customers` | 3 | ลูกค้า (ไทย + ต่างชาติ) |
| `bookings` | 2 | การจอง |
| `ledger` | 4 | สมุดบัญชี (รายรับ-รายจ่าย) |

### Sample Data

**Rooms:**

- 101, 102, 201, 202 - Standard (800 บาท)
- 103, 203 - Deluxe (1,200 บาท)
- 301, 302 - Suite (2,000 บาท)

**Customers:**

- CM0001 - สมชาย ใจดี
- CM0002 - สมหญิง รักสะอาด (VIP)
- CM0003 - John Smith (USA)

---

## 🔐 Environment Variables

### สำหรับ Local Development

สร้างไฟล์ `.env.local`:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.eeizuypqyhepkczqmqky.supabase.co:5432/postgres
PORT=5000
```

### สำหรับ Vercel Deployment

ไปที่ Vercel Dashboard:
👉 <https://vercel.com/nssuwan186-7911s-projects/bd_hotel/settings/environment-variables>

เพิ่ม:

- **Name:** `DATABASE_URL`
- **Value:** `postgresql://postgres:YOUR_PASSWORD@db.eeizuypqyhepkczqmqky.supabase.co:5432/postgres`
- **Environments:** Production, Preview, Development

---

## 🧪 ทดสอบระบบ

### 1. ทดสอบ Database Connection

```bash
# ใช้ psql
psql postgresql://postgres:YOUR_PASSWORD@db.eeizuypqyhepkczqmqky.supabase.co:5432/postgres -c "SELECT NOW()"
```

### 2. ทดสอบ API

```bash
# Health check
curl http://localhost:5000/api/health

# ดึงข้อมูลห้อง
curl http://localhost:5000/api/rooms

# ดึงสถิติ
curl http://localhost:5000/api/stats
```

### 3. ทดสอบ CRUD Operations

```bash
# เพิ่มลูกค้าใหม่
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -d '{"name":"ทดสอบ","phone":"0899999999","country":"ไทย"}'

# อัพเดทสถานะห้อง
curl -X PUT http://localhost:5000/api/rooms/101/status \
  -H "Content-Type: application/json" \
  -d '{"status":"Occupied"}'
```

---

## 🚀 Deploy to Vercel

### ขั้นตอนที่ 1: Push to GitHub

```bash
cd DB-HOTEL-UP-NEW
git init
git add .
git commit -m "Initial commit with PostgreSQL"
git remote add origin https://github.com/nssuwan186-dev/DB-HOTEL-UP.git
git push -u origin main
```

### ขั้นตอนที่ 2: เชื่อมต่อกับ Vercel

1. ไปที่ <https://vercel.com/new>
2. Import repository: `nssuwan186-dev/DB-HOTEL-UP`
3. ตั้งค่า Environment Variables:
   - `DATABASE_URL` = connection string ของคุณ
4. คลิก **Deploy**

### ขั้นตอนที่ 3: ทดสอบ Production

```bash
# ทดสอบ API
curl https://your-app.vercel.app/api/health
curl https://your-app.vercel.app/api/rooms
```

---

## 📁 โครงสร้างโปรเจค

```
DB-HOTEL-UP-NEW/
├── database/
│   └── schema.sql          ✅ PostgreSQL schema + sample data
├── api/
│   └── index.js            ✅ Express.js REST API
├── data/
│   ├── rooms.json          (สำหรับ reference)
│   ├── customers.json      (สำหรับ reference)
│   ├── bookings.json       (สำหรับ reference)
│   └── ledger.json         (สำหรับ reference)
├── package.json            ✅ Dependencies
├── vercel.json             ✅ Vercel config
├── .env.template           ✅ Environment template
├── DATABASE-SETUP.md       ✅ Database guide
├── README.md               ✅ Main documentation
└── SUMMARY.md              ✅ This file
```

---

## 🎯 ความแตกต่างจากเวอร์ชันเดิม

### เวอร์ชันเดิม (Google Sheets)

- ❌ ต้องตั้งค่า Google Cloud
- ❌ ต้องสร้าง Service Account
- ❌ ต้อง share Google Sheet
- ❌ จำกัดจำนวน requests
- ❌ ไม่มี transactions
- ❌ ช้ากว่า

### เวอร์ชันใหม่ (PostgreSQL)

- ✅ ใช้ Supabase (ฟรี)
- ✅ ตั้งค่าง่าย (แค่รัน SQL)
- ✅ ไม่จำกัด requests
- ✅ มี transactions
- ✅ เร็วกว่ามาก
- ✅ มี indexes, views, triggers
- ✅ Scalable

---

## 🆘 Troubleshooting

### ปัญหา: Database connection failed

**Solution:**

1. ตรวจสอบรหัสผ่านใน `DATABASE_URL`
2. ดูรหัสผ่านใน Supabase Dashboard → Settings → Database
3. ตรวจสอบว่า IP ของคุณไม่ถูก block

### ปัญหา: Table does not exist

**Solution:**

1. รัน `database/schema.sql` ใน Supabase SQL Editor
2. ตรวจสอบว่า SQL รันสำเร็จ (ไม่มี error)

### ปัญหา: API returns 500

**Solution:**

1. ดู console logs: `npm run server`
2. ตรวจสอบ `DATABASE_URL` ใน `.env.local`
3. ทดสอบ database connection ด้วย psql

---

## 📞 Links

- **โปรเจค:** `C:\Users\Hotel\.gemini\antigravity\scratch\DB-HOTEL-UP-NEW\`
- **Supabase Dashboard:** <https://supabase.com/dashboard>
- **Vercel Dashboard:** <https://vercel.com/nssuwan186-7911s-projects/bd_hotel>
- **GitHub:** <https://github.com/nssuwan186-dev/DB-HOTEL-UP>

---

## ✅ Checklist

### Database Setup

- [ ] รัน `schema.sql` ใน Supabase SQL Editor
- [ ] ตรวจสอบว่ามี 4 tables
- [ ] ตรวจสอบว่ามี sample data

### Local Development

- [ ] สร้างไฟล์ `.env.local`
- [ ] ใส่ `DATABASE_URL` ที่ถูกต้อง
- [ ] รัน `npm install`
- [ ] รัน `npm run server` - ต้องเห็น "Database connected"
- [ ] ทดสอบ API endpoints

### Deployment

- [ ] Push code to GitHub
- [ ] เชื่อมต่อกับ Vercel
- [ ] ตั้งค่า `DATABASE_URL` ใน Vercel
- [ ] Deploy และทดสอบ production URL

---

## 🎉 สรุป

คุณได้รับ:

- ✅ PostgreSQL database schema พร้อม sample data
- ✅ REST API backend (Express.js + pg)
- ✅ Configuration files สำหรับ Vercel
- ✅ เอกสารครบถ้วน (19 KB)
- ✅ พร้อม deploy ทันที

**ขั้นตอนถัดไป:**

1. รัน `schema.sql` ใน Supabase
2. ตั้งค่า `.env.local`
3. รัน `npm install && npm run server`
4. Deploy to Vercel

**Good luck! 🚀**

---

**Created:** December 29, 2025 09:48 AM  
**Version:** 2.0.0  
**Database:** Supabase PostgreSQL  
**Status:** ✅ Ready to use
