import { useEffect, useState } from "react";

import { useCopyToClipboard } from "usehooks-ts";

export const useCopyCommand = (command: string) => {
  const [, copy] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copy(command).catch(console.error);
    setCopied(true);
  };

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  return { copied, handleCopy };
};
