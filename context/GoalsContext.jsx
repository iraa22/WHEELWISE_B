import { addDoc, collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore"
import { createContext, useState } from "react"
import { db } from "../firebaseConfig"

export const GoalsContext = createContext()

export function GoalsProvider({ children }) {
  const [goals, setGoals] = useState([])

  async function fetchGoals() {
    const snapshot = await getDocs(collection(db, 'goals'));
    const goalsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setGoals(goalsList);
  }
 
  async function createGoal(goalData) {
    
    const goal = {
      name: goalData.name || '',
      progress: goalData.progress ?? 0,
      ...goalData
    };
    await addDoc(collection(db, 'goals'), goal);
  }

  async function deleteGoal(id) {
    await deleteDoc(doc(db, 'goals', id));
    await fetchGoals(); 
  }

  async function updateGoal(id, updatedData) {
    const goalRef = doc(db, 'goals', id);
    await updateDoc(goalRef, updatedData);
    await fetchGoals(); 
  }

  return (
    <GoalsContext.Provider
      value={{ goals, fetchGoals, createGoal, deleteGoal, updateGoal }}
    >
      {children}
    </GoalsContext.Provider>
  )
}
