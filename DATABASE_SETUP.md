# Database Configuration

## MongoDB Atlas Setup (Recommended - Free)

### Step 1: Create MongoDB Atlas Account
1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up (free account)
3. Create a project

### Step 2: Create a Cluster
1. Click "Create" button
2. Select "M0" (Free tier)
3. Choose your region (closest to you)
4. Wait for cluster to be created (~5 min)

### Step 3: Get Connection String
1. Click "Connect" button
2. Select "Connect your application"
3. Copy the connection string
4. Replace `<username>` and `<password>` with your credentials
5. Replace `<dbname>` with database name (e.g., "smart-store")

### Step 4: Create `.env.local` file

Create a file named `.env.local` in your project root with:

```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority
```

**Example:**
```
MONGODB_URI=mongodb+srv://admin:password123@cluster0.abc123.mongodb.net/smart-store?retryWrites=true&w=majority
```

### Step 5: Save and You're Done!

Now your database is ready to use! 🎉

---

## For Local Development (Alternative)

If you want to use local MongoDB:

1. Install MongoDB Community Edition from: https://www.mongodb.com/try/download/community
2. Set `MONGODB_URI=mongodb://localhost:27017/smart-store`

---

## Database Structure

The system will have these collections:

### `items` Collection
```json
{
  "_id": ObjectId,
  "name": "HP Mouse",
  "category": "Electronics",
  "floor": "Ground Floor",
  "aisle": "A3",
  "rack": "R2",
  "shelf": "S4",
  "quantity": 25,
  "minStockLevel": 10,
  "description": "Wireless USB Mouse",
  "createdAt": DateTime,
  "updatedAt": DateTime,
  "createdBy": "admin"
}
```

### `users` Collection
```json
{
  "_id": ObjectId,
  "username": "admin",
  "password": "hashed_password",
  "role": "admin",
  "name": "Store Owner",
  "createdAt": DateTime
}
```

---

## Important Notes

- 🔒 Keep your `.env.local` **private** - never commit to GitHub
- ✅ `.env.local` is already in `.gitignore`
- 🔑 Use strong passwords for MongoDB Atlas
- 📝 Check `.env.example` for reference

---

**Setup complete! Your database is now connected to the application! 🚀**
