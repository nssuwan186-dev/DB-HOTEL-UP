
import csv
import json

thai_months = {
    'ม.ค.': '01', 'ก.พ.': '02', 'มี.ค.': '03', 'เม.ย.': '04',
    'พ.ค.': '05', 'มิ.ย.': '06', 'ก.ค.': '07', 'ส.ค.': '08',
    'ก.ย.': '09', 'ต.ค.': '10', 'พ.ย.': '11', 'ธ.ค.': '12'
}

def convert_date(thai_date):
    if not thai_date or thai_date == '-': return ''
    parts = thai_date.split()
    if len(parts) == 3:
        d = parts[0].zfill(2)
        m = thai_months.get(parts[1], '01')
        y = '20' + parts[2]
        return f"{y}-{m}-{d}"
    return thai_date

rooms = []
with open(r'C:\Users\Hotel\Downloads\DB-Hotel-FullSystem - 1-2 ห้อง.csv', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for i, row in enumerate(reader):
        price_str = row['ค่าห้องต่อคืน']
        price = 0
        note = ''
        if '/เดือน' in price_str:
            try: price = int(price_str.split('/')[0].replace(',',''))
            except: price = 0
            note = 'รายเดือน'
        else:
            try: price = int(price_str.replace(',',''))
            except: price = 0
        
        rooms.append({
            'room_id': i + 1,
            'room_number': row['ห้อง'],
            'building': row['ตึก'],
            'floor': int(row['ชั้น']) if row['ชั้น'].isdigit() else 0,
            'room_type': row['ประเภทห้อง'],
            'price_per_night': price,
            'room_status': 'Available' if not row['สถานะ'] else row['สถานะ'],
            'note': note
        })

guests = []
with open(r'C:\Users\Hotel\Downloads\DB-Hotel-FullSystem - 2-1 ลูกค้า (1).csv', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        guests.append({
            'guest_id': row['id ลูกค้า'],
            'first_name': row['ชื่อลูกค้า'],
            'last_name': '',
            'phone_number': row['เบอร์โทร'],
            'guest_type': 'Individual',
            'address': row['ที่อยู่'],
            'tax_id': row['เลขบัตร ปชช']
        })

room_map = {r['room_number']: r['room_id'] for r in rooms}

bookings = []
payments = []
with open(r'C:\Users\Hotel\Downloads\DB-Hotel-FullSystem - 2-2 จองห้อง (1).csv', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        gid_raw = row['id ลูกค้า']
        gid = gid_raw.split()[0] if gid_raw else ''
        
        try: total = int(row['ยอดรวมสุทธิ'].replace(',',''))
        except: total = 0
        
        try: nights = int(row['จำนวนคืน'])
        except: nights = 0

        bid = row['Booking No.']
        check_in = convert_date(row['Check In'])

        bookings.append({
            'booking_id': bid,
            'guest_id': gid,
            'room_id': room_map.get(row['เบอร์ห้อง'], 0),
            'check_in_date': check_in,
            'check_out_date': convert_date(row['Check Out']),
            'nights': nights,
            'total_amount': total,
            'booking_source': row['ช่องทาง'],
            'status': row['สถานะ']
        })

        if total > 0 and check_in:
            payments.append({
                'payment_id': f"PAY-{bid}",
                'booking_id': bid,
                'amount': total,
                'payment_date': check_in,
                'payment_method': 'เงินสด' # Default assume cash for old records
            })

with open('data.js', 'w', encoding='utf-8') as f:
    f.write("window.IMPORTED_ROOMS = " + json.dumps(rooms, ensure_ascii=False) + ";\n")
    f.write("window.IMPORTED_GUESTS = " + json.dumps(guests, ensure_ascii=False) + ";\n")
    f.write("window.IMPORTED_BOOKINGS = " + json.dumps(bookings, ensure_ascii=False) + ";\n")
    f.write("window.IMPORTED_PAYMENTS = " + json.dumps(payments, ensure_ascii=False) + ";\n")
