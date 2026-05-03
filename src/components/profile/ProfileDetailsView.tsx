export interface ProfileDetailsViewProps {
  user: {
    email: string;
    phone?: string;
    bio?: string;
  };
}

const ProfileDetailsView = ({ user }: ProfileDetailsViewProps) => (
  <div className="space-y-3">
    <div>
      <span className="block text-xs text-blue-200">Email</span>
      <span className="block text-base text-white">{user.email}</span>
    </div>
    {user.phone && (
      <div>
        <span className="block text-xs text-blue-200">Phone</span>
        <span className="block text-base text-white">{user.phone}</span>
      </div>
    )}
    {user.bio && (
      <div>
        <span className="block text-xs text-blue-200">Bio</span>
        <span className="block text-base text-white">{user.bio}</span>
      </div>
    )}
  </div>
);

export default ProfileDetailsView;
