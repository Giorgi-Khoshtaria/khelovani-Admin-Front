import { usePartnerContext } from "@/context/PartnerContext";
import { Link } from "react-router-dom";
import { useNavigateToLogin } from "@/lib/hooks/useNavigateToLogin";
import "./Menu.scss";

function Menu() {
  useNavigateToLogin();
  const { partnerId } = usePartnerContext();

  return (
    <div className="menu-page">
      <h1>მთავარი გვერდი</h1>
      <div className="dashboard-content">
        <p>კეთილი იყოს თქვენი მობრძანება პარტნიორის პანელში.</p>
        
        {partnerId ? (
          <Link to="/partner-profile" className="view-profile-btn">
            ჩემი პროფილის ნახვა
          </Link>
        ) : (
          <p className="error">პარტნიორის ID ვერ მოიძებნა. გთხოვთ გაიაროთ ავტორიზაცია ფრთხილად.</p>
        )}
      </div>
    </div>
  );
}

export default Menu;


