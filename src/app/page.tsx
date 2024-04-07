'use client';

import Link from "next/link";
import { UserContext } from "../lib/context";
import { useContext } from "react";

export default function Home() {
  const { user, username } = useContext(UserContext);

  return (
    
    <main className="p-10">
      <h1 className="text-2xl font-bold">{username ?
        `Welcome back, ${username}!`
        :
        `No user`
      }</h1>
      <Link href={'/login'} className="text-blue-500">
        Login
      </Link>
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