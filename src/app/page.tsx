"use client"

import { redirect } from 'next/navigation';
import React from 'react';

export default function Home() {

    const fetchUserDetails = React.useCallback(async () => {
      try {
        let user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user.Id === undefined || user.Id === "" || user.Id === null || user.Token === undefined || user.Token === "" || user.Token === null || user.Session === undefined || user.Session === "" || user.Session === null) {
          notSignIn.current();
        }
      } catch (err) {
        notSignIn.current();
      }
  
    }, []);
  
    let notSignIn = React.useRef(() => { })
  
    notSignIn.current = () => {
      const currentUrl = window.location.pathname;
      if (currentUrl !== "/auth/sign-in") {
        Logout();
      }
      else redirect("/dashboard");
      return;
    }
  
    function Logout() {
      const host = window.location.hostname;
      // remove any subdomain
      localStorage.clear();
      sessionStorage.clear();
      redirect("/auth/sign-in");
    }
  
  
    React.useEffect(() => {
      fetchUserDetails();
    }, [fetchUserDetails]);
  

}
