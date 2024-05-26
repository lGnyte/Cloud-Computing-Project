'use client';

import { UserContext } from "@/lib/context";
import { useContext, useEffect, useState } from "react";

export default function AuthCheck(props: { children: React.ReactNode, usertype?: string }) {
  const { user, usertype } = useContext(UserContext);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (Object.keys(user).length > 0) {
      setIsValid(true);
      if (props.usertype && usertype !== props.usertype) {
        setIsValid(false);
      }
    }
  }, [user, usertype]);

  return Object.keys(user).length ? isValid ?
      props.children
      :
      <div>You are not allowed to access this content</div>
    :
    <div>Loading...</div>;
}
