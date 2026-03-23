import { Link, useLocation } from "react-router-dom";
import "./SideManu.scss";

export default function SideManu() {
  const location = useLocation();

  const links = [
    { path: "/", label: "მენიუ" },
    { path: "/partners", label: "პარტნიორების სია" },
    { path: "/translations", label: "თარგმანები" },
    { path: "/roles", label: "როლები" },
  ];

  return (
    <div className="side-manu">
      <ul className="side-manu__list">
        {links.map((link) => (
          <li
            key={link.path}
            className={`side-manu__item ${
              location.pathname === link.path ||
              (link.path.startsWith("/partner-profile") &&
                location.pathname.startsWith("/partner-profile"))
                ? "active"
                : ""
            }`}
          >
            <Link to={link.path} className="side-manu__link">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
