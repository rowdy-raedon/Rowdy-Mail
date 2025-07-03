"use client";

import { useUser } from "@stackframe/stack";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function PageClient() {
  const router = useRouter();
  const user = useUser({ or: "redirect" });

  useEffect(() => {
    // Redirect directly to the user dashboard
    router.push('/dashboard/main');
  }, [router]);

  return null;
}
