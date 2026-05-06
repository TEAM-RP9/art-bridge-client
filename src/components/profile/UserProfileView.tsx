export interface UserProfileData {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
}

interface UserProfileViewProps {
  data: UserProfileData;
}

const labelClass = "font-semibold text-white";
const valueClass = "text-white/90";

const UserProfileView = ({ data }: UserProfileViewProps) => (
  <div className="space-y-2">
    <div>
      <span className={labelClass}>Name:</span> <span className={valueClass}>{data.name}</span>
    </div>
    <div>
      <span className={labelClass}>Email:</span> <span className={valueClass}>{data.email}</span>
    </div>
    {data.phone && (
      <div>
        <span className={labelClass}>Phone:</span> <span className={valueClass}>{data.phone}</span>
      </div>
    )}
    {data.bio && (
      <div>
        <span className={labelClass}>Bio:</span> <span className={valueClass}>{data.bio}</span>
      </div>
    )}
  </div>
);

export default UserProfileView;
