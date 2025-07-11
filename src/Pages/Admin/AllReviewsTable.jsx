import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const AllReviewsTable = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [sortBy, setSortBy] = useState("postTime");
    const [order, setOrder] = useState("desc");

    const { data: meals = [], isLoading } = useQuery({
        queryKey: ["allMeals", sortBy, order],
        queryFn: async () => {
            const res = await axiosSecure.get(`/meals?sortBy=${sortBy}&order=${order}`);
            return res.data;
        },
    });

    const toggleSortByReviews = () => {
        if (sortBy === "reviews_count") {
            setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortBy("reviews_count");
            setOrder("desc");
        }
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
        Swal.fire("Deleted!", "Meal has been deleted.", "success");
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
                <button onClick={toggleSortByReviews} className="btn btn-sm">
                    Sort by Reviews {sortBy === "reviews_count" ? (order === "asc" ? "↑" : "↓") : ""}
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th className="text-center">Likes</th>
                            <th className="text-center">Reviews</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {meals.map((meal) => (
                            <tr key={meal._id}>
                                <td>{meal.title}</td>
                                <td className="text-center">{meal.likes}</td>
                                <td className="text-center">{meal.reviews_count}</td>
                                <td className="flex items-center justify-center space-x-2">
                                    <button
                                        className="btn btn-xs btn-info"
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
        </div>
    );
};

export default AllReviewsTable;
