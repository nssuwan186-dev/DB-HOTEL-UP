# 🏨 DB-HOTEL-UP - Hotel Management System

## 📊 ระบบจัดการโรงแรมพร้อม PostgreSQL Database

ระบบจัดการโรงแรมที่ใช้ **Supabase PostgreSQL** เป็นฐานข้อมูล พร้อม REST API และ React Frontend

---

## ✨ Features

- ✅ **จัดการห้องพัก** - เพิ่ม แก้ไข ดูสถานะห้อง
- ✅ **จัดการลูกค้า** - บันทึกข้อมูลลูกค้า (ไทย/ต่างชาติ)
- ✅ **จัดการการจอง** - สร้างและติดตามการจอง
- ✅ **สมุดบัญชี** - บันทึกรายรับ-รายจ่าย
- ✅ **Dashboard** - สถิติและกราฟแสดงผล
- ✅ **PostgreSQL Database** - ฐานข้อมูลที่แข็งแกร่งและปลอดภัย
- ✅ **Supabase** - Backend as a Service
- ✅ **REST API** - Express.js backend
- ✅ **React Frontend** - Modern UI

---

## 🗄️ Database Information

**Provider:** Supabase PostgreSQL  
**Host:** `db.eeizuypqyhepkczqmqky.supabase.co`  
**Port:** `5432`  
**Database:** `postgres`

**Connection String:**

```
postgresql://postgres:[YOUR-PASSWORD]@db.eeizuypqyhepkczqmqky.supabase.co:5432/postgres
```

---

## 🚀 Quick Start

### 1. Setup Database

**Option A: ใช้ Supabase Dashboard (แนะนำ)**

1. ไปที่ [Supabase Dashboard](https://supabase.com/dashboard)
2. เลือกโปรเจคของคุณ
3. ไปที่ **SQL Editor**
4. Copy เนื้อหาจาก `database/schema.sql`
5. Paste และคลิก **Run**

**Option B: ใช้ psql Command Line**

```bash
psql postgresql://postgres:YOUR_PASSWORD@db.eeizuypqyhepkczqmqky.supabase.co:5432/postgres -f database/schema.sql
```

📚 **คู่มือเต็ม:** อ่าน `DATABASE-SETUP.md`

### 2. ติดตั้ง Dependencies

```bash
cd DB-HOTEL-UP-NEW
npm install
```

### 3. ตั้งค่า Environment Variables

สร้างไฟล์ `.env.local`:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.eeizuypqyhepkczqmqky.supabase.co:5432/postgres
PORT=5000
```

### 4. รันแบบ Local

```bash
# Terminal 1: รัน Backend API
npm run server

# Terminal 2: รัน Frontend
npm run dev
```

- **Frontend:** <http://localhost:5173>
- **Backend API:** <http://localhost:5000>
- **API Docs:** <http://localhost:5000/>

### 5. ทดสอบ API

```bash
# Health check
curl http://localhost:5000/api/health

# ดึงข้อมูลห้อง
curl http://localhost:5000/api/rooms

# ดึงสถิติ
curl http://localhost:5000/api/stats
```

---

## 📁 โครงสร้างโปรเจค

```
DB-HOTEL-UP-NEW/
├── database/                # Database files
│   └── schema.sql          # PostgreSQL schema
├── api/                     # Backend API
│   └── index.js            # Express.js server
├── src/                     # Frontend (React)
│   ├── components/         # React components
│   ├── App.jsx            # Main app
│   └── main.jsx           # Entry point
├── package.json            # Dependencies
├── vercel.json             # Vercel config
├── .env.template           # Environment variables template
├── DATABASE-SETUP.md       # Database setup guide
└── README.md               # This file
```

---

## 🔌 API Endpoints

### Base URL

- **Local:** `http://localhost:5000`
- **Production:** `https://your-app.vercel.app`

### Rooms API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rooms` | ดึงข้อมูลห้องทั้งหมด |
| GET | `/api/rooms/:id` | ดึงข้อมูลห้องตาม ID |
| PUT | `/api/rooms/:id/status` | อัพเดทสถานะห้อง |

### Customers API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/customers` | ดึงข้อมูลลูกค้าทั้งหมด |
| GET | `/api/customers/:id` | ดึงข้อมูลลูกค้าตาม ID |
| POST | `/api/customers` | เพิ่มลูกค้าใหม่ |

### Bookings API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings` | ดึงข้อมูลการจองทั้งหมด |
| GET | `/api/bookings/:id` | ดึงข้อมูลการจองตาม ID |
| POST | `/api/bookings` | สร้างการจองใหม่ |
| PUT | `/api/bookings/:id/status` | อัพเดทสถานะการจอง |

### Ledger API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ledger` | ดึงข้อมูลสมุดบัญชีทั้งหมด |
| POST | `/api/ledger` | เพิ่มรายการใหม่ |

### Statistics API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats` | ดึงสถิติทั้งหมด |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | ตรวจสอบสถานะ API และ Database |

---

## 🚀 Deploy to Vercel

### Step 1: ตั้งค่า Environment Variables ใน Vercel

1. ไปที่ [Vercel Dashboard](https://vercel.com/nssuwan186-7911s-projects/bd_hotel/settings/environment-variables)
2. เพิ่ม:
   - **Name:** `DATABASE_URL`
   - **Value:** `postgresql://postgres:YOUR_PASSWORD@db.eeizuypqyhepkczqmqky.supabase.co:5432/postgres`
   - **Environments:** Production, Preview, Development

### Step 2: Deploy

**Option A: Git Push (Auto-deploy)**

```bash
git add .
git commit -m "Deploy with PostgreSQL"
git push origin main
```

**Option B: Vercel CLI**

```bash
npm install -g vercel
vercel --prod
```

---

## 🎨 ตัวอย่างการใช้งาน API

### เพิ่มลูกค้าใหม่

```bash
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ทดสอบ ระบบ",
    "phone": "0899999999",
    "address": "กรุงเทพฯ",
    "country": "ไทย",
    "email": "test@example.com"
  }'
```

### สร้างการจองใหม่

```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "room_id": "101",
    "customer_id": "CM0001",
    "customer_name": "สมชาย ใจดี",
    "customer_phone": "0812345678",
    "check_in_date": "2025-12-30",
    "check_out_date": "2026-01-01",
    "nights": 2,
    "room_type": "Standard",
    "room_price": 800,
    "service_fee": 100,
    "total_amount": 1700,
    "status": "Confirmed",
    "channel": "Walk-in"
  }'
```

### อัพเดทสถานะห้อง

```bash
curl -X PUT http://localhost:5000/api/rooms/101/status \
  -H "Content-Type: application/json" \
  -d '{"status": "Occupied"}'
```

---

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ Yes |
| `PORT` | Server port (default: 5000) | ❌ No |

### Vercel Configuration (`vercel.json`)

```json
{
  "version": 2,
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/api/:match*",
      "destination": "/api/index.js"
    }
  ]
}
```

---

## 🆘 Troubleshooting

### Database Connection Failed

**Error:** `password authentication failed`

**Solution:**

1. ตรวจสอบรหัสผ่านใน `DATABASE_URL`
2. ดูรหัสผ่านใน Supabase Dashboard → Settings → Database
3. Reset รหัสผ่านถ้าจำเป็น

### API Returns 500 Error

**Error:** `Failed to fetch rooms`

**Solution:**

1. ตรวจสอบว่า database schema ถูกสร้างแล้ว (รัน `schema.sql`)
2. ตรวจสอบ `DATABASE_URL` ใน environment variables
3. ดู logs: `npm run server`

### CORS Errors

**Error:** `Access to fetch has been blocked by CORS policy`

**Solution:**

- ตรวจสอบว่า `cors` middleware ถูก enable ใน `api/index.js`
- Redeploy application

---

## 📊 Database Schema

### Tables

- **rooms** - ข้อมูลห้องพัก (8 sample rooms)
- **customers** - ข้อมูลลูกค้า (3 sample customers)
- **bookings** - ข้อมูลการจอง (2 sample bookings)
- **ledger** - สมุดบัญชี (4 sample entries)

### Views

- **active_bookings** - การจองที่ active พร้อมข้อมูลลูกค้า
- **room_availability** - สถานะห้องว่าง
- **financial_summary** - สรุปการเงินรายเดือน

📚 **รายละเอียดเต็ม:** อ่าน `DATABASE-SETUP.md`

---

## 📈 Next Steps

### Production Checklist

- [ ] ตั้งค่า database backup
- [ ] เพิ่ม authentication/authorization
- [ ] ตั้งค่า monitoring และ logging
- [ ] เพิ่ม rate limiting
- [ ] ตั้งค่า custom domain
- [ ] เพิ่ม SSL certificate

### Feature Ideas

- [ ] Email notifications
- [ ] PDF receipt generation
- [ ] Multi-language support
- [ ] Mobile app
- [ ] Payment integration
- [ ] Reporting dashboard

---

## 📞 Support

- **GitHub:** <https://github.com/nssuwan186-dev/DB-HOTEL-UP>
- **Vercel:** <https://vercel.com/nssuwan186-7911s-projects/bd_hotel>
- **Supabase:** <https://supabase.com/dashboard>

---

## 📝 License

MIT License - ใช้งานได้อย่างอิสระ

---

**สร้างเมื่อ:** 29 ธันวาคม 2025  
**เวอร์ชัน:** 2.0.0  
**ฐานข้อมูล:** Supabase PostgreSQL  
**Backend:** Express.js + Node.js  
**Frontend:** React + Vite

🎉 **พร้อมใช้งานแล้ว!**
