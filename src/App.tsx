import "@/styles/globals.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./layout/Layout";
import LoginPage from "./pages/login/loginPage";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Menu from "./pages/menu/Menu";
import PartnerDetailedPage from "./pages/partnerDetailed/PartnerDetailedPage";
import { PartnerProvider } from "./context/PartnerProvider";
import PartnerListing from "./pages/partnerListings/PartnerListing";
import TranslationPage from "./pages/Translation/TranslationPage";
import ProductListingPage from "./pages/products/listing/ProductListingPage";
import AddProductPage from "./pages/products/add/AddProductPage";
import ProductDetailsPage from "./pages/products/details/ProductDetailsPage";
import EditProductPage from "./pages/products/edit/EditProductPage";
import RoleManagement from "./pages/Roles/RoleManagement";
import RoleDetailedPage from "./pages/Roles/RoleDetailedPage";
import { usePartnerContext } from "./context/PartnerContext";
import { parseJwt } from "./utils/parseJwt";

const IndexRedirect = () => {
  const { token, partnerId } = usePartnerContext();
  const decoded = parseJwt(token || "");
  const role = decoded?.role;

  if (role === "organisation" && partnerId) {
    return <Navigate to={`/partners/${partnerId}`} replace />;
  }

  return <Navigate to="/menu" replace />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <IndexRedirect />,
      },
      {
        path: "menu",
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
      {
        path: "partners/:id/products",
        element: <ProductListingPage />,
      },
      {
        path: "partners/:id/products/add",
        element: <AddProductPage />,
      },
      {
        path: "partners/:id/products/:productId",
        element: <ProductDetailsPage />,
      },
      {
        path: "partners/:id/products/:productId/edit",
        element: <EditProductPage />,
      },
      {
        path: "products",
        element: <ProductListingPage />,
      },
      {
        path: "products/:productId",
        element: <ProductDetailsPage />,
      },
      {
        path: "translations",
        element: <TranslationPage />,
      },
      {
        path: "roles",
        element: <RoleManagement />,
      },
      {
        path: "roles/:id",
        element: <RoleDetailedPage />,
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
