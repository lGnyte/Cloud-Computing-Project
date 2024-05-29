'use client';

import { UserContext } from "@/lib/context";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { useContext } from "react";

export default function Header() {
  const { user, usertype } = useContext(UserContext);

  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <Link href={"/"} className="text-2xl font-bold">Trek Trill</Link>
      <nav>
        <ul className="flex space-x-4">
          <li><Link href="/">Home</Link></li>
          {usertype == "host" ? <li><Link href="/my_accommodations">My Accommodations</Link></li> : null }
          <li><Link href="/about">About Us</Link></li>
          {Object.keys(user).length > 0 ?
            <>
              {usertype === "guest" && <li><Link href={"/checkout"}>Cart</Link></li>}
              <li className="cursor-pointer" onClick={() => auth.signOut()}>Sign out</li>
            </>
            :
            <li><Link href="/login">Sign in</Link></li>
          }
        </ul>
      </nav>
    </header>
  )
}
