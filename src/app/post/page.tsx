'use client';

import { signInWithGoogle } from "@/lib/auth";
import { UserContext } from "../../lib/context";
import { useContext } from "react";
import Link from "next/link";
import NewPostForm from "../components/NewPostForm";

export default function Post() {
  const { user, username } = useContext(UserContext);

  return (
    <main className="p-10">
      {Object.keys(user).length ? 
        username ?
          <div>
            <h1>Create a new Post</h1>
            <NewPostForm/>
          </div>
          :
          <div>
            <h1>Please set up the username!</h1>
            <Link href={"/login"}>
                Go username setup 
            </Link>
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
