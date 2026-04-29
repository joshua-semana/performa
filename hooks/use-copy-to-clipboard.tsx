"use client";

import { useState } from "react";

export function useCopyToClipboard(duration = 1500) {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, duration);
  };

  return {
    copied,
    copy,
  };
}
