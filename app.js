/**
 * VIPAT HOTEL MANAGEMENT SYSTEM - ARCHITECTURE V4.3
 * Cloud Data Sync + Database Health Check
 */

// ===== 1.0 SYSTEM CONFIGURATION & STORAGE KEYS =====
const DB_VERSION = '4.3 Cloud Sync Enabled';
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

// ===== 2.0 DATA INITIALIZATION (Master Templates) =====

const MASTER_ROOMS = [
    // ตึก A
    { room_id: 1, room_number: 'A101', building: 'A', floor: 1, room_type: 'Standard', price_per_night: 400, room_status: 'Available' },
    { room_id: 2, room_number: 'A102', building: 'A', floor: 1, room_type: 'Standard', price_per_night: 400, room_status: 'Available' },
    { room_id: 15, room_number: 'A204', building: 'A', floor: 2, room_type: 'Standard', price_per_night: 3500, room_status: 'Occupied', note: 'รายเดือน' },
    { room_id: 16, room_number: 'A205', building: 'A', floor: 2, room_type: 'Standard', price_per_night: 3500, room_status: 'Occupied', note: 'รายเดือน' },
    { room_id: 23, room_number: 'B101', building: 'B', floor: 1, room_type: 'Standard', price_per_night: 400, room_status: 'Available' },
    { room_id: 25, room_number: 'B103', building: 'B', floor: 1, room_type: 'Standard', price_per_night: 400, room_status: 'Available' },
];

const MASTER_GUESTS = [
    { guest_id: 'CM01578', first_name: 'สุรยา', last_name: 'คำแสน', phone_number: '084-5847792', guest_type: 'Individual', address: '45/3 ต.บึงโขงหลง อ.บึงโขงหลง จ.บึงกาฬ', tax_id: '1863615486608' },
    { guest_id: 'CM01734', first_name: 'ครูเกศกนก', last_name: 'หนูนาค', phone_number: '083-140-4771', guest_type: 'Individual', address: '-', tax_id: '-' },
    { guest_id: 'CM01204', first_name: 'บริษัท ห้าม้า โอสถ จำกัด', last_name: '', phone_number: '-', guest_type: 'Corporate', address: 'กรุงเทพฯ', tax_id: '105546034385' },
];

const MASTER_BOOKINGS = [
    { booking_id: 'VP01578', guest_id: 'CM01578', room_id: 25, check_in_date: '2025-10-06', check_out_date: '2025-10-07', nights: 1, total_amount: 400, booking_source: 'เงินโอน QR' },
    { booking_id: 'VP01768', guest_id: 'CM01734', room_id: 23, check_in_date: '2025-11-10', check_out_date: '2025-11-12', nights: 2, total_amount: 800, booking_source: 'Line' },
];

const MASTER_PAYMENTS = [
    { payment_id: 'PAY-VP01578', booking_id: 'VP01578', amount: 400, payment_date: '2025-10-07', payment_method: 'เงินโอน QR', type: 'daily' },
    { payment_id: 'PAY-VP01768', booking_id: 'VP01768', amount: 800, payment_date: '2025-11-10', payment_method: 'โอนเงิน', type: 'daily' },
];

// ===== 3.0 DATABASE MANAGER =====
const DB = {
    state: {},
    init() {
        try {
            this.state.guests = this.load(STORAGE_KEYS.GUESTS) || MASTER_GUESTS;
            this.state.rooms = this.load(STORAGE_KEYS.ROOMS) || MASTER_ROOMS;
            this.state.bookings = this.load(STORAGE_KEYS.BOOKINGS) || MASTER_BOOKINGS;
            this.state.payments = this.load(STORAGE_KEYS.PAYMENTS) || MASTER_PAYMENTS;
            this.state.expenses = this.load(STORAGE_KEYS.EXPENSES) || [];
            this.state.employees = this.load(STORAGE_KEYS.EMPLOYEES) || [{ salary: 15000 }];
            this.state.gas_url = localStorage.getItem(STORAGE_KEYS.GAS_URL) || "";

            console.log("DB Stats: Guests:", this.state.guests.length, "Rooms:", this.state.rooms.length);
            this.saveAll();
        } catch (e) {
            console.error("Database initialization failed", e);
        }
    },
    load(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) { return null; }
    },
    saveAll() {
        try {
            Object.keys(STORAGE_KEYS).forEach(k => {
                const key = STORAGE_KEYS[k];
                const stateKey = k.toLowerCase();
                if (this.state[stateKey] !== undefined) {
                    if (stateKey === 'gas_url') {
                        localStorage.setItem(key, this.state[stateKey]);
                    } else {
                        localStorage.setItem(key, JSON.stringify(this.state[stateKey]));
                    }
                }
            });
        } catch (e) { console.warn("Could not save to localStorage", e); }
    },
    clearData() {
        if (confirm("คำเตือน! ข้อมูลในเบราว์เซอร์ทั้งหมดจะถูกลบ?")) {
            localStorage.clear();
            location.reload();
        }
    }
};

// ===== 4.0 CLOUD SYNC ENGINE =====
const CloudEngine = {
    async sync() {
        const url = DB.state.gas_url;
        if (!url) return { status: 'idle', message: 'ย้งไม่ได้ตั้งค่า Cloud' };

        const statusEl = document.getElementById('syncStatus');
        if (statusEl) statusEl.innerText = "สถานะ: กำลังซิงค์ข้อมูล...";

        try {
            const response = await fetch(url, {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify({
                    action: 'sync',
                    data: DB.state
                })
            });
            const result = await response.json();
            if (statusEl) statusEl.innerText = "สถานะ: เชื่อมต่อล่าสุด " + new Date().toLocaleTimeString();
            return result;
        } catch (e) {
            if (statusEl) statusEl.innerText = "สถานะ: การเชื่อมต่อล้มเหลว (Check GAS URL)";
            return { status: 'error', error: e };
        }
    }
};

// ===== 5.0 ENGINES =====
const FinanceEngine = {
    getMonthlySummary() {
        const totalRevenue = DB.state.payments.reduce((s, p) => s + p.amount, 0);
        const totalExpense = DB.state.employees.reduce((s, e) => s + e.salary, 0);
        return {
            revenue: totalRevenue,
            expense: totalExpense,
            net: totalRevenue - totalExpense
        };
    }
};

// ===== 6.0 UI RENDERING =====
const UI = {
    hideLoading() {
        const loader = document.getElementById('loading');
        if (loader) loader.style.display = 'none';
    },

    renderDashboard() {
        const summary = FinanceEngine.getMonthlySummary();
        document.getElementById('d-income').innerText = "฿" + summary.revenue.toLocaleString();
        document.getElementById('d-expense').innerText = "฿" + summary.expense.toLocaleString();

        const avail = DB.state.rooms.filter(r => r.room_status === 'Available').length;
        const occupied = DB.state.rooms.filter(r => r.room_status === 'Occupied').length;
        document.getElementById('d-avail').innerText = avail;
        document.getElementById('d-occupied').innerText = occupied;

        this.renderIncomeChart();
    },

    renderIncomeChart() {
        const chartEl = document.querySelector("#chartIncome");
        if (!chartEl) return;

        const monthlyData = [400, 3600, 1200];
        const options = {
            series: [{ name: 'รายรับสะสม (Revenue Mix)', data: monthlyData }],
            chart: { type: 'area', height: 350, toolbar: { show: false }, animations: { enabled: true } },
            colors: ['#0d6efd'],
            fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.3 } },
            xaxis: { categories: ['ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'] },
            dataLabels: { enabled: true, formatter: (v) => "฿" + v.toLocaleString() }
        };
        new ApexCharts(chartEl, options).render();
    },

    renderRoomsGrid() {
        const grid = document.getElementById('roomsGrid');
        if (!grid) return;
        grid.innerHTML = DB.state.rooms.map(r => `
            <div class="room-card ${r.room_status.toLowerCase()}">
                <div class="number">${r.room_number}</div>
                <div class="type">${r.room_type}</div>
                <div class="mt-2 fw-bold">฿${r.price_per_night}</div>
            </div>
        `).join('');
    },

    renderGuests() {
        const tbody = document.getElementById('custTableBody');
        if (!tbody) return;
        tbody.innerHTML = DB.state.guests.map(g => `
            <tr>
                <td><strong>${g.first_name} ${g.last_name || ''}</strong></td>
                <td>${g.phone_number}</td>
                <td><code class="bg-light p-1">${g.guest_id}</code></td>
                <td><span class="badge ${g.guest_type === 'Corporate' ? 'bg-primary' : 'bg-secondary'}">${g.guest_type}</span></td>
                <td><button class="btn btn-sm btn-outline-info" onclick="alert('แสดงประวัติ: ${g.first_name}')">History</button></td>
            </tr>
        `).join('');
    },

    renderBookings() {
        const container = document.getElementById('bookingsContent');
        if (!container) return;

        const rows = DB.state.bookings.map(b => {
            const guest = DB.state.guests.find(g => g.guest_id === b.guest_id) || { first_name: 'ลูกค้าทั่วไป' };
            const room = DB.state.rooms.find(r => r.room_id === b.room_id) || { room_number: '?' };
            return `
                <tr>
                    <td><code>${b.booking_id}</code></td>
                    <td>${guest.first_name} ${guest.last_name || ''}</td>
                    <td><span class="badge bg-dark">${room.room_number}</span></td>
                    <td>${b.check_in_date}</td>
                    <td>${b.nights} คืน</td>
                    <td>฿${b.total_amount.toLocaleString()}</td>
                    <td><span class="badge bg-success">CHECKED-OUT</span></td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="UI.showBill('${b.booking_id}')">
                            <i class='bx bxs-file-pdf'></i> พิมพ์ใบเสร็จ
                        </button>
                    </td>
                </tr>
            `;
        }).reverse().join('');

        container.innerHTML = `
            <h5 class="fw-bold mb-4"><i class='bx bx-history'></i> ประวัติการเข้าพักและใบเสร็จ</h5>
            <div class="table-responsive">
                <table class="table table-hover align-middle">
                    <thead class="table-light">
                        <tr><th>เลขที่จอง</th><th>ชื่อลูกค้า</th><th>เลขห้อง</th><th>วันที่เข้า</th><th>จำนวน</th><th>ยอดชำระ</th><th>สถานะ</th><th>งาน</th></tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        `;
    },

    showBill(bookingId) {
        const booking = DB.state.bookings.find(b => b.booking_id === bookingId);
        if (!booking) return;

        const guest = DB.state.guests.find(g => g.guest_id === booking.guest_id) || { first_name: 'Unknown', address: '-', tax_id: '-' };
        const room = DB.state.rooms.find(r => r.room_id === booking.room_id) || { room_number: '?', room_type: 'Standard' };

        const vatRate = 0.07;
        const total = booking.total_amount;
        const basePrice = total / (1 + vatRate);
        const vatAmount = total - basePrice;

        const billHtml = `
            <div id="billContainer" class="p-5 bg-white text-dark shadow-sm mx-auto" style="max-width: 800px; border: 1px solid #ddd; font-family: 'Kanit', sans-serif;">
                <div class="d-flex justify-content-between border-bottom pb-3 mb-4">
                    <div>
                        <h4 class="fw-bold text-primary mb-1">บริษัท วิวัฒน์โฮเทล.ดีเวลอปเมนท์ จำกัด</h4>
                        <p class="small text-muted mb-1 text-wrap" style="max-width:300px;">426 หมู่ที่ 9 ต.บึงกาฬ อ.เมืองบึงกาฬ จ.บึงกาฬ 38000</p>
                        <p class="small text-muted mb-0">เลขประจำตัวผู้เสียภาษี: 0-3855-59000-07-5</p>
                    </div>
                    <div class="text-end">
                        <h5 class="fw-bold mb-1">ใบเสร็จรับเงิน/ใบกำกับภาษี</h5>
                        <p class="mb-0">เลขที่: <strong>${booking.booking_id}</strong></p>
                        <p class="mb-0 small text-muted">วันที่: ${new Date().toLocaleDateString('th-TH')}</p>
                    </div>
                </div>
                <div class="row mb-4">
                    <div class="col-8">
                        <h6 class="fw-bold text-muted border-bottom pb-1 mb-2">นามผู้ซื้อ/ลูกค้า</h6>
                        <p class="mb-1"><strong>คุณ ${guest.first_name} ${guest.last_name || ''}</strong></p>
                        <p class="small mb-1 text-muted">${guest.address}</p>
                        <p class="small mb-0">TAX ID: ${guest.tax_id || '-'}</p>
                    </div>
                </div>
                <table class="table table-bordered small">
                    <thead class="bg-light text-center">
                        <tr><th>ลำดับ</th><th>รายการรายละเอียด</th><th>จำนวน</th><th>จำนวนเงิน</th></tr>
                    </thead>
                    <tbody>
                        <tr style="height: 120px;">
                            <td class="text-center">1</td>
                            <td>บริการที่พักห้อง ${room.room_number} (${room.room_type})<br><small class="text-muted">Stay period: ${booking.check_in_date} - ${booking.check_out_date}</small></td>
                            <td class="text-center">${booking.nights} คืน</td>
                            <td class="text-end">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr><td colspan="2" class="border-0"></td><td class="text-end fw-bold">ก่อนภาษี (Subtotal)</td><td class="text-end">${basePrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td></tr>
                        <tr><td colspan="2" class="border-0"></td><td class="text-end fw-bold">VAT 7%</td><td class="text-end">${vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td></tr>
                        <tr class="table-primary fw-bold">
                            <td colspan="2" class="border-0 text-center small">(${this.numToThaiText(total)})</td>
                            <td class="text-end">ยอดเงินสุทธิ</td>
                            <td class="text-end">฿${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        </tr>
                    </tfoot>
                </table>
                <div class="mt-5 pt-3 d-flex justify-content-between text-center">
                    <div style="width: 200px;"><div class="border-bottom mb-2"></div><p class="small">ผู้รับเงิน / Cashier</p></div>
                    <div style="width: 200px;"><div class="border-bottom mb-2"></div><p class="small">ผู้มีอำนาจลงนาม / Authorized</p></div>
                </div>
                <div class="mt-4 text-center d-print-none">
                    <button class="btn btn-dark px-4" onclick="window.print()"><i class='bx bx-printer'></i> พิมพ์เอกสาร</button>
                    <button class="btn btn-outline-secondary px-4" onclick="bootstrap.Modal.getInstance(document.getElementById('receiptModal')).hide()">ปิด</button>
                </div>
            </div>
        `;

        document.getElementById('receiptModalContent').innerHTML = billHtml;
        new bootstrap.Modal(document.getElementById('receiptModal')).show();
    },

    numToThaiText(number) {
        const textMap = { 400: "สี่ร้อยบาทถ้วน", 800: "แปดร้อยบาทถ้วน", 1200: "หนึ่งพันสองร้อยบาทถ้วน" };
        return textMap[number] || "ระบุไม่ได้";
    },

    renderAccounting() {
        const list = document.getElementById('transactionsTableBody');
        if (!list) return;
        list.innerHTML = DB.state.payments.map(p => `
            <tr>
                <td>${p.payment_date}</td>
                <td><span class="text-primary fw-bold">ชำระค่าห้องพัก</span> (${p.booking_id})</td>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
                <td class="text-end text-success fw-bold">+฿${p.amount.toLocaleString()}</td>
                <td class="text-end fw-bold">฿${p.amount.toLocaleString()}</td>
                <td class="text-center">-</td>
                <td><span class="badge bg-light text-dark border">โอนเงิน</span></td>
            </tr>
        `).join('');
    }
};

// ===== 7.0 GLOBAL FUNCTIONS & HANDLERS =====

window.saveCloudSettings = async () => {
    const url = document.getElementById('gasUrlInput').value;
    if (!url.startsWith('https://script.google.com')) {
        alert("กรุณาระบุ GAS URL ที่ถูกต้อง");
        return;
    }
    DB.state.gas_url = url;
    DB.saveAll();
    alert("บันทึกการตั้งค่าสำเร็จ! กำลังทดสอบการซิงค์...");
    const result = await CloudEngine.sync();
    if (result.status === 'error') {
        alert("ซิงค์ล้มเหลว: " + (result.error.message || "ไม่สามารถเชื่อมต่อได้"));
    } else {
        alert("ซิงค์ข้อมูลสำเร็จ!");
    }
};

document.addEventListener('DOMContentLoaded', () => {
    try {
        DB.init();
        if (DB.state.gas_url) {
            document.getElementById('gasUrlInput').value = DB.state.gas_url;
            CloudEngine.sync();
        }
        UI.renderDashboard();
        initSidebar();
        UI.hideLoading();
    } catch (e) {
        console.error("Critical Startup Error", e);
        UI.hideLoading();
    }
});

function initSidebar() {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const pageId = item.dataset.page;
            document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
            const target = document.getElementById(pageId + 'Page');
            if (target) {
                target.classList.add('active');
                if (pageId === 'rooms') UI.renderRoomsGrid();
                if (pageId === 'customers') UI.renderGuests();
                if (pageId === 'bookings') UI.renderBookings();
                if (pageId === 'accounting') UI.renderAccounting();
                if (pageId === 'dashboard') UI.renderDashboard();
            }
            document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
            item.classList.add('active');
        });
    });
}
