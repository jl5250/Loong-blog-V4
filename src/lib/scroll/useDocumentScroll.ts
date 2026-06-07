"use client";

import { useEffect, useState } from "react";

export function useDocumentScroll(selector: (scrollY: number) => boolean, initial = false) {
  const [value, setValue] = useState(initial);

  useEffect(() => {
    const onScroll = () => setValue(selector(window.scrollY));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [selector]);

  return value;
}
