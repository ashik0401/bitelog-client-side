import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const ManageUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [querySearchTerm, setQuerySearchTerm] = useState('');
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: users = [], isFetching } = useQuery({
    queryKey: ['users', querySearchTerm],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?search=${encodeURIComponent(querySearchTerm)}`);
      return res.data;
    },
    enabled: true,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setQuerySearchTerm(searchTerm.trim());
  };

  const makeAdmin = async (userId, name) => {
    const confirmed = await Swal.fire({
      title: 'Are you sure?',
      text: `Make ${name} an admin?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, make admin',
    });

    if (!confirmed.isConfirmed) return;

    const res = await axiosSecure.patch(`/users/admin/${userId}`);
    if (res.data.modifiedCount > 0) {
      Swal.fire('Success!', `${name} is now an admin.`, 'success');
      queryClient.invalidateQueries(['users', querySearchTerm]);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>

      <form onSubmit={handleSearch} className="mb-4 flex flex-wrap gap-2 items-center">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full md:w-1/2"
          autoComplete="off"
        />
        <button type="submit" className="btn text-white btn-primary btn-sm">
          Search
        </button>
      </form>

      {isFetching && <div className="text-center py-4 text-gray-600">Loading users...</div>}

      {!isFetching && users.length === 0 && (
        <div className="text-center py-4 text-gray-600">No users found.</div>
      )}

      {!isFetching && users.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table w-full border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 text-center">User Name</th>
                <th className="border border-gray-300 text-center">Email</th>
                <th className="border border-gray-300 text-center">Subscription</th>
                <th className="border border-gray-300 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="border border-gray-200 text-center font-medium">
                    {user.name?.toUpperCase()}
                  </td>
                  <td className="border border-gray-200 text-center">{user.email}</td>
                  <td className="border border-gray-200 text-center">
                    {user.subscriptionStatus || 'Not Subscribed'}
                  </td>
                  <td className="border border-gray-200 text-center">
                    {user.role === 'admin' ? (
                      <span className="text-green-600 font-semibold">Admin</span>
                    ) : (
                      <button
                        className="btn btn-xs btn-warning"
                        onClick={() => makeAdmin(user._id, user.name)}
                      >
                        Make Admin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
