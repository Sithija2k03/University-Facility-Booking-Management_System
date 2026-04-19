import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../auth/AuthContext";
import {
  getTicketById,
  getComments,
  addComment,
  updateComment,
  deleteComment,
  getAttachments,
  uploadAttachment,
  deleteAttachment,
  deleteTicket,
} from "../api/ticketApi";
import { getAuthConfig } from "../api/authHelper";
import PageShell from "../components/layout/PageShell";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import StatusBadge from "../components/ui/StatusBadge";
import PriorityBadge from "../components/ui/PriorityBadge";

const ATTACHMENT_ACCEPT = "image/*";
// Previous formats kept for reference:
// const ATTACHMENT_ACCEPT = "image/*,application/pdf,.csv,.xls,.xlsx,.doc,.docx";

const formatTicketAge = (createdAt) => {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min${diffMinutes === 1 ? "" : "s"} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
};

function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, credentials, buildBasicAuthHeader } = useAuth();

  const [ticket, setTicket]                 = useState(null);
  const [comments, setComments]             = useState([]);
  const [attachments, setAttachments]       = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState("");
  const [commentText, setCommentText]       = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [editingId, setEditingId]           = useState(null);
  const [editText, setEditText]             = useState("");
  const [uploading, setUploading]           = useState(false);
  const [attachError, setAttachError]       = useState("");
  const [deletingTicket, setDeletingTicket] = useState(false);

  const authConfig = getAuthConfig(credentials, buildBasicAuthHeader);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [tRes, cRes, aRes] = await Promise.all([
          getTicketById(id, authConfig),
          getComments(id, authConfig),
          getAttachments(id, authConfig),
        ]);
        setTicket(tRes.data);
        setComments(cRes.data);
        setAttachments(aRes.data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load ticket.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    setCommentLoading(true);
    try {
      const res = await addComment(id, { content: commentText }, authConfig);
      setComments((prev) => [...prev, res.data]);
      setCommentText("");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to add comment.");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleUpdateComment = async (commentId) => {
    if (!editText.trim()) return;
    try {
      const res = await updateComment(id, commentId, { content: editText }, authConfig);
      setComments((prev) => prev.map((c) => (c.id === commentId ? res.data : c)));
      setEditingId(null);
      setEditText("");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update comment.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await deleteComment(id, commentId, authConfig);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete comment.");
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAttachError("");

    if (!file.type || !file.type.startsWith("image/")) {
      setAttachError("Only image files are allowed (jpg, jpeg, png, gif, webp, etc.).");
      e.target.value = "";
      return;
    }

    if (attachments.length >= 3) {
      setAttachError("Maximum 3 attachments allowed.");
      return;
    }
    setUploading(true);
    try {
      const res = await uploadAttachment(id, file, authConfig);
      setAttachments((prev) => [...prev, res.data]);
    } catch (err) {
      setAttachError(err?.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    if (!window.confirm("Delete this attachment?")) return;
    try {
      await deleteAttachment(id, attachmentId, authConfig);
      setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete attachment.");
    }
  };

  const getAttachmentUrl = (att) =>
    `http://localhost:8080/uploads/tickets/${id}/${att.storedFileName}`;

  const isImageAttachment = (att) =>
    (att.contentType || "").toLowerCase().startsWith("image/");

  const handleDownloadAttachment = async (att) => {
    try {
      const headers = credentials?.email
        ? { Authorization: buildBasicAuthHeader(credentials.email, credentials.password) }
        : {};
      const response = await fetch(getAttachmentUrl(att), {
        headers,
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to download file.");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = att.originalFileName || "attachment";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      alert(err?.message || "Failed to download attachment.");
    }
  };

  const handleDeleteTicket = async () => {
    if (!window.confirm("Delete this ticket? This will also remove related comments and attachments.")) {
      return;
    }

    setDeletingTicket(true);
    try {
      await deleteTicket(id, authConfig);
      navigate("/tickets/all");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete ticket.");
    } finally {
      setDeletingTicket(false);
    }
  };

  if (loading) return <p className="p-8 text-slate-400 animate-pulse">Loading ticket…</p>;
  if (error)   return <p className="p-8 text-red-400">{error}</p>;
  if (!ticket) return null;

  const isOwner   = user?.id === ticket.reporterId;
  const isAdmin   = user?.role === "ADMIN";
  const isTech    = user?.role === "TECHNICIAN";
  const canManage = isAdmin || isTech;

  return (
    <PageShell
      title={`Ticket #${ticket.id}`}
      subtitle={`${ticket.category} · ${ticket.locationText}`}
      actions={
        <div className="flex gap-2">
          {canManage && (
            <Button onClick={() => navigate(`/tickets/${id}/manage`)}>
              Manage Ticket
            </Button>
          )}
          {isAdmin && (
            <Button
              variant="ghost"
              onClick={handleDeleteTicket}
              disabled={deletingTicket}
            >
              {deletingTicket ? "Deleting..." : "Delete Ticket"}
            </Button>
          )}
          <Button variant="ghost" onClick={() => navigate(-1)}>← Back</Button>
        </div>
      }
    >
      <Card>
        <div className="flex flex-wrap gap-3 mb-4">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Description</p>
            <p className="text-sm text-slate-200 leading-relaxed">{ticket.description}</p>
          </div>
          <div className="space-y-3">
            <Info label="Reported by"  value={ticket.reporterName} />
            <Info label="Location"     value={ticket.locationText} />
            <Info label="Contact"      value={ticket.preferredContact} />
            <Info label="Submitted"    value={new Date(ticket.createdAt).toLocaleString("en-GB")} />
            <Info label="Age"          value={formatTicketAge(ticket.createdAt)} />
            {ticket.assignedTechnicianName && (
              <Info label="Technician" value={ticket.assignedTechnicianName} highlight />
            )}
            {ticket.resolutionNotes && (
              <Info label="Resolution Notes" value={ticket.resolutionNotes} />
            )}
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-100">
            Attachments <span className="text-slate-500 font-normal">({attachments.length}/3)</span>
          </h2>
          {attachments.length < 3 && (isOwner || canManage) && (
            <label className="inline-flex items-center gap-2 cursor-pointer rounded-2xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-300 hover:bg-slate-700 transition">
              {uploading ? "Uploading..." : "+ Upload"}
              <input
                type="file"
                accept={ATTACHMENT_ACCEPT}
                className="hidden"
                onChange={handleUpload}
                disabled={uploading}
              />
            </label>
          )}
        </div>

        {attachError && <p className="text-xs text-red-400 mb-3">{attachError}</p>}
        {attachments.length === 0 && <p className="text-sm text-slate-500">No attachments yet.</p>}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {attachments.map((att) => (
            <motion.div
              key={att.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group rounded-2xl overflow-hidden border border-slate-700 bg-slate-950"
            >
              {isImageAttachment(att) ? (
                <>
                  <img src={getAttachmentUrl(att)} alt={att.originalFileName} className="w-full h-32 object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2">
                    <p className="text-xs text-slate-200 px-2 text-center line-clamp-2">{att.originalFileName}</p>
                    <div className="flex items-center gap-3">
                      <a href={getAttachmentUrl(att)} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-300 hover:text-cyan-200">Open</a>
                      <button onClick={() => handleDownloadAttachment(att)} className="text-xs text-emerald-300 hover:text-emerald-200">Download</button>
                      {(isOwner || canManage) && (
                        <button onClick={() => handleDeleteAttachment(att.id)} className="text-xs text-red-400 hover:text-red-300">Delete</button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-4 h-32 flex flex-col justify-between">
                  <p className="text-xs text-slate-200 line-clamp-2">{att.originalFileName}</p>
                  <div className="flex items-center gap-3">
                    <a href={getAttachmentUrl(att)} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-300 hover:text-cyan-200">Open</a>
                    <button onClick={() => handleDownloadAttachment(att)} className="text-xs text-emerald-300 hover:text-emerald-200">Download</button>
                    {(isOwner || canManage) && (
                      <button onClick={() => handleDeleteAttachment(att.id)} className="text-xs text-red-400 hover:text-red-300">Delete</button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-base font-semibold text-slate-100 mb-4">
          Comments <span className="text-slate-500 font-normal">({comments.length})</span>
        </h2>

        <div className="space-y-3 mb-5">
          {comments.length === 0 && <p className="text-sm text-slate-500">No comments yet.</p>}
          {comments.map((c) => {
            const canEdit = c.authorId === user?.id || isAdmin;
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-orange-300">{c.authorName}</p>
                  <p className="text-xs text-slate-500">{new Date(c.createdAt).toLocaleString("en-GB")}</p>
                </div>
                {editingId === c.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={2}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-orange-400 resize-none"
                    />
                    <div className="flex gap-2">
                      <Button onClick={() => handleUpdateComment(c.id)}>Save</Button>
                      <Button variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm text-slate-300 leading-relaxed">{c.content}</p>
                    {canEdit && (
                      <div className="flex shrink-0 gap-2">
                        <button
                          onClick={() => { setEditingId(c.id); setEditText(c.content); }}
                          className="text-xs text-slate-400 hover:text-orange-300 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteComment(c.id)}
                          className="text-xs text-slate-400 hover:text-red-400 transition"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="flex gap-3">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={2}
            placeholder="Add a comment…"
            className="flex-1 rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none focus:border-orange-400 resize-none transition"
          />
          <Button onClick={handleAddComment} disabled={commentLoading || !commentText.trim()}>
            {commentLoading ? "Posting…" : "Post"}
          </Button>
        </div>
      </Card>
    </PageShell>
  );
}

function Info({ label, value, highlight }) {
  return (
    <div>
      <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
      <p className={`text-sm mt-0.5 ${highlight ? "text-orange-300 font-medium" : "text-slate-200"}`}>{value}</p>
    </div>
  );
}

export default TicketDetailPage;