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
  Timestamp,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Transaction, Budget, Bill, UserProfile, OperationType } from '../types';
import { handleFirestoreError } from '../lib/utils';

// Users
export const getOrCreateUser = async (user: any): Promise<UserProfile> => {
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
    currency: 'USD',
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
  const userRef = doc(db, 'users', uid);
  try {
    await updateDoc(userRef, data);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
  }
};

// Transactions
export const addTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
  try {
    await addDoc(collection(db, 'transactions'), {
      ...transaction,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'transactions');
  }
};

export const updateTransaction = async (id: string, data: Partial<Omit<Transaction, 'id'>>) => {
  try {
    await updateDoc(doc(db, 'transactions', id), data);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `transactions/${id}`);
  }
};

export const deleteTransaction = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'transactions', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `transactions/${id}`);
  }
};

// Budgets
export const setBudget = async (budget: Omit<Budget, 'id' | 'createdAt'>) => {
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
  try {
    await addDoc(collection(db, 'bills'), {
      ...bill,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'bills');
  }
};

export const updateBillStatus = async (id: string, status: 'paid' | 'unpaid') => {
  try {
    await updateDoc(doc(db, 'bills', id), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `bills/${id}`);
  }
};

export const deleteBill = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'bills', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `bills/${id}`);
  }
};
