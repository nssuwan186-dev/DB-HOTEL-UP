/**
 * Hotel Management System - Core Application Logic
 * Structured Database Edition with Real Data Persistence
 */

// ===== Database System Configuration =====
const DB_VERSION = '1.2';
const STORAGE_KEYS = {
    ROOMS: 'hotel_db_rooms',
    BOOKINGS: 'hotel_db_bookings',
    CUSTOMERS: 'hotel_db_customers',
    TRANSACTIONS: 'hotel_db_transactions',
    CONFIG: 'hotel_db_config'
};

// ===== Initial Master Data (Fallback) =====
const MASTER_ROOMS = [
    { id: 1, number: 'A101', building: 'A', floor: 1, type: 'standard', price: 400, status: 'available', capacity: 2 },
    { id: 2, number: 'A102', building: 'A', floor: 1, type: 'standard', price: 400, status: 'available', capacity: 2 },
    { id: 3, number: 'A103', building: 'A', floor: 1, type: 'standard', price: 400, status: 'available', capacity: 2 },
    { id: 4, number: 'A104', building: 'A', floor: 1, type: 'standard', price: 400, status: 'available', capacity: 2 },
    { id: 5, number: 'A105', building: 'A', floor: 1, type: 'standard', price: 400, status: 'available', capacity: 2 },
    { id: 6, number: 'A106', building: 'A', floor: 1, type: 'twin', price: 500, status: 'available', capacity: 2 },
    { id: 7, number: 'A107', building: 'A', floor: 1, type: 'twin', price: 500, status: 'available', capacity: 2 },
    { id: 8, number: 'A108', building: 'A', floor: 1, type: 'twin', price: 500, status: 'available', capacity: 2 },
    { id: 9, number: 'A109', building: 'A', floor: 1, type: 'twin', price: 500, status: 'available', capacity: 2 },
    { id: 10, number: 'A110', building: 'A', floor: 1, type: 'twin', price: 500, status: 'available', capacity: 2 },
    { id: 11, number: 'A111', building: 'A', floor: 1, type: 'standard', price: 400, status: 'available', capacity: 2 },
    { id: 12, number: 'A201', building: 'A', floor: 2, type: 'standard', price: 400, status: 'available', capacity: 2 },
    { id: 13, number: 'A202', building: 'A', floor: 2, type: 'standard', price: 400, status: 'available', capacity: 2 },
    { id: 14, number: 'A203', building: 'A', floor: 2, type: 'standard', price: 400, status: 'available', capacity: 2 },
    { id: 15, number: 'A204', building: 'A', floor: 2, type: 'standard', price: 3500, status: 'occupied', capacity: 2, note: 'รายเดือน' },
    { id: 16, number: 'A205', building: 'A', floor: 2, type: 'standard', price: 3500, status: 'occupied', capacity: 2, note: 'รายเดือน' },
    { id: 17, number: 'A206', building: 'A', floor: 2, type: 'standard', price: 3500, status: 'occupied', capacity: 2, note: 'รายเดือน' },
    { id: 18, number: 'A207', building: 'A', floor: 2, type: 'standard', price: 400, status: 'available', capacity: 2 },
    { id: 19, number: 'A208', building: 'A', floor: 2, type: 'standard', price: 3500, status: 'occupied', capacity: 2, note: 'รายเดือน' },
    { id: 20, number: 'A209', building: 'A', floor: 2, type: 'standard', price: 400, status: 'available', capacity: 2 },
    { id: 21, number: 'A210', building: 'A', floor: 2, type: 'standard', price: 400, status: 'available', capacity: 2 },
    { id: 22, number: 'A211', building: 'A', floor: 2, type: 'standard', price: 3500, status: 'occupied', capacity: 2, note: 'รายเดือน' },
    { id: 23, number: 'B101', building: 'B', floor: 1, type: 'standard', price: 400, status: 'available', capacity: 2 },
    { id: 24, number: 'B102', building: 'B', floor: 1, type: 'standard', price: 400, status: 'available', capacity: 2 },
    { id: 25, number: 'B103', building: 'B', floor: 1, type: 'standard', price: 400, status: 'available', capacity: 2 },
    { id: 26, number: 'B104', building: 'B', floor: 1, type: 'standard', price: 400, status: 'available', capacity: 2 },
    { id: 27, number: 'B105', building: 'B', floor: 1, type: 'standard', price: 400, status: 'available', capacity: 2 },
    { id: 28, number: 'B106', building: 'B', floor: 1, type: 'standard', price: 400, status: 'available', capacity: 2 },
    { id: 29, number: 'B107', building: 'B', floor: 1, type: 'standard', price: 400, status: 'available', capacity: 2 },
    { id: 30, number: 'B108', building: 'B', floor: 1, type: 'standard', price: 400, status: 'available', capacity: 2 },
    { id: 31, number: 'B109', building: 'B', floor: 1, type: 'standard', price: 400, status: 'available', capacity: 2 },
    { id: 32, number: 'B110', building: 'B', floor: 1, type: 'standard', price: 400, status: 'available', capacity: 2 },
    { id: 33, number: 'B111', building: 'B', floor: 1, type: 'twin', price: 500, status: 'available', capacity: 2 },
    { id: 34, number: 'B201', building: 'B', floor: 2, type: 'standard', price: 400, status: 'available', capacity: 2 },
    { id: 35, number: 'B202', building: 'B', floor: 2, type: 'standard', price: 400, status: 'available', capacity: 2 },
    { id: 36, number: 'B203', building: 'B', floor: 2, type: 'standard', price: 400, status: 'available', capacity: 2 },
    { id: 37, number: 'B204', building: 'B', floor: 2, type: 'standard', price: 400, status: 'available', capacity: 2 },
    { id: 38, number: 'B205', building: 'B', floor: 2, type: 'standard', price: 400, status: 'available', capacity: 2 },
    { id: 39, number: 'B206', building: 'B', floor: 2, type: 'standard', price: 400, status: 'available', capacity: 2 },
    { id: 40, number: 'B207', building: 'B', floor: 2, type: 'standard', price: 400, status: 'available', capacity: 2 },
    { id: 41, number: 'B208', building: 'B', floor: 2, type: 'standard', price: 400, status: 'available', capacity: 2 },
    { id: 42, number: 'B209', building: 'B', floor: 2, type: 'standard', price: 400, status: 'available', capacity: 2 },
    { id: 43, number: 'B210', building: 'B', floor: 2, type: 'standard', price: 400, status: 'available', capacity: 2 },
    { id: 44, number: 'B211', building: 'B', floor: 2, type: 'standard', price: 400, status: 'available', capacity: 2 },
    { id: 45, number: 'N1', building: 'N', floor: 1, type: 'twin', price: 600, status: 'available', capacity: 2 },
    { id: 46, number: 'N2', building: 'N', floor: 1, type: 'standard', price: 500, status: 'available', capacity: 2 },
    { id: 47, number: 'N3', building: 'N', floor: 1, type: 'standard', price: 500, status: 'available', capacity: 2 },
    { id: 48, number: 'N4', building: 'N', floor: 1, type: 'twin', price: 600, status: 'available', capacity: 2 },
    { id: 49, number: 'N5', building: 'N', floor: 1, type: 'twin', price: 600, status: 'available', capacity: 2 },
    { id: 50, number: 'N6', building: 'N', floor: 1, type: 'twin', price: 600, status: 'available', capacity: 2 },
    { id: 51, number: 'N7', building: 'N', floor: 1, type: 'standard', price: 500, status: 'available', capacity: 2 },
];

const MASTER_TRANSACTIONS_INIT = [
    { id: 1, date: '2025-12-01', name: 'ยกมา', phone: '-', room: '-', nights: 0, expense: 0, income: 0, balance: 4037, deposit: 0, note: 'ยกมา', paymentMethod: 'cash' },
    { id: 2, date: '2025-12-01', name: 'เบิกจ่ายค่าจ้างพนักงาน', phone: '-', room: '-', nights: 0, expense: 775, income: 0, balance: 3262, deposit: 0, note: '-', paymentMethod: 'cash' },
    { id: 3, date: '2025-12-01', name: 'เบิกค่าซื้ออุปกรณ์ล้อมต้นไม้', phone: '-', room: '-', nights: 0, expense: 400, income: 0, balance: 2862, deposit: 0, note: '-', paymentMethod: 'cash' },
    { id: 4, date: '2025-12-01', name: 'พรทิพย์', phone: '-', room: 'B106', nights: 1, expense: 0, income: 400, balance: 3262, deposit: 0, note: 'พักต่อ', paymentMethod: 'cash' },
    { id: 5, date: '2025-12-01', name: 'ชัยศักดิ์', phone: '089-39229374', room: 'N2', nights: 1, expense: 0, income: 500, balance: 3762, deposit: 200, note: '', paymentMethod: 'cash' },
    { id: 6, date: '2025-12-02', name: 'คุณน้ำส้ม', phone: '-', room: 'B107', nights: 1, expense: 0, income: 400, balance: 4162, deposit: 100, note: '', paymentMethod: 'cash' },
    { id: 7, date: '2025-12-02', name: 'สุจิตรา', phone: '-', room: 'A103', nights: 2, expense: 0, income: 800, balance: 4962, deposit: 100, note: 'โอนเข้าบัญชี', paymentMethod: 'transfer' },
    { id: 8, date: '2025-12-02', name: 'เบิกจ่าย ค่ามือถือคุณวิ', phone: '-', room: '-', nights: 0, expense: 1020, income: 0, balance: 3942, deposit: 0, note: '', paymentMethod: 'cash' },
    { id: 9, date: '2025-12-02', name: 'หักค่ามัดจำ', phone: '-', room: 'A105', nights: 0, expense: 100, income: 0, balance: 3842, deposit: 0, note: '', paymentMethod: 'cash' },
    { id: 10, date: '2025-12-03', name: 'เบิกจ่ายค่าไฟ รวมทั้งหมด', phone: '-', room: '-', nights: 0, expense: 3538, income: 0, balance: 304, deposit: 0, note: '', paymentMethod: 'cash' },
    { id: 11, date: '2025-12-03', name: 'พรทิพย์', phone: '-', room: 'B104', nights: 1, expense: 0, income: 400, balance: 704, deposit: 0, note: 'พักต่อ', paymentMethod: 'cash' },
    { id: 12, date: '2025-12-03', name: 'บุญเกิด', phone: '-', room: 'N7', nights: 1, expense: 0, income: 500, balance: 1204, deposit: 200, note: '', paymentMethod: 'cash' },
    { id: 13, date: '2025-12-04', name: 'เบิกจ่ายค่าซื้อของแม็คโคร', phone: '-', room: '-', nights: 0, expense: 2535, income: 0, balance: -1331, deposit: 0, note: '', paymentMethod: 'cash' },
    { id: 14, date: '2025-12-04', name: 'สมรัฐ', phone: '062-5468085', room: 'A104', nights: 1, expense: 0, income: 400, balance: -931, deposit: 100, note: '', paymentMethod: 'cash' },
    { id: 15, date: '2025-12-05', name: 'ชนกานต์สินธา', phone: '-', room: 'N7', nights: 1, expense: 0, income: 700, balance: -231, deposit: 0, note: 'โอนเข้าบัญชี', paymentMethod: 'transfer' },
    { id: 16, date: '2025-12-06', name: 'คุณใหญ่', phone: '065-224-9516', room: 'N3', nights: 2, expense: 0, income: 1200, balance: 969, deposit: 0, note: 'โอนเข้าบัญชี', paymentMethod: 'transfer' },
    { id: 17, date: '2025-12-07', name: 'เบิกซื้อของโกลบอลเฮ้าส์', phone: '-', room: '-', nights: 0, expense: 655, income: 0, balance: 314, deposit: 0, note: '', paymentMethod: 'cash' },
    { id: 18, date: '2025-12-08', name: 'เบิกจ่ายค่าทำบัญชี พ.ย.68', phone: '-', room: '-', nights: 0, expense: 4800, income: 0, balance: -4486, deposit: 0, note: '', paymentMethod: 'cash' },
    { id: 19, date: '2025-12-09', name: 'โอนให้คุณวิ', phone: '-', room: '-', nights: 0, expense: 2000, income: 0, balance: -6486, deposit: 0, note: '-', paymentMethod: 'cash' },
    { id: 20, date: '2025-12-10', name: 'Ascend', phone: 'ID-2169492', room: 'A106', nights: 2, expense: 0, income: 0, balance: -6486, deposit: 0, note: 'Ascend', paymentMethod: 'transfer' },
    { id: 21, date: '2025-12-11', name: 'ภาณุพงศ์', phone: '092-2839782', room: 'A105', nights: 1, expense: 0, income: 500, balance: -5986, deposit: 0, note: 'โอนบัญชี', paymentMethod: 'transfer' },
    { id: 22, date: '2025-12-12', name: 'บริษัทน้ำดื่มไฮโซ', phone: '-', room: 'A103', nights: 1, expense: 0, income: 400, balance: -5586, deposit: 100, note: '', paymentMethod: 'cash' },
    { id: 23, date: '2025-12-13', name: 'เบิกโอนให้คุณวิ', phone: '-', room: '-', nights: 0, expense: 3000, income: 0, balance: -8586, deposit: 0, note: '', paymentMethod: 'cash' },
    { id: 24, date: '2025-12-14', name: 'ขนิษฐากานต์', phone: '-', room: 'A104', nights: 1, expense: 0, income: 400, balance: -8186, deposit: 0, note: 'พักต่อ', paymentMethod: 'cash' },
    { id: 25, date: '2025-12-15', name: 'สมปอง', phone: '086-5731517', room: 'A111', nights: 1, expense: 0, income: 400, balance: -7786, deposit: 100, note: '', paymentMethod: 'cash' },
    { id: 26, date: '2025-12-16', name: 'นางอุดมลักษณ์ (ชำระค่ามัดจำ)', phone: '-', room: 'A207', nights: 0, expense: 0, income: 3500, balance: -4286, deposit: 0, note: 'ห้องเช่ารายเดือน', paymentMethod: 'cash' },
    { id: 27, date: '2025-12-17', name: 'ทีมงานกองปราบ รวม 11 ห้อง', phone: '-', room: '-', nights: 1, expense: 0, income: 5500, balance: 1214, deposit: 0, note: 'ชำระค่าห้อง', paymentMethod: 'transfer' },
    { id: 28, date: '2025-12-17', name: 'สมชาย', phone: '092-2812637', room: 'A102', nights: 1, expense: 0, income: 500, balance: 1714, deposit: 0, note: 'โอนเข้าบัญชี', paymentMethod: 'transfer' }
];

// Data state holders
let rooms = [];
let bookings = [];
let customers = MASTER_CUSTOMERS_LIST; // Using previously defined master customers
let transactions = [];

// ===== Database Engine =====
const DB = {
    init() {
        console.log('Initializing Database...');
        rooms = this.load(STORAGE_KEYS.ROOMS) || MASTER_ROOMS;
        bookings = this.load(STORAGE_KEYS.BOOKINGS) || [];
        customers = this.load(STORAGE_KEYS.CUSTOMERS) || [];
        transactions = this.load(STORAGE_KEYS.TRANSACTIONS) || MASTER_TRANSACTIONS_INIT;

        // Ensure data integrity
        this.saveAll();
    },

    load(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error(`Error loading ${key}:`, e);
            return null;
        }
    },

    save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error(`Error saving ${key}:`, e);
        }
    },

    saveAll() {
        this.save(STORAGE_KEYS.ROOMS, rooms);
        this.save(STORAGE_KEYS.BOOKINGS, bookings);
        this.save(STORAGE_KEYS.CUSTOMERS, customers);
        this.save(STORAGE_KEYS.TRANSACTIONS, transactions);
    },

    clearData() {
        if (confirm('ยืนยันรายการ: คุณต้องการล้างข้อมูลทั้งหมดในเครื่องนี้ใช่หรือไม่?')) {
            localStorage.clear();
            window.location.reload();
        }
    }
};

// ===== Utility Functions =====
function formatCurrency(amount) {
    if (amount === undefined || amount === null) return '0.00';
    return new Intl.NumberFormat('th-TH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

function formatDate(dateString) {
    if (!dateString) return '-';
    let date = new Date(dateString);
    if (isNaN(date.getTime())) {
        // Try parsing D/M/BE (Thai)
        const parts = dateString.split(/[\/\-]/);
        if (parts.length === 3) {
            let day = parseInt(parts[0]);
            let month = parseInt(parts[1]) - 1;
            let year = parseInt(parts[2]);
            if (year < 100) year += 2500;
            if (year > 2400) year -= 543;
            date = new Date(year, month, day);
        }
    }
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('th-TH', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

function getStatusBadge(status) {
    const statusMap = {
        'available': { text: 'ว่าง', class: 'badge-success' },
        'occupied': { text: 'ไม่ว่าง', class: 'badge-danger' },
        'cleaning': { text: 'กำลังทำความสะอาด', class: 'badge-warning' },
        'maintenance': { text: 'ซ่อมบำรุง', class: 'badge-danger' },
        'confirmed': { text: 'ยืนยันแล้ว', class: 'badge-success' },
        'pending': { text: 'รอการยืนยัน', class: 'badge-warning' },
        'cancelled': { text: 'ยกเลิก', class: 'badge-danger' },
        'active': { text: 'ปกติ', class: 'badge-success' },
        'vip': { text: 'VIP', class: 'badge-primary' }
    };
    const config = statusMap[status] || { text: status, class: 'badge-secondary' };
    return `<span class="badge ${config.class}">${config.text}</span>`;
}

function getRoomTypeLabel(type) {
    const types = { 'standard': 'Standard', 'twin': 'Standard Twin', 'deluxe': 'Deluxe' };
    return types[type] || type;
}

// ===== Smart Data Analyzer =====
const SmartAI = {
    categorize(name, note) {
        const text = (name + (note || '')).toLowerCase();
        const expenseKeywords = ['เบิก', 'จ่าย', 'ซื้อ', 'หัก', 'ซ่อม', 'น้ำมัน', 'ค่า'];
        const isExpense = expenseKeywords.some(kw => text.includes(kw));
        return isExpense ? 'expense' : 'income';
    },

    cleanNumber(val) {
        if (!val || val === '-') return 0;
        const cleaned = val.toString().replace(/[^0-9.-]/g, '');
        return parseFloat(cleaned) || 0;
    },

    parseDate(raw) {
        if (!raw) return new Date().toISOString().split('T')[0];
        const match = raw.match(/(\d{1,4})[\/\-](\d{1,2})[\/\-](\d{1,4})/);
        if (!match) return raw;
        let [_, d1, d2, d3] = match;
        let day, month, year;
        if (d1.length === 4) { [year, month, day] = [d1, d2, d3]; }
        else { [day, month, year] = [d1, d2, d3]; }
        year = parseInt(year);
        if (year < 100) year += 2500;
        if (year > 2400) year -= 543;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
};

// ===== Navigation Logic =====
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page-content');

function navigateTo(pageId) {
    pages.forEach(p => p.classList.remove('active'));
    navItems.forEach(n => n.classList.remove('active'));

    document.getElementById(pageId + 'Page').classList.add('active');
    document.querySelector(`[data-page="${pageId}"]`).classList.add('active');

    // Render page content
    switch (pageId) {
        case 'dashboard': renderDashboard(); break;
        case 'rooms': renderRooms(); break;
        case 'bookings': renderBookings(); break;
        case 'customers': renderCustomers(); break;
        case 'accounting': renderAccounting(); break;
    }
}

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(item.getAttribute('data-page'));
    });
});

// ===== Dashboard Module =====
function renderDashboard() {
    const activeBookings = bookings.filter(b => b.status === 'confirmed').length;
    const availableRooms = rooms.filter(r => r.status === 'available').length;
    const totalTransactions = transactions.length;

    document.getElementById('dashboardPage').innerHTML = `
        <div class="stats-grid">
            <div class="stat-card"><h3>ห้องว่างวันนี้</h3><p class="stat-value">${availableRooms}</p></div>
            <div class="stat-card"><h3>การจองที่ยืนยัน</h3><p class="stat-value">${activeBookings}</p></div>
            <div class="stat-card"><h3>ฐานลูกค้า</h3><p class="stat-value">${customers.length}</p></div>
            <div class="stat-card"><h3>รายการบัญชี</h3><p class="stat-value">${totalTransactions}</p></div>
        </div>
        <div class="recent-actions" style="margin-top: 2rem;">
            <h2>ระบบโรงแรมพร้อมใช้งานแล้ว</h2>
            <p>ยินดีต้อนรับสู่ระบบจัดการโรงแรมฉบับ AI-Driven ข้อมูลจริงถูกจัดระดับใหม่เรียบร้อยแล้วครับ</p>
        </div>
    `;
}

// ===== Rooms Module =====
function renderRooms() {
    const grid = document.getElementById('roomsGrid');
    grid.innerHTML = rooms.map(room => `
        <div class="room-card ${room.status}">
            <div class="room-header">
                <span class="room-number">${room.number}</span>
                ${getStatusBadge(room.status)}
            </div>
            <div class="room-info">
                <p><strong>ตึก ${room.building} ชั้น ${room.floor}</strong></p>
                <p>${getRoomTypeLabel(room.type)}</p>
                <p class="room-price">${formatCurrency(room.price)} / คืน</p>
                ${room.note ? `<p style="font-size: 0.8rem; opacity: 0.8;">* ${room.note}</p>` : ''}
            </div>
            <button class="btn btn-primary" onclick="editRoom(${room.id})" style="width: 100%; margin-top: 10px;">จัดการห้อง</button>
        </div>
    `).join('');
}

// ===== Accounting Module =====
function renderAccounting() {
    updateAccountingSummary();
    renderTransactions();
}

function updateAccountingSummary() {
    const income = transactions.reduce((sum, t) => sum + (t.income || 0), 0);
    const expense = transactions.reduce((sum, t) => sum + (t.expense || 0), 0);
    const deposit = transactions.reduce((sum, t) => sum + (t.deposit || 0), 0);
    const balance = transactions.length > 0 ? transactions[transactions.length - 1].balance : 0;

    document.getElementById('currentBalance').textContent = formatCurrency(balance);
    document.getElementById('totalIncome').textContent = formatCurrency(income);
    document.getElementById('totalExpense').textContent = formatCurrency(expense);
    document.getElementById('totalDeposit').textContent = formatCurrency(deposit);
}

function renderTransactions(filter = null) {
    const tableBody = document.getElementById('transactionsTableBody');
    let displayData = [...transactions];

    // Filtering logic...
    tableBody.innerHTML = displayData.map(t => `
        <tr>
            <td>${formatDate(t.date)}</td>
            <td>${t.name} ${t.aiNote ? `<small title="${t.aiNote}">🤖</small>` : ''}</td>
            <td>${t.room}</td>
            <td class="expense">${t.expense > 0 ? '-' + formatCurrency(t.expense) : '-'}</td>
            <td class="income">${t.income > 0 ? formatCurrency(t.income) : '-'}</td>
            <td class="balance">${formatCurrency(t.balance)}</td>
            <td class="deposit">${t.deposit > 0 ? formatCurrency(t.deposit) : '-'}</td>
            <td>${t.paymentMethod === 'transfer' ? 'โอน' : 'เงินสด'}</td>
        </tr>
    `).join('');
}

// ===== Import Logic =====
const csvFileInput = document.getElementById('csvFileInput');
if (csvFileInput) {
    csvFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const lines = event.target.result.split(/\r?\n/);
            const newTrans = [];

            for (let i = 1; i < lines.length; i++) {
                const parts = lines[i].split(',').map(s => s.trim().replace(/^"|"$/g, ''));
                if (parts.length < 2) continue;

                const date = SmartAI.parseDate(parts[0]);
                const income = SmartAI.cleanNumber(parts[6]);
                const expense = SmartAI.cleanNumber(parts[5]);

                newTrans.push({
                    id: Date.now() + i,
                    date: date,
                    name: parts[1] || 'ไม่มีชื่อ',
                    room: parts[3] || '-',
                    expense: expense,
                    income: income,
                    deposit: SmartAI.cleanNumber(parts[8]),
                    paymentMethod: parts[7]?.includes('โอน') ? 'transfer' : 'cash',
                    note: parts[9] || ''
                });
            }

            if (newTrans.length > 0) {
                transactions.push(...newTrans);
                recalculateDatabase();
                DB.saveAll();
                renderAccounting();
                alert(`นำเข้า ${newTrans.length} รายการสำเร็จ!`);
            }
        };
        reader.readAsText(file, 'UTF-8');
        e.target.value = '';
    });
}

function recalculateDatabase() {
    transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.id - b.id);
    let running = 0;
    transactions.forEach(t => {
        if (t.name === 'ยกมา') { running = t.balance; }
        else {
            running = running - (t.expense || 0) + (t.income || 0);
            t.balance = running;
        }
    });
}

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
    DB.init();
    navigateTo('dashboard');
});

// Exposed for UI
window.editRoom = (id) => alert('Room editing feature coming soon in the next update!');
