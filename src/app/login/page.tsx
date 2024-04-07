'use client';

import { signInWithGoogle } from "@/lib/auth";
import { UserContext } from "../../lib/context";
import { auth } from "@/lib/firebase";
import { useContext } from "react";
import Link from "next/link";
import UsernameForm from "./UsernameForm";

export default function Login() {
  const { user, username } = useContext(UserContext);

  return (
    <main className="p-10">
      {Object.keys(user).length ? 
        username ?
          <div>
            <h1 className="text-3xl font-bold mb-4">Welcome back, {username}!</h1>
            <button onClick={() => auth.signOut()} className="px-2 py-1 bg-gray-300 text-lg mb-2 rounded-md">Sign out</button>
            <br />
            <Link href={"/"} className="text-blue-500 text-lg">
              Go home
            </Link>
          </div>
          :
          <div>
            <h1 className="text-3xl font-bold mb-4">Set up your username</h1>
            <UsernameForm />
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
