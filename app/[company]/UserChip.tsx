"use client";

import Image from "next/image";
import { useUser } from "../../lib/context/UserContext";

export function UserChip() {
  const { user, loading } = useUser();
  return loading ? (
    <div className="flex gap-3 items-center">
      <div className="h-6 w-24 animate-pulse bg-slate-700 rounded-md" />
      <div className="h-10 w-10 animate-pulse bg-slate-700 rounded-full" />
    </div>
  ) : user ? (
    <div className="flex gap-3 items-center">
      <span className="italic text-slate-400">Welcome back</span>
      <span className="font-semibold">{user.username}</span>
      <Image
        alt="Your profile picture"
        src={user.profilePicUrl}
        width={40}
        height={40}
        className="rounded-full"
      />
    </div>
  ) : (
    <div></div>
  );
}
