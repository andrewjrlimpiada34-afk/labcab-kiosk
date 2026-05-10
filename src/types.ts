export interface UserProfile {
  id?: string;
  fullname: string;
  studentID: string;
  course: string;
  yearLevel: string;
  email: string;
  contactNumber: string;
  qrCode: string;
  pin: string;
  createdAt: any;
}

export interface InventoryItem {
  id: string;
  apparatusName: string;
  availableQuantity: number;
  totalQuantity: number;
  description?: string;
  imageUrl?: string;
}

export interface BorrowedItem {
  itemId: string;
  name: string;
  quantity: number;
}

export interface Transaction {
  id?: string;
  borrowerID: string;
  borrowerName: string;
  borrowedItems: BorrowedItem[];
  borrowTime: any;
  returnDeadline: any;
  status: 'active' | 'returned';
  actualReturnTime?: any;
}

export interface AdminUser {
  id?: string;
  email: string;
  role: 'admin' | 'superadmin';
}

export type View = 'home' | 'register' | 'borrow-auth' | 'borrow-select' | 'borrow-review' | 'borrow-time' | 'borrow-confirm' | 'return-auth' | 'return-active' | 'return-confirm' | 'admin-login' | 'admin-dashboard' | 'success';

export interface SuccessState {
  title: string;
  message: string;
  nextView: View;
}
