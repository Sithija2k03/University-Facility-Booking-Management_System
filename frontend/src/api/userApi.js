import axiosClient from "./axiosClient";

export const getUsersByRole = (role, authConfig) =>
  axiosClient.get(`/api/users/role/${role}`, authConfig);
