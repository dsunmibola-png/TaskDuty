import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.svg.png";
import avatar from "../assets/avatar.png.png";

function Navbar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors sm:text-base ${
      isActive ? "text-[#974fd0]" : "text-[#292929] hover:text-[#974fd0]"
    }`;

  return (
    <header className="border-b border-gray-200">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-5 sm:px-8"
      >
        <Link
          to="/"
          aria-label="TaskDuty home"
          className="flex shrink-0 items-center gap-2"
        >
          <img src={logo} alt="" className="h-8 w-auto" />

          <span className="text-lg font-bold text-[#31085c]">TaskDuty</span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-8">
          <NavLink to="/tasks/new" className={linkClass}>
            New Task
          </NavLink>

          <NavLink to="/tasks" end className={linkClass}>
            All Tasks
          </NavLink>

          <img
            src={avatar}
            alt="Profile avatar"
            className="hidden h-10 w-10 shrink-0 rounded-full object-cover sm:block"
          />
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
