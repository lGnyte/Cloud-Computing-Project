'use client';

import { UserContext } from "../../lib/context";
import { useContext } from "react";
import Link from "next/link";
import LoginForm from "./LoginForm";
import AccountForm from "./AccountForm";


export default function Login() {
  const { user, username, usertype  } = useContext(UserContext);

  return (
    <main className="p-10">
      {Object.keys(user).length ? 
        username ?
          <div className="max-w-[500px] mx-auto text-center">
            { usertype == "host" ? <h1 className="text-3xl font-bold mb-4">Welcome landlord, {username}!</h1> :
                <h1 className="text-3xl font-bold mb-4">Welcome special guest, {username}!</h1> }
            <Link href={"/"} className="bg-gray-800 text-white font-bold px-4 py-2 rounded-md hover:bg-gray-600 duration-200 text-lg">
              Go to dashboard
            </Link>
          </div>
          :
          <div className="max-w-[500px] mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Set up your account</h1>
            <p className="text-xl mb-4">Create a username and specify your account type.</p>
            <AccountForm />
          </div>
        :
        <div className="max-w-[500px] mx-auto text-center">
          <h1 className="font-bold text-3xl mb-4">Sign In to Your Account</h1>
          <p className="text-xl mb-4">Log in to your existing account.</p>
          <LoginForm />
        </div>
      }
    </main>
  );
}
