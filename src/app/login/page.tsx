'use client';

import { signInWithGoogle } from "@/lib/auth";
import { UserContext } from "../../lib/context";
import { auth } from "@/lib/firebase";
import { useContext, useState } from "react";
import Link from "next/link";
import HostForm from './tabs/HostTab';
import GuestForm from './tabs/GuestTab';


export default function Login() {
  const { user, username, usertype  } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("guestTab");

  const handleTabGuest = () => {
    // update the state to tab1
    setActiveTab("guestTab");
  };
  
  const handleTabHost = () => {
    // update the state to tab1
    setActiveTab("hostTab");
  };

  return (
    <main className="p-10">
      {Object.keys(user).length ? 
        username ?
          <div>
            { usertype == "host" ? <h1 className="text-3xl font-bold mb-4">Welcome landlord, {username}!</h1> :
                <h1 className="text-3xl font-bold mb-4">Welcome special guest, {username}!</h1> }
            <button onClick={() => auth.signOut()} className="px-2 py-1 bg-gray-300 text-lg mb-2 rounded-md">Sign out</button>
            <br />
            <Link href={"/"} className="text-blue-500 text-lg">
              Go home
            </Link>
          </div>
          :
          
          <div className="flex justify-center content-center">
            <div>
            <h1 className="text-3xl font-bold mb-4 ">Set up your account</h1>
            <ul className="hidden text-sm font-medium text-center text-gray-500 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
                <li className="w-full focus-within:z-10" onClick={handleTabGuest}>
                    <label className={activeTab == "guestTab" ? "inline-block w-full p-4 text-gray-900 bg-gray-100 border-r border-gray-200 dark:border-gray-700 rounded-s-lg focus:ring-4 focus:ring-blue-300 active focus:outline-none dark:bg-gray-700 dark:text-white" : "inline-block w-full p-4 bg-white border-s-0 border-gray-200 dark:border-gray-700 rounded-s-lg hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"}>Guest</label>
                </li>
                <li className="w-full focus-within:z-10" onClick={handleTabHost}>
                    <label className={activeTab == "hostTab" ? "inline-block w-full p-4 text-gray-900 bg-gray-100 border-r border-gray-200 dark:border-gray-700 rounded-e-lg focus:ring-4 focus:ring-blue-300 active focus:outline-none dark:bg-gray-700 dark:text-white" :"inline-block w-full p-4 bg-white border-s-0 border-gray-200 dark:border-gray-700 rounded-e-lg hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"} >Host</label>
                </li>
            </ul>
              <div>
              {activeTab == "guestTab" ? <GuestForm /> : <HostForm /> }
              </div>
            </div>
          </div>
        :
        <div>
          <h1 className="font-bold text-3xl mb-4">Sign in</h1>
          <button onClick={signInWithGoogle} className="bg-gray-300 px-2 py-1 text-lg rounded-md">Sign in with Google</button>
        </div>
      }
    </main>
  );
}
