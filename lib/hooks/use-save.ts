"use client";

import { useEffect } from "react";

export function useSave(save: () => void) {
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        save();
      }
    };
    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [save]);
}
