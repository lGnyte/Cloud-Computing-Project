'use client';

import { UserContext } from "@/lib/context";
import { db } from "@/lib/firebase";
import { doc, getDoc, writeBatch } from "firebase/firestore";
import { useContext, useState } from "react";
import toast from "react-hot-toast";

export default function UsernameForm() {
  const [formValue, setFormValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase();
    const regex = /^\w*$/;
    if (val.length < 3) {
      setIsValid(false);
    }
    if (regex.test(val)) {
      setIsValid(true);
    }
    setFormValue(val);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userDoc = doc(db, 'users', user.uid);
    const usernameDoc = doc(db, 'usernames', formValue);

    // check if username exists
    const usernameSnapshot = await getDoc(usernameDoc);
    if (usernameSnapshot.exists()) {
      toast.error('Username already exists');
      return;
    }

    const batch = writeBatch(db);
    batch.set(userDoc, {username: formValue});
    batch.set(usernameDoc, {uid: user.uid});

    await batch.commit();
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">Create Username:</label>
      <br />
      <input type="text" name="username" id="username" className="px-2 py-1 mr-2 bg-gray-300 rounded-md" value={formValue} onChange={handleChange} />
      <button type="submit" className="bg-gray-300 px-2 py-1 rounded-md">Submit</button>
    </form>
  )
}