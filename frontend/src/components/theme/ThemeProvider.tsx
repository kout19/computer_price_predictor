/**
 * Theme provider responsible for applying the `.dark` class to the
 * document root, which our Tailwind v4 `@custom-variant dark` setup
 * (in index.css) depends on. Defaults to dark mode per project
 * requirements; structured as a context so a future theme toggle is
 * a drop-in addition rather than a rearchitecture.
 */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Theme = "dark" | "light";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
  undefined,
);

const DEFAULT_STORAGE_KEY = "computer-price-prediction-theme";

/**
 * Provides the current theme and a setter to the component tree, and
 * syncs the `.dark` / `.light` class onto `<html>` whenever it changes.
 *
 * @param children - The application tree to render.
 * @param defaultTheme - Theme used when no persisted preference exists.
 * @param storageKey - localStorage key used to persist the user's choice.
 */
export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = DEFAULT_STORAGE_KEY,
}: ThemeProviderProps): JSX.Element {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return defaultTheme;
    }

    const stored = window.localStorage.getItem(storageKey) as Theme | null;
    if (stored === "dark" || stored === "light") {
      return stored;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(theme);
    root.style.colorScheme = theme;
  }, [theme]);

  const value = useMemo<ThemeProviderState>(
    () => ({
      theme,
      setTheme: (nextTheme: Theme) => {
        window.localStorage.setItem(storageKey, nextTheme);
        setThemeState(nextTheme);
      },
    }),
    [theme, storageKey],
  );

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

/**
 * Access the current theme and setter from any descendant component.
 *
 * @returns The current theme context value.
 * @throws {Error} If used outside of a `ThemeProvider`.
 */
export function useTheme(): ThemeProviderState {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider.");
  }
  return context;
}
