'use client';
import { signOut } from 'next-auth/react';
import { Session } from 'next-auth';

interface UserHeaderProps {
  session: Session;
}

export default function UserHeader({ session }: UserHeaderProps) {
  return (
    <div className="w-full p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <span className="text-sm">
          Signed in as {session.user?.email}
        </span>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
