'use client';

import { signInWithGoogle } from "@/lib/auth";
import { UserContext } from "../../lib/context";
import { auth } from "@/lib/firebase";
import { useContext } from "react";
import Link from "next/link";

export default function Login() {
  const { user, username } = useContext(UserContext);

  return (
    <main className="p-10">
      {Object.keys(user).length ? 
        username ?
          <div>
            <h1>Welcome back, {username}!</h1>
            <button onClick={() => auth.signOut()}>Sign out</button>
            <br />
            <Link href={"/"}>
              Go home
            </Link>
          </div>
          :
          <div>
            <h1>Set up your username</h1>
            <form>
              <input type="text" placeholder="Username" />
              <button type="submit">Set Username</button>
            </form>
          </div>
        :
        <div>
          <h1 className="font-bold text-2xl">Sign in</h1>
          <button onClick={signInWithGoogle} className="bg-gray-300 px-2 py-1 rounded-md">Sign in with Google</button>
        </div>
      }
    </main>
  );
}
