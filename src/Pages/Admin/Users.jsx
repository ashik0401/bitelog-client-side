import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const Users = () => {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users', search],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?search=${search}`);
      return res.data;
    }
  });

  const makeAdmin = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.patch(`/users/admin/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    }
  });

  return (
    <div className="p-6">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or email"
        className="input input-bordered w-full max-w-md mb-4"
      />

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <table className="table w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th>Name</th>
              <th>Email</th>
              <th>Subscription</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name || 'N/A'}</td>
                <td>{user.email}</td>
                <td>{user.subscription || 'Free'}</td>
                <td>
                  {user.badge === 'Admin' ? (
                    <span className="badge badge-success">Admin</span>
                  ) : (
                    <button
                      onClick={() => makeAdmin.mutate(user._id)}
                      className="btn btn-sm btn-outline"
                    >
                      Make Admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Users;
