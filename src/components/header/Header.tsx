import { useState } from "react";
import { toast } from "react-toastify";
import { usePartnerContext } from "@/context/PartnerContext";
import { parseJwt } from "@/utils/parseJwt";
import "./Header.scss";
import { useLogout } from "@/hooks/auth/useLogout";
import { clearCache } from "@/apiCalls/cacheApiCalls";
import { getErrorMessage } from "@/utils/handleApiError";

function Header() {
  const logout = useLogout();
  const { token } = usePartnerContext();
  const [clearing, setClearing] = useState(false);

  const decoded = parseJwt(token || "");
  const role = decoded?.role;

  const handleClearCache = async () => {
    setClearing(true);
    try {
      await clearCache();
      toast.success("ქეში წარმატებით გასუფთავდა");
    } catch (err) {
      toast.error(getErrorMessage(err, "ქეშის გასუფთავება ვერ მოხერხდა"));
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="header">
      <div className="header__logo">
        <a href="/">
          <img src="/assets/logo.png" width={100} height={50} alt="logo" />
        </a>
      </div>
      <div className="header__title">
        <h2>
          {role === "organisation" ? "ორგანიზაციის პანელი" : "ადმინ პანელი"}
        </h2>
      </div>
      <div className="header__content">
        {role !== "organisation" && (
          <button
            onClick={handleClearCache}
            disabled={clearing}
            className="clear-cache-btn"
          >
            {clearing ? "იწმინდება..." : "ქეშის წაშლა"}
          </button>
        )}
        <button onClick={logout} className="logout-btn">
          გასვლა
        </button>
      </div>
    </div>
  );
}

export default Header;
