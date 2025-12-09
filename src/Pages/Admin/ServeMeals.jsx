import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Pagination from "../../Components/Pagination/Pagination";

const ServeMeals = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data = {}, isFetching } = useQuery({
    queryKey: ['mealRequests', searchQuery, currentPage],
    queryFn: async () => {
      const res = await axiosSecure.get('/meal-requests', {
        params: {
          search: searchQuery,
          page: currentPage,
          limit: itemsPerPage,
        },
      });
      return res.data;
    },
    keepPreviousData: true,
  });

  const requests = data.requests || [];
  const totalItems = data.totalCount || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  const handleServe = async (id) => {
    await axiosSecure.patch(`/meal-requests/${id}/serve`);
    queryClient.invalidateQueries(['mealRequests']);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="sm:p-4 p-2">
      <h2 className="text-3xl font-bold mb-4 ">Requested Meals</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="input border border-gray-300 bg-white w-full max-w-xs "
          placeholder="Search by name or email"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button className="btn  bg-[#066303]  border-none" onClick={handleSearch}>
          Search
        </button>
      </div>
      {isFetching ? (
        <div className="flex justify-center items-center h-40">
          <span className="loading loading-ring loading-md"></span>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto shadow-xl border border-gray-200 rounded-xl">
            <table className="table whitespace-nowrap w-full">
              <thead>
                <tr className="text-black  bg-gray-200">
                  <th className="text-center">Meal Title</th>
                  <th className="text-center">User Name</th>
                  <th className="text-center">User Email</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Serve</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req._id}>
                    <td className=" text-center">{req.mealTitle}</td>
                    <td className=" text-center">{req.userName.toUpperCase()}</td>
                    <td className=" text-center">{req.userEmail}</td>
                    <td className=" text-center">{req.status}</td>
                    <td className=" text-center">
                      {req.status !== 'delivered' ? (
                        <button
                          className="btn btn-xs btn-success"
                          onClick={() => handleServe(req._id)}
                        >
                          Serve
                        </button>
                      ) : (
                        <span className="text-green-600">Served</span>
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

export default ServeMeals;