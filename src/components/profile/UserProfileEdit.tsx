import React, { useState } from "react";
import { UserProfileData } from "./UserProfileView";

interface UserProfileEditProps {
  data: UserProfileData;
  isLoading?: boolean;
  onSave: (data: UserProfileData) => void;
  onCancel: () => void;
}

const UserProfileEdit: React.FC<UserProfileEditProps> = ({ data, isLoading = false, onSave, onCancel }) => {
  const [form, setForm] = useState<UserProfileData>(data);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  const handleCancel = () => {
    setForm(data);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div>
        <label htmlFor="profile-name" className="block font-medium">Name</label>
        <input
          id="profile-name"
          name="name"
          value={form.name}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div>
        <label htmlFor="profile-email" className="block font-medium">Email</label>
        <input
          id="profile-email"
          name="email"
          value={form.email}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div>
        <label htmlFor="profile-phone" className="block font-medium">Phone</label>
        <input
          id="profile-phone"
          name="phone"
          value={form.phone || ""}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div>
        <label htmlFor="profile-bio" className="block font-medium">Bio</label>
        <textarea
          id="profile-bio"
          name="bio"
          value={form.bio || ""}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div className="flex gap-2 mt-2">
        <button type="submit" disabled={isLoading} className="bg-blue-600 text-white px-4 py-1 rounded">
          {isLoading ? <span className="animate-spin">⏳</span> : "Save"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={isLoading}
          className={
            `px-4 py-1 rounded transition font-medium ` +
            (isLoading
              ? "bg-gray-300 text-gray-400 opacity-50 cursor-not-allowed"
              : "bg-gray-200 text-gray-900 hover:bg-gray-300 hover:text-black cursor-pointer focus:outline focus:ring-2 focus:ring-blue-400")
          }
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default UserProfileEdit;
