'use client';

import { UserContext } from "@/lib/context";
import { db } from "@/lib/firebase";
import { doc, getDoc, writeBatch } from "firebase/firestore";
import { useContext, useState } from "react";
import toast from "react-hot-toast";

export default function GuestForm() {
  const [formValue, setFormValue] = useState('');
  const [isValid, setIsValid] = useState(false);

  const { user, username, usertype } = useContext(UserContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase();
    const regex = /^[0-0A-Za-z_]+$/;
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
    batch.set(userDoc, {username: formValue, usertype: "guest"});
    batch.set(usernameDoc, {uid: user.uid});

    await batch.commit();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <label htmlFor="username" className="text-center my-5 text-xl">Create Username</label>
      <br />
      <input type="text" name="username" id="username" className="px-2 py-1 bg-gray-300 m-5 rounded-md" value={formValue} onChange={handleChange} />
      <button type="submit" className="bg-gray-300 px-2 py-1 m-5 rounded-md">Submit</button>
    </form>
  )
}
