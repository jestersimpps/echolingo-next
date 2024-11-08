'use client';
import { signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import { useState } from 'react';

interface UserHeaderProps {
  session: Session;
}

export default function UserHeader({ session }: UserHeaderProps) {
  const [exporting, setExporting] = useState(false);

  const exportTranslations = async () => {
    try {
      setExporting(true);
      const response = await fetch('/api/translations/export');
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `translations-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting translations:', error);
    } finally {
      setExporting(false);
    }
  };
  return (
    <div className="user-header">
      <div className="user-header-content">
        <span className="user-email">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          {session.user?.email}
        </span>
        <div className="flex gap-2">
          <button
            onClick={exportTranslations}
            disabled={exporting}
            className="header-button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
          <button
            onClick={() => signOut()}
            className="header-button"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
