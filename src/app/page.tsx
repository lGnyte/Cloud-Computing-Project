export default function Home() {
  return (
    <main className="p-10">
      <p>asdasd</p>
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