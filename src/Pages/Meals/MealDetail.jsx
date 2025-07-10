import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';

import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';

const MealDetail = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const navigate = useNavigate();


    const [meal, setMeal] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [reviewText, setReviewText] = useState('');
    const [likes, setLikes] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [requesting, setRequesting] = useState(false);

useEffect(() => {
  setLoading(true)
  axiosSecure.get(`/meals/${id}`)
    .then(res => {
      setMeal(res.data.meal)
      setReviews(res.data.reviews)
      setReviewCount(res.data.reviewCount)
      setLikes(res.data.meal.likes)
      setLoading(false)
    })
    .catch(() => setLoading(false))
}, [id, axiosSecure])


const handleLike = async () => {
  if (!user) {
    navigate('/login')
    return
  }

  try {
    const res = await axiosSecure.post(`/meals/${id}/like`, {
      email: user.email,
    })
    console.log('Like success:', res.data)
    setLikes(res.data.likes)
  } catch (err) {
    console.error('Like error:', err)
    alert('Error liking meal: ' + (err.response?.data?.message || err.message))
  }
}




    const handleRequestMeal = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setRequesting(true);
        try {
            await axiosSecure.post(`/meals/${id}/request`);
            alert('Meal request sent. Pending approval.');
        } catch (err) {
            if (err.response && err.response.data.message) {
                alert(err.response.data.message);
            } else {
                alert('Error requesting meal');
            }
        } finally {
            setRequesting(false);
        }
    };

    const handleReviewSubmit = async e => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }
        if (!reviewText.trim()) return;

        try {
            const res = await axiosSecure.post(`/meals/${id}/reviews`, { text: reviewText });
            setReviews(prev => [res.data, ...prev]);
            setReviewCount(prev => prev + 1);
            setReviewText('');
        } catch {
            alert('Failed to post review');
        }
    };

    if (loading) return <div className="p-6 text-center">Loading...</div>;
    if (!meal) return <div className="p-6 text-center">Meal not found</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="card bg-base-100 shadow-xl">
                <figure><img src={meal.image} alt={meal.title} className="w-full h-64 md:h-96 object-cover rounded-t-lg" /></figure>
                <div className="card-body">
                    <h2 className="card-title">{meal.title}</h2>
                    <p className="text-sm text-gray-500">Distributor: {(meal.distributorName).toUpperCase()}</p>
                    <p className="my-3">{meal.description}</p>
                    <p><strong>Ingredients:</strong> {meal.ingredients.join(', ')}</p>
                    <p className="text-sm text-gray-400 mt-2">Posted: {new Date(meal.postTime).toLocaleString()}</p>
                    <p className="mt-1">Rating: {meal.rating.toFixed(1)} ⭐</p>
                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={handleLike}
                            className="btn btn-primary"
                        >
                            👍 Like ({likes})
                        </button>
                        <button
                            onClick={handleRequestMeal}
                            className={`btn btn-secondary text-black ${requesting ? 'loading' : ''}`}
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
                                onChange={e => setReviewText(e.target.value)}
                                rows={3}
                                required
                            />
                            <button type="submit" className="btn btn-success mt-2">Submit Review</button>
                        </form>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {reviews.length === 0 && <p>No reviews yet.</p>}
                            {reviews.map(review => (
                                <div key={review._id} className="p-4 bg-gray-50 rounded shadow">
                                    <p className="font-semibold">{review.username}</p>
                                    <p className="text-gray-700">{review.text}</p>
                                    <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleString()}</p>
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
