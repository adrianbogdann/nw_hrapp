import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  getGivenFeedback,
  getReceivedFeedback,
  updateFeedback,
  deleteFeedback,
} from "../lib/api";
import { useAuth } from "../context/AuthContext";
import FeedbackForm from "../components/FeedbackForm";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Feedback {
  id: number;
  content: string;
  polished?: string;
  from_user: { id: number; email: string; role: string };
  to_user_id: { id: number; email: string; role: string };
  created_at: string;
}

export default function FeedbackPage() {
  const { user } = useAuth();
  const [given, setGiven] = useState<Feedback[]>([]);
  const [received, setReceived] = useState<Feedback[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    (async () => {
      const rcv = await getReceivedFeedback(user.id);
      setReceived(rcv || []);
      if (user.role !== "employee") {
        const gvn = await getGivenFeedback();
        setGiven(gvn || []);
      }
    })();
  }, [user]);

  const startEdit = (fb: Feedback) => {
    setEditingId(fb.id);
    setEditText(fb.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const saveEdit = async (id: number) => {
    const updated = await updateFeedback(id, {
      content: editText,
      repolish: true,
    });
    setGiven((prev) => prev.map((f) => (f.id === id ? updated : f)));
    setReceived((prev) => prev.map((f) => (f.id === id ? updated : f)));
    cancelEdit();
  };

const confirmDelete = (id: number) => {
  setDeleteId(id);
  setShowConfirm(true);
};

const handleDelete = async () => {
  if (!deleteId) return;
  try {
    await deleteFeedback(deleteId);
    setGiven((prev) => prev.filter((f) => f.id !== deleteId));
    setReceived((prev) => prev.filter((f) => f.id !== deleteId));
    setShowConfirm(false);
    setDeleteId(null);
    toast.success("Feedback deleted successfully");
  } catch {
    toast.error("Failed to delete feedback");
  }
};

  const isEmployee = user?.role === "employee";
  const isCoWorker = user?.role === "coworker";
  const isManager = user?.role === "manager";

   if (isEmployee) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
        <h1 className="text-2xl font-semibold text-red-600 mb-2">
          Access Denied
        </h1>
        <p className="text-gray-600 max-w-md">
          You don’t have permission to view the feedback page.  
          Please contact your manager if you believe this is an error.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`p-3`}
    >
      {/* Only visible to managers and above */}
      {(isCoWorker || isManager)  && (
        <Card>
          <h2 className="text-lg font-semibold mb-3">Your Given Feedback</h2>
          <div className="space-y-3">
            {given.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No feedback given yet.
              </p>
            ) : (
              given.map((fb) => (
                <div key={fb.id} className="rounded-lg border bg-background p-3">
                  {editingId === fb.id ? (
                    <div className="space-y-2">
                      <textarea
                        className="w-full border rounded-md p-2"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(fb.id)}
                          className="px-3 py-1 rounded-md bg-primary text-white"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-3 py-1 rounded-md border"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => confirmDelete(fb.id)}
                          className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-sm">{fb.content}</p>
                      {fb.polished && (
                        <p className="text-xs text-muted-foreground italic">
                          Polished: {fb.polished}
                        </p>
                      )}
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => startEdit(fb)}
                          className="px-3 py-1 rounded-md border"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => confirmDelete(fb.id)}
                          className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </Card>
      )}

      {isManager && 
        (<Card>
          <h2 className="text-lg font-semibold mb-3">Received Feedback</h2>
          <div className="space-y-3">
            {received.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No feedback received yet.
              </p>
            ) : (
              received.map((fb) => (
                <div key={fb.id} className="rounded-lg border bg-background p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">
                      {fb.from_user?.email}
                    </span>
                    {fb.from_user?.role && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          fb.from_user.role === "manager"
                            ? "bg-blue-600 text-white"
                            : fb.from_user.role === "employee"
                            ? "bg-gray-500 text-white"
                            : "bg-green-600 text-white"
                        }`}
                      >
                        {fb.from_user.role}
                      </span>
                    )}
                  </div>
                  <p className="text-sm">{fb.content}</p>
                  {fb.polished && (
                    <p className="text-xs text-muted-foreground italic mt-1">
                      Polished: {fb.polished}
                    </p>
                  )}
                  {user?.role === "manager" && (
                    <div className="flex gap-2 pt-2">
                      <button
                          onClick={() => confirmDelete(fb.id)}
                          className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </Card>)
      }

      {/* Feedback form — hidden for employees */}
      {(isCoWorker || isManager) && (
        <Card>
          <FeedbackForm onNewFeedback={(f) => setGiven((prev) => [f, ...prev])} />
        </Card>
      )}

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">
              Confirm Deletion
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this feedback?  
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setDeleteId(null);
                }}
                className="px-4 py-2 border rounded-md hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
