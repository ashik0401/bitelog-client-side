import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const MealDetail = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [reviewText, setReviewText] = useState("");
  const [requesting, setRequesting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["mealDetail", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/meals/${id}`);
      return res.data;
    },
  });

  const handleLike = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await axiosSecure.post(`/meals/${id}/like`, { email: user.email });
      queryClient.invalidateQueries(["mealDetail", id]);
    } catch (err) {
      alert(err.response?.data?.message || "Error liking meal");
    }
  };

  const handleRequestMeal = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setRequesting(true);
    try {
      await axiosSecure.post(`/meals/${id}/request`);
      alert("Meal request sent. Pending approval.");
    } catch (err) {
      alert(err.response?.data?.message || "Error requesting meal");
    } finally {
      setRequesting(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    if (!reviewText.trim()) return;
    try {
      await axiosSecure.post(`/meals/${id}/reviews`, {
        text: reviewText,
        email: user.email,
        username: user.displayName,
        photoURL: user.photoURL

      });
      queryClient.invalidateQueries(["mealDetail", id]);
      setReviewText("");
    } catch {
      alert("Failed to post review");
    }
  };

  if (isLoading) return <div className="p-6 text-center">Loading...</div>;
  if (!data || !data.meal) return <div className="p-6 text-center">Meal not found</div>;

  const { meal, reviews, reviewCount } = data;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="card bg-base-100 shadow-xl">
        <figure>
          <img
            src={meal.image}
            alt={meal.title}
            className="w-full h-64 md:h-96 object-cover rounded-t-lg"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{meal.title}</h2>
          <p className="text-sm text-gray-500">
            Distributor: {meal.distributorName?.toUpperCase()}
          </p>
          <p className="my-3">{meal.description}</p>
          <p>
            <strong>Ingredients:</strong>{" "}
            {Array.isArray(meal.ingredients)
              ? meal.ingredients.join(", ")
              : "No ingredients listed"}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Posted: {new Date(meal.postTime).toLocaleString()}
          </p>
          <p className="mt-1">Rating: {meal.rating?.toFixed(1)} ⭐</p>
          <div className="flex gap-4 mt-4">
            <button onClick={handleLike} className="btn btn-primary">
              👍 Like ({meal.likes})
            </button>
            <button
              onClick={handleRequestMeal}
              className={`btn btn-secondary text-black ${requesting ? "loading" : ""
                }`}
              disabled={requesting}
            >
              Request Meal
            </button>
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-semibold">Reviews ({reviewCount})</h3>
            <form onSubmit={handleReviewSubmit} className="my-4">
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Write your review..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={3}
                required
              />
              <button type="submit" className="btn btn-success mt-2">
                Submit Review
              </button>
            </form>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {reviews.length === 0 && <p>No reviews yet.</p>}
              {reviews.map((review) => (
                <div key={review._id} className="p-4 bg-gray-50 rounded shadow flex items-start gap-3">
                  <img
                    src={review.photoURL || 'https://i.ibb.co/V0bwF2W1/User-Profile-PNG-High-Quality-Image.png'}
                    alt={review.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{(review.username).toUpperCase()}</p>
                    <p className="text-xs text-gray-400 mb-2">
                      {new Date(review.createdAt).toLocaleString()}
                    </p>
                    <p className="text-gray-700">{review.text}</p>
                    
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealDetail;
