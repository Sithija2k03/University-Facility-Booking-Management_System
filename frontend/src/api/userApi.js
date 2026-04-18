import axiosClient from "./axiosClient";

export const getUsersByRole = (role, authHeader) =>
  axiosClient.get(`/api/users/role/${role}`, {
    headers: { Authorization: authHeader },
  });
