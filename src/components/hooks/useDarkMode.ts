import { useState, useEffect } from "preact/hooks";

/**
 * useDarkMode — reactive hook that tracks whether dark mode is active.
 *
 * Watches for class changes on <html> via MutationObserver so components
 * re-render automatically when the user toggles the theme.
 *
 * @returns boolean — true when the "dark" class is present on <html>
 */
export function useDarkMode(): boolean {
  const [isDark, setIsDark] = useState(() =>
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false
  );

  useEffect(() => {
    const update = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    update();
    // MutationObserver is used instead of a storage event because ThemeToggle
    // toggles the class directly — no storage event is fired.
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  return isDark;
}
