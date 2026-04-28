import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Transaction, Budget, Bill, MoneyFlow, UserProfile, OperationType } from '../types';
import { handleFirestoreError } from '../lib/utils';

const IS_GUEST_KEY = 'smartfinance_is_guest';
const GUEST_DATA_KEY = 'smartfinance_guest_data';

const getGuestData = () => {
  const data = localStorage.getItem(GUEST_DATA_KEY);
  return data ? JSON.parse(data) : { transactions: [], budgets: [], bills: [], moneyFlow: [], profile: null };
};

const saveGuestData = (data: any) => {
  localStorage.setItem(GUEST_DATA_KEY, JSON.stringify(data));
};

// Users
export const getOrCreateUser = async (user: any): Promise<UserProfile> => {
  if (!user) {
    // Guest Mode
    const data = getGuestData();
    if (data.profile) return data.profile;
    
    const guestProfile: UserProfile = {
      uid: 'guest',
      email: 'guest@example.com',
      displayName: 'Guest User',
      photoURL: '',
      currency: 'INR',
      theme: 'light',
      createdAt: new Date().toISOString(),
    };
    data.profile = guestProfile;
    saveGuestData(data);
    return guestProfile;
  }

  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }

  const newUser: UserProfile = {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || '',
    photoURL: user.photoURL || '',
    currency: 'INR',
    theme: 'light',
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(userRef, newUser);
    return newUser;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    throw error;
  }
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
  if (uid === 'guest') {
    const gd = getGuestData();
    gd.profile = { ...gd.profile, ...data };
    saveGuestData(gd);
    return;
  }
  const userRef = doc(db, 'users', uid);
  try {
    await updateDoc(userRef, data);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
  }
};

// Transactions
export const addTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
  if (transaction.userId === 'guest') {
    const gd = getGuestData();
    const newT = { ...transaction, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() };
    gd.transactions.push(newT);
    saveGuestData(gd);
    return;
  }
  try {
    await addDoc(collection(db, 'transactions'), {
      ...transaction,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'transactions');
  }
};

export const deleteTransaction = async (id: string) => {
  if (auth.currentUser?.uid === undefined) {
    const gd = getGuestData();
    gd.transactions = gd.transactions.filter((t: any) => t.id !== id);
    saveGuestData(gd);
    return;
  }
  try {
    await deleteDoc(doc(db, 'transactions', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `transactions/${id}`);
  }
};

// Budgets
export const setBudget = async (budget: Omit<Budget, 'id' | 'createdAt'>) => {
  if (budget.userId === 'guest') {
    const gd = getGuestData();
    const idx = gd.budgets.findIndex((b: any) => b.category === budget.category && b.month === budget.month);
    if (idx > -1) {
      gd.budgets[idx].amount = budget.amount;
    } else {
      gd.budgets.push({ ...budget, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() });
    }
    saveGuestData(gd);
    return;
  }
  const q = query(
    collection(db, 'budgets'), 
    where('userId', '==', budget.userId),
    where('category', '==', budget.category),
    where('month', '==', budget.month)
  );
  
  try {
    const existing = await getDocs(q);
    if (!existing.empty) {
      const budgetDoc = existing.docs[0];
      await updateDoc(doc(db, 'budgets', budgetDoc.id), { amount: budget.amount });
    } else {
      await addDoc(collection(db, 'budgets'), {
        ...budget,
        createdAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'budgets');
  }
};

// Bills
export const addBill = async (bill: Omit<Bill, 'id' | 'createdAt'>) => {
  if (bill.userId === 'guest') {
    const gd = getGuestData();
    gd.bills.push({ ...bill, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() });
    saveGuestData(gd);
    return;
  }
  try {
    await addDoc(collection(db, 'bills'), {
      ...bill,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'bills');
  }
};

export const updateBillStatus = async (id: string, status: 'paid' | 'unpaid' | 'pending') => {
  if (auth.currentUser?.uid === undefined) {
    const gd = getGuestData();
    const idx = gd.bills.findIndex((b: any) => b.id === id);
    if (idx > -1) gd.bills[idx].status = status;
    saveGuestData(gd);
    return;
  }
  try {
    await updateDoc(doc(db, 'bills', id), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `bills/${id}`);
  }
};

export const deleteBill = async (id: string) => {
  if (auth.currentUser?.uid === undefined) {
    const gd = getGuestData();
    gd.bills = gd.bills.filter((b: any) => b.id !== id);
    saveGuestData(gd);
    return;
  }
  try {
    await deleteDoc(doc(db, 'bills', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `bills/${id}`);
  }
};

// Money Flow
export const addMoneyFlow = async (flow: Omit<MoneyFlow, 'id' | 'createdAt'>) => {
  if (flow.userId === 'guest') {
    const gd = getGuestData();
    gd.moneyFlow.push({ ...flow, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() });
    saveGuestData(gd);
    return;
  }
  try {
    await addDoc(collection(db, 'moneyFlow'), {
      ...flow,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'moneyFlow');
  }
};

export const updateMoneyFlowStatus = async (id: string, status: 'pending' | 'settled') => {
  if (auth.currentUser?.uid === undefined) {
    const gd = getGuestData();
    const idx = gd.moneyFlow.findIndex((f: any) => f.id === id);
    if (idx > -1) gd.moneyFlow[idx].status = status;
    saveGuestData(gd);
    return;
  }
  try {
    await updateDoc(doc(db, 'moneyFlow', id), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `moneyFlow/${id}`);
  }
};

export const deleteMoneyFlow = async (id: string) => {
  if (auth.currentUser?.uid === undefined) {
    const gd = getGuestData();
    gd.moneyFlow = gd.moneyFlow.filter((f: any) => f.id !== id);
    saveGuestData(gd);
    return;
  }
  try {
    await deleteDoc(doc(db, 'moneyFlow', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `moneyFlow/${id}`);
  }
};
