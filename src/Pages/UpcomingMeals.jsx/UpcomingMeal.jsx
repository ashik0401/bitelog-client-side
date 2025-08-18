import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useUserRole from '../../Pages/User/useUserRole';
import useAuth from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router';

const UpcomingMeal = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { roleUser, loading } = useUserRole();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMealId, setErrorMealId] = useState(null);

  const { data: meals = [], isLoading } = useQuery({
    queryKey: ['upcomingMeals'],
    queryFn: async () => {
      const res = await axiosSecure.get('/upcoming-meals');
      return Array.isArray(res.data) ? res.data : res.data.meals || [];
    },
  });

  const likeMeal = useMutation({
    mutationFn: async (mealId) => {
      const res = await axiosSecure.patch(`/like-upcoming-meal/${mealId}`, {
        email: user?.email,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['upcomingMeals']);
      setErrorMealId(null); // clear error if liked successfully
    },
  });


  const isPremiumUser = ['Silver', 'Gold', 'Platinum'].includes(roleUser?.badge);

  if (loading || isLoading) return (
    <div className="text-center py-10">
      <span className="loading loading-ring loading-sm"></span>
    </div>
  );

  return (
    <div className="p-4 md:p-8 mt-15">
      <h2 className="text-3xl font-bold mb-6 text-center text-black dark:text-white">Upcoming Meals</h2>

      {(!Array.isArray(meals) || meals.length === 0) ? (
        <p className="text-center text-black dark:text-white ">No upcoming meals found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:w-11/12 mx-auto mt-10">
          {meals.map((meal) => {
            const hasLiked = meal.likedBy?.includes(user?.email);

            return (
              <div key={meal._id} className="card shadow-xl bg-orange-100 dark:bg-transparent dark:text-white border border-gray-200">
                <figure>
                  <img
                    src={meal.image || null}
                    alt={meal.title}
                    className="w-full lg:h-68 md:h-42 sm:h-58 object-cover"
                  />
                </figure>
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-1 text-black dark:text-white">{meal.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-white mb-1">By: {(meal.distributorName).toUpperCase()}</p>
                    <p className="text-sm text-gray-500 dark:text-white mb-2">Likes: {meal.likes}</p>
                    <p className="text-sm text-gray-700 dark:text-white">
                      <span className="font-semibold">Ingredients:</span>{' '}
                      {meal.ingredients?.join(', ') || 'Not specified'}
                    </p>
                  </div>
                </div>
                <div className="p-4 border-t border-orange-50  ">
                  {user ? (
                    <>
                      {errorMealId === meal._id && (
                        <p className="text-red-500 text-sm mt-1 ">
                          You need to buy a membership to like meals!
                        </p>
                      )}

                      <button
                        onClick={() => {
                          if (!isPremiumUser) {
                            setErrorMealId(meal._id); // set error for this meal card
                            return;
                          }
                          likeMeal.mutate(meal._id);
                        }}
                        className={`btn btn-sm w-full sm:w-auto ${
                          isPremiumUser
                            ? hasLiked
                              ? 'bg-orange-600 text-white hover:bg-orange-700'
                              : 'bg-orange-500 text-white hover:bg-orange-600'
                            : 'bg-gray-300 text-gray-600 dark:text-black border-none'
                        }`}
                      >
                        {hasLiked ? 'Liked 🤍' : 'Like'}
                      </button>

                     
                    
                    </>
                  ) : (
                    <button
                      onClick={() => navigate('/login', { state: { from: location } })}
                      className="btn btn-sm bg-orange-500 text-white hover:bg-orange-600 w-full sm:w-auto"
                    >
                      Like
                    </button>
                  )}

                 
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UpcomingMeal;
