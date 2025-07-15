import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function calculateAverageRating(ratings) {
  if (!ratings) return 0;
  let totalScore = 0;
  let totalCount = 0;
  for (const [starStr, count] of Object.entries(ratings)) {
    const star = Number(starStr);
    totalScore += star * count;
    totalCount += count;
  }
  return totalCount === 0 ? 0 : totalScore / totalCount;
}

const MealDetail = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();

  const [reviewText, setReviewText] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [ratingMessage, setRatingMessage] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["mealDetail", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/meals/${id}`);
      return res.data;
    },
  });

  const showRatingPopup = () => {
    if (!user) {
      setRatingMessage("Please login to rate this meal.");
      return;
    }
    if (user.badge === "bronze") {
      setRatingMessage("You need a badge higher than Bronze to rate this meal.");
      return;
    }
    let selectedRating = 0;

    MySwal.fire({
      title: "Rate this meal",
      html: (
        <div
          id="rating-stars"
          style={{ fontSize: "30px", cursor: "pointer", userSelect: "none" }}
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              data-rating={i}
              style={{ color: "#ddd" }}
              id={`star-${i}`}
            >
              ★
            </span>
          ))}
        </div>
      ),
      showCancelButton: true,
      confirmButtonText: "Submit",
      preConfirm: () => {
        if (selectedRating === 0) {
          MySwal.showValidationMessage("Please select a rating");
        }
        return selectedRating;
      },
      didOpen: () => {
        const stars = document.querySelectorAll("#rating-stars span");
        const highlightStars = (rating) => {
          stars.forEach((star) => {
            star.style.color =
              parseInt(star.dataset.rating) <= rating ? "#f1c40f" : "#ddd";
          });
        };
        highlightStars(0);
        stars.forEach((star) => {
          star.onmouseenter = () =>
            highlightStars(parseInt(star.dataset.rating));
          star.onmouseleave = () => highlightStars(selectedRating);
          star.onclick = () => {
            selectedRating = parseInt(star.dataset.rating);
            highlightStars(selectedRating);
          };
        });
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.patch(`/meals/${id}/rate`, {
            rating: result.value,
            email: user.email,
          });
          queryClient.invalidateQueries(["mealDetail", id]);
          setRatingMessage("Thank you for your rating!");
        } catch {
          setRatingMessage("Failed to submit rating.");
        }
      }
    });
  };

  const handleLike = async () => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    try {
      await axiosSecure.post(`/meals/${id}/like`, { email: user.email });
      queryClient.invalidateQueries(["mealDetail", id]);
    } catch {
      setRatingMessage("Error liking meal");
    }
  };

const handleRequestMeal = async () => {
  if (!user) {
    navigate("/login", { state: { from: location.pathname } });
    return;
  }
  setRequesting(true);
  try {
    await axiosSecure.post(`/meals/${id}/request`, {
      email: user.email,
      username: user.displayName,
      photoURL: user.photoURL,
    });

    await MySwal.fire({
      icon: "success",
      title: "Meal Requested!",
      text: "Your meal request has been submitted successfully.",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });

  } catch {
    await MySwal.fire({
      icon: "error",
      title: "Request Failed",
      text: "Something went wrong. Please try again.",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  } finally {
    setRequesting(false);
  }
};

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    if (!reviewText.trim()) return;
    try {
      await axiosSecure.post(`/meals/${id}/reviews`, {
        text: reviewText,
        email: user.email,
        username: user.displayName,
        photoURL: user.photoURL,
      });
      queryClient.invalidateQueries(["mealDetail", id]);
      setReviewText("");
    } catch {
      setRatingMessage("Failed to post review");
    }
  };

  if (isLoading) return <div className="p-6 text-center"><span className="loading loading-ring loading-sm"></span>
</div>;
  if (!data || !data.meal) return <div className="p-6 text-center">Meal not found</div>;

  const { meal, reviews, reviewCount } = data;
  const averageRating = calculateAverageRating(meal.ratings);

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
          <p className="text-sm font-semibold">
            Distributor: <span className="font-bold">{meal.distributorName?.toUpperCase()}</span>
          </p>
          <p className="my-3">{meal.description}</p>
          <p>
            <strong>Ingredients:</strong>{" "}
            {Array.isArray(meal.ingredients) ? meal.ingredients.join(", ") : "No ingredients listed"}
          </p>
          <p className="font-bold">
            Price: <span className="font-semibold">${meal.price}</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Posted: {new Date(meal.postTime).toLocaleString()}
          </p>
          <p className="mt-1">Rating: {averageRating.toFixed(1)} ⭐</p>
          <div className="flex gap-4 mt-4">
            <button onClick={handleLike} className="btn btn-primary">
              👍 Like ({meal.likes})
            </button>
            <button
              onClick={handleRequestMeal}
              className={`btn btn-secondary text-black ${requesting ? "loading" : ""}`}
              disabled={requesting}
            >
              Request Meal
            </button>
            <button onClick={showRatingPopup} className="btn btn-warning">
              Rate Meal
            </button>
          </div>
          {ratingMessage && (
            <p className="mt-2 text-sm text-red-600 font-semibold">{ratingMessage}</p>
          )}
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
                <div
                  key={review._id}
                  className="p-4 bg-gray-50 rounded shadow flex items-start gap-3"
                >
                  <img
                    src={
                      review.photoURL ||
                      "https://i.ibb.co/V0bwF2W1/User-Profile-PNG-High-Quality-Image.png"
                    }
                    alt={review.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{review.username.toUpperCase()}</p>
                    <p className="text-xs text-gray-400">
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
