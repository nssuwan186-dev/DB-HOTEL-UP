# 🏨 DB-HOTEL-UP - ระบบบริหารจัดการโรงแรม
**ระบบจัดการโรงแรมพร้อมฐานข้อมูล PostgreSQL**

การจัดการโรงแรมที่ใช้ Supabase PostgreSQL เป็นเทคโนโลยีหลัก พร้อมด้วย REST API และ React Frontend

---

## ✨ คุณสมบัติ

- ✅ **จัดการห้องพัก** - ดูสถานะห้อง (ว่าง/ไม่ว่าง/ทำความสะอาด) และราคา
- ✅ **จัดการลูกค้า** - บันทึกและค้นหาข้อมูลลูกค้า (ไทย/ต่างประเทศ)
- ✅ **การจอง** - สร้างและติดตามการจอง ตัดสต็อกห้องอัตโนมัติ
- ✅ **สมุดบัญชี** - บันทึกรายรับ-รายจ่าย คำนวณยอดคงเหลือ
- ✅ **แดชบอร์ด** - สถิติภาพรวมและกราฟรายได้
- ✅ **ฐานข้อมูล PostgreSQL** - เชื่อมต่อ Cloud Database (Supabase)
- ✅ **REST API** - Backend ด้วย Express.js
- ✅ **React Frontend** - หน้าจอทันสมัย ใช้งานง่าย (Vite)

---

## 🚀 เริ่มต้นใช้งาน (Quick Start)

### 1. ตั้งค่าฐานข้อมูล (Supabase)

1. ไปที่ [Supabase Dashboard](https://supabase.com/dashboard)
2. สร้าง Project ใหม่
3. ไปที่เมนู **SQL Editor**
4. Copy เนื้อหาจากไฟล์ `database/schema.sql` ในโปรเจคนี้
5. Paste ลงใน SQL Editor แล้วกด **Run**

### 2. ติดตั้งและตั้งค่า (Local Development)

```bash
# ติดตั้ง dependencies
cd DB-HOTEL-UP-NEW
npm install

# สร้างไฟล์ .env.local
# แทนที่ password ด้วยรหัสผ่าน Supabase ของคุณ
echo "DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.eeizuypqyhepkczqmqky.supabase.co:5432/postgres" > .env.local
echo "PORT=5000" >> .env.local
```

### 3. รันโปรแกรม

เปิด 2 Terminal:

```bash
# Terminal 1: รัน Backend API
npm run server

# Terminal 2: รัน Frontend
npm run dev
```

- **Frontend:** <http://localhost:5173>
- **Backend API:** <http://localhost:5000>

---

## 🚀 ปรับใช้กับ Vercel (Deployment)

1. Push โค้ดทั้งหมดขึ้น GitHub
2. ไปที่ [Vercel Dashboard](https://vercel.com) -> **Import Project**
3. ตั้งค่า **Environment Variables**:
   - Name: `DATABASE_URL`
   - Value: `postgresql://postgres:[YOUR-PASSWORD]@db.eeizuypqyhepkczqmqky.supabase.co:5432/postgres`
4. กด **Deploy**

---

## 📁 โครงสร้างโปรเจค

```
DB-HOTEL-UP-NEW/
├── database/                # ไฟล์ Database Schema
│   └── schema.sql          # PostgreSQL setup script
├── api/                     # Backend API (Serverless function)
│   └── index.js            # Express.js app
├── src/                     # Frontend (React App)
│   ├── components/         # หน้าจอต่างๆ (Rooms, Customers, etc.)
│   ├── App.jsx            # Main Layout & Routing
│   └── main.jsx           # Entry point
├── package.json            # รายชื่อ Dependencies
└── vercel.json             # ตั้งค่าสำหรับ Vercel
```

---

## 🔌 API Endpoints

**Base URL:** `/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/rooms` | ดูข้อมูลห้อง |
| GET | `/customers` | ดูข้อมูลลูกค้า |
| GET | `/bookings` | ดูรายการจอง |
| POST | `/bookings` | สร้างการจองใหม่ |
| GET | `/ledger` | ดูบัญชีรายรับจ่าย |
| GET | `/stats` | ดูสถิติแดชบอร์ด |

---

## 📞 Support & Links

- **GitHub:** <https://github.com/nssuwan186-dev/DB-HOTEL-UP>
- **Vercel App:** <https://bdhotel-git-main-nssuwan186-7911s-projects.vercel.app>

---

**Version:** 2.0.0  
**Created:** 29 Dec 2025  
**Powered by:** Supabase + Vercel + React
