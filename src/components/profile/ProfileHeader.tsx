import React from "react";

interface ProfileHeaderProps {
  name: string;
  avatarUrl?: string;
  role: string;
  status: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0]?.toUpperCase() || "")
    .join("");
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, avatarUrl, role, status }) => (
  <div className="flex items-center gap-4">
    {avatarUrl ? (
      <img
        src={avatarUrl}
        alt={name}
        className="w-16 h-16 rounded-full object-cover border border-white"
      />
    ) : (
      <div className="w-16 h-16 rounded-full bg-blue-700 flex items-center justify-center text-2xl font-bold border border-white text-white">
        {getInitials(name)}
      </div>
    )}
    <div>
      <div className="text-xl font-semibold text-white drop-shadow">{name}</div>
      <div className="text-sm text-blue-200">{role}</div>
      <span className="inline-block mt-1 bg-green-700 text-white text-xs px-3 py-1 rounded-full">{status}</span>
    </div>
  </div>
);

export default ProfileHeader;
