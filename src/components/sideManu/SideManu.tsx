import { Link, useLocation } from "react-router-dom";
import { usePartnerContext } from "@/context/PartnerContext";
import { parseJwt } from "@/utils/parseJwt";
import "./SideManu.scss";

export default function SideManu() {
  const location = useLocation();
  const { token } = usePartnerContext();

  const decoded = parseJwt(token || "");
  const role = decoded?.role;
  const partnerId = decoded?.id;
  const permissions: string[] = decoded?.permissions || [];

  const links: { path: string; label: string }[] = [];

  const hasPermission = (p: string) =>
    permissions.includes(p) || role === "admin";

  // Admin / Moderator Links
  if (hasPermission("menu.manage"))
    links.push({ path: "/menu", label: "მენიუ" });
  if (hasPermission("users.list"))
    links.push({ path: "/partners", label: "პარტნიორების სია" });
  if (role === "admin") links.push({ path: "/users", label: "მომხმარებლები" });
  if (hasPermission("products.viewAll"))
    links.push({ path: "/products", label: "ყველა პროდუქტი" });
  if (hasPermission("orders.viewAll"))
    links.push({ path: "/orders", label: "შეკვეთები" });
  if (role === "admin")
    links.push({ path: "/products/pinned", label: "პინ-პროდუქტები" });
  if (hasPermission("translations.read"))
    links.push({ path: "/translations", label: "თარგმანები" });
  if (hasPermission("roles.read"))
    links.push({ path: "/roles", label: "როლები" });
  if (role === "admin")
    links.push({ path: "/categories", label: "კატეგორიები" });
  if (hasPermission("settings.view"))
    links.push({ path: "/information", label: "ინფორმმაციული ველები" });
  if (role === "admin") links.push({ path: "/export", label: "ექსპორტი" });
  if (hasPermission("statistics.view"))
    links.push({ path: "/statistics", label: "სტატისტიკა" });
  if (hasPermission("logs.view"))
    links.push({ path: "/logs", label: "ლოგები" });
  if (hasPermission("media.view"))
    links.push({ path: "/media", label: "მედია მენეჯერი" });

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
    if (
      permissions.includes("organization.orders.view") ||
      permissions.length === 0
    ) {
      links.push({ path: "/profile/orders", label: "ჩემი შეკვეთები" });
    }
    if (
      permissions.includes("organization.analytics.view") ||
      permissions.length === 0
    ) {
      links.push({ path: "/profile/statistics", label: "სტატისტიკა" });
    }
    if (
      permissions.includes("organization.media.view") ||
      permissions.includes("organization.media.manage") ||
      permissions.length === 0
    ) {
      links.push({ path: "/media", label: "მედია მენეჯერი" });
    }
  }

  const isActive = (linkPath: string) => {
    if (location.pathname === linkPath) return true;

    // Admin /partners highlighting
    if (linkPath === "/partners" && location.pathname.startsWith("/partners")) {
      return true;
    }

    // Admin /users highlighting
    if (linkPath === "/users" && location.pathname.startsWith("/users")) {
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

    // Orders highlighting (admin + partner)
    if (linkPath === "/orders" && location.pathname.startsWith("/orders"))
      return true;
    if (
      linkPath === "/profile/orders" &&
      location.pathname.startsWith("/profile/orders")
    )
      return true;

    // /products sub-pages (e.g. /products/123) but NOT /products/pinned
    if (
      linkPath === "/products" &&
      location.pathname.startsWith("/products/") &&
      !location.pathname.startsWith("/products/pinned")
    ) {
      return true;
    }

    // /products/pinned sub-pages
    if (
      linkPath === "/products/pinned" &&
      location.pathname.startsWith("/products/pinned")
    ) {
      return true;
    }

    // Org legacy paths (in case they land there via direct link)
    if (
      linkPath.endsWith("/products") &&
      linkPath !== "/products" &&
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
