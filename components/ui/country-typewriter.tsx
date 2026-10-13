"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export type TypewriterItem = {
  text: string;
  className?: string;
  flagCode?: string;
};

export function CountryTypewriter({
  items,
  className,
  typingSpeed = 42,
  deletingSpeed = 24,
  pauseDuration = 520,
}: {
  items: TypewriterItem[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}) {
  const [itemIndex, setItemIndex] = useState(0);
  const [characterCount, setCharacterCount] = useState(items[0]?.text.length ?? 0);
  const [isDeleting, setIsDeleting] = useState(false);

  const item = items[itemIndex] ?? { text: "" };
  const visibleText = item.text.slice(0, characterCount);

  useEffect(() => {
    if (!items.length) return;

    let delay = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && characterCount === item.text.length) {
      delay = pauseDuration;
    } else if (isDeleting && characterCount === 0) {
      delay = 80;
    }

    const timeout = window.setTimeout(() => {
      if (!isDeleting && characterCount < item.text.length) {
        setCharacterCount((count) => count + 1);
        return;
      }

      if (!isDeleting) {
        setIsDeleting(true);
        return;
      }

      if (characterCount > 0) {
        setCharacterCount((count) => count - 1);
        return;
      }

      setItemIndex((index) => (index + 1) % items.length);
      setIsDeleting(false);
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [
    characterCount,
    deletingSpeed,
    isDeleting,
    item.text,
    items.length,
    pauseDuration,
    typingSpeed,
  ]);

  return (
    <span
      className={cn("inline-flex min-w-[7ch] items-baseline", className)}
      aria-live="polite"
      aria-atomic="true"
    >
      <span
        className={item.className}
        style={item.flagCode ? {
          backgroundImage: `url(https://flagcdn.com/w160/${item.flagCode}.png)`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
          WebkitTextFillColor: "transparent",
          WebkitTextStroke: "1.5px #000000",
          paintOrder: "stroke fill",
        } : {
          WebkitTextStroke: "1.5px #000000",
          paintOrder: "stroke fill",
        }}
      >
        {visibleText}
      </span>
      <span
        className="ml-0.5 inline-block h-[0.9em] w-[0.08em] animate-pulse bg-current align-middle"
        aria-hidden="true"
      />
    </span>
  );
}
