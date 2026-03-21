import React from "react";
import "./Header.scss";
import { useLogout } from "@/lib/hooks/useLogout";

function Header() {
  const logout = useLogout();

  return (
    <div className="header">
      <div className="header__logo">
        <img src="/assets/logo.png" width={100} height={50} alt="logo" />
      </div>
      <div className="header__title">
        <h2>ადმინ პანელი</h2>
      </div>
      <div className="header__content">
        <div className="header__content__user">
          <p>მომხმარებელი</p>
        </div>
        <button onClick={logout}>გასვლა</button>
      </div>
    </div>
  );
}


export default Header;
