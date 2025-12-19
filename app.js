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
            // Helper to load or fallback if empty/null
            const loadOrImport = (key, imported, master) => {
                const stored = this.load(key);
                // Use stored if it exists AND has items. Otherwise use imported, or master as last resort.
                if (stored && stored.length > 0) return stored;
                return (imported && imported.length > 0) ? imported : master;
            };

            this.state.guests = loadOrImport(STORAGE_KEYS.GUESTS, window.IMPORTED_GUESTS, MASTER_GUESTS);
            this.state.rooms = loadOrImport(STORAGE_KEYS.ROOMS, window.IMPORTED_ROOMS, MASTER_ROOMS);
            this.state.bookings = loadOrImport(STORAGE_KEYS.BOOKINGS, window.IMPORTED_BOOKINGS, MASTER_BOOKINGS);
            this.state.payments = loadOrImport(STORAGE_KEYS.PAYMENTS, window.IMPORTED_PAYMENTS, MASTER_PAYMENTS);

            this.state.expenses = this.load(STORAGE_KEYS.EXPENSES) || [];
            this.state.employees = this.load(STORAGE_KEYS.EMPLOYEES) || [{ salary: 15000 }];
            this.state.gas_url = localStorage.getItem(STORAGE_KEYS.GAS_URL) || "";

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
        if (!url) return { status: 'idle', message: 'ยังไม่ได้ตั้งค่า Cloud' };

        const statusEl = document.getElementById('syncStatus');
        if (statusEl) statusEl.innerText = "สถานะ: กำลังซิงค์ข้อมูล...";

        try {
            console.log("Syncing to Cloud...");
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                body: JSON.stringify({
                    action: 'sync',
                    data: DB.state
                })
            });

            const result = await response.json();
            console.log("Cloud Response:", result);

            if (result.status === 'success') {
                if (statusEl) statusEl.innerText = "สถานะ: เชื่อมต่อล่าสุด " + new Date().toLocaleTimeString();
                return result;
            } else {
                throw new Error(result.message || "Cloud Error");
            }
        } catch (e) {
            console.error("Sync Error:", e);
            if (statusEl) statusEl.innerText = "สถานะ: การเชื่อมต่อล้มเหลว (ตรวจสอบการตั้งค่า GAS)";
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

        const guest = DB.state.guests.find(g => g.guest_id === booking.guest_id) || { first_name: 'Unknown', address: '-', tax_id: '-', phone_number: '-' };
        const room = DB.state.rooms.find(r => r.room_id === booking.room_id) || { room_number: '?', room_type: 'Standard' };

        // VAT Calculation matching the image (Total includes VAT)
        const total = booking.total_amount;
        const totalExclVat = total / 1.07;
        const vatAmount = total - totalExclVat;
        const thaiText = this.numToThaiText(total);

        const renderReceipt = (typeLabel) => `
            <div class="receipt-paper p-4" style="width: 50%; display: inline-block; vertical-align: top; font-family: 'Kanit', sans-serif; font-size: 11px; background: white; border-right: 1px dashed #ccc;">
                <!-- Header -->
                <div class="d-flex justify-content-between mb-2">
                    <div style="width: 60%;">
                        <div class="d-flex align-items-center mb-2">
                            <div style="width: 40px; height: 40px; background: #FFD700; border-radius: 50%; margin-right: 10px; opacity: 0.6;"></div>
                            <h6 class="fw-bold mb-0" style="color: #004a99; font-size: 14px;">บริษัท วิวัฒน์โฮเทล.ดีเวลอปเมนท์ จำกัด</h6>
                        </div>
                        <p class="mb-0 text-muted" style="font-size: 10px;">426 หมู่ที่ 9 ตำบลบึงกาฬ อำเภอเมืองบึงกาฬ จังหวัดบึงกาฬ 38000</p>
                        <p class="mb-0 text-muted" style="font-size: 10px;">โทร 080-6254859, 042-492641</p>
                        <p class="mb-2 text-muted" style="font-size: 10px;">เลขประจำตัวผู้เสียภาษีอากร: 0-3855-59000-07-5</p>
                        
                        <div class="mt-3">
                            <span class="fw-bold">ชื่อลูกค้า</span><br>
                            <strong>${guest.first_name} ${guest.last_name || ''}</strong><br>
                            ${guest.address}<br>
                            ${guest.phone_number}<br>
                            ${guest.tax_id || ''}
                        </div>
                    </div>
                    <div class="text-end" style="width: 40%;">
                        <h5 class="fw-bold" style="color: #0088cc; font-size: 16px;">ใบเสร็จรับเงิน / ใบกำกับภาษี</h5>
                        <div class="text-end mt-1" style="font-size: 10px;">${typeLabel}</div>
                        <div class="mt-3">
                            <div class="d-flex justify-content-between"><span style="color: #0088cc;">เลขที่เอกสาร</span> <span>${booking.booking_id}</span></div>
                            <div class="d-flex justify-content-between"><span style="color: #0088cc;">วันที่</span> <span>${booking.check_in_date}</span></div>
                            <div class="d-flex justify-content-between"><span style="color: #0088cc;">ชำระเงินโดย</span> <span>เงินโอน QR</span></div>
                        </div>
                    </div>
                </div>

                <!-- Table -->
                <table class="table table-sm mt-3" style="border: 1px solid #cce5ff;">
                    <thead style="background: #cce5ff; color: #004a99;">
                        <tr>
                            <th class="text-center" width="10%">No.</th>
                            <th width="50%">รายการ</th>
                            <th class="text-center" width="20%">ระยะเวลา</th>
                            <th class="text-end" width="20%">ราคารวม</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="height: 60px;">
                            <td class="text-center">1</td>
                            <td>ค่าห้องพัก ${room.room_type} ${room.room_number} (${booking.check_in_date})</td>
                            <td class="text-center">${booking.nights} คืน</td>
                            <td class="text-end">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        </tr>
                    </tbody>
                </table>

                <!-- Summary -->
                <div class="row mt-4">
                    <div class="col-6 pt-5">
                        <span class="fw-bold">(${thaiText})</span>
                    </div>
                    <div class="col-6">
                        <div class="d-flex justify-content-between mb-1"><span style="color: #0088cc;">รวมเป็นเงิน</span> <span>${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                        <div class="d-flex justify-content-between mb-1"><span style="color: #0088cc;">ภาษีมูลค่าเพิ่ม 7%</span> <span>${vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                        <div class="d-flex justify-content-between mb-1"><span style="color: #0088cc;">ราคาไม่รวมภาษีมูลค่าเพิ่ม</span> <span>${totalExclVat.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                        <div class="d-flex justify-content-between fw-bold" style="border-top: 1px solid #0088cc; padding-top: 5px;"><span style="color: #0088cc;">จำนวนเงินรวมทั้งสิ้น</span> <span>${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                    </div>
                </div>

                <!-- Footer Signatures -->
                <div class="row mt-5 text-center" style="font-size: 10px;">
                    <div class="col-4">
                        <div style="border-top: 1px dotted #999; margin: 0 10px;"></div>
                        ผู้จ่ายเงิน
                    </div>
                    <div class="col-2">
                        <div style="border-top: 1px dotted #999; margin: 0 5px;"></div>
                        วันที่
                    </div>
                    <div class="col-4">
                        <div style="border-top: 1px dotted #999; margin: 0 10px;"></div>
                        ผู้รับเงิน
                    </div>
                    <div class="col-2">
                        <div style="border-top: 1px dotted #999; margin: 0 5px;"></div>
                        วันที่
                    </div>
                </div>
            </div>
        `;

        const billHtml = `
            <div class="receipt-container" style="width: 1080px; margin: 0 auto; display: flex; background: #f8f9fa; padding: 10px;">
                ${renderReceipt('ต้นฉบับ')}
                ${renderReceipt('สำเนา')}
            </div>
            <div class="mt-4 text-center d-print-none">
                <button class="btn btn-primary px-5 py-2 fw-bold" onclick="window.print()"><i class='bx bx-printer'></i> พิมพ์ใบเสร็จ (A4 แนวนอน)</button>
                <button class="btn btn-outline-secondary px-4 ms-2" onclick="bootstrap.Modal.getInstance(document.getElementById('receiptModal')).hide()">ปิดหน้าต่าง</button>
            </div>
            <style>
                .receipt-paper { width: 520px !important; margin: 5px; box-shadow: 0 0 5px rgba(0,0,0,0.05); }
                @media print {
                    @page { size: A4 landscape; margin: 0; }
                    body * { visibility: hidden; }
                    .receipt-container, .receipt-container * { visibility: visible; }
                    .receipt-container { position: absolute; left: 0; top: 0; width: 100% !important; background: white !important; box-shadow: none !important; }
                    .receipt-paper { border: 1px solid #eee !important; box-shadow: none !important; }
                    .d-print-none { display: none !important; }
                }
            </style>
        `;

        document.getElementById('receiptModalContent').innerHTML = billHtml;
        new bootstrap.Modal(document.getElementById('receiptModal')).show();
    },

    numToThaiText(number) {
        let txtNum = number.toFixed(2).split(".");
        let baht = txtNum[0];
        let satang = txtNum[1];
        let bahtText = "";
        let unit = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];
        let num = ["ศูนย์", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า"];

        if (parseFloat(number) === 0) return "ศูนย์บาทถ้วน";

        for (let i = 0; i < baht.length; i++) {
            let digit = baht.charAt(i);
            let pos = baht.length - i - 1;
            if (digit !== "0") {
                if (pos % 6 === 1 && digit === "1") bahtText += "";
                else if (pos % 6 === 1 && digit === "2") bahtText += "ยี่";
                else if (pos % 6 === 0 && digit === "1" && i > 0) bahtText += "เอ็ด";
                else bahtText += num[digit];
                bahtText += unit[pos % 6];
            }
            if (pos % 6 === 0 && pos > 0) bahtText += unit[6];
        }
        bahtText += "บาท";
        if (satang === "00") bahtText += "ถ้วน";
        else {
            // Handle satang if needed, but usually hotel rooms are round numbers
            bahtText += " (มีเศษสตางค์)";
        }
        return bahtText;
    },

    renderAccounting() {
        const list = document.getElementById('transactionsTableBody');
        if (!list) return;

        // Combine and Sort Transactions
        let allTx = [];

        // Add Payments (Income)
        DB.state.payments.forEach(p => {
            const booking = DB.state.bookings.find(b => b.booking_id === p.booking_id) || {};
            const guest = DB.state.guests.find(g => g.guest_id === booking.guest_id) || {};
            const room = DB.state.rooms.find(r => r.room_id === booking.room_id) || {};

            allTx.push({
                date: p.payment_date,
                title: guest.first_name || 'ชำระค่าห้องพัก',
                phone: guest.phone_number || '-',
                room: room.room_number || '-',
                nights: booking.nights || 0,
                expense: 0,
                income: p.amount,
                balanceType: (p.payment_method && p.payment_method.includes('โอน')) ? 'โอนเข้าบัญชี' : 'cash',
                deposit: booking.deposit || '-',
                note: booking.note || (booking.channel === 'Line' ? 'จองผ่านไลน์' : '-')
            });
        });

        // Add Expenses
        DB.state.expenses.forEach(e => {
            allTx.push({
                date: e.date,
                title: e.title,
                phone: '-',
                room: '-',
                nights: '-',
                expense: e.amount,
                income: 0,
                balanceType: 'cash',
                deposit: '-',
                note: e.note || (e.title.includes('มัดจำ') ? 'หักค่ามัดจำ' : '-')
            });
        });

        // Sort by Date
        allTx.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Calculate Running Balance
        let cashBalance = 0;
        list.innerHTML = allTx.map(tx => {
            let displayBalance = "";

            if (tx.title.includes("ยกมา")) {
                cashBalance = (tx.income || tx.expense); // เริ่มยอดยกมาใหม่
                displayBalance = cashBalance.toLocaleString();
            } else if (tx.balanceType === 'โอนเข้าบัญชี') {
                displayBalance = '<span class="text-primary small">โอนเข้าบัญชี</span>';
            } else {
                cashBalance += (tx.income - tx.expense);
                displayBalance = cashBalance.toLocaleString();
            }

            const rowClass = tx.expense > 0 ? (tx.title.includes('มัดจำ') ? 'table-danger' : 'table-warning') : '';

            return `
                <tr class="${rowClass}">
                    <td class="small">${tx.date}</td>
                    <td><strong>${tx.title}</strong></td>
                    <td class="text-muted small">${tx.phone}</td>
                    <td class="text-center">${tx.room}</td>
                    <td class="text-center">${tx.nights}</td>
                    <td class="text-end text-danger">${tx.expense > 0 ? tx.expense.toLocaleString() : '-'}</td>
                    <td class="text-end text-success">${tx.income > 0 ? tx.income.toLocaleString() : '-'}</td>
                    <td class="text-end fw-bold">${displayBalance}</td>
                    <td class="text-center text-info fw-bold">${tx.deposit}</td>
                    <td class="small text-muted">${tx.note}</td>
                </tr>
            `;
        }).join('');

        // Update Summaries
        const totalIncome = allTx.reduce((s, t) => s + t.income, 0);
        const totalExpense = allTx.reduce((s, t) => s + t.expense, 0);
        document.getElementById('totalIncome').innerText = "฿" + totalIncome.toLocaleString();
        document.getElementById('totalExpense').innerText = "฿" + totalExpense.toLocaleString();
        document.getElementById('currentBalance').innerText = "฿" + cashBalance.toLocaleString() + " (เงินสด)";
        this.systemCash = cashBalance; // Store for difference check
    },

    checkDifference() {
        const manual = parseFloat(document.getElementById('manualCashInput').value);
        const diffEl = document.getElementById('diffResult');
        if (isNaN(manual)) {
            alert("กรุณาระบุจำนวนเงินสดทื่นับได้จริง");
            return;
        }
        const diff = manual - this.systemCash;
        if (diff === 0) {
            diffEl.innerHTML = `<span class="text-success fw-bold"><i class='bx bx-check-circle'></i> ยอดตรงกัน (฿0)</span>`;
        } else {
            const color = diff > 0 ? 'text-info' : 'text-danger';
            diffEl.innerHTML = `<span class="${color} fw-bold">ยอดต่าง: ฿${diff.toLocaleString()} (${diff > 0 ? 'เงินเกิน' : 'เงินขาด'})</span>`;
        }
    },

    calculateSplit() {
        const total = parseFloat(document.getElementById('b-total-input').value) || 0;
        const count = parseInt(document.getElementById('splitCount').value) || 1;
        const resultEl = document.getElementById('splitResult');
        if (count > 0) {
            resultEl.innerText = `คนละ ฿${(total / count).toLocaleString()}`;
        }
    }
};

// ===== 7.0 GLOBAL FUNCTIONS & HANDLERS =====

// Auto-Calculate Total
function calculateTotal() {
    const checkIn = document.getElementById('b-in').value;
    const checkOut = document.getElementById('b-out').value;
    const roomId = parseInt(document.getElementById('b-room').value);
    const extra = parseFloat(document.getElementById('b-extra').value) || 0;
    const detailEl = document.getElementById('calcDetail');

    if (checkIn && checkOut && !isNaN(roomId)) {
        const room = DB.state.rooms.find(r => r.room_id === roomId);
        if (room) {
            document.getElementById('b-price-night').value = room.price_per_night;
            const nights = Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)));
            const roomTotal = room.price_per_night * nights;
            const total = roomTotal + extra;

            document.getElementById('b-total-input').value = total;
            detailEl.innerHTML = `<strong>รายละเอียด:</strong> ${room.price_per_night.toLocaleString()} x ${nights} คืน ${extra > 0 ? '+ ค่าเสริม ' + extra.toLocaleString() : ''} = ฿${total.toLocaleString()}`;
            UI.calculateSplit();
        }
    } else {
        detailEl.innerText = "รายละเอียด: -";
    }
}

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

        // Evnet for Booking Calculation
        ['b-in', 'b-out', 'b-room', 'b-extra'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('change', calculateTotal);
        });

        // Form Submit
        const form = document.getElementById('formBooking');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const booking = {
                    booking_id: 'BK-' + Date.now().toString().slice(-6),
                    guest_id: 'G-' + Date.now().toString().slice(-4),
                    room_id: parseInt(document.getElementById('b-room').value),
                    check_in_date: document.getElementById('b-in').value,
                    nights: Math.max(1, (new Date(document.getElementById('b-out').value) - new Date(document.getElementById('b-in').value)) / (1000 * 60 * 60 * 24)),
                    total_amount: parseFloat(document.getElementById('b-total-input').value),
                    channel: document.getElementById('b-channel').value,
                    payment_method: document.getElementById('b-payment').value
                };

                const guest = {
                    guest_id: booking.guest_id,
                    first_name: document.getElementById('searchName').value,
                    phone_number: document.getElementById('custPhone').value,
                    address: document.getElementById('custAddress').value,
                    tax_id: document.getElementById('custAddress').value.match(/\d{13}/) ? document.getElementById('custAddress').value.match(/\d{13}/)[0] : ''
                };

                // Basic Validation
                if (!booking.room_id || !booking.total_amount) {
                    alert("กรุณาระบุข้อมูลห้องพักและราคาให้ครบถ้วน");
                    return;
                }
                if (new Date(booking.check_in_date) > new Date()) {
                    // console.warn("Check-in in the future is allowed for booking.");
                }

                DB.state.bookings.push(booking);
                DB.state.guests.push(guest);
                DB.state.payments.push({
                    payment_id: 'P-' + booking.booking_id,
                    booking_id: booking.booking_id,
                    amount: booking.total_amount,
                    payment_date: booking.check_in_date,
                    payment_method: booking.payment_method
                });

                DB.saveAll();
                alert("บันทึกสำเร็จ! ข้อมูลถูกสำรองและกำลังซิงค์ Cloud...");
                await CloudEngine.sync();
                form.reset();
                document.getElementById('calcDetail').innerText = "รายละเอียด: -";
                UI.renderDashboard();
            });
        }

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
