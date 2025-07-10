import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { Link } from 'react-router';

const MealsByCategory = () => {
  const [category, setCategory] = useState('All');
  const [meals, setMeals] = useState([]);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    axiosSecure.get('/meals')
      .then(res => setMeals(res.data))
      .catch(err => console.error('Error fetching meals:', err));
  }, [axiosSecure]);


  const filteredMeals =
    category === 'All'
      ? meals
      : meals.filter((meal) => meal.category === category);

  return (
    <div className="px-4 my-7 py-8 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-primary">Meals</h2>

      <div role="tablist" className="tabs tabs-boxed justify-center mb-6">
        {['All', 'Breakfast', 'Lunch', 'Dinner'].map((tab) => (
          <button
            key={tab}
            onClick={() => setCategory(tab)}
            className={`tab ${category === tab ? 'tab-active text-primary font-bold' : ''}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-6">
        {filteredMeals.map((meal) => (
          <div key={meal.id} className="card shadow-xl bg-orange-100">
            <figure>
              <img
                src={meal.image}
                alt={meal.title}
                className="w-full h-48 object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{meal.title}</h2>
              <p>⭐ Rating: {meal.rating}</p>
              <p>💰 Price: ${meal.price}</p>
              <div className="card-actions justify-end">
                  <Link to={`/Meals/${meal._id}`}>
                <button className="btn btn-sm btn-primary">Details</button></Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealsByCategory;
