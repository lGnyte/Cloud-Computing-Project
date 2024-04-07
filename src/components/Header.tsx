'use client';

import { UserContext } from "@/lib/context";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { useContext } from "react";

export default function Header() {
  const { username } = useContext(UserContext);

  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1 className="text-2xl font-bold">[CC] Turismo</h1>
      <nav>
        <ul className="flex space-x-4">
          <li><Link href="/">Home</Link></li>
          {username ?
            <li className="cursor-pointer" onClick={() => auth.signOut()}>Sign out</li>
            :
            <li><Link href="/login">Sign in</Link></li>
          }
        </ul>
      </nav>
    </header>
  )
}