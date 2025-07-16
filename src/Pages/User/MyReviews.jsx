import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import Pagination from "../../Components/Pagination/Pagination";

const MyReviews = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["myReviews", user?.email, page],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/reviews/user/${user.email}?page=${page}&limit=${limit}`, {
        credentials: "include"
      });
      const { reviews, totalCount } = res.data;
      const mealIds = [...new Set(reviews.map((r) => r.mealId))];
      if (!mealIds.length) return { reviews: [], totalCount };
      const mealsRes = await axiosSecure.get("/meals-by-ids", {
        params: { ids: mealIds.join(",") }
      });
      const meals = mealsRes.data;
      const mealsMap = {};
      meals.forEach((meal) => {
        mealsMap[meal._id] = meal;
      });
      const enriched = reviews.map((review) => ({
        ...review,
        likes: mealsMap[review.mealId]?.likes || 0
      }));
      return { reviews: enriched, totalCount };
    }
  });

  const reviews = data?.reviews || [];
  const totalCount = data?.totalCount || 0;

  const deleteReview = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/reviews/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myReviews"]);
      Swal.fire({
        title: "Deleted!",
        text: "Your review has been removed.",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        allowOutsideClick: false,
        allowEscapeKey: false
      });
    },
    onError: () => {
      Swal.fire({
        title: "Error!",
        text: "Failed to delete review.",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  });

  const updateReview = useMutation({
    mutationFn: async ({ id, text }) => {
      const res = await axiosSecure.patch(`/reviews/${id}`, { text });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myReviews"]);
      setEditingId(null);
      setEditText("");
      Swal.fire({
        title: "Updated!",
        text: "Your review has been updated.",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        allowOutsideClick: false,
        allowEscapeKey: false
      });
    },
    onError: () => {
      Swal.fire({
        title: "Error!",
        text: "Failed to update review.",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  });

  const handleEditClick = (id, currentText) => {
    setEditingId(id);
    setEditText(currentText);
  };

  const handleSaveEdit = () => {
    if (!editText.trim()) return;
    updateReview.mutate({ id: editingId, text: editText });
  };

  const handleDeleteClick = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((result) => {
      if (result.isConfirmed) {
        deleteReview.mutate(id);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Reviews</h2>
      {totalCount === 0 ? (
        <p className="text-center text-gray-500">You haven't posted any reviews yet.</p>
      ) : (
        <>
          <div className="overflow-x-auto sm:overflow-x-visible shadow-xl rounded-xl border border-gray-200">
            <table className="table w-full table-zebra">
              <thead className="bg-base-200">
                <tr>
                  <th>Meal Title</th>
                  <th>Likes</th>
                  <th>Review</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review._id}>
                    <td>{review.mealTitle}</td>
                    <td>{review.likes || 0}</td>
                    <td>
                      {editingId === review._id ? (
                        <textarea
                          className="textarea textarea-bordered w-full"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                        />
                      ) : (
                        <p>{review.text}</p>
                      )}
                    </td>
                    <td className="space-x-1">
                      {editingId === review._id ? (
                        <button className="btn btn-sm btn-success" onClick={handleSaveEdit}>
                          Save
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => handleEditClick(review._id, review.text)}
                        >
                          Edit
                        </button>
                      )}
                      <button className="btn btn-sm btn-error" onClick={() => handleDeleteClick(review._id)}>
                        Delete
                      </button>
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => navigate(`/Meals/${review.mealId}`)}
                      >
                        View Meal
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            totalItems={totalCount}
            itemsPerPage={limit}
            currentPage={page}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};

export default MyReviews;
