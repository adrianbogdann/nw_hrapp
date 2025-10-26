import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info("You’ve been logged out");
    setTimeout(() => navigate("/login"), 800);
  };

  if (!user) return null; // Don’t show header when not logged in

  return (
    <header className="w-full bg-white shadow-sm border-b mb-6">
      <div className="max-w-5xl mx-auto flex justify-between items-center px-6 py-3">
        <Link to="/profile" className="text-lg font-semibold text-gray-800">
          HR Portal
        </Link>

        {/* Center: Navigation */}
        <nav className="flex gap-4">
          {user.role === "manager" && (
            <>
              <Link
                to="/feedback"
                className="text-gray-600 hover:text-blue-600 transition"
              >
                Feedback
              </Link>
              {/* <Link
                to="/absences"
                className="text-gray-600 hover:text-blue-600 transition"
              >
                Absences
              </Link> */}
            </>
          )}

          {user.role === "coworker" && (
            <Link
              to="/feedback"
              className="text-gray-600 hover:text-blue-600 transition"
            >
              Feedback
            </Link>
          )}

          <Link
            to="/profile"
            className="text-gray-600 hover:text-blue-600 transition"
          >
            Profile
          </Link>
        </nav>

        {/* Right: User + Logout */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-700">
            {user.email}{" "}
            <span className="text-xs text-gray-500">({user.role})</span>
          </span>
          <button
            onClick={handleLogout}
            className="px-1 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
