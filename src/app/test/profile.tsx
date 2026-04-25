"use client";
import React, { useState } from "react";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileDetailsView from "../../components/profile/ProfileDetailsView";
import type { UserProfileData } from "../../components/profile/UserProfileView";
import UserProfileEdit from "../../components/profile/UserProfileEdit";

const initialProfile: UserProfileData = {
  name: "Katrin Kask",
  email: "katrin.kask@example.com",
  phone: "+372 5555 1234",
  bio: "Frontend developer & art lover.",
  avatarUrl: undefined,
};


import Link from "next/link";

export default function ProfileTestPage() {
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [profile, setProfile] = useState<UserProfileData>(initialProfile);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = (data: UserProfileData) => {
    setIsLoading(true);
    setTimeout(() => {
      setProfile(data);
      setMode("view");
      setIsLoading(false);
    }, 1200);
  };

  const handleCancel = () => {
    setMode("view");
  };

  return (
    <>
      <div className="mx-auto max-w-md px-6 pt-8">
        <Link href="/test" className="inline-block mb-6 text-blue-400 hover:underline">← Back to Test Pages</Link>
      </div>
      <div className="max-w-md mx-auto mt-2 p-6 border rounded shadow bg-neutral-900">
        <ProfileHeader
          name={profile.name}
          avatarUrl={profile.avatarUrl}
          role="Artist"
          status="Active"
        />
        <div className="mt-6">
          {mode === "view" ? (
            <>
              <ProfileDetailsView user={profile} />
              <button
                className="mt-4 bg-blue-600 text-white px-4 py-1 rounded focus:outline focus:ring-2 focus:ring-blue-400"
                onClick={() => setMode("edit")}
              >
                Edit
              </button>
            </>
          ) : (
            <UserProfileEdit
              data={profile}
              isLoading={isLoading}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}
        </div>
      </div>
    </>
  );
}
