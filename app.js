// ===== Real Transaction Data =====
let transactions = [
    { id: 1, date: '2024-12-01', name: 'ยกมา', phone: '-', room: '-', nights: 0, expense: 0, income: 0, balance: 4037, deposit: 0, note: 'ยกมา', paymentMethod: 'cash' },
    { id: 2, date: '2024-12-01', name: 'เบิกจ่ายค่าจ้างพนักงาน', phone: '-', room: '-', nights: 0, expense: 775, income: 0, balance: 3262, deposit: 0, note: '-', paymentMethod: 'cash' },
    { id: 3, date: '2024-12-01', name: 'เบิกค่าซื้ออุปกรณ์ล้อมต้นไม้', phone: '-', room: '-', nights: 0, expense: 400, income: 0, balance: 2862, deposit: 0, note: '-', paymentMethod: 'cash' },
    { id: 4, date: '2024-12-01', name: 'เบิกค่าซื้อข้าวเลี้ยงคนงานล้อมต้นไม้', phone: '-', room: '-', nights: 0, expense: 150, income: 0, balance: 2712, deposit: 0, note: '-', paymentMethod: 'cash' },
    { id: 5, date: '2024-12-01', name: 'พรทิพย์', phone: '-', room: 'B106', nights: 1, expense: 0, income: 400, balance: 3112, deposit: 0, note: 'พักต่อ', paymentMethod: 'cash' },
    { id: 6, date: '2024-12-01', name: 'ชัยศักดิ์', phone: '089-39229374', room: 'N2', nights: 1, expense: 0, income: 500, balance: 3612, deposit: 200, note: '', paymentMethod: 'cash' },
    { id: 7, date: '2024-12-01', name: 'พรทิพย์', phone: '-', room: 'B103', nights: 1, expense: 0, income: 400, balance: 4012, deposit: 100, note: '', paymentMethod: 'cash' },
    { id: 8, date: '2024-12-01', name: 'พรทิพย์', phone: '-', room: 'B105', nights: 1, expense: 0, income: 400, balance: 4412, deposit: 0, note: 'พักต่อ', paymentMethod: 'cash' },
    { id: 9, date: '2024-12-01', name: 'อาทิตย์', phone: '098-6197361', room: 'B107', nights: 1, expense: 0, income: 400, balance: 4812, deposit: 100, note: '', paymentMethod: 'cash' },
    { id: 10, date: '2024-12-01', name: 'จิรัชยา', phone: '061-526615218', room: 'N7', nights: 1, expense: 0, income: 500, balance: 5312, deposit: 200, note: '', paymentMethod: 'cash' },

    { id: 11, date: '2024-12-02', name: 'คุณน้ำส้ม', phone: '-', room: 'B107', nights: 1, expense: 0, income: 400, balance: 5712, deposit: 100, note: '', paymentMethod: 'cash' },
    { id: 12, date: '2024-12-02', name: 'สุจิตรา', phone: '-', room: 'A103', nights: 2, expense: 0, income: 800, balance: 0, deposit: 100, note: '', paymentMethod: 'transfer' },
    { id: 13, date: '2024-12-02', name: 'เบิกจ่าย ค่ามือถือคุณวิ', phone: '-', room: '-', nights: 0, expense: 1020, income: 0, balance: 4892, deposit: 0, note: '-', paymentMethod: 'cash' },
    { id: 14, date: '2024-12-02', name: 'เบิกจ่าย ค่าขยะประจำเดือน พ.ย. 68', phone: '-', room: '-', nights: 0, expense: 500, income: 0, balance: 4392, deposit: 0, note: '-', paymentMethod: 'cash' },
    { id: 15, date: '2024-12-02', name: 'พรทิพย์', phone: '-', room: 'B106', nights: 1, expense: 0, income: 400, balance: 4792, deposit: 0, note: 'พักต่อ', paymentMethod: 'cash' },
    { id: 16, date: '2024-12-02', name: 'พรทิพย์', phone: '-', room: 'B104', nights: 1, expense: 0, income: 400, balance: 5192, deposit: 0, note: 'พักต่อ', paymentMethod: 'cash' },
    { id: 17, date: '2024-12-02', name: 'จิรพัส', phone: '093-5657693', room: 'A105', nights: 1, expense: 0, income: 500, balance: 0, deposit: 0, note: '', paymentMethod: 'transfer' },
    { id: 18, date: '2024-12-02', name: 'หักค่ามัดจำ', phone: '-', room: 'A105', nights: 0, expense: 100, income: 0, balance: 5092, deposit: 0, note: '', paymentMethod: 'cash' },
    { id: 19, date: '2024-12-02', name: 'พรทิพย์', phone: '-', room: 'B105', nights: 1, expense: 0, income: 400, balance: 5492, deposit: 0, note: 'พักต่อ', paymentMethod: 'cash' },
    { id: 20, date: '2024-12-02', name: 'วราภรณ์', phone: '062-1017813', room: 'N6', nights: 1, expense: 0, income: 600, balance: 6092, deposit: 200, note: '', paymentMethod: 'cash' },
];

let rooms = [
    { id: 1, number: '101', type: 'standard', price: 1500, status: 'available', capacity: 2 },
    { id: 2, number: '102', type: 'standard', price: 1500, status: 'occupied', capacity: 2 },
    { id: 3, number: '103', type: 'standard', price: 1500, status: 'available', capacity: 2 },
    { id: 4, number: 'A103', type: 'deluxe', price: 2500, status: 'available', capacity: 3 },
    { id: 5, number: 'A104', type: 'deluxe', price: 2500, status: 'available', capacity: 3 },
    { id: 6, number: 'A105', type: 'deluxe', price: 2500, status: 'available', capacity: 3 },
    { id: 7, number: 'B101', type: 'standard', price: 1500, status: 'available', capacity: 2 },
    { id: 8, number: 'B103', type: 'standard', price: 1500, status: 'occupied', capacity: 2 },
    { id: 9, number: 'B104', type: 'standard', price: 1500, status: 'occupied', capacity: 2 },
    { id: 10, number: 'B105', type: 'standard', price: 1500, status: 'occupied', capacity: 2 },
    { id: 11, number: 'B106', type: 'standard', price: 1500, status: 'occupied', capacity: 2 },
    { id: 12, number: 'B107', type: 'standard', price: 1500, status: 'available', capacity: 2 },
    { id: 13, number: 'N2', type: 'deluxe', price: 2000, status: 'occupied', capacity: 3 },
    { id: 14, number: 'N6', type: 'deluxe', price: 2000, status: 'occupied', capacity: 3 },
    { id: 15, number: 'N7', type: 'deluxe', price: 2000, status: 'available', capacity: 3 },
];

let bookings = [
    { id: 1, bookingNumber: 'BK-2024-001', customerName: 'พรทิพย์', roomId: 11, checkIn: '2024-12-01', checkOut: '2024-12-03', nights: 2, total: 3000, status: 'confirmed' },
    { id: 2, bookingNumber: 'BK-2024-002', customerName: 'ชัยศักดิ์', roomId: 13, checkIn: '2024-12-01', checkOut: '2024-12-02', nights: 1, total: 2000, status: 'confirmed' },
    { id: 3, bookingNumber: 'BK-2024-003', customerName: 'อาทิตย์', roomId: 12, checkIn: '2024-12-01', checkOut: '2024-12-02', nights: 1, total: 1500, status: 'confirmed' },
    { id: 4, bookingNumber: 'BK-2024-004', customerName: 'สุจิตรา', roomId: 4, checkIn: '2024-12-02', checkOut: '2024-12-04', nights: 2, total: 5000, status: 'confirmed' },
];

let customers = [
    { id: 1, customerId: 'CUS-001', name: 'พรทิพย์', email: 'pornthip@example.com', phone: '-', visits: 10, totalSpent: 15000, status: 'active' },
    { id: 2, customerId: 'CUS-002', name: 'ชัยศักดิ์', email: 'chaisak@example.com', phone: '089-39229374', visits: 5, totalSpent: 10000, status: 'active' },
    { id: 3, customerId: 'CUS-003', name: 'อาทิตย์', email: 'arthit@example.com', phone: '098-6197361', visits: 3, totalSpent: 4500, status: 'active' },
    { id: 4, customerId: 'CUS-004', name: 'สุจิตรา', email: 'sujitra@example.com', phone: '-', visits: 2, totalSpent: 5000, status: 'active' },
];

// ===== Utility Functions =====
function formatCurrency(amount) {
    if (!amount && amount !== 0) return '-';
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(amount);
}

function formatDate(dateString) {
    if (!dateString) return '-';
    let date = new Date(dateString);
    if (isNaN(date.getTime())) {
        // Support for D-M-68 (Thai BE)
        const parts = dateString.split(/[\/\-]/);
        if (parts.length === 3) {
            let day = parseInt(parts[0]);
            let month = parseInt(parts[1]) - 1;
            let year = parseInt(parts[2]);

            // Handle Thai BE years (e.g., 67, 68)
            if (year < 100) year += 2500;
            if (year > 2400) year -= 543; // Convert BE to AD

            date = new Date(year, month, day);
        }
    }
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('th-TH', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

function formatDateLong(dateString) {
    if (!dateString) return '-';
    let date = new Date(dateString);
    if (isNaN(date.getTime())) {
        const parts = dateString.split(/[\/\-]/);
        if (parts.length === 3) {
            if (parts[0].length === 4) date = new Date(parts[0], parts[1] - 1, parts[2]);
            else date = new Date(parts[2], parts[1] - 1, parts[0]);
        }
    }
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
}

function getRoomById(id) {
    return rooms.find(room => room.id === id);
}

function getRoomTypeLabel(type) {
    const types = {
        'standard': 'Standard',
        'deluxe': 'Deluxe',
        'suite': 'Suite',
        'executive': 'Executive'
    };
    return types[type] || type;
}

function getStatusBadge(status, type = 'room') {
    const statusConfig = {
        room: {
            'available': { class: 'badge-success', label: 'ว่าง' },
            'occupied': { class: 'badge-danger', label: 'ไม่ว่าง' },
            'maintenance': { class: 'badge-warning', label: 'ซ่อมบำรุง' }
        },
        booking: {
            'confirmed': { class: 'badge-success', label: 'ยืนยันแล้ว' },
            'pending': { class: 'badge-warning', label: 'รอยืนยัน' },
            'cancelled': { class: 'badge-danger', label: 'ยกเลิก' },
            'completed': { class: 'badge-info', label: 'เสร็จสิ้น' }
        },
        customer: {
            'active': { class: 'badge-success', label: 'ใช้งาน' },
            'inactive': { class: 'badge-secondary', label: 'ไม่ใช้งาน' },
            'vip': { class: 'badge-primary', label: 'VIP' }
        }
    };

    const config = statusConfig[type][status] || { class: 'badge-secondary', label: status };
    return `<span class="badge ${config.class}">${config.label}</span>`;
}

// ===== Navigation =====
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page-content');
const pageTitle = document.getElementById('pageTitle');
const pageSubtitle = document.getElementById('pageSubtitle');

const pageInfo = {
    dashboard: { title: 'แดชบอร์ด', subtitle: 'ภาพรวมการดำเนินงานของโรงแรม' },
    rooms: { title: 'จัดการห้องพัก', subtitle: 'ดูและจัดการข้อมูลห้องพักทั้งหมด' },
    bookings: { title: 'การจอง', subtitle: 'จัดการการจองห้องพัก' },
    customers: { title: 'ลูกค้า', subtitle: 'ข้อมูลลูกค้าและประวัติการเข้าพัก' },
    reports: { title: 'รายงาน', subtitle: 'สถิติและรายงานการดำเนินงาน' },
    accounting: { title: 'บัญชี', subtitle: 'รายรับ-รายจ่ายและการเงิน' }
};

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPage = item.dataset.page;

        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        pages.forEach(page => page.classList.remove('active'));
        document.getElementById(`${targetPage}Page`).classList.add('active');

        if (pageInfo[targetPage]) {
            pageTitle.textContent = pageInfo[targetPage].title;
            pageSubtitle.textContent = pageInfo[targetPage].subtitle;
        }

        if (targetPage === 'dashboard') renderDashboard();
        else if (targetPage === 'rooms') renderRooms();
        else if (targetPage === 'bookings') renderBookings();
        else if (targetPage === 'customers') renderCustomers();
        else if (targetPage === 'reports') renderReports();
        else if (targetPage === 'accounting') renderAccounting();
    });
});

// ===== Dashboard Functions =====
function renderDashboard() {
    renderRecentBookings();
    renderCharts();
}

function renderRecentBookings() {
    const tableBody = document.getElementById('recentBookingsTable');
    const recentBookings = bookings.slice(0, 5);

    tableBody.innerHTML = recentBookings.map(booking => {
        const room = getRoomById(booking.roomId);
        return `
            <tr>
                <td>${booking.bookingNumber}</td>
                <td>${booking.customerName}</td>
                <td>${room ? room.number : '-'}</td>
                <td>${formatDateLong(booking.checkIn)}</td>
                <td>${formatDateLong(booking.checkOut)}</td>
                <td>${formatCurrency(booking.total)}</td>
                <td>${getStatusBadge(booking.status, 'booking')}</td>
                <td>
                    <button class="action-btn view" title="ดูรายละเอียด">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke-width="2"/>
                            <circle cx="12" cy="12" r="3" stroke-width="2"/>
                        </svg>
                    </button>
                    <button class="action-btn edit" title="แก้ไข">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke-width="2"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke-width="2"/>
                        </svg>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function renderCharts() {
    const occupancyCtx = document.getElementById('occupancyChart');
    if (occupancyCtx && !occupancyCtx.chartInstance) {
        createMockChart(occupancyCtx, 'line');
    }

    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx && !revenueCtx.chartInstance) {
        createMockChart(revenueCtx, 'bar');
    }
}

function createMockChart(canvas, type) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0.05)');

    ctx.clearRect(0, 0, width, height);

    if (type === 'line') {
        const points = [];
        const numPoints = 7;
        for (let i = 0; i < numPoints; i++) {
            points.push({
                x: (width / (numPoints - 1)) * i,
                y: height - 50 - Math.random() * (height - 100)
            });
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(points[0].x, height);
        points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.lineTo(points[points.length - 1].x, height);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#6366F1';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.stroke();

        points.forEach(p => {
            ctx.fillStyle = '#6366F1';
            ctx.beginPath();
            ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
        });
    } else if (type === 'bar') {
        const numBars = 7;
        const barWidth = (width / numBars) * 0.6;
        const spacing = (width / numBars) * 0.4;

        for (let i = 0; i < numBars; i++) {
            const barHeight = Math.random() * (height - 100) + 50;
            const x = i * (width / numBars) + spacing / 2;
            const y = height - barHeight;

            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth, barHeight);

            ctx.strokeStyle = '#6366F1';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, barWidth, barHeight);
        }
    }

    canvas.chartInstance = true;
}

// ===== Rooms Page =====
function renderRooms() {
    const roomsGrid = document.getElementById('roomsGrid');

    roomsGrid.innerHTML = rooms.map(room => `
        <div class="room-card">
            <div class="room-image" style="background: linear-gradient(135deg, hsl(${Math.random() * 360}, 70%, 50%) 0%, hsl(${Math.random() * 360}, 70%, 40%) 100%);">
                <svg viewBox="0 0 200 100" style="width: 100%; height: 100%; opacity: 0.3;">
                    <rect x="20" y="40" width="60" height="40" fill="white" opacity="0.5"/>
                    <rect x="30" y="30" width="40" height="20" fill="white" opacity="0.3"/>
                    <circle cx="60" cy="65" r="3" fill="white"/>
                </svg>
            </div>
            <div class="room-content">
                <div class="room-header">
                    <div>
                        <div class="room-number">ห้อง ${room.number}</div>
                        <div class="room-type">${getRoomTypeLabel(room.type)}</div>
                    </div>
                    ${getStatusBadge(room.status, 'room')}
                </div>
                <div class="room-details">
                    <div class="room-detail-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke-width="2"/>
                            <circle cx="9" cy="7" r="4" stroke-width="2"/>
                        </svg>
                        <span>จำนวนผู้พัก: ${room.capacity} คน</span>
                    </div>
                </div>
                <div class="room-price">${formatCurrency(room.price)}<span style="font-size: 0.875rem; color: var(--color-text-secondary); font-weight: 400;">/คืน</span></div>
                <div class="room-actions">
                    <button class="btn btn-primary" style="flex: 1;" onclick="editRoom(${room.id})">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke-width="2"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke-width="2"/>
                        </svg>
                        แก้ไข
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteRoom(${room.id})">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="3 6 5 6 21 6" stroke-width="2"/>
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke-width="2"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== Bookings Page =====
function renderBookings() {
    const tableBody = document.getElementById('bookingsTable');

    tableBody.innerHTML = bookings.map(booking => {
        const room = getRoomById(booking.roomId);
        return `
            <tr>
                <td>${booking.bookingNumber}</td>
                <td>${booking.customerName}</td>
                <td>${room ? room.number : '-'}</td>
                <td>${formatDateLong(booking.checkIn)}</td>
                <td>${formatDateLong(booking.checkOut)}</td>
                <td>${booking.nights} คืน</td>
                <td>${formatCurrency(booking.total)}</td>
                <td>${getStatusBadge(booking.status, 'booking')}</td>
                <td>
                    <button class="action-btn view" title="ดูรายละเอียด">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke-width="2"/>
                            <circle cx="12" cy="12" r="3" stroke-width="2"/>
                        </svg>
                    </button>
                    <button class="action-btn edit" title="แก้ไข" onclick="editBooking(${booking.id})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke-width="2"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke-width="2"/>
                        </svg>
                    </button>
                    <button class="action-btn delete" title="ลบ" onclick="deleteBooking(${booking.id})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="3 6 5 6 21 6" stroke-width="2"/>
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke-width="2"/>
                        </svg>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// ===== Customers Page =====
function renderCustomers() {
    const tableBody = document.getElementById('customersTable');

    tableBody.innerHTML = customers.map(customer => `
        <tr>
            <td>${customer.customerId}</td>
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${customer.visits} ครั้ง</td>
            <td>${formatCurrency(customer.totalSpent)}</td>
            <td>${getStatusBadge(customer.status, 'customer')}</td>
            <td>
                <button class="action-btn view" title="ดูรายละเอียด">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke-width="2"/>
                        <circle cx="12" cy="12" r="3" stroke-width="2"/>
                    </svg>
                </button>
                <button class="action-btn edit" title="แก้ไข">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke-width="2"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke-width="2"/>
                    </svg>
                </button>
                <button class="action-btn delete" title="ลบ">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="3 6 5 6 21 6" stroke-width="2"/>
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke-width="2"/>
                    </svg>
                </button>
            </td>
        </tr>
    `).join('');
}

// ===== Reports Page =====
function renderReports() {
    const roomTypeCtx = document.getElementById('roomTypeRevenueChart');
    if (roomTypeCtx && !roomTypeCtx.chartInstance) {
        createMockChart(roomTypeCtx, 'bar');
    }

    const bookingSourceCtx = document.getElementById('bookingSourceChart');
    if (bookingSourceCtx && !bookingSourceCtx.chartInstance) {
        createPieChart(bookingSourceCtx);
    }
}

function createPieChart(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;

    const data = [
        { value: 40, color: '#6366F1', label: 'เว็บไซต์' },
        { value: 30, color: '#8B5CF6', label: 'โทรศัพท์' },
        { value: 20, color: '#EC4899', label: 'Walk-in' },
        { value: 10, color: '#F59E0B', label: 'อื่นๆ' }
    ];

    let currentAngle = -Math.PI / 2;

    data.forEach(item => {
        const sliceAngle = (item.value / 100) * Math.PI * 2;

        ctx.fillStyle = item.color;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#1a1f37';
        ctx.lineWidth = 2;
        ctx.stroke();

        currentAngle += sliceAngle;
    });

    ctx.fillStyle = '#1a1f37';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius / 2, 0, Math.PI * 2);
    ctx.fill();

    canvas.chartInstance = true;
}

// ===== Accounting Page =====
function renderAccounting() {
    updateAccountingSummary();
    renderTransactions();
}

function updateAccountingSummary() {
    const totalIncome = transactions.reduce((sum, t) => sum + (t.income || 0), 0);
    const totalExpense = transactions.reduce((sum, t) => sum + (t.expense || 0), 0);
    const totalDeposit = transactions.reduce((sum, t) => sum + (t.deposit || 0), 0);
    const currentBalance = transactions.length > 0 ? transactions[transactions.length - 1].balance : 0;
    const lastDate = transactions.length > 0 ? transactions[transactions.length - 1].date : '-';

    document.getElementById('currentBalance').textContent = formatCurrency(currentBalance);
    document.getElementById('totalIncome').textContent = formatCurrency(totalIncome);
    document.getElementById('totalExpense').textContent = formatCurrency(totalExpense);
    document.getElementById('totalDeposit').textContent = formatCurrency(totalDeposit);
    document.getElementById('balanceDate').textContent = `อัปเดต: ${formatDate(lastDate)}`;
}

function renderTransactions(filter = null) {
    const tableBody = document.getElementById('transactionsTable');
    let filteredTransactions = transactions;

    if (filter) {
        if (filter.startDate) {
            filteredTransactions = filteredTransactions.filter(t => t.date >= filter.startDate);
        }
        if (filter.endDate) {
            filteredTransactions = filteredTransactions.filter(t => t.date <= filter.endDate);
        }
        if (filter.type) {
            if (filter.type === 'income') {
                filteredTransactions = filteredTransactions.filter(t => t.income > 0);
            } else if (filter.type === 'expense') {
                filteredTransactions = filteredTransactions.filter(t => t.expense > 0);
            } else if (filter.type === 'deposit') {
                filteredTransactions = filteredTransactions.filter(t => t.deposit > 0);
            }
        }
        if (filter.paymentMethod) {
            filteredTransactions = filteredTransactions.filter(t => t.paymentMethod === filter.paymentMethod);
        }
    }

    document.getElementById('transactionCount').textContent = `ทั้งหมด ${filteredTransactions.length} รายการ`;

    tableBody.innerHTML = filteredTransactions.map(transaction => `
        <tr>
            <td>${formatDate(transaction.date)}</td>
            <td>${transaction.name}</td>
            <td>${transaction.phone}</td>
            <td>${transaction.room}</td>
            <td>${transaction.nights || '-'}</td>
            <td class="${transaction.expense > 0 ? 'expense' : ''}">${transaction.expense > 0 ? formatCurrency(transaction.expense) : '-'}</td>
            <td class="${transaction.income > 0 ? 'income' : ''}">${transaction.income > 0 ? formatCurrency(transaction.income) : '-'}</td>
            <td class="balance">${formatCurrency(transaction.balance)}</td>
            <td class="${transaction.deposit > 0 ? 'deposit' : ''}">${transaction.deposit > 0 ? formatCurrency(transaction.deposit) : '-'}</td>
            <td>${transaction.note}</td>
            <td>
                <button class="action-btn edit" title="แก้ไข" onclick="editTransaction(${transaction.id})">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke-width="2"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke-width="2"/>
                    </svg>
                </button>
                <button class="action-btn delete" title="ลบ" onclick="deleteTransaction(${transaction.id})">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="3 6 5 6 21 6" stroke-width="2"/>
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke-width="2"/>
                    </svg>
                </button>
            </td>
        </tr>
    `).join('');
}

// ===== Modal Functions =====
const roomModal = document.getElementById('roomModal');
const bookingModal = document.getElementById('bookingModal');
const transactionModal = document.getElementById('transactionModal');

const addRoomBtn = document.getElementById('addRoomBtn');
const addBookingBtn = document.getElementById('addBookingBtn');
const addTransactionBtn = document.getElementById('addTransactionBtn');

const closeRoomModal = document.getElementById('closeRoomModal');
const closeBookingModal = document.getElementById('closeBookingModal');
const closeTransactionModal = document.getElementById('closeTransactionModal');

const cancelRoom = document.getElementById('cancelRoom');
const cancelBooking = document.getElementById('cancelBooking');
const cancelTransaction = document.getElementById('cancelTransaction');

function openModal(modal) {
    modal.classList.add('active');
}

function closeModal(modal) {
    modal.classList.remove('active');
}

if (addRoomBtn) {
    addRoomBtn.addEventListener('click', () => {
        document.getElementById('roomForm').reset();
        document.getElementById('roomModalTitle').textContent = 'เพิ่มห้องพัก';
        openModal(roomModal);
    });
}

if (addBookingBtn) {
    addBookingBtn.addEventListener('click', () => {
        document.getElementById('bookingForm').reset();
        document.getElementById('bookingModalTitle').textContent = 'เพิ่มการจอง';
        populateRoomSelect();
        openModal(bookingModal);
    });
}

if (addTransactionBtn) {
    addTransactionBtn.addEventListener('click', () => {
        document.getElementById('transactionForm').reset();
        document.getElementById('transactionModalTitle').textContent = 'บันทึกรายการ';
        document.getElementById('transactionDate').valueAsDate = new Date();
        openModal(transactionModal);
    });
}

if (closeRoomModal) closeRoomModal.addEventListener('click', () => closeModal(roomModal));
if (closeBookingModal) closeBookingModal.addEventListener('click', () => closeModal(bookingModal));
if (closeTransactionModal) closeTransactionModal.addEventListener('click', () => closeModal(transactionModal));

if (cancelRoom) cancelRoom.addEventListener('click', () => closeModal(roomModal));
if (cancelBooking) cancelBooking.addEventListener('click', () => closeModal(bookingModal));
if (cancelTransaction) cancelTransaction.addEventListener('click', () => closeModal(transactionModal));

if (roomModal) {
    roomModal.addEventListener('click', (e) => {
        if (e.target === roomModal) closeModal(roomModal);
    });
}

if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
        if (e.target === bookingModal) closeModal(bookingModal);
    });
}

if (transactionModal) {
    transactionModal.addEventListener('click', (e) => {
        if (e.target === transactionModal) closeModal(transactionModal);
    });
}

// Room Form Submit
const roomForm = document.getElementById('roomForm');
if (roomForm) {
    roomForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const newRoom = {
            id: rooms.length + 1,
            number: formData.get('roomNumber'),
            type: formData.get('roomType'),
            price: parseInt(formData.get('roomPrice')),
            status: formData.get('roomStatus'),
            capacity: parseInt(formData.get('roomCapacity'))
        };

        rooms.push(newRoom);
        renderRooms();
        closeModal(roomModal);
        alert('เพิ่มห้องพักสำเร็จ!');
    });
}

// Booking Form Submit
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const checkIn = new Date(formData.get('checkInDate'));
        const checkOut = new Date(formData.get('checkOutDate'));
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        const roomId = parseInt(formData.get('bookingRoom'));
        const room = getRoomById(roomId);

        const newBooking = {
            id: bookings.length + 1,
            bookingNumber: `BK-2024-${String(bookings.length + 1).padStart(3, '0')}`,
            customerName: formData.get('customerName'),
            roomId: roomId,
            checkIn: formData.get('checkInDate'),
            checkOut: formData.get('checkOutDate'),
            nights: nights,
            total: room.price * nights,
            status: 'pending'
        };

        bookings.push(newBooking);
        renderBookings();
        closeModal(bookingModal);
        alert('เพิ่มการจองสำเร็จ!');
    });
}

// Transaction Form Submit
const transactionForm = document.getElementById('transactionForm');
if (transactionForm) {
    transactionForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const expense = parseFloat(formData.get('transactionExpense')) || 0;
        const income = parseFloat(formData.get('transactionIncome')) || 0;
        const previousBalance = transactions.length > 0 ? transactions[transactions.length - 1].balance : 0;
        const newBalance = previousBalance - expense + income;

        const newTransaction = {
            id: transactions.length + 1,
            date: formData.get('transactionDate'),
            name: formData.get('transactionName'),
            phone: formData.get('transactionPhone') || '-',
            room: formData.get('transactionRoom') || '-',
            nights: parseInt(formData.get('transactionNights')) || 0,
            expense: expense,
            income: income,
            balance: newBalance,
            deposit: parseFloat(formData.get('transactionDeposit')) || 0,
            note: formData.get('transactionNote') || '',
            paymentMethod: formData.get('transactionPaymentMethod')
        };

        transactions.push(newTransaction);
        renderAccounting();
        closeModal(transactionModal);
        alert('บันทึกรายการสำเร็จ!');
    });
}

function populateRoomSelect() {
    const roomSelect = document.getElementById('bookingRoom');
    const availableRooms = rooms.filter(room => room.status === 'available');

    roomSelect.innerHTML = '<option value="">เลือกห้อง</option>' +
        availableRooms.map(room =>
            `<option value="${room.id}">${room.number} - ${getRoomTypeLabel(room.type)} (${formatCurrency(room.price)}/คืน)</option>`
        ).join('');
}

// Edit and Delete Functions
function editRoom(id) {
    const room = getRoomById(id);
    if (room) {
        document.getElementById('roomNumber').value = room.number;
        document.getElementById('roomType').value = room.type;
        document.getElementById('roomPrice').value = room.price;
        document.getElementById('roomStatus').value = room.status;
        document.getElementById('roomCapacity').value = room.capacity;
        document.getElementById('roomModalTitle').textContent = 'แก้ไขห้องพัก';
        openModal(roomModal);
    }
}

function deleteRoom(id) {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบห้องพักนี้?')) {
        rooms = rooms.filter(room => room.id !== id);
        renderRooms();
        alert('ลบห้องพักสำเร็จ!');
    }
}

function editBooking(id) {
    const booking = bookings.find(b => b.id === id);
    if (booking) {
        document.getElementById('customerName').value = booking.customerName;
        document.getElementById('bookingRoom').value = booking.roomId;
        document.getElementById('checkInDate').value = booking.checkIn;
        document.getElementById('checkOutDate').value = booking.checkOut;
        document.getElementById('bookingModalTitle').textContent = 'แก้ไขการจอง';
        populateRoomSelect();
        openModal(bookingModal);
    }
}

function deleteBooking(id) {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบการจองนี้?')) {
        bookings = bookings.filter(booking => booking.id !== id);
        renderBookings();
        alert('ลบการจองสำเร็จ!');
    }
}

function editTransaction(id) {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
        document.getElementById('transactionDate').value = transaction.date;
        document.getElementById('transactionName').value = transaction.name;
        document.getElementById('transactionPhone').value = transaction.phone;
        document.getElementById('transactionRoom').value = transaction.room;
        document.getElementById('transactionNights').value = transaction.nights;
        document.getElementById('transactionExpense').value = transaction.expense;
        document.getElementById('transactionIncome').value = transaction.income;
        document.getElementById('transactionDeposit').value = transaction.deposit;
        document.getElementById('transactionNote').value = transaction.note;
        document.getElementById('transactionPaymentMethod').value = transaction.paymentMethod;
        document.getElementById('transactionModalTitle').textContent = 'แก้ไขรายการ';
        openModal(transactionModal);
    }
}

function deleteTransaction(id) {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบรายการนี้?')) {
        transactions = transactions.filter(t => t.id !== id);
        // Recalculate balances
        let runningBalance = 0;
        transactions.forEach(t => {
            if (t.name === 'ยกมา') {
                runningBalance = t.balance;
            } else {
                runningBalance = runningBalance - t.expense + t.income;
                t.balance = runningBalance;
            }
        });
        renderAccounting();
        alert('ลบรายการสำเร็จ!');
    }
}

// Accounting Filters
const filterStartDate = document.getElementById('filterStartDate');
const filterEndDate = document.getElementById('filterEndDate');
const filterType = document.getElementById('filterType');
const filterPaymentMethod = document.getElementById('filterPaymentMethod');
const resetFilters = document.getElementById('resetFilters');

function applyFilters() {
    const filter = {
        startDate: filterStartDate?.value || null,
        endDate: filterEndDate?.value || null,
        type: filterType?.value || null,
        paymentMethod: filterPaymentMethod?.value || null
    };
    renderTransactions(filter);
}

if (filterStartDate) filterStartDate.addEventListener('change', applyFilters);
if (filterEndDate) filterEndDate.addEventListener('change', applyFilters);
if (filterType) filterType.addEventListener('change', applyFilters);
if (filterPaymentMethod) filterPaymentMethod.addEventListener('change', applyFilters);

if (resetFilters) {
    resetFilters.addEventListener('click', () => {
        if (filterStartDate) filterStartDate.value = '';
        if (filterEndDate) filterEndDate.value = '';
        if (filterType) filterType.value = '';
        if (filterPaymentMethod) filterPaymentMethod.value = '';
        renderTransactions();
    });
}

// CSV Import/Export
const importCSVBtn = document.getElementById('importCSVBtn');
const exportCSVBtn = document.getElementById('exportCSVBtn');
const csvFileInput = document.getElementById('csvFileInput');

// ===== Smart Data Analyzer & Import Engine =====
const smartImport = {
    // Keywords for pattern matching
    patterns: {
        expense: ['เบิก', 'จ่าย', 'ซื้อ', 'หัก', 'ค่า', 'จ้าง', 'ซ่อม'],
        income: ['พักต่อ', 'ห้อง', 'โอน', 'รับ'],
        deposit: ['มัดจำ', 'เงินประกัน']
    },

    analyzeLine(data, existingTransactions) {
        const name = data.name || '';
        const note = data.note || '';
        let expense = data.expense || 0;
        let income = data.income || 0;
        let deposit = data.deposit || 0;

        // 1. Cross-check for Duplicates
        const isDuplicate = existingTransactions.some(t =>
            t.date === data.date &&
            t.name === data.name &&
            (t.income === income && t.expense === expense)
        );
        if (isDuplicate) return { status: 'duplicate', data: null };

        // 2. Smart Categorization (If values are ambiguous)
        const combinedText = (name + note).toLowerCase();

        // If it's clearly an expense by keyword but put in income column
        if (this.patterns.expense.some(p => combinedText.includes(p)) && income > 0 && expense === 0) {
            expense = income;
            income = 0;
            data.aiNote = 'AI: ย้ายจากรายรับไปรายจ่ายตามคำสำคัญ';
        }

        // 3. Room & Deposit Logic
        if (combinedText.includes('มัดจำ') && deposit === 0 && income > 0) {
            deposit = income;
            data.aiNote = 'AI: ตรวจพบมัดจำสด';
        }

        return {
            status: 'ok',
            data: { ...data, expense, income, deposit }
        };
    },

    getSummary(transactions) {
        return {
            count: transactions.length,
            totalIncome: transactions.reduce((s, t) => s + (t.income || 0), 0),
            totalExpense: transactions.reduce((s, t) => s + (t.expense || 0), 0),
            totalDeposit: transactions.reduce((s, t) => s + (t.deposit || 0), 0)
        };
    }
};

if (importCSVBtn && csvFileInput) {
    importCSVBtn.addEventListener('click', () => {
        csvFileInput.click();
    });

    csvFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const csv = event.target.result;
                const lines = csv.split(/\r?\n/);
                const results = { ok: [], duplicates: 0, fixed: 0, skipped: 0 };

                const parseCSVLine = (text) => {
                    const result = [];
                    let cell = '';
                    let inQuotes = false;
                    for (let i = 0; i < text.length; i++) {
                        const char = text[i];
                        if (char === '"') inQuotes = !inQuotes;
                        else if (char === ',' && !inQuotes) {
                            result.push(cell.trim());
                            cell = '';
                        } else cell += char;
                    }
                    result.push(cell.trim());
                    return result;
                };

                const cleanNumber = (val) => {
                    if (!val || val === '-') return 0;
                    // Robust number cleaning for values like "4,037"
                    const cleaned = val.toString().replace(/[^0-9.-]/g, '');
                    return parseFloat(cleaned) || 0;
                };

                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) continue;

                    const values = parseCSVLine(line);
                    if (values.length < 2) continue;

                    // Support for Thai Date Format (D-M-68)
                    let formattedDate = values[0];
                    if (formattedDate) {
                        const dateParts = formattedDate.split(/[\/\-]/);
                        if (dateParts.length === 3) {
                            let d = dateParts[0].padStart(2, '0');
                            let m = dateParts[1].padStart(2, '0');
                            let y = parseInt(dateParts[2]);
                            if (y < 100) y += 2500;
                            if (y > 2400) y -= 543;
                            formattedDate = `${y}-${m}-${d}`;
                        }
                    }

                    // Special handling for "Balance" column which might contain payment method
                    let balanceCol = values[7] || '';
                    let paymentMethod = 'cash';
                    if (balanceCol.includes('โอน') || balanceCol.includes('บัญชี') || balanceCol.includes('Ascend')) {
                        paymentMethod = 'transfer';
                    }

                    const rawData = {
                        date: formattedDate,
                        name: values[1] || 'ไม่มีชื่อ',
                        phone: values[2] || '-',
                        room: values[3] || '-',
                        nights: parseInt(values[4]) || 0,
                        expense: cleanNumber(values[5]),
                        income: cleanNumber(values[6]),
                        deposit: cleanNumber(values[8]),
                        note: values[9] || '',
                        paymentMethod: paymentMethod
                    };

                    // Skip "ยกมา" lines to avoid duplication but update starter balance if needed
                    if (rawData.name.includes('ยกมา') || (!rawData.date && rawData.name === '')) {
                        results.skipped++;
                        continue;
                    }

                    const analysis = smartImport.analyzeLine(rawData, transactions);
                    if (analysis.status === 'ok') {
                        if (analysis.data.aiNote) results.fixed++;
                        results.ok.push({ ...analysis.data, id: Date.now() + i });
                    } else if (analysis.status === 'duplicate') {
                        results.duplicates++;
                    }
                }

                if (results.ok.length > 0) {
                    const summary = smartImport.getSummary(results.ok);
                    const confirmMsg = `🤖 AI ตรวจวิเคราะห์ข้อมูลจาก Google Sheets เสร็จแล้ว:
-----------------------------------
✅ พร้อมนำเข้า: ${results.ok.length} รายการ
⚠️ ข้ามรายการซ้ำ: ${results.duplicates} รายการ
⏭️ ข้ามบรรทัด 'ยกมา': ${results.skipped} รายการ
🛠️ ปรับแก้ข้อมูลอัตโนมัติ: ${results.fixed} รายการ

💰 สรุปยอดที่กำลังจะเพิ่ม:
+ รายรับรวม: ${formatCurrency(summary.totalIncome)}
- รายจ่ายรวม: ${formatCurrency(summary.totalExpense)}
🔒 มัดจำรวม: ${formatCurrency(summary.totalDeposit)}

คุณต้องการบันทึกข้อมูลเหล่านี้ใช่หรือไม่?`;

                    if (confirm(confirmMsg)) {
                        transactions.push(...results.ok);

                        // Recalculate everything
                        let runningBalance = 0;
                        transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.id - b.id);

                        transactions.forEach(t => {
                            if (t.name === 'ยกมา') {
                                runningBalance = t.balance;
                            } else {
                                runningBalance = runningBalance - (t.expense || 0) + (t.income || 0);
                                t.balance = runningBalance;
                            }
                        });

                        renderAccounting();
                        alert('นำเข้าข้อมูลสำเร็จและคำนวณยอดเงินเรียบร้อยครับ!');
                    }
                } else {
                    alert('🤖 AI ไม่พบข้อมูลใหม่');
                }
            } catch (error) {
                console.error('Expert Import Error:', error);
                alert('เกิดข้อผิดพลาดในการอ่านข้อมูล: ' + error.message);
            }
        };
        reader.readAsText(file, 'UTF-8');
        e.target.value = '';
    });
}

if (exportCSVBtn) {
    exportCSVBtn.addEventListener('click', () => {
        const headers = ['วันที่', 'ชื่อรายการ', 'เบอร์โทร', 'ห้อง', 'คืน', 'จ่าย', 'รับ', 'รวม', 'มัดจำสด', 'หมายเหตุ', 'ช่องทางชำระเงิน'];
        const csv = [
            headers.join(','),
            ...transactions.map(t => [
                t.date,
                t.name,
                t.phone,
                t.room,
                t.nights,
                t.expense,
                t.income,
                t.balance,
                t.deposit,
                t.note,
                t.paymentMethod
            ].join(','))
        ].join('\n');

        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();

        alert('ส่งออกข้อมูลสำเร็จ!');
    });
}

// Search Customer
const searchCustomer = document.getElementById('searchCustomer');
if (searchCustomer) {
    searchCustomer.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredCustomers = customers.filter(customer =>
            customer.name.toLowerCase().includes(searchTerm) ||
            customer.email.toLowerCase().includes(searchTerm) ||
            customer.phone.includes(searchTerm)
        );

        const tableBody = document.getElementById('customersTable');
        tableBody.innerHTML = filteredCustomers.map(customer => `
            <tr>
                <td>${customer.customerId}</td>
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td>${customer.visits} ครั้ง</td>
                <td>${formatCurrency(customer.totalSpent)}</td>
                <td>${getStatusBadge(customer.status, 'customer')}</td>
                <td>
                    <button class="action-btn view" title="ดูรายละเอียด">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke-width="2"/>
                            <circle cx="12" cy="12" r="3" stroke-width="2"/>
                        </svg>
                    </button>
                    <button class="action-btn edit" title="แก้ไข">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke-width="2"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke-width="2"/>
                        </svg>
                    </button>
                    <button class="action-btn delete" title="ลบ">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="3 6 5 6 21 6" stroke-width="2"/>
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke-width="2"/>
                        </svg>
                    </button>
                </td>
            </tr>
        `).join('');
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    renderDashboard();
});
