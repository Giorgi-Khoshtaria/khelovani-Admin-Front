import "@/styles/globals.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./layout/Layout";
import LoginPage from "./pages/login/loginPage";

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Menu from "./pages/menu/Menu";
import PartnerDetailedPage from "./pages/partnerDetailed/PartnerDetailedPage";
import { PartnerProvider } from "./context/PartnerProvider";
import PartnerListing from "./pages/partnerListings/PartnerListing";

import TranslationPage from "./pages/Translation/TranslationPage";
import ProductListingPage from "./pages/products/listing/ProductListingPage";
import AddProductPage from "./pages/products/add/AddProductPage";
import ProductDetailsPage from "./pages/products/details/ProductDetailsPage";
import EditProductPage from "./pages/products/edit/EditProductPage";
import PinnedProductsPage from "./pages/products/pinned/PinnedProductsPage";
import OrderListingPage from "./pages/orders/listing/OrderListingPage";

import RoleManagement from "./pages/Roles/RoleManagement";
import RoleDetailedPage from "./pages/Roles/RoleDetailedPage";
import { usePartnerContext } from "./context/PartnerContext";
import { parseJwt } from "./utils/parseJwt";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import ExportPage from "./pages/Export/ExportPage";
import NotFound from "./pages/NotFound/NotFound";
import UserListingPage from "./pages/users/listing/UserListingPage";
import UserDetailsPage from "./pages/users/details/UserDetailsPage";
import CategoryListing from "./pages/categories/CategoryListing";
import LogsPage from "./pages/Logs/LogsPage";
import MediaManagerPage from "./pages/media/MediaManagerPage";

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
            path: "products/pinned",
            element: <PinnedProductsPage />,
          },
          {
            path: "orders",
            element: <OrderListingPage />,
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
          {
            path: "users",
            element: <UserListingPage />,
          },
          {
            path: "users/:id",
            element: <UserDetailsPage />,
          },
          {
            path: "categories",
            element: <CategoryListing />,
          },
          {
            path: "logs",
            element: <LogsPage />,
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
            path: "media",
            element: <MediaManagerPage />,
          },
          {
            path: "profile",
            element: <PartnerDetailedPage />,
          },
          {
            path: "profile/products",
            element: <ProductListingPage />,
          },
          {
            path: "profile/orders",
            element: <OrderListingPage />,
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
