import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getUserByIdRequest, deleteUserRequest } from "@/apiCalls/userApiCalls/user.req";
import { toast } from "react-toastify";
import type { User } from "@/types/user.types";

export const useUserDetails = (userId?: string) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getUserByIdRequest(userId);
      setUser(data);
    } catch {
      setError("მომხმარებელი ვერ მოიძებნა");
      toast.error("მომხმარებლის მონაცემების ჩატვირთვა ვერ მოხერხდა");
      navigate("/users");
    } finally {
      setLoading(false);
    }
  }, [userId, navigate]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleDelete = async () => {
    if (!userId) return;
    if (
      !window.confirm(
        "ნამდვილად გსურთ მომხმარებლის წაშლა? / Are you sure you want to delete this user?",
      )
    )
      return;
    try {
      await deleteUserRequest(userId);
      toast.success("მომხმარებელი წარმატებით წაიშალა");
      navigate("/users");
    } catch {
      toast.error("შეცდომა მომხმარებლის წაშლისას");
    }
  };

  return { user, loading, error, handleDelete };
};
