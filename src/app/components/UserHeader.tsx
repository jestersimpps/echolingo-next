'use client';
import { signOut } from 'next-auth/react';
import { Session } from 'next-auth';

interface UserHeaderProps {
  session: Session;
}

export default function UserHeader({ session }: UserHeaderProps) {
  return (
    <div className="user-header">
      <div className="user-header-content">
        <span className="user-email">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          {session.user?.email}
        </span>
        <button
          onClick={() => signOut()}
          className="signout-button"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
