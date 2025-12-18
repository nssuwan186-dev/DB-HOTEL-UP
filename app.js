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
    {
        guest_id: 'G01155',
        first_name: 'ชัชพล',
        last_name: 'หลวงชา',
        phone: '091-8673787',
        email: '-',
        guest_type: 'Individual',
        tax_id: '-',
        province: 'บึงกาฬ'
    },
    {
        guest_id: 'G01188',
        first_name: 'บริษัท ชัวร์ ฟิลเตอร์ (ประเทศไทย) จำกัด',
        last_name: '',
        phone: '086-4666146',
        guest_type: 'Corporate',
        tax_id: '745546000078',
        province: 'สมุทรสาคร'
    }
];

// ===== 3.0 DATABASE MANAGER (RELATIONAL SYNC) =====
const DB = {
    state: {},

    init() {
        console.log('--- Initializing VIPAT Relational Engine (3NF) ---');
        this.state.guests = this.load(STORAGE_KEYS.GUESTS) || MASTER_GUESTS;
        this.state.rooms = this.load(STORAGE_KEYS.ROOMS) || MASTER_ROOMS;
        this.state.bookings = this.load(STORAGE_KEYS.BOOKINGS) || [];
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
