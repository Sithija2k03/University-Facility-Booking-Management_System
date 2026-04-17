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
} from "../api/ticketApi";
import PageShell from "../components/layout/PageShell";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const STATUS_STYLES = {
  OPEN:        "bg-blue-500/15 text-blue-300 border-blue-500/30",
  IN_PROGRESS: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  RESOLVED:    "bg-green-500/15 text-green-300 border-green-500/30",
  CLOSED:      "bg-slate-500/15 text-slate-400 border-slate-500/30",
  REJECTED:    "bg-red-500/15 text-red-300 border-red-500/30",
};

const PRIORITY_STYLES = {
  LOW:      "text-slate-400",
  MEDIUM:   "text-yellow-400",
  HIGH:     "text-orange-400",
  CRITICAL: "text-red-400 font-semibold",
};

function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, credentials, buildBasicAuthHeader } = useAuth();

  const [ticket, setTicket]           = useState(null);
  const [comments, setComments]       = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");

  // comment form
  const [commentText, setCommentText]   = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [editingId, setEditingId]       = useState(null);
  const [editText, setEditText]         = useState("");

  // attachment
  const [uploading, setUploading] = useState(false);
  const [attachError, setAttachError] = useState("");

  const authHeader = buildBasicAuthHeader(credentials.email, credentials.password);

  // ── fetch all data ─────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [tRes, cRes, aRes] = await Promise.all([
          getTicketById(id, authHeader),
          getComments(id, authHeader),
          getAttachments(id, authHeader),
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

  // ── comments ───────────────────────────────────────────────────────────────
  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    setCommentLoading(true);
    try {
      const res = await addComment(id, { authorId: user.id, content: commentText }, authHeader);
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
      const res = await updateComment(id, commentId, user.id, { content: editText }, authHeader);
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
      await deleteComment(id, commentId, user.id, authHeader);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete comment.");
    }
  };

  // ── attachments ────────────────────────────────────────────────────────────
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAttachError("");
    if (attachments.length >= 3) {
      setAttachError("Maximum 3 attachments allowed.");
      return;
    }
    setUploading(true);
    try {
      const res = await uploadAttachment(id, file, authHeader);
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
      await deleteAttachment(id, attachmentId, authHeader);
      setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete attachment.");
    }
  };

  // ── render ─────────────────────────────────────────────────────────────────
  if (loading) return <p className="p-8 text-slate-400 animate-pulse">Loading ticket…</p>;
  if (error)   return <p className="p-8 text-red-400">{error}</p>;
  if (!ticket) return null;

  const isOwner    = user.id === ticket.reporterId;
  const isAdmin    = user.role === "ADMIN";
  const isTech     = user.role === "TECHNICIAN";
  const canManage  = isAdmin || isTech;

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
          <Button variant="ghost" onClick={() => navigate(-1)}>← Back</Button>
        </div>
      }
    >
      {/* ── TICKET INFO ── */}
      <Card>
        <div className="flex flex-wrap gap-3 mb-4">
          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${STATUS_STYLES[ticket.status] ?? ""}`}>
            {ticket.status.replace("_", " ")}
          </span>
          <span className={`text-sm font-medium ${PRIORITY_STYLES[ticket.priority] ?? ""}`}>
            {ticket.priority} priority
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Description</p>
            <p className="text-sm text-slate-200 leading-relaxed">{ticket.description}</p>
          </div>
          <div className="space-y-3">
            <Info label="Reported by"    value={ticket.reporterName} />
            <Info label="Location"       value={ticket.locationText} />
            <Info label="Contact"        value={ticket.preferredContact} />
            <Info label="Submitted"      value={new Date(ticket.createdAt).toLocaleString("en-GB")} />
            {ticket.assignedTechnicianName && (
              <Info label="Technician" value={ticket.assignedTechnicianName} highlight />
            )}
            {ticket.resolutionNotes && (
              <Info label="Resolution Notes" value={ticket.resolutionNotes} />
            )}
          </div>
        </div>
      </Card>

      {/* ── ATTACHMENTS ── */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-100">
            Attachments <span className="text-slate-500 font-normal">({attachments.length}/3)</span>
          </h2>
          {attachments.length < 3 && (isOwner || canManage) && (
            <label className="inline-flex items-center gap-2 cursor-pointer rounded-2xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-300 hover:bg-slate-700 transition">
              {uploading ? "Uploading…" : "+ Upload Image"}
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
          )}
        </div>

        {attachError && <p className="text-xs text-red-400 mb-3">{attachError}</p>}

        {attachments.length === 0 && (
          <p className="text-sm text-slate-500">No attachments yet.</p>
        )}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {attachments.map((att) => (
            <motion.div
              key={att.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group rounded-2xl overflow-hidden border border-slate-700 bg-slate-950"
            >
              <img
                src={`http://localhost:8080/uploads/tickets/${id}/${att.storedFileName}`}
                alt={att.originalFileName}
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2">
                <p className="text-xs text-slate-200 px-2 text-center line-clamp-2">{att.originalFileName}</p>
                {(isOwner || canManage) && (
                  <button
                    onClick={() => handleDeleteAttachment(att.id)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* ── COMMENTS ── */}
      <Card>
        <h2 className="text-base font-semibold text-slate-100 mb-4">
          Comments <span className="text-slate-500 font-normal">({comments.length})</span>
        </h2>

        <div className="space-y-3 mb-5">
          {comments.length === 0 && (
            <p className="text-sm text-slate-500">No comments yet.</p>
          )}
          {comments.map((c) => {
            const canEdit = c.authorId === user.id || isAdmin;
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-orange-300">{c.authorName}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(c.createdAt).toLocaleString("en-GB")}
                  </p>
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

        {/* Add comment */}
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
