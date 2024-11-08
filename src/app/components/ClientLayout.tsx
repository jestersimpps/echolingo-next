'use client';
import { useSession } from 'next-auth/react';
import AuthForm from './AuthForm';
import UserHeader from './UserHeader';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      {!session && status !== "loading" && <AuthForm />}
      
      {session && (
        <div className="flex flex-col">
          <UserHeader session={session} />
          {children}
        </div>
      )}
    </>
  );
}
