import axios from "axios";

export const updatePartnerStatusRequest = async (
  id: string,
  status: "approved" | "rejected",
) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;
  const token = localStorage.getItem("adminToken");

  // Note: Adjust the endpoint structure if the backend uses a different path
  const response = await axios.patch(
    `${BACKEND_URL}/api/admin/partners/${id}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};
