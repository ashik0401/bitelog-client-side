import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const ServeMeals = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: requests = [], isFetching } = useQuery({
    queryKey: ['mealRequests', searchQuery],
    queryFn: async () => {
      const res = await axiosSecure.get(`/meal-requests?search=${searchQuery}`);
      return res.data;
    }
  });

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  const handleServe = async (id) => {
    await axiosSecure.patch(`/meal-requests/${id}/serve`);
    queryClient.invalidateQueries(['mealRequests']);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Requested Meals</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="input input-bordered w-full max-w-xs"
          placeholder="Search by name or email"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>
      {isFetching ? (
        <div className="flex justify-center items-center h-40">
          <span className="loading loading-ring loading-md"></span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Meal Title</th>
                <th>User Name</th>
                <th>User Email</th>
                <th>Status</th>
                <th>Serve</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id}>
                  <td>{req.mealTitle}</td>
                  <td>{(req.userName).toUpperCase()}</td>
                  <td>{req.userEmail}</td>
                  <td>{req.status}</td>
                  <td>
                    {req.status !== 'delivered' ? (
                      <button
                        className="btn btn-sm btn-success"
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
      )}
    </div>
  );
};

export default ServeMeals;
