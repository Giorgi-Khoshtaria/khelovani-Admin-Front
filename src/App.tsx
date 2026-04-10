import "@/styles/globals.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./layout/Layout";
import LoginPage from "./pages/Login/loginPage";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Menu from "./pages/Menu/Menu";
import PartnerDetailedPage from "./pages/PartnerDetailed/PartnerDetailedPage";
import { PartnerProvider } from "./context/PartnerProvider";
import PartnerListing from "./pages/PartnerListings/PartnerListing";
import TranslationPage from "./pages/Translation/TranslationPage";
import ProductListingPage from "./pages/Products/listing/ProductListingPage";
import AddProductPage from "./pages/Products/add/AddProductPage";
import ProductDetailsPage from "./pages/Products/details/ProductDetailsPage";
import EditProductPage from "./pages/Products/edit/EditProductPage";
import RoleManagement from "./pages/Roles/RoleManagement";
import RoleDetailedPage from "./pages/Roles/RoleDetailedPage";
import { usePartnerContext } from "./context/PartnerContext";
import { parseJwt } from "./utils/parseJwt";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import ExportPage from "./pages/Export/ExportPage";
import NotFound from "./pages/NotFound/NotFound";

const IndexRedirect = () => {
  const { token } = usePartnerContext();
  const decoded = parseJwt(token || "");
  const partnerId = decoded?.id;
  const role = decoded?.role;

  if (role === "organisation" && partnerId) {
    return <Navigate to="/profile" replace />;
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
      // Admin-only Routes
      {
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
          {
            path: "menu",
            element: <Menu />,
          },
          {
            path: "partners",
            element: <PartnerListing />,
          },
          {
            path: "products",
            element: <ProductListingPage />,
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
          {
            path: "export",
            element: <ExportPage />,
          },
        ],
      },
      // Shared / Partner-Specific Routes (Enforced Ownership)
      {
        element: <ProtectedRoute requireOwnership={true} />,
        children: [
          {
            path: "partners/:id",
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
        ],
      },
      // Dedicated Profile Routes (Organizers)
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "profile",
            element: <PartnerDetailedPage />,
          },
          {
            path: "profile/products",
            element: <ProductListingPage />,
          },
          {
            path: "profile/products/add",
            element: <AddProductPage />,
          },
          {
            path: "profile/products/:productId",
            element: <ProductDetailsPage />,
          },
          {
            path: "profile/products/:productId/edit",
            element: <EditProductPage />,
          },
        ],
      },
      // Global Product Details (Shared)
      {
        path: "products/:productId",
        element: <ProductDetailsPage />,
      },
      {
        path: "*",
        element: <NotFound />,
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
