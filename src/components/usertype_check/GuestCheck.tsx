'use client';

import { UserContext } from "@/lib/context";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export default function GuestCheck(props: {children: React.ReactNode}) {
  const { user, usertype } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (Object.keys(user).length === 0){
      router.push('/');
    }
  }, [user, usertype]);

  return user && usertype == "guest" ? <>{props.children}</> : null;
}
