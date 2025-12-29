# 🗄️ Database Setup Guide - Supabase PostgreSQL

## 📋 ข้อมูลการเชื่อมต่อ

**Database URL:**

```
postgresql://postgres:[YOUR-PASSWORD]@db.eeizuypqyhepkczqmqky.supabase.co:5432/postgres
```

**Host:** `db.eeizuypqyhepkczqmqky.supabase.co`  
**Port:** `5432`  
**Database:** `postgres`  
**User:** `postgres`

---

## 🚀 Quick Setup (3 Steps)

### Step 1: เข้าสู่ Supabase Dashboard

1. ไปที่ [Supabase Dashboard](https://supabase.com/dashboard)
2. เลือกโปรเจคของคุณ
3. ไปที่ **SQL Editor** (เมนูซ้าย)

### Step 2: รัน Database Schema

1. คลิก **"New Query"**
2. Copy เนื้อหาจากไฟล์ `database/schema.sql`
3. Paste ลงใน SQL Editor
4. คลิก **"Run"** (หรือกด Ctrl+Enter)

ระบบจะสร้าง:

- ✅ 4 Tables: `rooms`, `customers`, `bookings`, `ledger`
- ✅ Indexes สำหรับ performance
- ✅ Triggers สำหรับ auto-update timestamps
- ✅ Views สำหรับ query ที่ซับซ้อน
- ✅ Sample data สำหรับทดสอบ

### Step 3: ตั้งค่า Environment Variables

**สำหรับ Local Development:**

1. สร้างไฟล์ `.env.local` ในโปรเจค
2. เพิ่ม:

   ```env
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.eeizuypqyhepkczqmqky.supabase.co:5432/postgres
   PORT=5000
   ```

3. แทนที่ `YOUR_PASSWORD` ด้วยรหัสผ่านจริง

**สำหรับ Vercel Deployment:**

1. ไปที่ Vercel Dashboard
2. Settings → Environment Variables
3. เพิ่ม:
   - **Name:** `DATABASE_URL`
   - **Value:** `postgresql://postgres:YOUR_PASSWORD@db.eeizuypqyhepkczqmqky.supabase.co:5432/postgres`
   - **Environments:** Production, Preview, Development

---

## 🔑 หารหัสผ่าน Database

### วิธีที่ 1: ดูจาก Supabase Dashboard

1. ไปที่ Supabase Dashboard
2. เลือกโปรเจคของคุณ
3. ไปที่ **Settings** → **Database**
4. ดูที่ **Connection string**
5. คลิก **"Reset database password"** ถ้าลืม

### วิธีที่ 2: ใช้รหัสผ่านที่ตั้งไว้ตอนสร้างโปรเจค

- ถ้าคุณจำรหัสผ่านที่ตั้งไว้ตอนสร้างโปรเจค Supabase ใช้รหัสนั้นได้เลย

---

## 📊 Database Schema

### Table: rooms (ห้องพัก)

```sql
room_id      VARCHAR(10)   PRIMARY KEY
building     VARCHAR(10)   NOT NULL
floor        VARCHAR(10)   NOT NULL
room_type    VARCHAR(50)   NOT NULL
price        DECIMAL(10,2) NOT NULL
status       VARCHAR(20)   DEFAULT 'Available'
created_at   TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
updated_at   TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
```

### Table: customers (ลูกค้า)

```sql
customer_id    VARCHAR(20)   PRIMARY KEY
name           VARCHAR(255)  NOT NULL
phone          VARCHAR(20)
address        TEXT
country        VARCHAR(100)  DEFAULT 'ไทย'
id_card        VARCHAR(20)
passport       VARCHAR(20)
email          VARCHAR(255)
customer_type  VARCHAR(20)   DEFAULT 'Regular'
notes          TEXT
created_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
updated_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
```

### Table: bookings (การจอง)

```sql
booking_id      VARCHAR(30)   PRIMARY KEY
room_id         VARCHAR(10)   REFERENCES rooms(room_id)
customer_id     VARCHAR(20)   REFERENCES customers(customer_id)
customer_name   VARCHAR(255)
customer_phone  VARCHAR(20)
check_in_date   DATE          NOT NULL
check_out_date  DATE          NOT NULL
nights          INTEGER       NOT NULL
room_type       VARCHAR(50)
room_price      DECIMAL(10,2)
service_fee     DECIMAL(10,2) DEFAULT 0
total_amount    DECIMAL(10,2) NOT NULL
status          VARCHAR(20)   DEFAULT 'Confirmed'
channel         VARCHAR(50)   DEFAULT 'Walk-in'
created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
updated_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
```

### Table: ledger (สมุดบัญชี)

```sql
id          VARCHAR(20)   PRIMARY KEY
date        DATE          NOT NULL
item        VARCHAR(255)  NOT NULL
room_id     VARCHAR(10)
phone       VARCHAR(20)
nights      INTEGER       DEFAULT 0
income      DECIMAL(10,2) DEFAULT 0
expense     DECIMAL(10,2) DEFAULT 0
balance     DECIMAL(10,2) DEFAULT 0
deposit     DECIMAL(10,2) DEFAULT 0
note        TEXT
booking_id  VARCHAR(30)
created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
```

---

## 🧪 ทดสอบการเชื่อมต่อ

### ใช้ psql (Command Line)

```bash
psql postgresql://postgres:YOUR_PASSWORD@db.eeizuypqyhepkczqmqky.supabase.co:5432/postgres
```

### ใช้ Node.js

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:YOUR_PASSWORD@db.eeizuypqyhepkczqmqky.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

pool.query('SELECT NOW()', (err, res) => {
  console.log(err ? err : res.rows[0]);
  pool.end();
});
```

### ใช้ API Health Check

```bash
# รัน server ก่อน
npm run server

# ทดสอบ
curl http://localhost:5000/api/health
```

---

## 📝 Sample Queries

### ดูห้องทั้งหมด

```sql
SELECT * FROM rooms ORDER BY room_id;
```

### ดูห้องว่าง

```sql
SELECT * FROM rooms WHERE status = 'Available';
```

### ดูการจองที่ active

```sql
SELECT * FROM bookings 
WHERE status IN ('Confirmed', 'Checked In')
ORDER BY check_in_date;
```

### ดูยอดรวมรายรับ-รายจ่าย

```sql
SELECT 
  SUM(income) as total_income,
  SUM(expense) as total_expense,
  SUM(income) - SUM(expense) as net_profit
FROM ledger;
```

### ดูการจองพร้อมข้อมูลลูกค้า

```sql
SELECT 
  b.*,
  c.name as customer_name,
  c.email,
  r.room_type,
  r.price
FROM bookings b
LEFT JOIN customers c ON b.customer_id = c.customer_id
LEFT JOIN rooms r ON b.room_id = r.room_id
ORDER BY b.created_at DESC;
```

---

## 🔒 Security Best Practices

### 1. ใช้ Environment Variables

- ❌ ห้าม hardcode รหัสผ่านในโค้ด
- ✅ ใช้ `.env.local` สำหรับ local
- ✅ ใช้ Vercel Environment Variables สำหรับ production

### 2. Enable Row Level Security (RLS)

```sql
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger ENABLE ROW LEVEL SECURITY;
```

### 3. Create Policies

```sql
-- Example: Allow all operations (adjust based on your needs)
CREATE POLICY "Allow all operations on rooms" 
ON rooms FOR ALL USING (true);
```

### 4. Use Connection Pooling

- ✅ ใช้ `pg.Pool` แทน `pg.Client`
- ✅ จำกัดจำนวน connections

---

## 🆘 Troubleshooting

### Error: "password authentication failed"

**Solution:** ตรวจสอบรหัสผ่านใน `DATABASE_URL`

### Error: "no pg_hba.conf entry"

**Solution:** เพิ่ม `ssl: { rejectUnauthorized: false }` ใน Pool config

### Error: "too many connections"

**Solution:** ใช้ connection pooling และจำกัดจำนวน connections

### Error: "relation does not exist"

**Solution:** รัน `schema.sql` ใน Supabase SQL Editor

---

## 📞 Useful Links

- **Supabase Dashboard:** <https://supabase.com/dashboard>
- **Supabase Docs:** <https://supabase.com/docs>
- **PostgreSQL Docs:** <https://www.postgresql.org/docs/>
- **pg (Node.js) Docs:** <https://node-postgres.com/>

---

**Setup Date:** December 29, 2025  
**Database:** Supabase PostgreSQL  
**Version:** 2.0.0

**Ready to use! 🚀**
