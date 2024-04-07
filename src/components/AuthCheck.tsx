'use client';

import { UserContext } from "@/lib/context";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export default function AuthCheck(props: {children: React.ReactNode}) {
  const { user } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (Object.keys(user).length === 0){
      router.push('/');
    }
  }, [user]);

  return user ? <>{props.children}</> : null;
}