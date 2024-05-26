import { useContext, useState } from "react";
import { MdAccountCircle, MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { FaPersonCircleQuestion } from "react-icons/fa6";
import { doc, getDoc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserContext } from "@/lib/context";
import toast from "react-hot-toast";

export default function AccountForm() {
  const [username, setUsername] = useState('');
  const [accountType, setAccountType] = useState('guest');
  const { user } = useContext(UserContext);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //validate username
    const regex = /^[0-0A-Za-z_]+$/;
    if (username.length < 3 || !regex.test(username)) {
      toast.error('Invalid username (minimum 3 characters, alphanumeric only)')
      return;
    }

    const userDoc = doc(db, 'users', user.uid);
    const usernameDoc = doc(db, 'usernames', username);

    // check if username exists
    const usernameSnapshot = await getDoc(usernameDoc);
    if (usernameSnapshot.exists()) {
      toast.error('Username already exists');
      return;
    }

    // create user and username documents
    const batch = writeBatch(db);
    batch.set(userDoc, {username: username, usertype: accountType});
    batch.set(usernameDoc, {uid: user.uid});

    await batch.commit();
    toast.success('Account created successfully');
  }

  return (
    <form className="px-8 py-4 mx-auto mt-10 bg-gray-200 shadow-md select-none rounded-xl mb-4 w-96" onSubmit={handleSubmit}>
      <MdOutlineDriveFileRenameOutline className="mx-auto mb-6 w-28 h-28 text-gray-800" />
      <p className="text-lg mb-2">Enter your username below:</p>
      <label className="flex items-center w-full p-2 mb-2 border-gray-700 rounded-lg bg-white">
        <span>
          <MdAccountCircle className="w-8 h-8 pr-2 text-gray-500 border-r" />
        </span>
        <input type="text" name="username" id="username" className="flex-1 px-3 text-lg bg-transparent focus:outline-none" placeholder="Your Username" required value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <div className="flex items-center justify-between w-full p-2 mb-2 border-gray-700 rounded-lg bg-white">
        <span>
          <FaPersonCircleQuestion  className="w-8 h-8 pr-2 text-gray-500 border-r" />
        </span>
        <select name="accountType" id="accountType" className="flex-1 px-3 text-lg bg-transparent focus:outline-none" value={accountType} onChange={(e) => setAccountType(e.target.value)}>
          <option value="guest">Guest</option>
          <option value="host">Host</option>
        </select>
      </div>
      <button className="w-full py-2 mt-4 text-xl font-bold text-white duration-200 rounded-lg bg-gray-800 hover:bg-gray-600">Create account</button>
    </form>
  )
}