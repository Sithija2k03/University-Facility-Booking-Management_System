import axiosClient from "./axiosClient";

const buildConfig = (authConfig, extra = {}) => ({
  ...authConfig,
  ...extra,
  headers: {
    ...authConfig?.headers,
    ...extra?.headers,
  },
});

// ─── TICKETS ────────────────────────────────────────────────────────────────

export const createTicket = (data, authConfig) =>
  axiosClient.post("/api/tickets", data, authConfig);

export const getAllTickets = (authConfig) =>
  axiosClient.get("/api/tickets", authConfig);

export const getTicketById = (id, authConfig) =>
  axiosClient.get(`/api/tickets/${id}`, authConfig);

export const getMyTickets = (authConfig) =>
  axiosClient.get("/api/tickets/my", authConfig);

export const getTicketsByStatus = (status, authConfig) =>
  axiosClient.get(`/api/tickets/status/${status}`, authConfig);

export const assignTechnician = (ticketId, technicianId, authConfig) =>
  axiosClient.patch(`/api/tickets/${ticketId}/assign`, { technicianId }, authConfig);

export const updateTicketStatus = (ticketId, data, authConfig) =>
  axiosClient.patch(`/api/tickets/${ticketId}/status`, data, authConfig);

export const deleteTicket = (ticketId, authConfig) =>
  axiosClient.delete(`/api/tickets/${ticketId}`, authConfig);

// ─── ATTACHMENTS ────────────────────────────────────────────────────────────

export const uploadAttachment = (ticketId, file, authConfig) => {
  const formData = new FormData();
  formData.append("file", file);
  return axiosClient.post(
    `/api/tickets/${ticketId}/attachments`,
    formData,
    buildConfig(authConfig, { headers: { "Content-Type": "multipart/form-data" } })
  );
};

export const getAttachments = (ticketId, authConfig) =>
  axiosClient.get(`/api/tickets/${ticketId}/attachments`, authConfig);

export const deleteAttachment = (ticketId, attachmentId, authConfig) =>
  axiosClient.delete(`/api/tickets/${ticketId}/attachments/${attachmentId}`, authConfig);

// ─── COMMENTS ───────────────────────────────────────────────────────────────

export const addComment = (ticketId, data, authConfig) =>
  axiosClient.post(`/api/tickets/${ticketId}/comments`, data, authConfig);

export const getComments = (ticketId, authConfig) =>
  axiosClient.get(`/api/tickets/${ticketId}/comments`, authConfig);

export const updateComment = (ticketId, commentId, data, authConfig) =>
  axiosClient.put(`/api/tickets/${ticketId}/comments/${commentId}`, data, authConfig);

export const deleteComment = (ticketId, commentId, authConfig) =>
  axiosClient.delete(`/api/tickets/${ticketId}/comments/${commentId}`, authConfig);