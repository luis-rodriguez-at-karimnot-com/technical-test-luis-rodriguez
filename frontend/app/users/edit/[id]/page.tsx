'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import UserForm from '@/components/users/UserForm';
import { LoadingSpinner } from '@/components/dashboard';

export default function EditUserPage() {
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
        const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:4000/users/${id}`, {
        method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        router.push('/dashboard');
      }
    };

    if (id) fetchUser();
  }, [id, router]);

  return user ? <UserForm user={user} isEdit={true} /> : <LoadingSpinner /> ;
}
