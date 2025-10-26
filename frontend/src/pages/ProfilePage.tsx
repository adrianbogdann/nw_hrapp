import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getProfile, requestAbsence, getAbsences, updateAbsenceStatus } from "../lib/api";
import ProfileForm from "../components/ProfileForm";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [absences, setAbsences] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [absenceStart, setAbsenceStart] = useState("");
  const [absenceEnd, setAbsenceEnd] = useState("");
  const [absenceReason, setAbsenceReason] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) {
      navigate("/login", { replace: true });
      return;
    }
    (async () => {
      try {
        const [profileData, absencesData] = await Promise.all([
          getProfile(user.id),
          user.role === "manager" ? getAbsences(true) : getAbsences(),
        ]);
        setProfile(profileData);
        setAbsences(absencesData || []);
      } catch {
        setError("Failed to load profile or absences");
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const handleSubmitAbsence = async () => {
    if (!absenceStart || !absenceEnd || !absenceReason.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      await requestAbsence({
        start_date: absenceStart,
        end_date: absenceEnd,
        reason: absenceReason,
      });
      toast.success("Absence request submitted!");
      setShowModal(false);
      setAbsenceStart("");
      setAbsenceEnd("");
      setAbsenceReason("");

      const updated = await getAbsences();
      setAbsences(updated || []);
    } catch {
      toast.error("Failed to submit absence");
    }
  };

  const handleUpdateStatus = async (id: number, status: "approved" | "rejected") => {
    try {
      await updateAbsenceStatus(id, status);
      toast.success(`Absence ${status}`);
      setAbsences(prev =>
        prev.map(a => (a.id === id ? { ...a, status } : a))
      );
    } catch {
      toast.error("Failed to update absence status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!profile) return null;

  const editable = user?.role === "manager"

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {profile.first_name} {profile.last_name}
        </h1>
        {user?.role === "employee" && (
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Request Absence
          </button>
        )}
      </header>

      <ProfileForm editable={editable} data={profile} />

      {user?.role === "employee" && (
        <section>
          <h2 className="text-lg font-semibold mb-3">Your Absence Requests</h2>
          <AbsenceTable absences={absences} getStatusColor={getStatusColor} />
        </section>
      )}

      {user?.role === "manager" && (
        <AbsenceTable absences={absences} managerView={true} handleUpdateStatus={handleUpdateStatus} getStatusColor={getStatusColor} />
      )}

      {/* Modal for new absence */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
              <h2 className="text-xl font-semibold mb-4">Request Absence</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={absenceStart}
                    onChange={(e) => setAbsenceStart(e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={absenceEnd}
                    onChange={(e) => setAbsenceEnd(e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Reason
                  </label>
                  <textarea
                    value={absenceReason}
                    onChange={(e) => setAbsenceReason(e.target.value)}
                    rows={3}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                    placeholder="Describe your reason..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-md border hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitAbsence}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
      )}
    </div>
  );
}

function AbsenceTable({ absences, managerView, handleUpdateStatus, getStatusColor }: any) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            {managerView &&  <th className="py-2 px-4 text-left">Employee</th>}
            <th className="py-2 px-4 text-left">Period</th>
            <th className="py-2 px-4 text-left">Reason</th>
            <th className="py-2 px-4 text-left">Status</th>
             {managerView &&  <th className="py-2 px-4 text-left">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {absences.map((a: any) => (
            <tr key={a.id} className="border-t">
              {managerView && <td className="py-2 px-4">{a.email || "Unknown"}</td>}
              <td className="py-2 px-4">{a.start_date} → {a.end_date}</td>
              <td className="py-2 px-4">{a.reason}</td>
              <td className="py-2 px-4">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(a.status || "pending")}`}
                >
                  {a.status || "pending"}
                </span>
              </td>
              {managerView &&       
                <td className="py-2 px-4 flex gap-2">
                  {a.status === "pending" && 
                    (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(a.id, "approved")}
                          className="px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(a.id, "rejected")}
                          className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </>
                    )
                  }
                  </td>
                }
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
