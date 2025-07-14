import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';

const RequestedMeals = () => {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [mealsStats, setMealsStats] = useState({}); // mealId -> { likes, reviews_count }

  const fetchRequestedMeals = async () => {
    const { data } = await axiosSecure.get(`/meal-requests?email=${user?.email}`);
    return data;
  };

  const fetchMealStats = async (mealId) => {
    const { data } = await axiosSecure.get(`/meals/${mealId}`);
    return {
      id: mealId,
      likes: data.meal.likes || 0,
      reviews_count: data.meal.reviews_count || 0,
    };
  };

  const { data: requests = [], isLoading, isError } = useQuery({
    queryKey: ['requestedMeals', user?.email],
    queryFn: fetchRequestedMeals,
    enabled: !!user?.email,
  });

  useEffect(() => {
    const loadStats = async () => {
      if (requests.length > 0) {
        const promises = requests.map((r) => fetchMealStats(r.mealId));
        const stats = await Promise.all(promises);
        const statsMap = {};
        stats.forEach((s) => {
          statsMap[s.id] = { likes: s.likes, reviews_count: s.reviews_count };
        });
        setMealsStats(statsMap);
      }
    };
    loadStats();
  }, [requests]);

  const cancelMealRequest = async (id) => {
    await axiosSecure.delete(`/meal-requests/${id}?email=${user?.email}`);
  };

  const mutation = useMutation({
    mutationFn: cancelMealRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requestedMeals', user?.email] });
      Swal.fire('Cancelled', 'Your meal request has been cancelled.', 'success');
    },
    onError: () => {
      Swal.fire('Error', 'Failed to cancel the meal request.', 'error');
    }
  });

  const handleCancel = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this request!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!'
    }).then((result) => {
      if (result.isConfirmed) {
        mutation.mutate(id);
      }
    });
  };

  if (isLoading) return <div>Loading requested meals...</div>;
  if (isError) return <div>Error loading requested meals.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="table w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-orange-200">
            <th className="border border-gray-300 px-4 py-2">Meal Title</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Likes</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Reviews Count</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Status</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center p-4">No requested meals found.</td>
            </tr>
          )}
          {requests.map((req) => (
            <tr key={req._id} className="hover:bg-orange-100">
              <td className="border border-gray-300 px-4 py-2">{req.mealTitle}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {mealsStats[req.mealId]?.likes ?? '...'}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {mealsStats[req.mealId]?.reviews_count ?? '...'}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">{req.status}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {req.status === 'pending' ? (
                  <button
                    onClick={() => handleCancel(req._id)}
                    className="btn btn-sm btn-error"
                    disabled={mutation.isLoading}
                  >
                    Cancel
                  </button>
                ) : (
                  <span className="text-gray-500">N/A</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestedMeals;
