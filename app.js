/**
 * VIPAT HOTEL MANAGEMENT SYSTEM - ARCHITECTURE V3.0
 * Based on: Modular + Relational Database (3NF) Design Document
 */

// ===== 1.0 SYSTEM CONFIGURATION & STORAGE KEYS =====
const DB_VERSION = '3.0 Architecture Ready';
const STORAGE_KEYS = {
    GUESTS: 'vipat_guests',
    ROOMS: 'vipat_rooms',
    BOOKINGS: 'vipat_bookings',
    PAYMENTS: 'vipat_payments',
    EXPENSES: 'vipat_expenses',
    TENANTS: 'vipat_monthly_tenants',
    EMPLOYEES: 'vipat_employees',
    PAYROLL: 'vipat_payroll',
    FINANCIAL_SUMMARY: 'vipat_fin_summary',
    GAS_URL: 'vipat_cloud_api_url'
};

// ===== 2.0 DATA INITIALIZATION (Master Data from Design Doc) =====

const MASTER_ROOMS = [
    // ตึก A
    { room_id: 1, room_number: 'A101', room_type: 'Standard', price_per_night: 400, room_status: 'Available' },
    { room_id: 6, room_number: 'A106', room_type: 'Twin', price_per_night: 500, room_status: 'Available' },
    { room_id: 15, room_number: 'A204', room_type: 'Monthly', price_per_night: 3500, room_status: 'Occupied' },
    // ตึก N
    { room_id: 45, room_number: 'N1', room_type: 'Twin', price_per_night: 600, room_status: 'Available' },
    { room_id: 46, room_number: 'N2', room_type: 'Standard', price_per_night: 500, room_status: 'Available' }
];

const MASTER_GUESTS = [
    { guest_id: 'CM01734', first_name: 'ครูเกศกนก', last_name: 'หนูนาค', phone: '083-140-4771', guest_type: 'Individual', province: '-' },
    { guest_id: 'CM01735', first_name: 'รอง ผ.อ. แหม่ม', last_name: '', phone: '081-066-2923', guest_type: 'Individual', province: '-' },
    { guest_id: 'CM01737', first_name: 'คุณ ฐานิตา', last_name: '', phone: '087-801-8921', guest_type: 'Individual', province: '-' },
    { guest_id: 'CM01738', first_name: 'Dk', last_name: '', phone: '086-466-6146', guest_type: 'Corporate', province: '-' },
    { guest_id: 'CM01148', first_name: 'ทวีศักดิ์', last_name: '', phone: '082-8389-843', guest_type: 'Individual', province: '-' },
    { guest_id: 'CM01773', first_name: 'ห้าม้าโอสถ', last_name: '', phone: '086-826-6853', guest_type: 'Corporate', province: '-' }
];

const MASTER_BOOKINGS = [
    // ตัวอย่างรายการจองจากรายงาน (เพื่อใช้คำนวณสถิติ Analytics)
    { booking_id: 'VP01734', guest_id: 'CM01734', room_id: 1, check_in_date: '2025-11-16', check_out_date: '2025-11-18', nights: 2, total_amount: 800, booking_source: 'Line' },
    { booking_id: 'VP01740', guest_id: 'CM01735', room_id: 6, check_in_date: '2025-11-16', check_out_date: '2025-11-18', nights: 2, total_amount: 1000, booking_source: 'Line' },
    { booking_id: 'VP01758', guest_id: 'CM01737', room_id: 1, check_in_date: '2025-11-15', check_out_date: '2025-11-16', nights: 1, total_amount: 400, booking_source: 'โทรศัพท์' },
    { booking_id: 'VP01763', guest_id: 'CM01148', room_id: 11, check_in_date: '2025-11-12', check_out_date: '2025-11-13', nights: 1, total_amount: 400, booking_source: 'Walk-in' }
];

// ===== 3.0 DATABASE MANAGER (RELATIONAL SYNC) =====
const DB = {
    state: {},

    init() {
        console.log('--- Initializing VIPAT Relational Engine (3NF) ---');
        this.state.guests = this.load(STORAGE_KEYS.GUESTS) || MASTER_GUESTS;
        this.state.rooms = this.load(STORAGE_KEYS.ROOMS) || MASTER_ROOMS;
        this.state.bookings = this.load(STORAGE_KEYS.BOOKINGS) || MASTER_BOOKINGS;
        this.state.payments = this.load(STORAGE_KEYS.PAYMENTS) || [];
        this.state.expenses = this.load(STORAGE_KEYS.EXPENSES) || [];
        this.state.tenants = this.load(STORAGE_KEYS.TENANTS) || [];
        this.state.fin_summary = this.load(STORAGE_KEYS.FINANCIAL_SUMMARY) || [];

        this.saveAll();
    },

    load(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },

    saveAll() {
        Object.keys(STORAGE_KEYS).forEach(key => {
            const stateKey = key.toLowerCase();
            if (this.state[stateKey]) {
                localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(this.state[stateKey]));
            }
        });
    },

    clearData() {
        if (confirm('🚨 การล้างข้อมูลจะทำการล้างทุกตารางตามโครงสร้าง 3NF คุณแน่ใจหรือไม่?')) {
            localStorage.clear();
            window.location.reload();
        }
    }
};

// ===== 4.0 BUSINESS LOGIC MODULES =====

const FinanceEngine = {
    // 2.10 ตาราง Financial_Summary
    getMonthlySummary(monthYear) {
        const revenue = DB.state.payments
            .filter(p => p.payment_date.startsWith(monthYear))
            .reduce((sum, p) => sum + p.amount, 0);

        const expense = DB.state.expenses
            .filter(e => e.expense_date.startsWith(monthYear))
            .reduce((sum, e) => sum + e.amount, 0);

        return {
            period: monthYear,
            revenue: revenue,
            expense: expense,
            profit: revenue - expense
        };
    }
};

const UI = {
    renderDashboard() {
        const stats = FinanceEngine.getMonthlySummary('2025-12');
        document.getElementById('d-income').innerText = "฿" + stats.revenue.toLocaleString();
        document.getElementById('d-expense').innerText = "฿" + stats.expense.toLocaleString();

        // Rooms Stats
        const avail = DB.state.rooms.filter(r => r.room_status === 'Available').length;
        const occupied = DB.state.rooms.filter(r => r.room_status === 'Occupied').length;
        document.getElementById('d-avail').innerText = avail;
        document.getElementById('d-occupied').innerText = occupied;
    },

    renderRoomsGrid() {
        const grid = document.getElementById('roomsGrid');
        if (!grid) return;
        grid.innerHTML = DB.state.rooms.map(r => `
            <div class="room-card ${r.room_status.toLowerCase()}">
                <div class="number">${r.room_number}</div>
                <div class="type">${r.room_type}</div>
                <div class="mt-2 fw-bold">฿${r.price_per_night}</div>
                <div class="small mt-1 text-muted">สถานะ: ${r.room_status}</div>
            </div>
        `).join('');
    }
};

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    DB.init();
    UI.renderDashboard();
    initSidebar();
});

// Sidebar & Page Navigation Handler
function initSidebar() {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const pageId = item.dataset.page;
            // UI logic and page switching
            document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
            document.getElementById(pageId + 'Page')?.classList.add('active');

            if (pageId === 'rooms') UI.renderRoomsGrid();
            if (pageId === 'dashboard') UI.renderDashboard();
        });
    });
}
