import "./App.css";
import Layout from "./layout/Layout";
import LoginPage from "./pages/loginPage/loginPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Menu from "./pages/menu/Menu";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true, // ← use index instead of path "/"
        element: <Menu />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
