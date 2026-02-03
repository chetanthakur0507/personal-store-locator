# 🏪 Smart Store Item Locator

**Find items in your store instantly! 🔍**

A comprehensive inventory management system that helps shop owners and staff quickly locate items in large stores using search-based location mapping.

---

## 📋 Project Overview

### Problem Statement
- Large stores have thousands of items across multiple floors, aisles, racks, and shelves
- Staff struggle to exact itremember em locations
- Customers wait longer when items can't be found quickly
- Time wasted searching for inventory

### Solution
A smart web application where:
- **Admins** can manage complete inventory with precise locations
- **Staff** can instantly search and find any item's exact location
- Real-time stock tracking and low stock alerts
- Mobile-friendly interface for on-the-go access

---

## ✨ Features

### 👑 Admin Panel
- **Dashboard**: Overview of inventory statistics
  - Total items count
  - Low stock alerts
  - Category breakdown
  - Visual analytics

- **Item Management**:
  - ✅ Add new items with location details
  - ✏️ Edit existing items
  - 🗑️ Delete items
  - Search and filter items
  - Set minimum stock levels

- **Reports & Analytics**:
  - Low stock alerts
  - Category-wise breakdown
  - Complete inventory overview
  - Stock status tracking

### 👤 User Panel (Staff)
- **Instant Search**: Find items by name or category
- **Precise Location**: Shows floor, aisle, rack, and shelf
- **Stock Status**: Real-time quantity and availability
- **Mobile Optimized**: Easy to use on shop floor

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

1. **Clone/Open the project**
   ```bash
   cd smart-store-item-locator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

---

## 🔐 Demo Accounts

### Admin Account
- **Username**: `admin`
- **Password**: `admin123`
- **Access**: Full control - Add/Edit/Delete items, View reports

### Staff Account
- **Username**: `staff`
- **Password**: `staff123`
- **Access**: Search items only (Read-only)

---

## 💻 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router |
| **TypeScript** | Type safety and better DX |
| **Tailwind CSS** | Modern, responsive styling |
| **Lucide React** | Beautiful icons |
| **LocalStorage** | Client-side data persistence |

---

## 📁 Project Structure

```
smart-store-item-locator/
├── app/
│   ├── page.tsx                  # Home/Redirect page
│   ├── login/
│   │   └── page.tsx             # Login page
│   ├── admin/
│   │   ├── dashboard/page.tsx   # Admin dashboard
│   │   ├── items/
│   │   │   ├── page.tsx         # Manage items
│   │   │   └── add/page.tsx     # Add new item
│   │   └── reports/page.tsx     # Reports & analytics
│   └── user/
│       └── search/page.tsx      # Staff search page
├── lib/
│   ├── types.ts                 # TypeScript interfaces
│   ├── data.ts                  # Sample data & functions
│   └── auth.ts                  # Authentication utilities
└── README.md
```

---

## 🎯 Key Functionalities

### 1. Authentication System
- Role-based access control (Admin/User)
- Secure login/logout
- Automatic routing based on role

### 2. Item Management (Admin)
```typescript
{
  name: "HP Mouse",
  category: "Electronics",
  floor: "Ground Floor",
  aisle: "A3",
  rack: "R2",
  shelf: "S4",
  quantity: 25,
  minStockLevel: 10
}
```

### 3. Smart Search (User/Staff)
- Real-time search by item name
- Category-based filtering
- Partial match support
- Instant location display

### 4. Stock Alerts
- Automatic low stock warnings
- Color-coded status indicators
- Quantity tracking

---

## 📱 Mobile Responsive

Fully optimized for:
- 📱 Mobile phones (Staff on shop floor)
- 💻 Tablets
- 🖥️ Desktop computers

---

## 🔄 Future Enhancements

- [ ] **Database Integration**: MongoDB/PostgreSQL
- [ ] **Barcode Scanning**: QR code support
- [ ] **Voice Search**: "USB cable kaha hai?"
- [ ] **Multiple Stores**: Multi-location support
- [ ] **Store Map**: Visual floor plan
- [ ] **Export Reports**: PDF/Excel export
- [ ] **User Management**: Add/remove staff accounts
- [ ] **Search History**: Track popular items
- [ ] **Real-time Updates**: WebSocket integration

---

## 📝 How to Use

### For Admin:
1. Login with admin credentials
2. Navigate to "Manage Items"
3. Add new items with location details
4. Set minimum stock levels
5. View reports and analytics
6. Monitor low stock alerts

### For Staff:
1. Login with staff credentials
2. Use search bar to find items
3. View exact location on screen
4. Navigate to: Floor → Aisle → Rack → Shelf
5. Check stock availability

---

## 🎓 Interview Talking Points

**"I built a Smart Inventory Locator system that helps shop owners quickly find where an item is stored inside a large store or warehouse using search-based location mapping."**

### Technical Highlights:
- Built with Next.js 16 (App Router) and TypeScript
- Implemented role-based authentication
- Created responsive UI with Tailwind CSS
- Real-time search with instant results
- Mobile-first design for shop floor usage
- Scalable architecture for database integration

### Problem-Solving:
- Addressed real-world retail inventory challenge
- Reduced item search time from minutes to seconds
- Improved customer service efficiency
- Prevented stock-outs with low stock alerts

---

## 🤝 Contributing

This is a portfolio/demo project. Feel free to:
- Fork the repository
- Add new features
- Improve existing functionality
- Submit pull requests

---

## 📄 License

MIT License - Free to use for personal/commercial projects

---

## 👨‍💻 Developer

Built as a portfolio project demonstrating:
- Full-stack development skills
- React/Next.js expertise
- TypeScript proficiency
- UI/UX design capabilities
- Problem-solving abilities

---

## 📞 Support

For questions or suggestions:
- Open an issue on GitHub
- Contact via email

---

**Made with ❤️ using Next.js & TypeScript**

🚀 **Ready for deployment on Vercel, Netlify, or any Node.js hosting!**
