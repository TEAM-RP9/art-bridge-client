import React from 'react';

interface ProfileHeaderProps {
  name: string;
  role: string;
  avatarUrl?: string;
  status: string;
}

// Placeholder UserAvatar component
const UserAvatar: React.FC<{ name: string; avatarUrl?: string }> = ({ name, avatarUrl }) => {
  if (avatarUrl) {
    return <img src={avatarUrl} alt={name} className="user-avatar" style={{ width: 64, height: 64, borderRadius: '50%' }} />;
  }
  // Initials fallback
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  return (
    <div className="user-avatar-fallback" style={{ width: 64, height: 64, borderRadius: '50%', background: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
      {initials}
    </div>
  );
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, role, avatarUrl, status }) => {
  return (
    <div className="profile-header" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <UserAvatar name={name} avatarUrl={avatarUrl} />
      <div>
        <div style={{ fontWeight: 600, fontSize: 20 }}>{name}</div>
        <div style={{ color: '#666' }}>{role}</div>
        <span className="status-badge" style={{ background: '#eee', borderRadius: 12, padding: '2px 10px', fontSize: 12 }}>{status}</span>
      </div>
    </div>
  );
};

export default ProfileHeader;
