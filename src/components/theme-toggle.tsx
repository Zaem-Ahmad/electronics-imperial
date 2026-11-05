"use client";

import { Icon } from "./icon";

export function ThemeToggle() {
  function toggle() {
    const next =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    try {
      localStorage.setItem("imperial-theme", next);
    } catch {
      /* The theme still works without storage. */
    }
  }
  return (
    <button
      className="icon-button theme-toggle"
      type="button"
      aria-label="Toggle color theme"
      onClick={toggle}
    >
      <Icon name="moon" className="theme-moon" />
      <Icon name="sun" className="theme-sun" />
    </button>
  );
}
