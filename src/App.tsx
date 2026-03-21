import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./layout/Layout";
import LoginPage from "./pages/loginPage/loginPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Menu from "./pages/menu/Menu";
import PartnerProfilePage from "./pages/partnerProfilePage/PartnerProfilePage";
import { PartnerProvider } from "./context/PartnerProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Menu />,
      },
      {
        path: "partner-profile",
        element: <PartnerProfilePage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

function App() {
  return (
    <PartnerProvider>
      <RouterProvider router={router} />
      <ToastContainer />
    </PartnerProvider>
  );
}

export default App;
