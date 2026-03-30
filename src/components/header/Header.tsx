import { usePartnerContext } from "@/context/PartnerContext";
import { parseJwt } from "@/utils/parseJwt";
import "./Header.scss";
import { useLogout } from "@/hooks/auth/useLogout";

function Header() {
  const logout = useLogout();
  const { token } = usePartnerContext();

  const decoded = parseJwt(token || "");
  const role = decoded?.role;

  return (
    <div className="header">
      <div className="header__logo">
        <a href="/">
          <img src="/assets/logo.png" width={100} height={50} alt="logo" />
        </a>
      </div>
      <div className="header__title">
        <h2>
          {role === "organisation"
            ? "ორგანიზაციის პანელი"
            : "ადმინ პანელი"}
        </h2>
      </div>
      <div className="header__content">
        <button onClick={logout}>გასვლა</button>
      </div>
    </div>
  );
}

export default Header;
