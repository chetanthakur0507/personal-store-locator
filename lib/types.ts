// Database Types

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
  name: string;
  createdAt: Date;
}

export interface Item {
  id: string;
  name: string;
  category: string;
  floor: string;
  aisle: string;
  rack: string;
  shelf: string;
  quantity: number;
  minStockLevel?: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface Location {
  id: string;
  floor: string;
  aisle: string;
  rack: string;
  shelf: string;
  capacity?: number;
}

export interface SearchHistory {
  id: string;
  itemName: string;
  searchedBy: string;
  timestamp: Date;
}
