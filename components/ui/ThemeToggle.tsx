"use client";

import { useThemeContext } from "./ThemeProvider";
import styles from "./ThemeToggle.module.css";

export default function ThemeToggle() {
  const { theme, toggle, mounted } = useThemeContext();

  if (!mounted) {
    return <div className={styles.placeholder} aria-hidden="true" />;
  }

  return (
    <button
      onClick={toggle}
      className={styles.toggle}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <span className={styles.track}>
        <span className={styles.thumb} data-theme-active={theme}>
          {theme === "light" ? "☼" : "◐"}
        </span>
        <span className={styles.labelLight}>LIGHT</span>
        <span className={styles.labelDark}>DARK</span>
      </span>
    </button>
  );
}
