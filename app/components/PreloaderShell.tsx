"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Preloader from "./Preloader";

export default function PreloaderShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  if (pathname.startsWith("/admin")) return <>{children}</>;

  useEffect(() => {
    if (sessionStorage.getItem("visited")) {
      setLoading(false);
    }
  }, []);

  const handleComplete = () => {
    setLoading(false);
    sessionStorage.setItem("visited", "true");
  };

  return (
    <>
      {loading && <Preloader onComplete={handleComplete} />}
      {children}
    </>
  );
}
