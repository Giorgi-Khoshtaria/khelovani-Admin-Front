import { Link, useLocation } from "react-router-dom";
import { usePartnerContext } from "@/context/PartnerContext";
import { parseJwt } from "@/utils/parseJwt";
import "./SideManu.scss";

export default function SideManu() {
  const location = useLocation();
  const { token, partnerId } = usePartnerContext();

  const decoded = parseJwt(token || "");
  const role = decoded?.role;
  const permissions: string[] = decoded?.permissions || [];

  const links: { path: string; label: string }[] = [];

  const hasPermission = (p: string) =>
    permissions.includes(p) || role === "admin";

  // Admin / Moderator Links
  if (hasPermission("menu.manage"))
    links.push({ path: "/menu", label: "მენიუ" });
  if (hasPermission("users.list"))
    links.push({ path: "/partners", label: "პარტნიორების სია" });
  if (hasPermission("products.viewAll"))
    links.push({ path: "/products", label: "ყველა პროდუქტი" });
  if (hasPermission("translations.read"))
    links.push({ path: "/translations", label: "თარგმანები" });
  if (hasPermission("roles.read"))
    links.push({ path: "/roles", label: "როლები" });
  if (role === "admin") links.push({ path: "/export", label: "ექსპორტი" });

  // Organisation / Partner Links
  if (role === "organisation" && partnerId) {
    if (
      permissions.includes("organization.profile.view") ||
      permissions.includes("organization.profile.edit") ||
      permissions.length === 0
    ) {
      links.push({ path: "/profile", label: "ჩემი პროფილი" });
    }
    if (
      permissions.includes("organization.products.view") ||
      permissions.includes("organization.products.create") ||
      permissions.length === 0
    ) {
      links.push({ path: "/profile/products", label: "ჩემი პროდუქტები" });
    }
  }

  const isActive = (linkPath: string) => {
    if (location.pathname === linkPath) return true;

    // Admin /partners highlighting
    if (linkPath === "/partners" && location.pathname.startsWith("/partners")) {
      return true;
    }

    // Profile /products highlighting
    if (linkPath === "/profile" && location.pathname === "/profile")
      return true;
    if (
      linkPath === "/profile/products" &&
      location.pathname.startsWith("/profile/products")
    )
      return true;

    // Org legacy paths (in case they land there via direct link)
    if (
      linkPath.endsWith("/products") &&
      location.pathname.startsWith(linkPath)
    ) {
      return true;
    }

    return false;
  };

  return (
    <div className="side-manu">
      <ul className="side-manu__list">
        {links.map((link) => (
          <li
            key={link.path}
            className={`side-manu__item ${isActive(link.path) ? "active" : ""}`}
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
