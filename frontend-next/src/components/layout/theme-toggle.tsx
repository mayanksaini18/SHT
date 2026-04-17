"use client";

import { useTheme } from "next-themes";
import { useCallback, type MouseEvent } from "react";
import { flushSync } from "react-dom";
import { Button } from "@/components/ui/button";
import { Moon02Icon, Sun01Icon } from "hugeicons-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const newTheme = theme === "dark" ? "light" : "dark";

      if (
        !document.startViewTransition ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        setTheme(newTheme);
        return;
      }

      const x = e.clientX;
      const y = e.clientY;

      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = document.startViewTransition(() => {
        flushSync(() => {
          setTheme(newTheme);
        });
        document.documentElement.classList.toggle("dark", newTheme === "dark");
      });

      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 1500,
            easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      });
    },
    [theme, setTheme]
  );

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      <Sun01Icon className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon02Icon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
