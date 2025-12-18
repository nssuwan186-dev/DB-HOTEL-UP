/**
 * Hotel Management System - Pro Edition
 * Hybrid Cloud Architecture (LocalStorage + Google Apps Script)
 */

// ===== Configuration & Constants =====
const DB_VERSION = '2.0';
const STORAGE_KEYS = {
    ROOMS: 'hotel_db_rooms',
    BOOKINGS: 'hotel_db_bookings',
    CUSTOMERS: 'hotel_db_customers',
    TRANSACTIONS: 'hotel_db_transactions',
    CONFIG: 'hotel_db_config',
    GAS_URL: 'hotel_gas_url'
};

// ===== Cloud Sync Shim (Bridge for GitHub Pages) =====
const CloudSync = {
    get url() { return localStorage.getItem(STORAGE_KEYS.GAS_URL) || ''; },
    setURL(val) { localStorage.setItem(STORAGE_KEYS.GAS_URL, val); },

    async request(action, data = {}) {
        if (!this.url) return { error: 'No URL connected' };
        try {
            const response = await fetch(this.url, {
                method: 'POST',
                mode: 'no-cors', // Apps Script requires no-cors sometimes, or use redirect handling
                body: JSON.stringify({ action, data })
            });
            // Note: because of no-cors, we can't read response body directly. 
            // In a real production environment, you'd use a proxy or JSONP.
            // For this demo, we assume success if no error is thrown.
            return { status: 'success' };
        } catch (e) {
            console.error('CloudSync Error:', e);
            return { error: 'Connection failed' };
        }
    }
};

// Simulation of google.script.run for the user's new template logic
window.google = {
    script: {
        run: {
            withSuccessHandler: function (handler) {
                this.handler = handler;
                return this;
            },
            getDashboardData: function () {
                // Simulate or Call API
                setTimeout(() => {
                    this.handler({
                        stats: { income: "45,000", expense: "12,400", available: 32, occupied: 18 },
                        chart: { categories: ['11/12', '12/12', '13/12', '14/12', '15/12', '16/12', '17/12'], seriesIncome: [1200, 3000, 4500, 2800, 5000, 4200, 5500], seriesExpense: [500, 1200, 800, 1500, 900, 2000, 1100] },
                        roomStatus: { occupied: 18, available: 32 }
                    });
                }, 500);
            },
            getRoomData: function () {
                setTimeout(() => this.handler(rooms.map(r => [r.number, r.building, r.floor, r.type, r.price])), 500);
            },
            getCustomerList: function () {
                setTimeout(() => this.handler(customers), 200);
            },
            getRoomStatusByDate: function (date) {
                setTimeout(() => this.handler(rooms.map(r => ({ room: r.number, type: r.type, price: r.price, status: r.status, customer: '' }))), 300);
            }
        }
    }
};

// ===== Master Data Persistence =====
const DB = {
    init() {
        rooms = this.load(STORAGE_KEYS.ROOMS) || [];
        bookings = this.load(STORAGE_KEYS.BOOKINGS) || [];
        customers = this.load(STORAGE_KEYS.CUSTOMERS) || [];
        transactions = this.load(STORAGE_KEYS.TRANSACTIONS) || [];
        this.saveAll();
    },
    load(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },
    saveAll() {
        localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
        localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    },
    clearData() {
        if (confirm('ต้องการล้างข้อมูลทั้งหมดใช่หรือไม่?')) {
            localStorage.clear();
            window.location.reload();
        }
    }
};

// Global data holders
let rooms = [], bookings = [], customers = [], transactions = [];

// ===== Core Logic & Navigation =====
document.addEventListener('DOMContentLoaded', () => {
    DB.init();
    initNavigation();
    loadDashboard();
    initForms();

    // UI Initial State
    document.getElementById('gas-url-input').value = CloudSync.url;
    document.getElementById('loading').style.display = 'none';
});

function initNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const pageId = item.dataset.page;

            // UI Toggle
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
            const activePage = document.getElementById(pageId + 'Page');
            if (activePage) activePage.classList.add('active');

            document.getElementById('pageTitle').innerText = item.querySelector('span').innerText;

            // Mobile Sidebar Auto-hide
            if (window.innerWidth < 768) document.getElementById('sidebar').classList.remove('show');

            // Route logic
            if (pageId === 'dashboard') loadDashboard();
            if (pageId === 'rooms') renderRoomsOverview();
            if (pageId === 'customers') renderCustomerList();
            if (pageId === 'accounting') renderAccounting();
        });
    });

    document.getElementById('mobile-toggle')?.addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('show');
    });
}

// ===== Modules =====

function loadDashboard() {
    google.script.run.withSuccessHandler(data => {
        document.getElementById('d-income').innerText = "฿" + data.stats.income;
        document.getElementById('d-expense').innerText = "฿" + data.stats.expense;
        document.getElementById('d-avail').innerText = data.stats.available;
        document.getElementById('d-occupied').innerText = data.stats.occupied;

        // Income Chart
        new ApexCharts(document.querySelector("#chartIncome"), {
            series: [
                { name: 'รายรับ', data: data.chart.seriesIncome },
                { name: 'รายจ่าย', data: data.chart.seriesExpense }
            ],
            chart: { type: 'area', height: 320, toolbar: { show: false }, fontFamily: 'Sarabun' },
            colors: ['#3b82f6', '#ef4444'],
            dataLabels: { enabled: false },
            stroke: { curve: 'smooth', width: 3 },
            fill: { type: 'gradient', gradient: { opacityFrom: 0.6, opacityTo: 0.1 } },
            xaxis: { categories: data.chart.categories }
        }).render();

        // Room Status Chart
        new ApexCharts(document.querySelector("#chartRoom"), {
            series: [data.roomStatus.occupied, data.roomStatus.available],
            labels: ['ไม่ว่าง', 'ว่าง'],
            chart: { type: 'donut', fontFamily: 'Sarabun' },
            colors: ['#ef4444', '#22c55e'],
            legend: { position: 'bottom' }
        }).render();
    }).getDashboardData();
}

function renderRoomsOverview() {
    const grid = document.getElementById('roomsGrid');
    grid.innerHTML = rooms.map(room => `
        <div class="room-card ${room.status}">
            <div class="number">${room.number}</div>
            <div class="type">${room.type}</div>
            <div class="mt-2 fw-bold">฿${room.price}</div>
            <div class="small mt-1 text-muted">${room.building} | ชั้น ${room.floor}</div>
        </div>
    `).join('');
}

function renderCustomerList() {
    const tbody = document.getElementById('custTableBody');
    const searchTerm = document.getElementById('custSearchInput').value.toLowerCase();

    tbody.innerHTML = customers
        .filter(c => c.name.toLowerCase().includes(searchTerm) || c.phone.includes(searchTerm))
        .map(c => `
            <tr>
                <td class="fw-bold">${c.name}</td>
                <td>${c.phone}</td>
                <td><code class="text-primary">${c.customerId}</code></td>
                <td><span class="badge ${c.status === 'vip' ? 'badge-warning' : 'badge-success'}">${c.status}</span></td>
                <td><button class="btn btn-sm btn-outline-info">ดูประวัติ</button></td>
            </tr>
        `).join('');
}

function renderAccounting() {
    const tbody = document.getElementById('transactionsTableBody');
    tbody.innerHTML = transactions.map(t => `
        <tr>
            <td>${t.date}</td>
            <td class="fw-bold">${t.name}</td>
            <td>${t.room}</td>
            <td class="text-danger">${t.expense ? '-' + t.expense : '-'}</td>
            <td class="text-success">${t.income ? '+' + t.income : '-'}</td>
            <td class="fw-bold">${t.balance}</td>
            <td>${t.deposit || '-'}</td>
            <td>${t.paymentMethod}</td>
        </tr>
    `).join('');

    // Update Summaries
    const income = transactions.reduce((s, x) => s + (Number(x.income) || 0), 0);
    const expense = transactions.reduce((s, x) => s + (Number(x.expense) || 0), 0);
    document.getElementById('totalIncome').innerText = income.toLocaleString();
    document.getElementById('totalExpense').innerText = expense.toLocaleString();
    document.getElementById('currentBalance').innerText = (income - expense).toLocaleString();
}

function initForms() {
    // Form handlers and input masks...
    document.getElementById('importCSVBtn')?.addEventListener('click', () => {
        document.getElementById('csvFileInput').click();
    });
}

window.saveCloudSettings = function () {
    const url = document.getElementById('gas-url-input').value;
    CloudSync.setURL(url);
    alert('บันทึกการเชื่อมต่อเรียบร้อยแล้ว!');
    location.reload();
};

// Helper: formatDate
function formatDate(d) {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('th-TH');
}
