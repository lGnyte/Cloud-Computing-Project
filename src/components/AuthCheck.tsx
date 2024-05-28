'use client';

import { UserContext } from "@/lib/context";
import { useContext, useEffect, useState } from "react";

export default function AuthCheck(props: { children: React.ReactNode, usertype?: string, notAllowedMessage?: string, loadingMessage?: string }) {
  const { user, usertype } = useContext(UserContext);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (Object.keys(user).length > 0) {
      setIsValid(true);
      if (props.usertype && usertype !== props.usertype) {
        setIsValid(false);
      }
    }
  }, [user, usertype, props.usertype]);

  return Object.keys(user).length ? isValid ?
      props.children
      :
      (props.notAllowedMessage ? <div>{props.notAllowedMessage}</div> : <div>You are not allowed to access this content</div>)
    :
    (props.loadingMessage ? <div>{props.loadingMessage}</div> : <div>Loading...</div>);
}
