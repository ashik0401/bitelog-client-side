import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import useAxiosSecure from '../../hooks/useAxiosSecure';


import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';

const MealDetail = () => {
    const { id } = useParams();
    const [meal, setMeal] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [reviewText, setReviewText] = useState('');
   const {user}=useAuth()
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        axiosSecure.get(`/meals/${id}`).then(res => setMeal(res.data));
        axiosSecure.get(`/reviews/${id}`).then(res => setReviews(res.data));
    }, [id, axiosSecure]);

    const handleLike = async () => {
        if (!user) return Swal.fire('Login required', 'You must be logged in to like.', 'warning');
        try {
            await axiosSecure.patch(`/meals/${id}/like`, { email: user.email });
            setMeal(prev => ({ ...prev, likes: prev.likes + 1 }));
        } catch (err) {
            Swal.fire('Error', 'Could not update like.', 'error',err);
        }
    };

    const handleMealRequest = async () => {
        if (!user) return Swal.fire('Login required', 'Please login to request a meal.', 'warning');

        try {
            const res = await axiosSecure.post('/mealRequests', {
                mealId: id,
                userEmail: user.email,
                status: 'pending'
            });
            if (res.data.insertedId) {
                Swal.fire('Requested!', 'Your meal request is submitted.', 'success');
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to request the meal.', 'error' , error);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) return Swal.fire('Login required', 'Please login to post a review.', 'warning');

        try {
            const res = await axiosSecure.post('/reviews', {
                mealId: id,
                email: user.email,
                review: reviewText,
                time: new Date().toISOString()
            });
            setReviewText('');
            setReviews([...reviews, res.data]);
        } catch (error) {
            Swal.fire('Error', 'Failed to submit review.', 'error' , error);
        }
    };

    if (!meal) return <div className="text-center mt-10">Loading meal details...</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <img src={meal.image} alt={meal.title} className="w-full h-64 object-cover rounded-xl mb-6" />

            <h2 className="text-3xl font-bold mb-2">{meal.title}</h2>
            <p className="text-gray-600">Posted by: <span className="font-semibold">{meal.distributorName}</span></p>
            <p className="text-sm text-gray-500 mb-2">Posted on: {new Date(meal.postTime).toLocaleString()}</p>

            <p className="my-4">{meal.description}</p>

            <p><span className="font-semibold">Ingredients:</span> {meal.ingredients?.join(', ')}</p>
            <p className="mt-2"><span className="font-semibold">Rating:</span> {meal.rating}/5</p>

            <div className="flex items-center gap-4 mt-4">
                <button onClick={handleLike} className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600">
                    ❤️ Like ({meal.likes})
                </button>
                <button onClick={handleMealRequest} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                    Request Meal
                </button>
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-3">Reviews ({reviews.length})</h3>
                {user && (
                    <form onSubmit={handleReviewSubmit} className="mb-4">
                        <textarea
                            className="w-full p-2 border rounded mb-2"
                            placeholder="Write your review here..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            required
                        />
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                            Submit Review
                        </button>
                    </form>
                )}
                <div className="space-y-4">
                    {reviews.map((r, index) => (
                        <div key={index} className="p-4 border rounded">
                            <p className="font-semibold">{r.email}</p>
                            <p className="text-sm text-gray-600">{new Date(r.time).toLocaleString()}</p>
                            <p className="mt-1">{r.review}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MealDetail;
