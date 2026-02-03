// In-Memory Database (Replace with MongoDB/PostgreSQL in production)
import { User, Item, Location } from './types';

// Default Admin Account
export const users: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123', // In production, use bcrypt hashing
    role: 'admin',
    name: 'Store Owner',
    createdAt: new Date(),
  },
  {
    id: '2',
    username: 'staff',
    password: 'staff123',
    role: 'user',
    name: 'Salesman',
    createdAt: new Date(),
  },
];

// Sample Items
export const items: Item[] = [
  {
    id: '1',
    name: 'HP Mouse',
    category: 'Electronics',
    floor: 'Ground Floor',
    aisle: 'A3',
    rack: 'R2',
    shelf: 'S4',
    quantity: 25,
    minStockLevel: 10,
    description: 'Wireless USB Mouse',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'admin',
  },
  {
    id: '2',
    name: 'USB Cable',
    category: 'Electronics',
    floor: 'Ground Floor',
    aisle: 'A3',
    rack: 'R2',
    shelf: 'S5',
    quantity: 50,
    minStockLevel: 20,
    description: 'Type-C USB Cable',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'admin',
  },
  {
    id: '3',
    name: 'Notebook A4',
    category: 'Stationery',
    floor: '1st Floor',
    aisle: 'B5',
    rack: 'R1',
    shelf: 'S2',
    quantity: 100,
    minStockLevel: 30,
    description: '200 pages ruled notebook',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'admin',
  },
  {
    id: '4',
    name: 'LED Bulb 9W',
    category: 'Electrical',
    floor: '1st Floor',
    aisle: 'C2',
    rack: 'R3',
    shelf: 'S1',
    quantity: 45,
    minStockLevel: 15,
    description: 'Energy saving LED bulb',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'admin',
  },
  {
    id: '5',
    name: 'Water Bottle',
    category: 'Home & Kitchen',
    floor: 'Ground Floor',
    aisle: 'D1',
    rack: 'R4',
    shelf: 'S3',
    quantity: 30,
    minStockLevel: 10,
    description: '1 Liter plastic water bottle',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'admin',
  },
];

// Locations
export const locations: Location[] = [
  { id: '1', floor: 'Ground Floor', aisle: 'A3', rack: 'R2', shelf: 'S4' },
  { id: '2', floor: 'Ground Floor', aisle: 'A3', rack: 'R2', shelf: 'S5' },
  { id: '3', floor: '1st Floor', aisle: 'B5', rack: 'R1', shelf: 'S2' },
  { id: '4', floor: '1st Floor', aisle: 'C2', rack: 'R3', shelf: 'S1' },
  { id: '5', floor: 'Ground Floor', aisle: 'D1', rack: 'R4', shelf: 'S3' },
];

// Helper functions
export function findUserByUsername(username: string): User | undefined {
  return users.find((u) => u.username === username);
}

export function authenticateUser(username: string, password: string): User | null {
  const user = users.find((u) => u.username === username && u.password === password);
  return user || null;
}

export function getAllItems(): Item[] {
  return items;
}

export function searchItems(query: string): Item[] {
  const lowerQuery = query.toLowerCase();
  return items.filter(
    (item) =>
      item.name.toLowerCase().includes(lowerQuery) ||
      item.category.toLowerCase().includes(lowerQuery) ||
      item.description?.toLowerCase().includes(lowerQuery)
  );
}

export function getItemById(id: string): Item | undefined {
  return items.find((item) => item.id === id);
}

export function getLowStockItems(): Item[] {
  return items.filter((item) => item.quantity <= (item.minStockLevel || 0));
}

export function getItemsByCategory(): Record<string, number> {
  return items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}
