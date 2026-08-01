import { z } from "zod";

import { makeEndpoint } from "../../utils/makeEndpoint";
import { useFetchQuery } from "../../hooks/useFetchQuery";
import httpClient from "../api/httpClient";
export const ADMIN_MANAGE_QUERY_KEY = "admin-manage";

export const AdminManageSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  admin_role: z.string().min(1, "Admin role is required"),
  email: z.string().email().min(1, "Email is required"),
  password_txt: z.string().min(6).min(1, "Password is required"),
});

export async function createAdminManage(payload) {
  return httpClient.post("/administrator/admin-management/", payload);
}

export const useGetAdminManages = ({ query }) => {
  const endPoint = makeEndpoint("/administrator/admin-management", {
    view: "admin-list",
    p: query.page,
  });
  return useFetchQuery([ADMIN_MANAGE_QUERY_KEY, query], endPoint, {});
};

export async function updateAdminManage(data) {
  console.log(data);
  return httpClient.put(`/administrator/admin-management/?id=${data.id}`, {
    full_name: data.data.full_name,
    admin_role: data.data.admin_role,
  });
}

export async function deleteAdminManage(id) {
  return httpClient.delete(
    `/administrator/admin-management/?id=${id}`,
  );
}