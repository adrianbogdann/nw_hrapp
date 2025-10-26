import { useState } from "react";
import { updateProfile } from "../lib/api";
import { toast } from "sonner";

interface ProfileFormProps {
  editable: boolean;
  data: any;
}

export default function ProfileForm({ editable, data }: ProfileFormProps) {
  const [form, setForm] = useState(data);
  const [status, setStatus] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(form.id, form);
      toast.success("Profile saved successfully ✅");
    } catch {
       toast.error("Save profile details failed");
      setStatus("Save profile details failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white rounded-2xl shadow space-y-5"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label htmlFor="first_name" className="text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            id="first_name"
            disabled={!editable}
            name="first_name"
            value={form.first_name || ""}
            onChange={handleChange}
            placeholder="Enter first name"
            className="border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="last_name" className="text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            id="last_name"
            disabled={!editable}
            name="last_name"
            value={form.last_name || ""}
            onChange={handleChange}
            placeholder="Enter last name"
            className="border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>
      </div>

      <div className="flex flex-col">
        <label htmlFor="location" className="text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          id="location"
          disabled={!editable}
          name="location"
          value={form.location || ""}
          onChange={handleChange}
          placeholder="Enter location"
          className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-1">
          Phone
        </label>
        <input
          id="phone"
          disabled={!editable}
          name="phone"
          value={form.phone || ""}
          onChange={handleChange}
          placeholder="Enter phone number"
          className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
        />
      </div>

      {editable && (
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Save
        </button>
      )}
      {status && <p className="text-sm text-gray-500">{status}</p>}
    </form>
  );
}