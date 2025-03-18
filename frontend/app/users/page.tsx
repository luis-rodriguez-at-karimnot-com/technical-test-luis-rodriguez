'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/auth';
import { User } from '../../store/auth';
import { LoadingSpinner } from '@/components/dashboard';

export default function UserPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'User') {
      router.push('/login');
    } else {
      setUserData(user);
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">User Profile</h2>
        {userData ? (
          <div className="space-y-6">


            {userData.profilePicture && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Profile Picture</h3>
                <div className="flex justify-center">
                  <img
                    src={userData.profilePicture}
                    alt="Profile Picture"
                    className="h-32 w-32 rounded-full object-cover"
                  />
                </div>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">First Name</label>
                  <p className="mt-1 text-lg text-gray-900">{userData.firstName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Last Name</label>
                  <p className="mt-1 text-lg text-gray-900">{userData.lastName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email</label>
                  <p className="mt-1 text-lg text-gray-900">{userData.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                  <p className="mt-1 text-lg text-gray-900">{userData.phoneNumber}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Role</label>
                  <p className="mt-1 text-lg text-gray-900">{userData.role}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Status</label>
                  <p className="mt-1 text-lg text-gray-900">{userData.status}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Street</label>
                  <p className="mt-1 text-lg text-gray-900">{userData.address.street}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Number</label>
                  <p className="mt-1 text-lg text-gray-900">{userData.address.number}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">City</label>
                  <p className="mt-1 text-lg text-gray-900">{userData.address.city}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Postal Code</label>
                  <p className="mt-1 text-lg text-gray-900">{userData.address.postalCode}</p>
                </div>
              </div>
            </div>


          </div>
        ) : (
          <LoadingSpinner/>
        )}
      </div>
    </div>
  );
}