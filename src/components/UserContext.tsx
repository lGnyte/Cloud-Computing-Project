'use client';

import { UserContext } from "@/lib/context";
import { useUserData } from "@/lib/hooks";

export default function Context(props : any) {
  const userData = useUserData();

  return (
    <UserContext.Provider value={userData}>
      {props.children}
    </UserContext.Provider>
  );
}