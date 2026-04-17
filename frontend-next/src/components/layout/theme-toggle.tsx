"use client";

import { useTheme } from "next-themes";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Moon02Icon, Sun01Icon } from "hugeicons-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = useCallback(() => {
    const newTheme = theme === "dark" ? "light" : "dark";

    if (
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setTheme(newTheme);
      return;
    }

    const transition = document.startViewTransition(() => {
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    });

    transition.finished.then(() => {
      setTheme(newTheme);
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            "polygon(100% -100%, 200% -200%, 300% -100%, 200% 0%)",
            "polygon(-150% 150%, 200% -200%, 300% -100%, -50% 250%)",
          ],
        },
        {
          duration: 3000,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  }, [theme, setTheme]);

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      <Sun01Icon className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon02Icon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
