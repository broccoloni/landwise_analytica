import { useContext } from "react";
import { SettingsContext } from "@/contexts/settings/SettingsContext";
import { Moon, Sun } from "lucide-react";

const ThemeButton = () => {
  const { theme, handleUpdate } = useContext(SettingsContext);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    handleUpdate({ theme: newTheme });

    // Apply theme class to root
    const root = document.querySelector(":root");
    root?.classList.remove("light", "dark");
    root?.classList.add(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg text-white hover:opacity-75"
    >
      {theme === "light" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default ThemeButton;
