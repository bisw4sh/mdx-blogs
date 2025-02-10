import { useEffect } from "react";

type modeType = "dark" | "light";

interface PropTypes {
  mode: modeType;
  setMode: (mode: modeType) => void;
}

export default function ThemeToggle({ mode, setMode }: PropTypes) {
  useEffect(() => {
    if (
      localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
      setMode("dark");
    } else {
      localStorage.setItem("theme", "light");
      setMode("light");
      document.documentElement.classList.remove("dark");
    }
  }, [setMode]);

  const handleClick = () => {
    if (mode === "light") {
      setMode("dark");
      localStorage.setItem("theme", "dark");
    } else {
      setMode("light");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <>
      <button className="absolute top-4 right-4" type="button">
        <label className="flex cursor-pointer gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <title>Light mode icon</title>
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
          </svg>
          <input
            type="checkbox"
            value="synthwave"
            className="toggle theme-controller"
            onClick={handleClick}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <title>Dark mode icon</title>
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </label>
      </button>
    </>
  );
}
