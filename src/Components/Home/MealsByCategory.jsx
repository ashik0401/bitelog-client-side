import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { Link } from 'react-router';

const MealsByCategory = ({ searchTerm }) => {
  const [category, setCategory] = useState('All');
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const axiosSecure = useAxiosSecure();


 
  

  useEffect(() => {
    setLoading(true);
    const fetchMeals = async () => {
      try {
        const res = await axiosSecure.get('/meals', {
          params: { search: searchTerm }
        });
        const data = Array.isArray(res.data.meals) ? res.data.meals : res.data;
        setMeals(data);
      } catch {
        setMeals([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, [axiosSecure, searchTerm]);

  const filteredMeals = category === 'All' ? meals : meals.filter(meal => meal.category === category);
  const mealsToShow = showAll ? filteredMeals : filteredMeals.slice(0, 6);

  if (loading) {
    return (
      <div className="text-center my-10 text-xl font-semibold text-primary">
       <span className="loading loading-ring loading-sm"></span>

      </div>
    );
  }

  return (
    <div className="px-4 my-7 py-8 w-11/12 mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-primary">Meals</h2>

      <div role="tablist" className="tabs tabs-boxed justify-center mb-6">
        {['All', 'Breakfast', 'Lunch', 'Dinner'].map(tab => (
          <button
            key={tab}
            onClick={() => setCategory(tab)}
            className={`tab ${category === tab ? 'tab-active text-primary font-bold' : ''}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {filteredMeals.length === 0 ? (
        <p className="text-center text-gray-600">No meals found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-10 gap-10">
            {mealsToShow.map(meal => (
              <div key={meal._id} className="card shadow-xl bg-orange-100">
                <figure>
                  <img
                    src={meal.image || null}
                    alt={meal.title}
                    className="w-full lg:h-68 md:h-42 sm:h-58 object-cover"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{meal.title}</h2>
                  <p>⭐ Rating: {
                    (() => {
                      const ratings = meal.ratings || {};
                      const totalRatings = Object.values(ratings).reduce((a, b) => a + b, 0);
                      if (totalRatings === 0) return 0;
                      const totalScore = Object.entries(ratings).reduce(
                        (acc, [star, count]) => acc + Number(star) * count, 0
                      );
                      return (totalScore / totalRatings).toFixed(1);
                    })()
                  }</p>

                  <p>💰 Price: ${meal.price}</p>
                  <div className="card-actions justify-end">
                    <Link to={`/Meals/${meal._id}`}>
                      <button className="btn btn-sm btn-primary">Details</button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredMeals.length > 6 && (
            <div className="text-center mt-6">
              <button
                onClick={() => setShowAll(!showAll)}
                className="btn btn-outline btn-primary"
              >
                {showAll ? 'Show Less' : 'Show More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MealsByCategory;
