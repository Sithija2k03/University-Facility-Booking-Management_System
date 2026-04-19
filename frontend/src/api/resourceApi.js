import axiosClient from "./axiosClient";

export const getAllResources = (authConfig) =>
  axiosClient.get("/api/resources", authConfig);

export const getResourceById = (id, authConfig) =>
  axiosClient.get(`/api/resources/id/${id}`, authConfig);

export const searchResources = (params, authConfig) =>
  axiosClient.get("/api/resources/search", { ...authConfig, params });

export const createResource = (formData, authConfig) => {
  const { headers: configHeaders, ...restConfig } = authConfig || {};
  const { "Content-Type": _removed, ...headersWithoutContentType } = configHeaders || {};
  return axiosClient.post("/api/resources", formData, {
    ...restConfig,
    headers: headersWithoutContentType,
  });
};

export const updateResource = (id, formData, authConfig) => {
  const { headers: configHeaders, ...restConfig } = authConfig || {};
  const { "Content-Type": _removed, ...headersWithoutContentType } = configHeaders || {};
  return axiosClient.put(`/api/resources/${id}`, formData, {
    ...restConfig,
    headers: headersWithoutContentType,
  });
};

export const deleteResource = (id, authConfig) =>
  axiosClient.delete(`/api/resources/${id}`, authConfig);