import axiosClient from "./axiosClient";

// ─── TICKETS ────────────────────────────────────────────────────────────────

export const createTicket = (data, authHeader) =>
  axiosClient.post("/api/tickets", data, {
    headers: { Authorization: authHeader },
  });

export const getAllTickets = (authHeader) =>
  axiosClient.get("/api/tickets", {
    headers: { Authorization: authHeader },
  });

export const getTicketById = (id, authHeader) =>
  axiosClient.get(`/api/tickets/${id}`, {
    headers: { Authorization: authHeader },
  });

export const getMyTickets = (reporterId, authHeader) =>
  axiosClient.get(`/api/tickets/reporter/${reporterId}`, {
    headers: { Authorization: authHeader },
  });

export const getTicketsByStatus = (status, authHeader) =>
  axiosClient.get(`/api/tickets/status/${status}`, {
    headers: { Authorization: authHeader },
  });

export const assignTechnician = (ticketId, technicianId, authHeader) =>
  axiosClient.patch(
    `/api/tickets/${ticketId}/assign`,
    { technicianId },
    { headers: { Authorization: authHeader } }
  );

export const updateTicketStatus = (ticketId, data, authHeader) =>
  axiosClient.patch(`/api/tickets/${ticketId}/status`, data, {
    headers: { Authorization: authHeader },
  });

// ─── ATTACHMENTS ────────────────────────────────────────────────────────────

export const uploadAttachment = (ticketId, file, authHeader) => {
  const formData = new FormData();
  formData.append("file", file);
  return axiosClient.post(`/api/tickets/${ticketId}/attachments`, formData, {
    headers: {
      Authorization: authHeader,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAttachments = (ticketId, authHeader) =>
  axiosClient.get(`/api/tickets/${ticketId}/attachments`, {
    headers: { Authorization: authHeader },
  });

export const deleteAttachment = (ticketId, attachmentId, authHeader) =>
  axiosClient.delete(
    `/api/tickets/${ticketId}/attachments/${attachmentId}`,
    { headers: { Authorization: authHeader } }
  );

// ─── COMMENTS ───────────────────────────────────────────────────────────────

export const addComment = (ticketId, data, authHeader) =>
  axiosClient.post(`/api/tickets/${ticketId}/comments`, data, {
    headers: { Authorization: authHeader },
  });

export const getComments = (ticketId, authHeader) =>
  axiosClient.get(`/api/tickets/${ticketId}/comments`, {
    headers: { Authorization: authHeader },
  });

export const updateComment = (ticketId, commentId, requesterUserId, data, authHeader) =>
  axiosClient.put(
    `/api/tickets/${ticketId}/comments/${commentId}?requesterUserId=${requesterUserId}`,
    data,
    { headers: { Authorization: authHeader } }
  );

export const deleteComment = (ticketId, commentId, requesterUserId, authHeader) =>
  axiosClient.delete(
    `/api/tickets/${ticketId}/comments/${commentId}?requesterUserId=${requesterUserId}`,
    { headers: { Authorization: authHeader } }
  );
