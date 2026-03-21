import { Outlet } from "react-router-dom";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import SideManu from "../components/sideManu/SideManu";
import "./Layout.scss";

function Layout() {
  return (
    <div className="layout">
      <Header />
      <div className="layout__main">
        <SideManu />
        <div className="layout__content">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Layout;

