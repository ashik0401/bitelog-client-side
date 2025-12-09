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
      setErrorMealId(null);
    },
  });

  const isPremiumUser = ['Silver', 'Gold', 'Platinum'].includes(roleUser?.badge);

  if (loading || isLoading) return (
    <div className="text-center py-10">
      <span className="loading loading-ring loading-sm"></span>
    </div>
  );

  return (
    <div className="px-4 py-16 lg:w-10/12 mx-auto mt-15">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#012200]  ">
        Upcoming Meals
      </h2>

      {(!Array.isArray(meals) || meals.length === 0) ? (
        <p className="text-center text-gray-600 ">No upcoming meals found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-wrap gap-2 sm:gap-10 md:w-11/12 mx-auto mt-10">
          {meals.map((meal) => {
            const hasLiked = meal.likedBy?.includes(user?.email);

            return (
              <div
                key={meal._id}
                className="card rounded-lg text-gray-900  shadow-lg   flex flex-col border  border-gray-200 w-full sm:max-w-[300px] mx-auto"
              >
                <figure>
                  <img
                    src={meal.image || null}
                    alt={meal.title}
                    className="w-full md:h-52 h-36 sm:h-58 object-cover  rounded-t-lg"
                  />
                </figure>
                <div className="card-body flex flex-col justify-between p-4 flex-grow">
                  <div>
                    <h2 className="card-title text-lg md:text-xl font-bold mb-1 line-clamp-2 text-gray-900">
                      {meal.title}
                    </h2>
                    <p className="text-sm text-gray-600  mb-1">
                      By: {(meal.distributorName).toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-500  mb-2">
                      Likes: {meal.likes}
                    </p>
                    <p className="text-sm text-gray-700  line-clamp-2 ">
                      <span className="font-semibold">Ingredients:</span>{' '}
                      {meal.ingredients?.join(', ') || 'Not specified'}
                    </p>
                  </div>

                  <div className=" border-t  border-[#01220040] pt-3 flex items-center justify-between">
                    {user ? (
                      <>
                        {errorMealId === meal._id && (
                          <p className="text-red-500 text-sm mt-1">
                            You need to buy a membership to like meals!
                          </p>
                        )}

                        <button
                          onClick={() => {
                            if (!isPremiumUser) {
                              setErrorMealId(meal._id);
                              return;
                            }
                            likeMeal.mutate(meal._id);
                          }}
                          className={`btn btn-sm  sm:w-auto ${
                            isPremiumUser
                              ? hasLiked
                                ? 'bg-[#012200] text-white hover:bg-[#015500] '
                                : 'bg-[#012200]  text-white hover:bg-[#015500]'
                              : 'bg-gray-300 text-gray-600 border-none'
                          }`}
                        >
                          {hasLiked ? '👍' : 'Like'}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => navigate('/login', { state: { from: location } })}
                        className="btn btn-sm  bg-[#012200] text-white hover:bg-[#015500]  sm:w-auto"
                      >
                        Like
                      </button>
                    )}
                  </div>
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
