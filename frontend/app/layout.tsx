'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/auth';
import Link from 'next/link';
import '../styles/globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role === 'Admin') {
        router.push('/dashboard');
      } else if (user.role === 'User') {
        router.push('/users');
      }
    }
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <html lang="en">
      <body>
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href={user?.role === 'Admin' ? '/dashboard' : '/user'} className="text-xl font-bold text-indigo-600">
                Technical Test
                </Link>
              </div>
              <div className="flex items-center">
                {user && (
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center space-x-2 focus:outline-none"
                    >
                      <span className="text-gray-700">{user.firstName} {user.lastName}</span>
                      <svg
                        className="w-4 h-4 text-gray-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                        <Link
                          href={`/users/edit/${user.id}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Mi Perfil
                        </Link>
                        {user.role === 'Admin' && (
                          <Link
                            href="/dashboard"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Dashboard
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}