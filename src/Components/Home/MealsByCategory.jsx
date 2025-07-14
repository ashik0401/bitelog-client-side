import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { Link } from 'react-router';

const MealsByCategory = ({ searchTerm }) => {
  const [category, setCategory] = useState('All');
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    setLoading(true);
    const fetchMeals = async () => {
      try {
        const res = await axiosSecure.get('/meals', {
          params: { search: searchTerm }
        });
        setMeals(res.data);
      } catch {
        setMeals([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, [axiosSecure, searchTerm]);

  const filteredMeals = category === 'All' ? meals : meals.filter(meal => meal.category === category);

  if (loading) {
    return (
      <div className="text-center my-10 text-xl font-semibold text-primary">
        Loading meals...
      </div>
    );
  }

  return (
    <div className="px-4 my-7 py-8 max-w-6xl mx-auto">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-10 gap-10">
          {filteredMeals.map(meal => (
            <div key={meal._id} className="card shadow-xl bg-orange-100">
              <figure>
                <img src={meal.image} alt={meal.title} className="w-full lg:h-68 md:h-42 sm:h-58 object-cover" />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{meal.title}</h2>
                <p>⭐ Rating: {meal.rating}</p>
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
      )}
    </div>
  );
};

export default MealsByCategory;
