import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Pagination from "../../Components/Pagination/Pagination";

const itemsPerPage = 10;

const AllReviewsTable = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState("asc"); // ⬅️ initially least reviews first
  const [currentPage, setCurrentPage] = useState(1);

  const { data = {}, isLoading } = useQuery({
    queryKey: ["allMeals", sortOrder, currentPage],
    queryFn: async () => {
      const res = await axiosSecure.get(`/meals`, {
        params: {
          sortBy: "reviews_count",
          order: sortOrder,
          page: currentPage,
          limit: itemsPerPage,
          hasReviewsOnly: true,
        },
      });
      return res.data;
    },
  });

  const meals = data.meals || [];
  const totalCount = data.totalCount || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setCurrentPage(1);
  };

  const deleteMeal = async (id) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (!confirmed.isConfirmed) return;
    await axiosSecure.delete(`/meals/${id}`);
    Swal.fire({
      title: "Deleted!",
      text: "Meal has been deleted.",
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });
    queryClient.invalidateQueries(["allMeals"]);
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">All Meal Reviews</h2>
        <button onClick={toggleSortOrder} className="btn btn-sm">
          {sortOrder === "asc"
            ? "Sort by Most Reviews ↓"
            : "Sort by Least Reviews ↑"}
        </button>
      </div>
      <div className="overflow-x-auto shadow-xl border border-gray-200 rounded-xl">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="text-black">
              <th className="text-center">Title</th>
              <th className="text-center">Likes</th>
              <th className="text-center">Reviews</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {meals.map((meal) => (
              <tr key={meal._id} className="border-none">
                <td className="bg-white text-center">{meal.title}</td>
                <td className="bg-white text-center">{meal.likes}</td>
                <td className="bg-white text-center">{meal.reviews_count}</td>
                <td className="flex items-center justify-center space-x-2 bg-white ">
                  <button
                    className="btn btn-xs btn-info bg-white "
                    onClick={() => navigate(`/Meals/${meal._id}`)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-xs btn-error"
                    onClick={() => deleteMeal(meal._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination
          totalItems={totalCount}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default AllReviewsTable;