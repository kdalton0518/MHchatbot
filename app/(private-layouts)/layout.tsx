"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useAuth } from "@/components/providers/auth";

export default function AuthCheck() {
  const { user, setUser } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          redirect("/auth/login");
        } else {
          const userData = await response.json();
          setUser(userData);
        }
      } catch {
        redirect("/auth/login");
      }
    };

    if (!user) {
      checkAuth();
    }
  }, [user, setUser]);

  return null;
}
