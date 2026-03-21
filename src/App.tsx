import "@/styles/globals.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./layout/Layout";
import LoginPage from "./pages/login/loginPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Menu from "./pages/menu/Menu";
import PartnerDetailedPage from "./pages/partnerDetailed/PartnerDetailedPage";
import { PartnerProvider } from "./context/PartnerProvider";
import PartnerListing from "./pages/partnerListings/PartnerListing";

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
        path: "partners",
        element: <PartnerListing />,
      },
      {
        path: "partners/:id?",
        element: <PartnerDetailedPage />,
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
