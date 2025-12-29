// DB-HOTEL-UP Backend API
// PostgreSQL + Supabase Database

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL Connection Pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Required for Supabase on Vercel
    },
    max: 1, // Limit connections for serverless
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});

// Helper to check connection
const checkConnection = async () => {
    try {
        const client = await pool.connect();
        client.release();
        console.log('✅ Database connected successfully');
        return true;
    } catch (err) {
        console.error('❌ Database connection error:', err.message);
        return false;
    }
};

// ==================== ROOMS API ====================

// Get all rooms
app.get('/api/rooms', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM rooms ORDER BY room_id');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({
            error: 'Failed to fetch rooms',
            details: error.message,
            hint: 'Check database connection and schema'
        });
    }
});

// Get room by ID
app.get('/api/rooms/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM rooms WHERE room_id = $1', [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Room not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching room:', error);
        res.status(500).json({ error: 'Failed to fetch room' });
    }
});

// Update room status
app.put('/api/rooms/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const result = await pool.query(
            'UPDATE rooms SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE room_id = $2 RETURNING *',
            [status, req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Room not found' });
        }

        res.json({ success: true, room: result.rows[0] });
    } catch (error) {
        console.error('Error updating room status:', error);
        res.status(500).json({ error: 'Failed to update room status' });
    }
});

// ==================== CUSTOMERS API ====================

// Get all customers
app.get('/api/customers', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM customers ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
});

// Get customer by ID
app.get('/api/customers/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM customers WHERE customer_id = $1', [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching customer:', error);
        res.status(500).json({ error: 'Failed to fetch customer' });
    }
});

// Add new customer
app.post('/api/customers', async (req, res) => {
    try {
        // Generate new customer ID
        const lastIdResult = await pool.query(
            "SELECT customer_id FROM customers ORDER BY customer_id DESC LIMIT 1"
        );

        let newId = 'CM0001';
        if (lastIdResult.rows.length > 0) {
            const lastNum = parseInt(lastIdResult.rows[0].customer_id.replace('CM', ''));
            newId = `CM${String(lastNum + 1).padStart(4, '0')}`;
        }

        const { name, phone, address, country, id_card, passport, email, customer_type, notes } = req.body;

        const result = await pool.query(
            `INSERT INTO customers (customer_id, name, phone, address, country, id_card, passport, email, customer_type, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
            [newId, name, phone, address, country || 'ไทย', id_card, passport, email, customer_type || 'Regular', notes]
        );

        res.json({ success: true, customer: result.rows[0] });
    } catch (error) {
        console.error('Error adding customer:', error);
        res.status(500).json({ error: 'Failed to add customer' });
    }
});

// ==================== BOOKINGS API ====================

// Get all bookings
app.get('/api/bookings', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM bookings ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// Get booking by ID
app.get('/api/bookings/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM bookings WHERE booking_id = $1', [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ error: 'Failed to fetch booking' });
    }
});

// Create new booking
app.post('/api/bookings', async (req, res) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Generate booking ID: BK + YYYYMMDD + sequence
        const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const countResult = await client.query(
            "SELECT COUNT(*) FROM bookings WHERE booking_id LIKE $1",
            [`BK${today}%`]
        );
        const sequence = String(parseInt(countResult.rows[0].count) + 1).padStart(4, '0');
        const newId = `BK${today}${sequence}`;

        const {
            room_id, customer_id, customer_name, customer_phone,
            check_in_date, check_out_date, nights, room_type,
            room_price, service_fee, total_amount, status, channel
        } = req.body;

        // Check if customer exists, if not create one (to satisfy FK)
        const custCheck = await client.query('SELECT customer_id FROM customers WHERE customer_id = $1', [customer_id]);
        if (custCheck.rows.length === 0) {
            await client.query(
                `INSERT INTO customers (customer_id, name, phone, customer_type) VALUES ($1, $2, $3, 'Walk-in')`,
                [customer_id, customer_name || 'Guest', customer_phone || '-']
            );
        }

        // Insert booking
        const bookingResult = await client.query(
            `INSERT INTO bookings (
        booking_id, room_id, customer_id, customer_name, customer_phone,
        check_in_date, check_out_date, nights, room_type,
        room_price, service_fee, total_amount, status, channel
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
            [newId, room_id, customer_id, customer_name, customer_phone,
                check_in_date, check_out_date, nights, room_type,
                room_price, service_fee || 0, total_amount, status || 'Confirmed', channel || 'Walk-in']
        );

        // Update room status
        await client.query(
            'UPDATE rooms SET status = $1 WHERE room_id = $2',
            ['Occupied', room_id]
        );

        await client.query('COMMIT');

        res.json({ success: true, booking: bookingResult.rows[0] });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Failed to create booking' });
    } finally {
        client.release();
    }
});

// Update booking status
app.put('/api/bookings/:id/status', async (req, res) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const { status } = req.body;

        const result = await client.query(
            'UPDATE bookings SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE booking_id = $2 RETURNING *',
            [status, req.params.id]
        );

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Booking not found' });
        }

        // If checked out, update room status
        if (status === 'Checked Out') {
            await client.query(
                'UPDATE rooms SET status = $1 WHERE room_id = $2',
                ['Available', result.rows[0].room_id]
            );
        }

        await client.query('COMMIT');

        res.json({ success: true, booking: result.rows[0] });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error updating booking status:', error);
        res.status(500).json({ error: 'Failed to update booking status' });
    } finally {
        client.release();
    }
});

// ==================== LEDGER API ====================

// Get all ledger entries
app.get('/api/ledger', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM ledger ORDER BY date DESC, created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching ledger:', error);
        res.status(500).json({ error: 'Failed to fetch ledger' });
    }
});

// Add ledger entry
app.post('/api/ledger', async (req, res) => {
    try {
        // Generate new ledger ID
        const lastIdResult = await pool.query(
            "SELECT id FROM ledger ORDER BY id DESC LIMIT 1"
        );

        let newId = 'LED0001';
        if (lastIdResult.rows.length > 0) {
            const lastNum = parseInt(lastIdResult.rows[0].id.replace('LED', ''));
            newId = `LED${String(lastNum + 1).padStart(4, '0')}`;
        }

        // Get last balance
        const balanceResult = await pool.query(
            "SELECT balance FROM ledger ORDER BY created_at DESC LIMIT 1"
        );
        const lastBalance = balanceResult.rows.length > 0 ? parseFloat(balanceResult.rows[0].balance) : 0;

        const { date, item, room_id, phone, nights, income, expense, deposit, note, booking_id } = req.body;
        const newBalance = lastBalance + (parseFloat(income) || 0) - (parseFloat(expense) || 0);

        const result = await pool.query(
            `INSERT INTO ledger (id, date, item, room_id, phone, nights, income, expense, balance, deposit, note, booking_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
            [newId, date, item, room_id, phone, nights || 0, income || 0, expense || 0, newBalance, deposit || 0, note, booking_id]
        );

        res.json({ success: true, entry: result.rows[0] });
    } catch (error) {
        console.error('Error adding ledger entry:', error);
        res.status(500).json({ error: 'Failed to add ledger entry' });
    }
});

// ==================== STATS API ====================

// Get dashboard statistics
app.get('/api/stats', async (req, res) => {
    try {
        const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM rooms) as total_rooms,
        (SELECT COUNT(*) FROM rooms WHERE status = 'Available') as available_rooms,
        (SELECT COUNT(*) FROM rooms WHERE status = 'Occupied') as occupied_rooms,
        (SELECT COUNT(*) FROM bookings) as total_bookings,
        (SELECT COUNT(*) FROM bookings WHERE status IN ('Confirmed', 'Checked In')) as active_bookings,
        (SELECT COALESCE(SUM(income), 0) FROM ledger) as total_revenue,
        (SELECT COALESCE(SUM(expense), 0) FROM ledger) as total_expenses,
        (SELECT COALESCE(balance, 0) FROM ledger ORDER BY created_at DESC LIMIT 1) as current_balance
    `);

        res.json(stats.rows[0]);
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({
            status: 'OK',
            message: 'DB-HOTEL-UP API is running',
            database: 'Connected',
            timestamp: result.rows[0].now
        });
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            message: 'Database connection failed',
            error: error.message
        });
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'DB-HOTEL-UP API with PostgreSQL',
        version: '2.0.0',
        database: 'Supabase PostgreSQL',
        endpoints: {
            rooms: '/api/rooms',
            customers: '/api/customers',
            bookings: '/api/bookings',
            ledger: '/api/ledger',
            stats: '/api/stats',
            health: '/api/health'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server (for local development)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 DB-HOTEL-UP API running on port ${PORT}`);
        console.log(`📊 Database: PostgreSQL (Supabase)`);
    });
}

// Export for Vercel serverless
module.exports = app;
