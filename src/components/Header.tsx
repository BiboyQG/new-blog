import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

export default function Header() {
  const { user, isAuthenticated, login, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="w-full max-w-screen-xl mx-auto flex items-center justify-between h-16 px-6">
        <div className="flex items-center">
          <Link
            to="/"
            className="text-2xl font-bold text-gray-900 dark:text-white"
          >
            Banghao's Blog
          </Link>
        </div>

        <nav className="flex items-center space-x-4">
          <Link
            to="/"
            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            Home
          </Link>

          {isAuthenticated && user?.isAdmin && (
            <Link
              to="/admin"
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Admin
            </Link>
          )}

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img
                  src={user?.picture}
                  alt={user?.name}
                  className="h-8 w-8 rounded-full"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {user?.name}
                </span>
              </div>
              <button onClick={logout} className="btn-secondary text-sm">
                Logout
              </button>
            </div>
          ) : (
            <button onClick={login} className="btn-primary text-sm">
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
