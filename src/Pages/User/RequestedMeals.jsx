import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import Pagination from '../../Components/Pagination/Pagination';

const RequestedMeals = () => {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [mealsStats, setMealsStats] = useState({});
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchRequestedMeals = async () => {
    const res = await axiosSecure.get(`/meal-requests?email=${user?.email}&page=${page}&limit=${limit}`);
    const { requests, totalCount } = res.data;
    return { requests, totalCount };
  };

  const fetchMealStats = async (mealId) => {
    const { data } = await axiosSecure.get(`/meals/${mealId}`);
    return {
      id: mealId,
      likes: data.meal.likes || 0,
      reviews_count: data.meal.reviews_count || 0,
    };
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['requestedMeals', user?.email, page],
    queryFn: fetchRequestedMeals,
    enabled: !!user?.email,
  });

  const requests = data?.requests || [];
  const totalCount = data?.totalCount || 0;

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
      queryClient.invalidateQueries({ queryKey: ['requestedMeals', user?.email, page] });
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

  if (isLoading) return <div className="text-center mt-20">Loading requested meals...</div>;
  if (isError) return <div className="text-center text-red-500 mt-20">Error loading requested meals.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">Requested Meals</h2>
      <div className="overflow-x-auto sm:overflow-x-visible">
        <table className="table w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-green-100 dark:bg-transparent dark:text-white text-black">
              <th className="border border-gray-300 px-4 py-2">Meal Title</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Likes</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Reviews Count</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Status</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4 dark:text-white">No requested meals found.</td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr key={req._id} className="dark:text-white text-black ">
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
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        totalItems={totalCount}
        itemsPerPage={limit}
        currentPage={page}
        onPageChange={setPage}
      />
    </div>
  );
};

export default RequestedMeals;
