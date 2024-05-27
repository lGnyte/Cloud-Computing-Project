'use client';

import Link from "next/link";
import { UserContext } from "../lib/context";
import { useContext } from "react";
import PostsFeed from "@/components/PostsFeed";

export default function Home() {
  const { username } = useContext(UserContext);

  return (
    <main className="p-10">
      {username ?
        <>
          <h1 className="text-3xl font-bold mb-3">Welcome back, {username}!</h1>
          <p className="text-xl mb-2">Start planning your next trip.</p>
          <Link href="/post" className="px-4 py-2 bg-gray-500 rounded-md text-lg text-white font-bold">Create a post</Link>
        </>
        :
        <>
          <h1 className="text-3xl font-bold">Welcome to Trek Trill!</h1>
          <p className="text-xl mb-2">Sign in to start planning your next trip!</p>
          <Link href="/login" className="px-4 py-2 bg-gray-800 hover:bg-gray-500 duration-200 rounded-md text-xl text-white font-bold">Sign in</Link>
        </>
      }
      <hr className="my-10" />
      <h2 className="text-2xl font-bold mb-6">Latest accommodations</h2>
      <PostsFeed />
    </main>
  );
}


/**
 * Orice ruta din app va fi un folder cu numele rutei si un fisier page.tsx
 * Exemplu: src/app/login/page.tsx
 * Fisierul trebuie sa exporte o functie default care returneaza elemente JSX
 * Layoutul este definit in src/app/layout.tsx
 * Daca vreti sa folositi un layout diferit pentru o anumita ruta, puteti crea un fisier layout.tsx in folderul rutei
 * Altfel, se va folosi cel mai apropiat layout pe care il gaseste in ierarhia de foldere
 */