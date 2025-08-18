import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Pagination from '../../Components/Pagination/Pagination';

const ManageUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [querySearchTerm, setQuerySearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data = {}, isFetching } = useQuery({
    queryKey: ['users', querySearchTerm, currentPage],
    queryFn: async () => {
      const res = await axiosSecure.get('/users', {
        params: {
          search: querySearchTerm,
          page: currentPage,
          limit: itemsPerPage,
        },
      });
      return res.data;
    },
    keepPreviousData: true,
  });

  const users = data.users || [];
  const totalItems = data.totalCount || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuerySearchTerm(searchTerm.trim());
    setCurrentPage(1);
  };

  const makeAdmin = async (userId, name) => {
    const confirmed = await Swal.fire({
      title: 'Are you sure?',
      text: `Make ${name} an admin?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, make admin',
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    if (!confirmed.isConfirmed) return;

    const res = await axiosSecure.patch(`/users/admin/${userId}`);
    if (res.data.modifiedCount > 0) {
      await Swal.fire({
        title: 'Success!',
        text: `${name} is now an admin.`,
        icon: 'success',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
      queryClient.invalidateQueries(['users', querySearchTerm, currentPage]);
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-4">Manage Users</h2>

      <form onSubmit={handleSearch} className="mb-4 flex flex-wrap gap-2 items-center">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input  bg-white border border-black w-full md:w-1/2"
          autoComplete="off"
        />
        <button type="submit" className="btn text-white  bg-orange-500 border-none">
          Search
        </button>
      </form>

      {isFetching && <div className="text-center py-4 text-gray-600"><span className="loading loading-ring loading-sm"></span></div>}

      {!isFetching && users.length === 0 && (
        <div className="text-center py-4 text-gray-600">No users found.</div>
      )}

      {!isFetching && users.length > 0 && (
        <>
          <div className="overflow-x-auto border rounded-xl border-gray-300 shadow-xl">
            <table className="table w-full border border-gray-300">
              <thead>
                <tr className='text-black'>
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
                          className="btn btn-warning"
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
          <Pagination
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default ManageUsers;
