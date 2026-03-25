import { Link, useLocation } from "react-router-dom";
import { usePartnerContext } from "@/context/PartnerContext";
import { parseJwt } from "@/utils/parseJwt";
import "./SideManu.scss";

export default function SideManu() {
  const location = useLocation();
  const { token, partnerId } = usePartnerContext();

  const decoded = parseJwt(token || "");
  const role = decoded?.role;

  const links: { path: string; label: string }[] = [];

  if (role === "super_admin" || role === "admin" || role === "moderator") {
    links.push(
      { path: "/menu", label: "მენიუ" },
      { path: "/partners", label: "პარტნიორების სია" },
      { path: "/translations", label: "თარგმანები" },
      { path: "/roles", label: "როლები" },
    );
  } else if (role === "organisation" && partnerId) {
    links.push({ path: `/partners/${partnerId}`, label: "ჩემი პროფილი" });
  }

  return (
    <div className="side-manu">
      <ul className="side-manu__list">
        {links.map((link) => (
          <li
            key={link.path}
            className={`side-manu__item ${
              location.pathname === link.path ||
              (link.path.startsWith("/partners") &&
                location.pathname.startsWith("/partners"))
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
