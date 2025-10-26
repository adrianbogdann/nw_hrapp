import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

interface FeedbackFormProps {
  onNewFeedback: (fb: any) => void;
}

export default function FeedbackForm({ onNewFeedback }: FeedbackFormProps) {
  const { user } = useAuth();
  const [users, setUsers] = useState<{ id: number; email: string }[]>([]);
  const [toUserId, setToUserId] = useState<number | null>(null);
  const [content, setContent] = useState("");
  const [polish, setPolish] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/users").then(res => setUsers(res.data || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toUserId || !content.trim()) return;

    setLoading(true);
    try {
      const { data } = await api.post(`/feedback/${toUserId}`, {
        toUserId,
        content,
        polish,
      });
      onNewFeedback(data);
      setContent("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-6">
      <div>
        <Label htmlFor="toUser">To</Label>
        <select
          id="toUser"
          className="w-full border rounded-md p-2 bg-background text-foreground"
          value={toUserId || ""}
          onChange={e => setToUserId(Number(e.target.value))}
        >
          <option value="">Select user...</option>
          {users.filter(u => u.id !== user!.id).map(u => (
            <option key={u.id} value={u.id}>
              {u.email}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="content">Feedback</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e:any) => setContent(e.target.value)}
          placeholder="Write feedback..."
          className="min-h-[100px]"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch checked={polish} onCheckedChange={setPolish} />
          <Label>Polish with AI</Label>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </Button>
      </div>
    </form>
  );
}