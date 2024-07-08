import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [mode, setMode] = useState<"light" | "dark">("light");

  return (
    <div data-theme={mode} className="space-x-4 p-4">
      <ThemeToggle mode={mode} setMode={setMode} />
      <Link to="/" className="link link-info">
        Home
      </Link>
      <Link to="/main" className="link link-info">
        Main
      </Link>
      <Link to="/write" className="link link-info">
        Write
      </Link>
      <Outlet />
    </div>
  );
}
