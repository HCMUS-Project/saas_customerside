"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import themeOptions from "./theme-options";

export const ToggleThemeButton = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // When mounted on client, now we can show the UI
  useEffect(() => {
    setMounted(true);
    setTheme("sunset-horizon");
  }, []);

  if (!mounted) return null;

  return (
    <>
      <span className="p-1 sm:px-3 sm:py-2 text-th-secodary">
        Current theme: {mounted && theme}
      </span>
      <div>
        <label htmlFor="theme-select" className="sr-only mr-2">
          Choose theme:
        </label>
        <select
          name="theme"
          id="theme-select"
          className="bg-white text-gray-800 border-gray-800 border py-1 px-3"
          onChange={(e) => setTheme(e.currentTarget.value)}
          value={theme}
        >
          <option value="system">System</option>
          {themeOptions.map((t) => (
            <option key={t.name.toLowerCase()} value={t.name.toLowerCase()}>
              {t.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};
