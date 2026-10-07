# ระบบคำนวณและตรวจสอบมิเตอร์จานหมุน PEA
### PEA Induction Disc Meter Testing System (การไฟฟ้าส่วนภูมิภาค)

เว็บแอปพลิเคชันสำหรับคำนวณ ตรวจสอบ และวิเคราะห์ความคลาดเคลื่อน (% Error) ของมิเตอร์ไฟฟ้าแบบจานหมุน (Induction Watt-Hour Meter) ตามเกณฑ์มาตรฐานของการไฟฟ้าส่วนภูมิภาค (PEA Standard: ±2.00%) ใช้งานได้ทั้งบนคอมพิวเตอร์ แท็บเล็ต และสมาร์ตโฟนหน้างาน

---

## 🚀 วิธีการ Deploy และรันบน Vercel

โปรเจกต์นี้รองรับการ Deploy บน **Vercel** ได้โดยตรงแบบ 1-Click โดยมีการตั้งค่าไฟล์ `vercel.json` ไว้ให้เรียบร้อยแล้ว

### ขั้นตอนการ Deploy:

1. **เชื่อมต่อ GitHub / GitLab / Bitbucket กับ Vercel**
   - ไปที่ [vercel.com](https://vercel.com) และกด **Add New...** > **Project**
   - เลือก Repository ของโปรเจกต์นี้แล้วกด **Import**

2. **ตั้งค่า Build & Output Settings บน Vercel Dashboard**
   *(หากใช้ `vercel.json` ในโปรเจกต์ ระบบจะตั้งค่าให้อัตโนมัติ)*
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
   - **Node.js Version**: แนะนำเวอร์ชัน `18.x` หรือ `20.x` (ค่าเริ่มต้นของ Vercel)

3. **กด Deploy**
   - รอ Vercel ทำการ `npm install` และ `npm run build` ประมาณ 30-45 วินาที
   - เมื่อเสร็จแล้วจะได้ URL สำหรับใช้งานทันที (เช่น `https://your-project.vercel.app`)

---

## 💻 วิธีการรันบนเครื่องคอมพิวเตอร์ (Local Development)

### ข้อกำหนดเบื้องต้น
- [Node.js](https://nodejs.org/) เวอร์ชัน 18 ขึ้นไป
- npm หรือ yarn หรือ pnpm

### ขั้นตอนการรัน:

1. **ติดตั้ง Dependencies:**
   ```bash
   npm install
   ```

2. **เริ่มเซิร์ฟเวอร์สำหรับพัฒนา (Development Mode):**
   ```bash
   npm run dev
   ```
   เปิดเบราว์เซอร์ไปที่: `http://localhost:3000`

3. **ทดสอบ Build สำหรับ Production:**
   ```bash
   npm run build
   ```
   ไฟล์ผลลัพธ์จะถูกสร้างไว้ในโฟลเดอร์ `dist/`

4. **พรีวิวผลลัพธ์ Build:**
   ```bash
   npm run preview
   ```

---

## ⚡ คุณสมบัติและความสามารถของระบบ

1. **คำนวณความคลาดเคลื่อนมิเตอร์จานหมุน (PEA Standard ±2%)**:
   - คำนวณ $P_{\text{meter}} (\text{kW}) = \left(\frac{N \times 3600}{\text{Kh} \times t}\right) \times \text{Multiplier}$
   - คำนวณ $\% \text{Error} = \left(\frac{P_{\text{meter}} - P_{\text{ref}}}{P_{\text{ref}}}\right) \times 100$
   - แสดงสถานะชัดเจน: **ปกติ (ผ่านเกณฑ์ ±2%)**, **หมุนเร็ว (คิดไฟเกิน)**, หรือ **หมุนช้า (คิดไฟขาด)**

2. **ระบบมิเตอร์ 1 เฟส และ 3 เฟส 4 สาย**:
   - **1 เฟส 2 สาย (220V)**: ตัวคูณเป็น 1x (ต่อตรง) อัตโนมัติ สะอาดตา ใช้งานง่าย
   - **3 เฟส 4 สาย (380V)**: แสดงส่วน **ตัวคูณมิเตอร์ (Multiplier / CT)** ให้เลือก `1x`, `10x`, `20x`, `40x` หรือกรอกเอง

3. **โหลดอ้างอิง ($P_{\text{ref}}$) 2 รูปแบบ**:
   - **ระบุ kW โดยตรง**: อ่านจากคลิปออนเพาเวอร์มิเตอร์
   - **คำนวณจาก V, I, PF**: รองรับทั้ง 1 เฟส และ 3 เฟส (IA, IB, IC หรือเฉลี่ย)

4. **นาฬิกาจับเวลาในตัว (Precision Stopwatch & Disc Simulator)**:
   - แอนิเมชันจานหมุนอะลูมิเนียมพร้อมมาร์คอ้างอิง
   - ปุ่มกดบันทึกรอบ **(Lap)** เมื่อมาร์คผ่านขีด เพื่อหาค่าเฉลี่ยเวลาต่อรอบ
   - ปุ่ม **นำค่าไปใช้งาน** ถ่ายโอนรอบและเวลาเข้าฟอร์มทันที

5. **ระบบออกใบรายงานและส่งผลเข้า LINE**:
   - พรีวิวใบรายงานการตรวจสอบภาคสนาม (PEA Inspection Work Order)
   - ปุ่ม **คัดลอกส่ง LINE** จัดฟอร์แมตพร้อมส่งเข้ากลุ่มงาน
   - ปุ่ม **พิมพ์ / บันทึก PDF** สำหรับแนบใบสั่งงาน

6. **ประวัติการทดสอบ (History Log)**:
   - บันทึกผลอัตโนมัติในเบราว์เซอร์ (Local Storage)
   - โหลดข้อมูลเก่ากลับมาคำนวณซ้ำได้
   - ส่งออกไฟล์ **CSV สำหรับ Excel** (รองรับภาษาไทย UTF-8 BOM)

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```text
├── index.html                   # HTML entry point และ Google Fonts
├── package.json                 # Dependencies และ Scripts
├── tsconfig.json                # การตั้งค่า TypeScript
├── vite.config.ts               # การตั้งค่า Vite และ Tailwind CSS
├── vercel.json                  # การตั้งค่า Vercel Deployment & SPA Rewrites
├── src/
│   ├── main.tsx                 # จุดเริ่มต้นของ React App
│   ├── App.tsx                  # คอมโพเนนต์หลักและ State Management
│   ├── index.css                # สไตล์ Tailwind และ Custom Animations
│   ├── types/
│   │   └── meter.ts             # Type Definitions ทางไฟฟ้า
│   ├── utils/
│   │   └── calculator.ts        # สูตรคำนวณ, ฟังก์ชันรายงาน, ส่งออก CSV
│   └── components/
│       ├── Header.tsx           # แถบหัวเว็บ PEA และทางลัด
│       ├── InputForm.tsx        # ฟอร์มกรอกข้อมูลและเลือก 1 เฟส / 3 เฟส
│       ├── ResultDisplay.tsx    # ผลการตรวจสอบและสถานะผ่าน/ไม่ผ่าน
│       ├── HistoryList.tsx      # ประวัติการทดสอบและปุ่มดาวน์โหลด CSV
│       ├── StopwatchModal.tsx   # นาฬิกาจับเวลาและ Lap Counter
│       ├── KnowledgeModal.tsx   # คู่มือมาตรฐานและสาเหตุความผิดปกติ
│       ├── MeterDiscAnimation.tsx # แอนิเมชันจำลองจานหมุนมิเตอร์
│       └── WorkOrderReportModal.tsx # ใบรายงานภาคสนามพร้อมพิมพ์ PDF/LINE
```

---

## 🛠️ Tech Stack
- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 8
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
