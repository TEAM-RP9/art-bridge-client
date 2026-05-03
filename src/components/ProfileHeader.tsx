import Image from 'next/image';

interface ProfileHeaderProps {
  name: string;
  role: string;
  avatarUrl?: string;
  status: string;
}

// Placeholder UserAvatar component
const UserAvatar = ({ name, avatarUrl }: { name: string; avatarUrl?: string }) => {
  if (avatarUrl) {
    return <Image src={avatarUrl} alt={name} width={64} height={64} className="user-avatar" style={{ borderRadius: '50%' }} />;
  }
  // Initials fallback
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  return (
    <div className="user-avatar-fallback" style={{ width: 64, height: 64, borderRadius: '50%', background: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
      {initials}
    </div>
  );
};

const ProfileHeader = ({ name, role, avatarUrl, status }: ProfileHeaderProps) => {
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
