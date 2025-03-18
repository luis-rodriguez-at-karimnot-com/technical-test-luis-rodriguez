'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/auth';
import { User } from '../../store/auth';
import { UserTable, Pagination, LoadingSpinner, ErrorMessage, DashboardHeader, UserFilters } from '@/components/dashboard';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const limit = 10;
  //const token = useAuthStore((state) => state.token)

  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'Admin') {
      router.push('/login');
    } else {
      fetchUsers(currentPage);
    }
  }, [user, router, currentPage, searchTerm, roleFilter, statusFilter]);

  const fetchUsers = async (page: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found');
      }

      const url = new URL('http://localhost:4000/users');
      url.searchParams.append('page', page.toString());
      url.searchParams.append('limit', limit.toString());
      if (searchTerm) url.searchParams.append('search', searchTerm);
      if (roleFilter) url.searchParams.append('role', roleFilter);
      if (statusFilter) url.searchParams.append('status', statusFilter);

      const res = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.log(res)
        setError('Failed to fetch users')
        //throw new Error('Failed to fetch users');
      }

      const data = await res.json();

      if (Array.isArray(data.data)) {
        setUsers(data.data);
        setTotalPages(data.totalPages || Math.ceil(data.totalItems / limit));
        setTotalItems(data.totalItems || data.data.length);
      } else {
        setError('Invalid data format');
      }
    } catch (err) {
      setError('Something went wrong');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (confirm('You are about to delete this user, Are you sure?')) {
      try {
        const token = localStorage.getItem('token');

        const res = await fetch(`http://localhost:4000/users/${userId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to delete user');
        }

        fetchUsers(currentPage);
      } catch (err) {
        setError('Error on user delete');
        console.error(err);
      }
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  const handleFilter = (filters: { role?: string; status?: string }) => {
    setRoleFilter(filters.role || '');
    setStatusFilter(filters.status || '');
    setCurrentPage(1); 
  };

  if (error) {
    return <ErrorMessage message={error} onRetry={() => fetchUsers(currentPage)} />;
  }

  return (
    <div className="container mx-auto p-6">
      <DashboardHeader title="Admin Dashboard" />

      <UserFilters onSearch={handleSearch} onFilter={handleFilter} />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <UserTable users={users} onDelete={handleDelete} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsCount={users.length}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}