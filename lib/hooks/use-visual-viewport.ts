"use client";

import { useEffect, useState } from "react";

export function useVisualViewport() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [offsetTop, setOffsetTop] = useState(0);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!window.visualViewport) {
      setIsSupported(false);
      return;
    }

    const handleResize = () => {
      const vv = window.visualViewport;
      if (!vv) return;

      // The keyboard height is the difference between the window height
      // and the visual viewport height.
      // We use Math.max(0) to ignore cases where the visual viewport
      // might be larger than innerHeight (rare) or small jitter.
      const heightDifference = window.innerHeight - vv.height;

      setKeyboardHeight(Math.max(0, heightDifference));
      setOffsetTop(vv.offsetTop);
    };

    window.visualViewport.addEventListener("resize", handleResize);
    window.visualViewport.addEventListener("scroll", handleResize);

    // Initial call
    handleResize();

    return () => {
      window.visualViewport?.removeEventListener("resize", handleResize);
      window.visualViewport?.removeEventListener("scroll", handleResize);
    };
  }, []);

  return { keyboardHeight, offsetTop, isSupported };
}
