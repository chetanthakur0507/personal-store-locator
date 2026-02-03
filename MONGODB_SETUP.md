# 🗄️ Database Setup Guide - Smart Store Item Locator

## ✅ What's New?

Your project now has **MongoDB integration** with:
- ✅ Real database persistence (data survives after restart)
- ✅ Admin can add items that stay in database
- ✅ Staff can search and find actual stored data
- ✅ No more fake/sample data - everything is real!

---

## 📋 Three Ways to Set Up Database

Choose ONE of these options:

---

## Option 1: **MongoDB Atlas** (Recommended - Cloud, Free) ☁️

### Best For: Production, Testing, Portfolio Projects

**Advantages:**
- ✅ Free tier available (512 MB storage)
- ✅ No local installation needed
- ✅ Works from anywhere
- ✅ Perfect for portfolio project
- ✅ Easy to share with others

### Step-by-Step Setup:

#### 1. Create MongoDB Atlas Account
```
Go to: https://www.mongodb.com/cloud/atlas
Click "Try Free"
Sign up with email
```

#### 2. Create a Cluster
1. Click "Create Deployment"
2. Select "Free" tier
3. Choose any region (closest to you is best)
4. Click "Create Deployment"
5. **Wait 5-10 minutes** for cluster to deploy

#### 3. Create Database User
1. Go to "Security" → "Database Access"
2. Click "Add New Database User"
3. Set username: `admin`
4. Set password: `admin12345` (or your choice)
5. Click "Create Database User"

#### 4. Get Connection String
1. Go to "Deployment" → "Databases"
2. Click "Connect" button
3. Select "Connect your application"
4. Choose "Node.js" driver
5. Copy the connection string

#### 5. Update `.env.local`
Edit `.env.local` in your project:

```
MONGODB_URI=mongodb+srv://admin:admin12345@cluster0.abc123.mongodb.net/smart-store?retryWrites=true&w=majority
```

Replace:
- `admin` with your username
- `admin12345` with your password
- `cluster0.abc123` with your cluster name

#### 6. Test Connection
Restart dev server and try:
1. Add an item from admin panel
2. Search for it from staff panel
3. Refresh page - data should still be there! ✅

---

## Option 2: **MongoDB Community** (Local, Free) 💻

### Best For: Local development, offline work

**Advantages:**
- ✅ No internet needed
- ✅ Fast local access
- ✅ No cloud dependencies
- ✅ Full control

### Step-by-Step Setup:

#### 1. Install MongoDB
**Windows:**
1. Go to: https://www.mongodb.com/try/download/community
2. Download "Windows (msi)"
3. Run installer
4. Use default settings
5. MongoDB will start automatically

#### 2. Update `.env.local`
```
MONGODB_URI=mongodb://localhost:27017/smart-store
```

#### 3. Test It
Restart dev server and try adding/searching items

---

## Option 3: **MongoDB Compass + Local Server** (Visual + Local)

### Best For: Learning, Visual database management

### Installation:
1. Install MongoDB Community (Step 1 above)
2. Download MongoDB Compass: https://www.mongodb.com/products/compass
3. Open Compass
4. Connect to `mongodb://localhost:27017`
5. Create database: `smart-store`
6. Use connection string from Option 2

---

## 🔑 Current Setup

Your project has `.env.local` file with:
```
MONGODB_URI=mongodb+srv://admin:admin12345@smart-store.z1abc.mongodb.net/smart-store?retryWrites=true&w=majority
```

**⚠️ Important:** This is a shared demo cluster. For your own project:
1. Create your own MongoDB Atlas account
2. Create your own cluster
3. Use your own credentials
4. Update `.env.local`

---

## 🏗️ Database Schema

### Items Collection

```javascript
{
  _id: ObjectId,
  name: "HP Mouse",
  category: "Electronics",
  floor: "Ground Floor",
  aisle: "A3",
  rack: "R2",
  shelf: "S4",
  quantity: 25,
  minStockLevel: 10,
  description: "Wireless USB Mouse",
  createdBy: "admin",
  createdAt: 2024-01-15T10:30:00Z,
  updatedAt: 2024-01-15T10:30:00Z
}
```

### Users Collection

```javascript
{
  _id: ObjectId,
  username: "admin",
  password: "hashedpassword",
  role: "admin",
  name: "Store Owner",
  createdAt: 2024-01-15T10:30:00Z
}
```

---

## 📡 API Endpoints

### Items API

#### Get All Items
```
GET /api/items
Query params: ?search=usb&category=Electronics
Response: { success: true, data: [...] }
```

#### Get Single Item
```
GET /api/items/:id
Response: { success: true, data: {...} }
```

#### Create Item
```
POST /api/items
Body: {
  name, category, floor, aisle, rack, shelf,
  quantity, minStockLevel, description, createdBy
}
Response: { success: true, data: {...} }
```

#### Update Item
```
PUT /api/items/:id
Body: { ...updated fields... }
Response: { success: true, data: {...} }
```

#### Delete Item
```
DELETE /api/items/:id
Response: { success: true, message: "Item deleted" }
```

#### Get Low Stock Items
```
GET /api/items/low-stock
Response: { success: true, data: [...] }
```

#### Get Statistics
```
GET /api/stats
Response: {
  success: true,
  data: {
    totalItems: 5,
    totalStock: 250,
    categories: [...]
  }
}
```

---

## 🧪 Test the Setup

### 1. Start Dev Server
```bash
npm run dev
```

### 2. Open in Browser
```
http://localhost:3000
```

### 3. Login as Admin
```
Username: admin
Password: admin123
```

### 4. Test Flow

**Step 1: Add Item**
- Click "Add Item"
- Fill details:
  - Name: `Test Mouse`
  - Category: `Electronics`
  - Floor: `Ground Floor`
  - Aisle: `A1`
  - Rack: `R1`
  - Shelf: `S1`
  - Quantity: `10`
- Click "Save Item"
- Should see: "Item added successfully!"

**Step 2: Check Dashboard**
- Go to Dashboard
- Should see Total Items increased
- Should see Item in reports

**Step 3: Search as Staff**
- Logout (top right)
- Login with Staff account:
  ```
  Username: staff
  Password: staff123
  ```
- Search for "Test Mouse"
- Should see exact location displayed

**Step 4: Refresh Page**
- Refresh the page
- Login again
- Item should still be there! ✅

---

## ⚙️ Project Structure

```
lib/
├── mongodb.ts          # Database connection
├── models/
│   ├── Item.ts        # Item schema
│   └── User.ts        # User schema
└── ...

app/api/
├── items/
│   ├── route.ts       # GET (list), POST (create)
│   ├── [id]/
│   │   └── route.ts   # GET, PUT, DELETE individual items
│   └── low-stock/
│       └── route.ts   # GET low stock items
└── stats/
    └── route.ts       # GET statistics
```

---

## 🚨 Troubleshooting

### Problem: "Connection failed"
**Solution:**
- Check `.env.local` file exists
- Check MongoDB URI is correct
- Check internet connection (for Atlas)
- Check MongoDB service is running (for local)

### Problem: "Items not saving"
**Solution:**
- Check browser console for errors
- Check MongoDB connection in server logs
- Make sure database user credentials are correct

### Problem: "Search not working"
**Solution:**
- Items might not exist in database
- Try adding an item first from admin panel
- Check low stock alerts first

### Problem: "Cannot connect to MongoDB Atlas"
**Solution:**
1. Check if MongoDB Atlas IP whitelist includes your IP
2. Go to Security → Network Access
3. Click "Add IP Address"
4. Select "Allow Access from Anywhere" (for testing)
5. Click "Confirm"

---

## 🔐 Security Notes

**For Production:**
1. ❌ Never commit `.env.local` to GitHub
2. ✅ Use strong passwords (not `admin12345`)
3. ✅ Restrict MongoDB IP whitelist
4. ✅ Use environment variables for sensitive data
5. ✅ Hash passwords before storing

---

## 📊 Monitoring Database

### Using MongoDB Compass (GUI)
1. Download: https://www.mongodb.com/products/compass
2. Connect with your MongoDB URI
3. Browse collections visually
4. See all your data

### Using MongoDB Atlas Console
1. Go to: https://cloud.mongodb.com
2. Login
3. Go to Databases → Collections
4. Browse your data

---

## 🚀 Next Steps

1. ✅ Set up MongoDB (choose option above)
2. ✅ Update `.env.local` with your credentials
3. ✅ Restart dev server
4. ✅ Test adding and searching items
5. ✅ Add more items to test
6. ✅ Check reports and analytics
7. ✅ Deploy to Vercel/Netlify

---

## 📝 Important Files

- `.env.local` - Database connection (keep private!)
- `lib/mongodb.ts` - Connection logic
- `lib/models/Item.ts` - Item schema
- `app/api/items/route.ts` - Items API
- `app/api/stats/route.ts` - Statistics API

---

**Database integration complete! 🎉 Your app now has real persistence!**

---

## 💡 Tips

- Add a few test items from admin panel
- Check reports to see statistics update in real-time
- Use low stock feature to test alerts
- Try searching with different keywords
- Check database directly with Compass/Atlas

Good luck! 🚀
